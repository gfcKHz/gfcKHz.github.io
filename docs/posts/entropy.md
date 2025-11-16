---
title: Ghost in the Capture — Entropy
hide:
  - title
---

### Micro-Fluctuation 

Entropy is just instrumentation with variance we can audit. Frequency, jitter, and bias only count if they stay tethered to the hardware that emitted them, so every reduction pass doubles as a witness channel. Each capture leaves a meshed trail (carrier drift, mixer jitter, PLL recoveries) and those traces either count as entropy or expose the side channel. Every run emits the same fluctuation vector (drift, phase noise, temperature swing, supply ripple) and that packet rides with the data so any “fresh randomness” claim has to debit a specific line item. Persisting the trace lets us replay it through whitening, masking, or shuffling and watch the signature contract in real time. The log becomes the handshake between all these measurements; every knob turn is pinned to a readable signature instead of a hunch.

### Local Instrumentation

Logic Pro’s stem splitter rewrites the same story on the audio side. Because its ML pipeline (drums, bass, vocals, other) runs entirely on-device, every decomposition happens inside the same hardware envelope as the rest of the DAW (no external model, API call, or hosted inference path). Ableton followed the same path with Live 12.3’s [stem splitter](https://www.ableton.com/en/blog/live-12-3-is-coming/), which means I get two independent local decompositions to compare. When Logic generates a texture that Ableton doesn’t, that diff isn’t random; it carries quantization noise, memory access cadence, and floating-point drift from each autoencoder. The machinery becomes a pair of witness channels whose fluctuations persist with the stems they emit. Local processing turns both tools into audit-friendly instruments: I get entropy by proxy because each model’s variance is literally my hardware’s variance, and the delta between them exposes which fingerprints are stable versus model-specific.

---

## Bibliography

1. Zeng, Kevin, and Roozbeh Bassirian. "Practical Doppler Side Channels on Wireless Encryption." *IEEE Transactions on Information Forensics and Security* 19 (2024): 1123–1136.
2. Holcomb, Daniel E., William P. Burleson, and Kevin Fu. "Power-Up SRAM State as a True Random Number Generator." *IEEE Journal of Solid-State Circuits* 48, no. 1 (2013): 917–930.
3. Sunar, Berk, WeiJiaan Martin, and Daniel R. Stinson. "A Provably Secure True Random Number Generator with Built-in Tolerance to Active Attacks." *IEEE Transactions on Computers* 56, no. 1 (2007): 109–119.
4. Tokunaga, Claudio, and David Blaauw. "True Random Number Generator with a Metastability-Based Entropy Source." *IEEE Journal of Solid-State Circuits* 45, no. 1 (2010): 70–77.
5. Kocher, Paul, Joshua Jaffe, and Benjamin Jun. "Differential Power Analysis." In *Advances in Cryptology – CRYPTO '99*, 1999.
6. Cagli, Emanuele, Cécile Dumas, and Emmanuel Prouff. "Convolutional Neural Networks with Data Augmentation for Side-Channel Attacks." In *Proceedings of CHES*, 2017.
