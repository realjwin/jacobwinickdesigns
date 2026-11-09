---
title: Quantized OFDM Detection
dwg: JW-102
discipline: research
year: "2019–2020"
status: released
rev: A
summary: A learned LLR detector for OFDM behind 1-, 3-, and 5-bit ADCs, swept over clipping level and loss weighting, AWGN and fading.
role: Solo — research, implementation
stack: [Python, PyTorch, NumPy, Matplotlib]
links:
  - label: GitHub — quantized-detector
    href: https://github.com/realjwin/quantized-detector
figure: ofdm-ber
order: 2
featured: true
---

## Problem

A neural detector that computes LLRs for OFDM receivers behind 1-, 3-, and 5-bit ADCs, the follow-on to my thesis work. Low-bit ADCs save power and cost, but they clip the signal, and a conventional detector then hands the decoder bad soft information.

The question was how far a learned detector could recover from 1, 3, or 5 bits of resolution, and how sensitive that is to where the ADC clips.

## Approach

I started this repo in December 2019 as a clean rewrite of the exploratory code in [JW-101](/work/neural-ldpc-decoding). It narrows the scope to the detector and evaluates it through a fixed decoder.

- **Signal chain.** QPSK on 32 subcarriers, encoded with a rate-1/2 (64, 32) LDPC code. Each OFDM symbol draws its own SNR uniformly from 0–30 dB, so one network covers the whole range.
- **Quantizer with AGC.** The received signal is scaled per symbol by an AGC factor derived from the expected signal-plus-noise power and a clip ratio in dB. It is then uniformly quantized and rescaled, so the LLRs stay correctly scaled.
- **Detector.** A three-hidden-layer `tanh` network. The input is the quantized time-domain samples (real and imaginary parts) plus the linear SNR. The output is one value per coded bit.
- **Training.** The network is first pretrained on unquantized data, then fine-tuned for each grid point. Fine-tuning uses a weighted MSE against the ideal LLRs, where `epsilon` controls how hard uncertain bits are weighted:

```python
qbits = np.array([1, 3, 5])
clipdb = np.array([-6, -3, 0, 3, 6])
wmse_epsilon = ([1, 1e-1, 1e-3, 1e-4, 1e-6])
```

- **Fading.** A second set of scripts multiplies each subcarrier by an i.i.d. complex Gaussian (Rayleigh) tap. It retrains over a {1, 3, 5}-bit × {−10, −5, 0} dB clip × three-epsilon grid.
- **Evaluation.** The detector's LLRs are decoded by the same five-iteration belief-propagation network in every case. They are compared against traditional LLRs computed from both unquantized and quantized samples.

## Result

For each (bits, clip) setting, the plotting script produces BER (coded and uncoded), BLER, and the WMSE training loss. Traditional and NN curves are overlaid for each epsilon. The figure on this drawing is drawn from those outputs. The repo doesn't reduce the grid to a single headline number, so I don't give one here.

## Notes

- Pretrain-then-fine-tune made the grid sweep practical. Every quantized model starts from the same unquantized checkpoint.
- Clip level is treated as a sweep axis alongside bit depth, not a constant. At low resolution, the AGC and clipping choice decides what the few available levels actually represent.
- This is the last of my UT Austin wireless × ML research repos. Its commits run through January 2020.
