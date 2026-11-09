---
title: Bandits for Mobile Users
dwg: JW-103
discipline: research
year: "2019"
status: released
rev: A
summary: A multi-armed bandit that picks which user gets a power-control update each step, so a cell meets per-user SINR targets.
role: Course project — UT Austin Reinforcement Learning, Fall 2019
stack: [Python, NumPy, Matplotlib]
links:
  - label: GitHub — rl-project
    href: https://github.com/realjwin/rl-project
order: 6
featured: false
---

## Problem

My project for the UT Austin Reinforcement Learning course in Fall 2019: a multi-armed bandit that decides which user in a cell gets the next power-control command. Every user's transmit power is interference for the others, so that choice decides whether the cell meets each user's minimum SINR.

The base station can command only one user per time step, and users that move make the problem non-stationary.

## Approach

I framed it as a multi-armed bandit where each arm is a user.

- **Scenario.** Users are placed at random in a square cell with the base station near the center. Path loss is inverse-square, and SINR includes interference from every other user plus a noise floor. Power is chosen from a discrete grid of levels.
- **Power update.** The selected user either steps up or down one level (`step`) or jumps toward the power that would exactly meet its target (`direct`). A damping factor δ keeps it from overshooting.
- **Strategies.** Random selection, ε-greedy with a sample-average estimate (`avg`), ε-greedy with an exponential recency-weighted estimate (`exp`, step size α), and UCB variants of both.
- **Reward.** Either the binary "is this user meeting its target", or a soft *delta* reward, `|log2(1+SINR) − log2(1+η)|`. With the delta reward, the greedy choice is the user furthest from its target in rate terms.
- **Movement.** Optionally, every few steps each user takes a random step of configurable size, which tests how the recency-weighted estimate copes with drift.

## Result

The repo includes scripts and saved sample results for single runs, an α × ε grid, a movement-step-size grid, and a damping (δ) grid. Each has a matching plotting script. The full results from the write-up were too large to commit, and the repo holds no summary metric, so I don't quote one.

## Notes

- The exponential recency-weighted estimate is the natural fit here. With moving users, a sample average remembers channel conditions that no longer exist.
- The SINR computation is genie-aided: the simulator knows every user's position. A real system would have to estimate it.
