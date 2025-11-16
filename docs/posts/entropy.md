---
title: Ghost in the Capture — Entropy
hide:
  - title
---

### Micro-Fluctuation 

Entropy is just instrumentation with variance we can audit. Frequency, jitter, and bias only count if they stay tethered to the hardware that emitted them, so every reduction pass doubles as a witness channel. Each capture leaves a meshed trail (carrier drift, mixer jitter, PLL recoveries) and those traces either count as entropy or expose the side channel. Every run emits the same fluctuation vector (drift, phase noise, temperature swing, supply ripple) and that packet rides with the data so any “fresh randomness” claim has to debit a specific line item. Persisting the trace lets us replay it through whitening, masking, or shuffling and watch the signature contract in real time. The log becomes the handshake between these captures and the RNG, EM, acoustic, and ML leakage literature cited below, so every knob turn ties back to an explicit threat model or countermeasure.

### Stem Splitting as Entropy

Logic Pro’s stem splitter rewrites the exact same story on the audio side. Its ML pipeline (drums, bass, vocals, other) runs entirely on-device, so every decomposition lives inside the same trusted compute boundary as an RTL-SDR capture. When the model hallucinates a wind-chime texture into the isolated bass, that artifact isn’t random—it carries quantization noise, memory access cadence, and floating-point drift from the autoencoder. The splitter becomes another instrumentation channel whose fluctuations persist with the stems it emits.

That makes an easy parallel to the RF fluctuation vector:  
- RF captures trace oscillator drift, PLL relock cadence, mixer jitter.  
- Stem separation traces reconstruction artifacts, phase coherence errors, attention head preferences.

Just like we log carrier drift and CNR, we can log reconstruction fidelity from Logic: spectral roll-off deltas between stems and the full mix, residual phase offsets, or consistency of repeated runs. Every reduction pass—whether it’s whitening an FM capture or partitioning a song into stems—doubles as a witness channel for the processing chain. Treat the built-in splitter as a black box with a measurable entropy budget, run tracks through multiple times, and the variance becomes part of the capture fingerprint.

---

## Bibliography

1. Zeng, Kevin, and Roozbeh Bassirian. "Practical Doppler Side Channels on Wireless Encryption." *IEEE Transactions on Information Forensics and Security* 19 (2024): 1123–1136.
2. Holcomb, Daniel E., William P. Burleson, and Kevin Fu. "Power-Up SRAM State as a True Random Number Generator." *IEEE Journal of Solid-State Circuits* 48, no. 1 (2013): 917–930.
3. Sunar, Berk, WeiJiaan Martin, and Daniel R. Stinson. "A Provably Secure True Random Number Generator with Built-in Tolerance to Active Attacks." *IEEE Transactions on Computers* 56, no. 1 (2007): 109–119.
4. Tokunaga, Claudio, and David Blaauw. "True Random Number Generator with a Metastability-Based Entropy Source." *IEEE Journal of Solid-State Circuits* 45, no. 1 (2010): 70–77.
5. Kocher, Paul, Joshua Jaffe, and Benjamin Jun. "Differential Power Analysis." In *Advances in Cryptology – CRYPTO '99*, 1999.
6. Cagli, Emanuele, Cécile Dumas, and Emmanuel Prouff. "Convolutional Neural Networks with Data Augmentation for Side-Channel Attacks." In *Proceedings of CHES*, 2017.
