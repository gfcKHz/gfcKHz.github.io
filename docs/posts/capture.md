---
title: Ghost in the Capture
---

# Ghost in the Capture

---

## Metal_SDR

A measurement [tool](https://github.com/gfcKHz/Metal_SDR) for RF captures. SDR feeds SigMF logs, fingerprints extract deterministic metrics (peak interpolation, CNR, bandwidth, adjacent-channel rejection), and regression tests keep the math anchored to physics rather than intention. The sections below walk through the failure modes uncovered while building that pipeline and the corrections layered in so each capture carries defensible results.

---

## Field Journal 

**Why FM broadcast?** It’s a stable, public signal I can listen to, analyze and validate within an acceptable amount of error based on my hardware constraints. Stations occupy ~200 kHz and have published parameters for stress testing the capture loop before facing OFDM systems.

### Wide-bandwidth Source Ambiguity  

- **Setup:** RTL-SDR @ 2.4 Msps sweeping FM broadcast from 100–142 MHz.  
- **Symptom:** metadata said “105.9 MHz,” but the stored spectrum often contained 105.4 or 106.3 MHz whenever those stations were louder.  
- **Lesson:** tuner settings document *intent*. Without a validation step, a wide window silently captures whichever emitter dominates the moment.

**Course correction:** narrow each capture window around the target station; log the measured peak frequency (post-capture) instead of trusting the tuner.

### Single-feature Validation fallacy

- **Setup:** narrowed windows but still used “maximum FFT bin” as the only check.  
- **Symptom:** station IDs drifted ±0.5 MHz as the dongle’s oscillator warmed up; adjacent-channel interference triggered new entries in the manifest.  
- **Lesson:** a single feature can’t tell “tuner drift” from “new signal.” Multi-feature fingerprints (peak interpolation, CNR, bandwidth, adjacent rejection, roll-off) are mandatory.

The multi-feature fix lives in (`fm_fingerprint.py`): takes each capture and emits a structured feature vector (peak frequency, CNR, 3 dB bandwidth, adjacent-channel rejection, rolloff asymmetry). Even the “find the peak” step is formalized with a three-point parabolic interpolation,

$$
\large \delta = \tfrac{1}{2}\,\frac{P_{k-1}-P_{k+1}}{P_{k-1}-2P_k+P_{k+1}}, \qquad f_{\text{peak}} = f_k + \delta\,\Delta f,
$$

where $P_i$ are log-PSD samples and $\Delta f$ is the FFT bin spacing ([scripts/fingerprinting](https://github.com/gfcKHz/Metal_SDR/blob/master/scripts/fingerprinting/README.md#parabolic-peak-interpolation)). That keeps every capture anchored to the same peak-estimation math instead of trusting one noisy FFT bin.

### Carrier-to-Noise ratio needs dimensional consistency

Identical night captures reported CNR swings between 50–72 dB because the numerator summed carrier PSD bins $\left(\sum_{k\in\mathcal{C}} S[k]\right)$ while the denominator used *average* noise PSD $\left(|\mathcal{N}|^{-1} \sum_{k\in\mathcal{N}} S[k]\right)$. That mismatch silently injects ≈22 dB of phantom CNR by counting $|\mathcal{C}|$ extra bins. The correct form compares mean PSD on both sides:

$$
\bar{S}_{\text{carrier}} = \frac{1}{|\mathcal{C}|} \sum_{k \in \mathcal{C}} S[k], \qquad
\bar{S}_{\text{noise}} = \frac{1}{|\mathcal{N}|} \sum_{k \in \mathcal{N}} S[k], \qquad
\mathrm{CNR}_{\text{correct}} = 10 \log_{10} \left( \frac{\bar{S}_{\text{carrier}}}{\bar{S}_{\text{noise}}} \right)
$$

**Fix:** compare mean PSD on both sides:

```python
# scripts/fingerprinting/fm_fingerprint.py:118
carrier_mask = np.abs(freqs - peak_freq_hz) <= carrier_bw_hz
carrier_power_density = np.mean(psd[carrier_mask])

noise_mask = np.abs(freqs - peak_freq_hz) > guard_bw_hz
noise_bins = psd[noise_mask]
noise_floor = np.mean(np.partition(noise_bins, kth)[:n_bins])

cnr_db = 10 * np.log10(carrier_power_density / noise_floor)
```

Both sides stay as mean PSD:

The corrected ratio stays in mean-PSD land: carrier and noise are averaged over matching bandwidths before taking $10\log_{10}$ of their quotient.

### Welch PSD requires bin-width scaling

`signal.welch(..., scaling='density')` returns PSD values $S[k]$ in $[\text{W/Hz}]$. Summing those values without multiplying by the frequency bin width $\Delta f$ makes results depend on FFT length. The conversion is straightforward:

$$
P_{\text{carrier}} = \left( \sum_{k \in \mathcal{C}} S[k] \right) \Delta f, \qquad \Delta f = f[k+1] - f[k]
$$

All metrics that integrate PSD now multiply by `freq_resolution`; ratios stay between averaged densities.

### Adjacent-channel rejection needs matching bandwidths

Same pitfall as CNR: the original code integrated carrier power but compared it against the average adjacent-channel power. Averaging PSD over identical ±50 kHz windows fixes the mismatch:

```python
# scripts/fingerprinting/fm_fingerprint.py:205
carrier_mask = np.abs(freqs - peak_freq_hz) <= 50e3
carrier_power_density = np.mean(psd[carrier_mask])

left_center = peak_freq_hz - channel_spacing_hz
left_mask = np.abs(freqs - left_center) <= 50e3
left_power_density = np.mean(psd[left_mask])

right_center = peak_freq_hz + channel_spacing_hz
right_mask = np.abs(freqs - right_center) <= 50e3
right_power_density = np.mean(psd[right_mask])

rejection_db = 10 * np.log10(
    carrier_power_density / np.maximum(1e-15, (left_power_density + right_power_density) / 2.0)
)
```

### RTL-SDR normalization must be symmetric

Dividing raw samples by 127.5 placed zero halfway between two quantization codes. Dividing by 128.0 centers zero exactly, removing a deterministic DC bias:

```python
# scripts/capture/backends/rtl_sdr.py:95
raw = np.fromfile(temp_path, dtype=np.uint8)
iq_float = (raw.astype(np.float32) - 127.5) / 128.0
iq = iq_float[0::2] + 1j * iq_float[1::2]
```

---

## Testing 

Once the signal chain math was honest, I still needed proof. The regression suite generates synthetic IQ blocks with known SNR/frequency to ensure the extractor reports what physics says it should:

```python
def test_cnr_with_known_signal():
    fs = 2.4e6
    duration = 0.1
    t = np.arange(0, duration, 1/fs)

    signal_power = 1.0
    carrier = np.exp(2j * np.pi * 0 * t) * np.sqrt(signal_power)

    target_snr_db = 30.0
    noise_power = signal_power / (10**(target_snr_db / 10))
    noise = (np.random.randn(len(t)) + 1j * np.random.randn(len(t))) * np.sqrt(noise_power / 2)

    iq = carrier + noise
    features = extract_fingerprint(iq.astype(np.complex64), fs, 0.0)
    assert abs(features["cnr_db"] - target_snr_db) < 2.0
```

There’s a companion test for frequency accuracy (parabolic interpolation within 100 Hz). Together they act as the “analysis” block’s tripwire: any change to the fingerprint code reruns the synthetic suite before merging.

---

## What This Enables

**Propagation tracking:** does WQXR's carrier drift 200 Hz warmer at 2 PM than at 2 AM? Does atmospheric ducting at night pull in stations from 300+ miles away? Multi-day captures with sub-100 Hz peak interpolation and timestamped CNR logs answer questions that spectrum analyzer screenshots cannot.

**Interference detection:** when CNR drops 8 dB between successive captures, or when adjacent-channel rejection degrades from 40 dB to 18 dB, the pipeline flags it. Cross-reference against weather data, time of day, and nearby capture sessions to distinguish atmospheric fade from a new emitter appearing in-band.

**Relational grounding for ML:** models hallucinate, just like people do. None of us interface with reality directly. We experience it through peripherals, sensors, and neurophysiological smoothing functions that hide thermal jitter and hardware drift. Nobuo reminds us that we understand an object only through its [relationships](https://www.math3ma.com/blog/the-yoneda-perspective). There is no true representation, only the web of all possible representations. Whatever we believe to be the intrinsic meaning of an object is just a useful abstraction, true meaning lies between networks of relations between different objects. A SigMF capture is meaningful when the relationships it claims (frequency, CNR, bandwidth) match the measurable traces coming off the radio. Validation keeps those morphisms honest so the model’s hallucinations stay tethered to the same perceptual field the hardware saw.

**Foundation:** FM broadcast is the introduction. If the same CNR checks, bandwidth validation, and adjacent-channel rejection metrics can scale to LTE downlink (15 kHz subcarriers, 20 MHz channels), WiFi OFDM (312.5 kHz subcarriers, 20/40/80 MHz channels), and LoRa chirps (125–500 kHz), then the bladeRF backend brings the same regression harness.

---

> So crazy thing I learned recently, was that most audio models don’t actually operate on audio at all. There are some bespoke ones that do, but the majority convert the audio to a spectrogram then pass that spectrogram into an image2* model. Img2img for new audio, reconstruct the spectrogram with encodec at the output layer. I have also been playing with that, re-representing patches of tokens as a unified vector, representing that vector in a pixel group, with some masked pixels for pattern learning. - SashimiSaketoro

---

## We All Knew This Was Coming

> “Long-term, >99% of input and output for AI models will be [photons](https://x.com/elonmusk/status/1980430707706196359). Nothing else scales.”  
> — Elon Musk replying to Andrej Karpathy on DeepSeek-OCR

So all the cool kids are beam [splitting](space.md) audio via pixel space and I'm late to the party as usual. This is when it naturally occurred to me that I haven't been paying attention to what's really going on (and it doesn't help that I don't even know where my glasses are right now). Perception is computationally bounded, and [vision](https://en.wikipedia.org/wiki/Human_echolocation#Ben_Underwood) transforms once the perceptual map reshapes to the relational geometry that emerges from constraints. Maybe I'm just intercepting a broadcast from a [CDMA downlink](https://cyclostationary.blog/2016/03/22/csp-estimators-the-strip-spectral-correlation-analyzer/), the kind William mapped long before the noise took [shape](https://cyclostationarity.com/wp-content/uploads/2022/12/202210131027.pdf). 

---

## References

1. Gardner, William A. *Statistical Spectral Analysis: A Nonprobabilistic Theory*. Prentice Hall, 1987. [Cyclostationary coherence framework underpinning the validation heuristics]
2. Gardner, William A. "A Unifying View of Coherence in Signal Processing." *Signal Processing* 29 (1992): 113–140.
3. Bradley, Tai-Danae. "The Yoneda Perspective." Math3ma, May 2017. https://www.math3ma.com/blog/the-yoneda-perspective. [Intuition primer that motivates the Yoneda link in plain language]
4. Ibn al-Haytham. *The Optics of Ibn al-Haytham: Books I–III, On Direct Vision*. Translated with introduction and commentary by A. I. Sabra. London: The Warburg Institute, University of London, 1989. Book 2, Chapter 3, "On the manner of perceiving each of the particular properties."
5. Reed, Graham T., and Andrew P. Knights. *Silicon Photonics: An Introduction*. Chichester: John Wiley & Sons, 2004. Chapter 8.4, "Raman Excitation."
6. Wells, H. G. *The Invisible Man*. London: C. Arthur Pearson, 1897.
7. Spooner, Chad. "Correcting the Record: Comments on Wireless Signal Representation Techniques for Automatic Modulation Classification." (2022).
8. Wei, Haoran, Yaofeng Sun, and Yukun Li. "DeepSeek-OCR: Contexts Optical Compression." arXiv:2510.18234 (2025). [Optical context compression for high-accuracy OCR with constrained vision tokens]
9. Shao, Chenze, Darren Li, Fandong Meng, and Jie Zhou. "Continuous Autoregressive Language Models." arXiv:2510.27688 (2025). [Continuous next-vector generation to increase semantic bandwidth per decoding step]
10. O'Shea, Timothy J., Johnathan Corgan, and T. Charles Clancy. "Convolutional Radio Modulation Recognition Networks." arXiv:1602.04105 (2016). [CNN baselines for end-to-end modulation recognition]
11. Peng, Shengliang, Hanyu Jiang, Huaxia Wang, Hathal Alwageed, Yu Zhou, Marjan Mazrouei Sebdani, and Yu-Dong Yao. "Modulation Classification Based on Signal Constellation Diagrams and Deep Learning." *IEEE Transactions on Neural Networks and Learning Systems* 30, no. 3 (2019): 718–727. https://doi.org/10.1109/TNNLS.2018.2850703. [Constellation image CNN that set the standard for diagram-first modulation tasks]
12. Zhang, Hao, Fuhui Zhou, Hongyang Du, Qihui Wu, and Chau Yuen. "Revolution of Wireless Signal Recognition for 6G: Recent Advances, Challenges and Future Directions." *IEEE Communications Surveys & Tutorials* (2025). https://doi.org/10.1109/COMST.2025.3569427. [6G-era survey of modulation/fingerprint pipelines, open problems, and data requirements]
13. Wolfram, Stephen. "I Have a Theory Too: The Challenge and Opportunity of Avocational Science." August 2025. https://writings.stephenwolfram.com/2025/08/i-have-a-theory-too-the-challenge-and-opportunity-of-avocational-science/. [Framework for keeping hobby-grade theory accountable]
