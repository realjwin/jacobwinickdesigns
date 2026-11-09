---
title: Image Deblurring
dwg: JW-104
discipline: research
year: "2014"
status: released
rev: A
summary: An undergrad DSP project comparing inverse filtering, Wiener deconvolution, wavelet denoising, and blind deconvolution on blurred images.
role: Four-person team — University of Michigan EECS 451
stack: [MATLAB]
links:
  - label: GitHub — imagedeblurring
    href: https://github.com/realjwin/imagedeblurring
order: 8
featured: false
---

## Problem

A four-person project for EECS 451, Michigan's digital signal processing course, testing how far the standard deblurring tools get you, first on synthetic blur and then on a real out-of-focus photo of text. Blur is just convolution with a point spread function (PSF) plus sensor noise, but that noise is what breaks the textbook fixes.

## Approach

- **Inverse filtering.** Dividing by the PSF's spectrum recovers an artificially blurred image exactly when there's no noise. It falls apart once Gaussian noise is added.
- **Wavelet denoising.** We used MATLAB's Wavelet Toolbox to denoise before deblurring.
- **Wiener filter** (`deconvwnr`). We compared results across noise and PSF parameters.
- **Blind deconvolution.** We implemented the Ayers–Dainty iterative method. It was hard to make converge because the inverses involved are ill-conditioned, so we used MATLAB's `deconvblind` and tuned the PSF radius and iteration count by hand.

## Result

On the real photo, both the Wiener filter and blind deconvolution made the text readable to people who didn't know what it said. The Wiener result was the better of the two. The write-up is a static web page in the repo, with the MATLAB code included.

## Notes

The main lesson was that parameter choice was guess-and-check, and the right values depend heavily on the image.
