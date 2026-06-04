# 🏁 Porsche 911 GT3 RS — Hyper-Premium Scrollytelling Showcase

An ultra-premium, cinematic product showcase and interactive engineering reveal for the track-focused apex predator: the **Porsche 911 GT3 RS**. 

Designed to deliver an Apple/Porsche-level visual experience, this project combines high-performance scroll-bound storytelling, advanced telemetry HUDs, dynamic customization, and curated automotive audio.

🚀 **Live Interactive Demo:** [Launch Showroom on Hugging Face Spaces](https://itachii9090-porsche-911-gt3-rs.static.hf.space)

---

## 🛠️ The Technical Stack
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS & Glassmorphic UI Principles
* **Animation:** Framer Motion (Scroll-bound triggers & spring physics)
* **Smooth Scrolling:** Lenis Smooth Scroll integration
* **Deployment:** Hugging Face static space deployment pipeline

---

## 🏎️ Core Interactive Experiences
* **360° Studio Turntable:** Scroll to rotate the GT3 RS under studio lighting.
* **Technical Disassembly (Exploded View):** Scroll-driven breakdown of aerodynamics, active downforce components, engine block, and carbon chassis.
* **Telemetry HUD Simulation:** Real-time synchronized speed, gear ratio, RPM gauge, and G-force sensors updating dynamically during high-speed runs.
* **Interactive Configurator:** A custom build-builder simulator allowing you to toggle lightweight magnesium packages, track-spec wheel rims, and request callback requests to a local dealer.
* **Studio Exhaust Soundboard:** Cinematic revs, track launches, and cabin engine audio toggleable via a custom audio controller.

---

## ⚡ High-Performance Architecture
To ensure a **buttery-smooth 60 FPS** experience on both mobile and desktop (vital for recruiter retention):

### 1. Viewport Virtualization & Lazy-Mounting
Instead of loading all 13 heavy HD videos concurrently (which causes high browser thread overhead, frame drops, and player freezing), this project utilizes a custom dynamic virtualization hook:
* Video files are **completely unmounted** from the DOM when off-screen, replaced by lightweight, optimized image posters.
* A video player only mounts when it scrolls within `150px` of the viewport.
* This caps active visual decoders at **1 or 2 at any given time**, maintaining a steady, fluid frame rate.

### 2. Zero-Byte Initial Video Load
On first load, the page downloads **0MB of video data**. Instead, it renders highly compressed visual posters. The page loads in **under 1.5 seconds (LCP)**, downloading video streams only as the user scrolls.

### 3. Programmatic Blob Streaming (Bypassing IDM Hijacks)
Direct `.mp4` URLs are frequently intercepted by third-party browser download managers (like Internet Download Manager - IDM), triggering unwanted popups, breaking media parsing, and displaying black boxes.
* This project fetches raw video streams programmatically via `fetch()` and loads them locally via **Blob Object URLs** (`blob:https://...`), keeping playback native and extension-proof.

### 4. Smart Network Throttling
We implemented a **450ms scroll debounce** on all videos. If a user scrolls rapidly past sections, the fetching thread is discarded, preserving bandwidth.

---

## 💻 Local Development Setup

To run this repository locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/porsche-911-gt3-rs.git
   cd porsche-911-gt3-rs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the local development server:**
   ```bash
   npm run dev
   ```

4. **Verify production compilation:**
   ```bash
   npm run build
   ```
