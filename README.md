# 🛺 Dhaka Ride: 3D Video Editor Physics Portfolio

An interactive 3D physics-based portfolio website inspired by **Bruno Simon**, customized with an authentic **Dhaka City theme**! Drive a procedurally built Bangladeshi Electric Easybike / Auto-Rickshaw to explore career milestones, watch video editing showreels on 3D TV screens, and experience living Dhaka street life.

Built with **React Three Fiber (R3F)**, **Three.js**, and **Rapier Physics**.

---

## 🌟 Key Features

- **Bangladeshi Electric Easybike / Auto-Rickshaw (3-Wheeler):**
  - Modeled using pure Three.js geometries (no heavy external 3D files required).
  - Front motorcycle-style chrome fork, red suspension shock springs, chrome handlebars, yellow glowing round headlight, cream passenger bench, overhead canopy with red hanging grab straps.
  - Realistic tricycle physics with arcade stability (never flips over permanently).
  - 3D Driver character seated at the wheel who leans dynamically into steering turns.
  - Synthesized Web Audio API electronic horn (Key `H`) and traditional rickshaw bell (Key `B`).

- **Dhaka City Career Map:**
  - **উত্তরা সেক্টর ১৫ (বাসা ও গ্যারেজ - Home / Spawn Location):** Private 2-storey residence with open ground parking garage and driveway.
  - **রাজলক্ষ্মী, সেক্টর ৪ (Banglay IELTS):** Current workplace as Video Editor. Features an interactive 3D TV studio monitor showcasing edited IELTS promotional videos.
  - **নিকুঞ্জ (Pi-Infotech):** Previous workplace. 3D TV showcase displaying tech product SaaS video reels.
  - **ধানমন্ডি (Education BD):** Past workplace. 3D TV showcase displaying higher education documentary & commercial edits.

- **Interactive 3D TV Video Cinema Player:**
  - Pull up in front of any office TV to open the cinema showcase modal.
  - Switch between edited videos, play/pause, volume, and view tools used (Premiere Pro, After Effects, DaVinci Resolve).

- **Living Dhaka City Environment:**
  - Seamless closed-loop interconnected road grid (no dead-ends).
  - Living traffic: Green Dhaka local bus, BRTC red double-decker bus, green CNG baby-taxis, white microbuses, and traditional cycle rickshaws with pulling drivers.
  - **Dynamic Collision Reaction:** Colliding with traffic causes the other driver to step out on the road with animated angry gestures and floating dialogue bubbles!
  - **Illuminated "মায়ের দোয়া চা স্টল" (Tong Dokan):** Open tea stall with warm glowing ceiling bulb, kettle, shopkeeper making tea, and customers chatting on benches.
  - Lush green grass terrain and blooming **Krishnachura** trees.

---

## 🎮 Driving Controls

| Key | Action |
| :--- | :--- |
| **`W` / `↑`** | Accelerate / Drive Forward |
| **`S` / `↓`** | Reverse / Back up |
| **`A` / `←`** | Steer Left |
| **`D` / `→`** | Steer Right |
| **`SPACE`** | Handbrake |
| **`H`** | Easybike Electronic Horn |
| **`B`** | Traditional Rickshaw Bell ("টুং-টাং") |
| **`R`** | Reset Easybike to Home Garage |

*Touch / Mouse Controls are also available on-screen via the bottom-left D-Pad.*

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **3D Graphics:** Three.js + `@react-three/fiber`
- **Helper Utilities:** `@react-three/drei`
- **Physics Engine:** `@react-three/rapier`
- **Audio:** Web Audio API (Synthesized Bell & Horn)
- **Typography:** Google Fonts (`Hind Siliguri`, `Space Grotesk`)
- **Icons:** Lucide React

---

## 🚀 Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/pabeledp/ThreeJS.git
   cd ThreeJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   # or on Windows PowerShell:
   npm.cmd run dev
   ```

4. Open `http://localhost:3000` in your browser!
