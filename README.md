#  Flappy Bird - Ultimate Arcade Edition

A modernized, animated, and responsive web clone of the iconic **Flappy Bird** game, built using **Phaser 3** and the **Web Audio API**.

---
##  Key Features

- ** Full Laptop Screen Coverage**: Dynamic viewport scaling (`Phaser.Scale.RESIZE`) that automatically adapts to 100% of any laptop or desktop screen resolution without letterboxing.
- ** Rich Animations & Particle Juice**:
  - 3-frame animated flapping bird with idle hover bobbing on the start screen.
  - Smooth angle pitch dynamics (tilting upward on flaps, gradual nose-diving downward during freefall).
  - Multi-layered parallax scrolling backgrounds (dynamic sky gradient, moving clouds, city skyline, and striped ground).
  - Flap wind trail particles, screen shake, red flash, and feather explosion bursts on collision.
- **Interactive Start & Game Over UI**:
  - Glowing, pulsing **START GAME** button with hover animations.
  - Drop-in Game Over scoreboard with score roll-up counter.
  - Tiered Medal System: 🥉 Bronze, 🥈 Silver, 🥇 Gold, and 💎 Platinum.
  - Persistent High Score tracking saved to `localStorage`.
  - Floating `+1` score popups on clearing pipe obstacles.
- ** Built-in Retro Sound Effects**:
  - Procedurally synthesized audio via Web Audio API (flap swoosh, coin ding, impact hit, fall whistle, and UI clicks)..
  - Quick audio mute/unmute toggle (`🔊` / `🔇`).
- ** Smooth Physics**:
  - Balanced gravity and floaty flap velocity for satisfying and responsive gameplay.

---

##  Controls

| Action | Controls |
| :--- | :--- |
| **Start Game / Flap / Restart** | `Spacebar` / `↑ Up Arrow` / `W` |
| **Mouse / Touch** | `Left Click` or `Tap` anywhere on screen |
| **Toggle Audio** | Click the sound icon (`🔊` / `🔇`) in the top-right corner |

---

##  Technology Stack

- **Game Engine**: [Phaser 3](https://phaser.io/) (v3.55.2)
- **Audio Engine**: Web Audio API (Zero external MP3 dependencies)
- **Styling & Fonts**: HTML5 Canvas, Vanilla CSS, Google Fonts (`Outfit`, `Press Start 2P`)

---

##  How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Sri-1212/flappy-bird-clone.git
   ```
2. Open `index.html` directly in your browser, or start a static server:
   ```bash
   npx serve .
   ```
3. Open `http://localhost:3000` (or `http://localhost:8080`) and enjoy!
