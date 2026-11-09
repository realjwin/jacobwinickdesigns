---
title: Neural LDPC Decoding
dwg: JW-101
discipline: research
year: "2019"
status: released
rev: B
summary: Belief-propagation LDPC decoding unrolled into a trainable PyTorch network, fed by a learned LLR estimator for quantized OFDM.
role: Solo — research, implementation
stack: [Python, PyTorch, NumPy, MATLAB]
links:
  - label: GitHub — ldpc-sims
    href: https://github.com/realjwin/ldpc-sims
figure: ldpc-ber
order: 1
featured: true
---

## Problem

This is the thesis work from my M.S. at UT Austin: an LDPC receiver where a neural network learns the soft inputs from coarsely quantized samples, and belief propagation is unrolled into a trainable network. Low-resolution ADCs save power, but they break the soft information that standard decoders depend on.

The standard log-likelihood ratios (LLRs) assume an unquantized AWGN channel, so after coarse quantization they are the wrong input for belief propagation. I wanted to know whether a network could learn better LLRs from the quantized samples, and whether the decoder itself could be trained along with it.

## Approach

The work started in MATLAB in early 2019 with an LDPC encoder, a quantizer, and a DVB-S2 codebook. I moved it to PyTorch later that year so the whole receive chain could be differentiated.

- **BP as a network.** Each belief-propagation iteration became a layer: a variable-to-check pass, a `tanh`, and a check-to-variable pass. Both passes are custom `autograd.Function`s with hand-written backward passes. Masks generated from the parity-check matrix `H` fix which edges exist, and every edge carries a learnable weight.
- **Code.** A (64, 32) LDPC code generated with a PEG construction tool.
- **LLR estimator.** A fully connected `tanh` network maps one received OFDM symbol (32 subcarriers, real and imaginary parts stacked) to per-bit LLRs. In one variant the first layer is initialized to a real-valued DFT matrix, so the network starts out doing the OFDM demodulation.
- **Loss.** The estimator is trained against true LLRs with a weighted MSE that penalizes errors on small-magnitude (uncertain) LLRs most:

```python
def weighted_mse(llr_est, llr, epsilon):
    return torch.mean((llr_est - llr)**2 / (torch.abs(llr) + epsilon))
```

- **Joint training.** A `Joint` module chains the estimator into the BP network and trains both end to end with binary cross-entropy on the decoded bits.

## Result

The repo produces BER and BLER versus SNR for three receivers, each coded and uncoded: a traditional receiver, the NN estimator on unquantized input, and the NN estimator on quantized input. It also tracks the WMSE of the estimated LLRs. The figure on this drawing is drawn from those runs. I don't state a headline gain here, because the repo has no single summary number and the results moved a lot between runs.

## Notes

- The commit history is honest about how research goes: several reorganizations, a long 20 dB run to understand training at high SNR, and a late `tanh`-output experiment.
- The old/ directory keeps the MATLAB prototype and a third-party reference implementation of learned BP that I studied. It is not my code.
- This repo was exploratory. The cleaned-up continuation is [JW-102](/work/quantized-ofdm-detection).
