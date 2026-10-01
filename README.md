# ⚔️ REAL-LIFE QUEST — The Real-World RPG Operating System

> **"Turn real-life goals into an RPG where completing real-world actions gives you XP, levels, achievements, rewards, and progression."**

Real-Life Quest transforms the vague *"I want to get better"* into a structured hero's journey:
```text
GOAL ➔ ROADMAP ➔ CAMPAIGN ➔ CHAPTERS ➔ QUESTS ➔ DAILY ACTIONS ➔ COMPLETION ➔ XP + GOLD ➔ LEVEL UP ➔ BOSS DAMAGE
```

---

## 🚀 Live App & Quick Start

The application server is running locally on **`http://localhost:3000`**.

### 1. Start Server Manually
```bash
# In the project directory:
npm install
npm run dev
# or
node server/server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎮 Key Features Implemented

### 1. Hero HUD & 6 Core Attributes
- **Top HUD**: Character avatar, Level badge, dynamic glowing XP progress bar, Gold coin balance, and active Streak counter with **Streak Shield** protection indicator.
- **6 Core RPG Stats**:
  - 🧠 **Knowledge** (study sessions, reading, theory)
  - 💻 **Technical / Skill** (coding, systems, building)
  - ⚡ **Discipline** (unbroken streaks, punctuality, focus)
  - 💪 **Fitness** (workouts, cardio, mobility, recovery)
  - 🎨 **Creativity** (design, UI/UX, inventive projects)
  - 🤝 **Social** (community, collaboration, networking)

### 2. Daily Quest Board & Active Focus Timer
- **Quest Tiers & Types**:
  - 📚 **Study Quests**
  - 💻 **Build Quests**
  - ⚔️ **Task Quests**
  - 🏃 **Exercise Quests**
  - 🧠 **Challenge Quests**
  - 🐉 **Boss Battles**
- **Difficulty Rating**: ⭐ Easy (+50 XP) to ⭐⭐⭐⭐⭐ Boss (+500-1000 XP)
- **Active Focus Timer Modal**:
  - Built-in stopwatch (HH:MM:SS) with Pause/Resume/Reset
  - Reflection / Proof of completion journal field
  - Completion loot popup with breakdown: +XP, +Gold, +Attribute stats, and Boss damage!

### 3. Epic Boss Battles: The Procrastination Dragon
- Boss monsters represent the real-world obstacles (e.g. *Procrastination Dragon*, *Syllabus Wyrm*, *Distraction Behemoth*).
- **Combat Mechanics**: Completing any real-world daily quest deals direct critical strike damage to the boss!
- Animated health bar, shake impact animations, live battle log, and +1,000 XP / +500 Gold / Mythic Title defeat bounty.

### 4. Interactive Campaign Roadmap Tree
- Instead of a boring checklist, displays a visual multi-chapter roadmap:
  - **Chapter 1: The Core Syntax Grove (Foundation)**
  - **Chapter 2: Algorithms & Architectural Patterns (Training)**
  - **Chapter 3: Full Feature Forge (Challenge)**
  - **Chapter 4: The Final Deployment Arena (Final Boss)**
- Displays progress milestones and unlocked status.

### 5. AI Game Master Sanctum & Emergency Mode
- **Powered by Google Gemini** with built-in intelligent procedural fallback.
- **Dynamic Adaptation**:
  - *"I only have 20 minutes today"* ➔ Automatically crafts a high-impact Micro-Quest (+35 Gold, +75 XP) with 1-click addition to your daily board.
  - *"I have an exam in 3 days"* ➔ Summons an **Emergency Survival Arc** prioritizing high-yield past questions and active recall.
  - *"I feel tired / low motivation"* ➔ Scales down workload while protecting your daily momentum.

### 6. Bazaar (Shop) & Inventory Bag
- Earn **Gold** strictly by completing real-world quests (no pay-to-win):
  - 🛡️ **Streak Shield**: Preserves your streak if life gets in the way and you miss a day.
  - 🧪 **Elixir of Focus**: Grants +50% bonus XP on next 3 completed quests.
  - 🐉 **Baby Coding Wyrm**: Companion pet that travels with your hero.
  - 🐱 **Scholar Cat**: Erudite companion for study arcs.
  - 🦊 **Focus Kitsune**: Companion spirit warding off distractions.
  - 🏷️ **Mythic Titles**: e.g., *"The Relentless"*.

### 8. Telangana Government Board Academic Arc (Class 1 to Inter 2nd Year)
- **Official Telangana Curriculum Support**:
  - **TS SCERT Primary & High School**: Class 1 to 9 (Telugu, English, Mathematics, EVS, General Science, Social Studies).
  - **TS SSC Class 10th Board Exam**: Mathematics (Real Numbers, Polynomials, Coordinate Geometry, Trigonometry, Progressions), Physical Science, Biological Science, Social Studies (Telangana Movement & State Formation).
  - **TSBIE Intermediate 1st Year (Junior Inter)**:
    - **MPC**: Mathematics 1A (75M), Mathematics 1B (75M), Physics 1 (60M), Chemistry 1 (60M).
    - **BiPC**: Botany 1, Zoology 1, Physics 1, Chemistry 1.
    - **CEC / MEC**: Commerce, Economics, Civics.
  - **TSBIE Intermediate 2nd Year (Senior Inter - Final Board & TG EAPCET)**:
    - **MPC**: Mathematics 2A (Complex Numbers, De Moivre's, Quadratic, Binomial, Probability), Mathematics 2B (Circles, System of Circles, Conics, Integration, Differential Equations), Physics 2, Chemistry 2.
    - **BiPC**: Botany 2, Zoology 2 (Human Anatomy & Physiology), Physics 2, Chemistry 2.
  - **1-Click Telangana Campaign Generation**: Automatically generates chapter-by-chapter quest modules with official IPE weightage marks and summons custom state board bosses (*The 10/10 GPA Sovereign*, *The Senior Inter Apex Wyrm*)!

### 9. Real Money Extra Gold Coins & Cashout Treasury (₹ INR)
- **Real Rupee Conversion Standard**:
  - **100 Gold Coins = ₹10.00 INR** (10 Gold = ₹1.00 INR).
  - Live HUD and Treasury balance indicator: e.g. `🪙 2,145 Gold ≈ ₹214.50 INR Real Wealth`.
- **Buy Extra Gold Coins with Real Money (₹ INR)**:
  - 🪙 **Apprentice Coin Pouch (₹49)**: +500 Gold Coins + 1 Free Streak Shield
  - 💰 **Scholar Treasure Chest (₹99)**: +1,200 Gold Coins + 2 Streak Shields + 1 Focus Elixir (+20% Bonus)
  - 👑 **Topper Grand Vault (₹199)**: +2,800 Gold Coins + 5 Streak Shields + instant Dragon Pet (+40% Extra)
  - 💎 **Inter Sovereign Apex (₹499)**: +8,000 Gold Coins + 10 Shields + VIP Apex Sovereign Title
  - One-click simulated UPI (PhonePe / Google Pay / Paytm / Cards) payment flow.
- **Redeem Hard-Earned Gold for Real Rewards & Cash Out**:
  - Turn honest study hours into real rewards:
    - 🎁 **₹50 Amazon / Flipkart E-Gift Voucher** (500 Gold)
    - 📚 **₹100 Academic Books / Stationary Voucher** (1,000 Gold)
    - ⚡ **₹250 Direct UPI Cash Transfer** (2,500 Gold)
    - 💸 **₹500 Direct UPI Cash Transfer** (5,000 Gold)
  - Disbursed with verifiable payout reference codes (e.g. `RLQ-INR-580744`) and audit ledger!

### 10. Interactive 3D Spatial UI & Three.js Scene
- **Three.js 3D Background**:
  - Live rotating RPG polyhedral dice (D20 Icosahedrons, Octahedrons, Dodecahedrons) with glowing crystalline translucent materials, metallic wireframe edges, and dynamic point lights (Amethyst purple, Solar gold, and Mana cyan).
  - Floating 300+ arcane starfield that rotates slowly in 3D depth.
  - Interactive cursor parallax: the 3D camera tilts and shifts dynamically as you move your mouse across the screen.
  - **3D Shockwaves**: Expanding 3D energy rings trigger in the Three.js scene whenever you complete a quest!
- **3D Perspective Card Tilt (`tilt3d.js`)**:
  - Cards tilt in true 3D space (`perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02, 1.02, 1.02)`) following cursor movement.
  - **Dynamic Specular Glare**: A specular radial light highlight follows the pointer across the face of each card.
  - **Z-Axis Separation**: Inner avatar frames (`translateZ(35px)`), badges, and buttons pop out toward the viewer in true stereoscopic depth.
- **3D Boss Battle Colosseum**:
  - Elevated 3D perspective battle stage (`rotateX(55deg)`) with a floating 3D boss core that bobs and glows with fiery embers.
- **3D Arcade Tactical Buttons**:
  - Physical 3D beveled edges (`box-shadow: 0 5px 0 ...`) that depress down in 3D when clicked.

---

## 🛠️ Architecture & Tech Stack

```text
REALMIX/
├── server/
│   ├── server.js            # Express API routes & static file hosting
│   ├── db.js                # Persistent JSON database with atomic file writes
│   ├── gameEngine.js        # XP, Level curves, Gold, Stats, Streaks, Boss combat
│   ├── aiEngine.js          # Google Gemini AI client & procedural campaign generator
│   └── defaultData.js       # Initial achievements, bosses, shop items, and classes
├── data/
│   └── database.json        # Persistent database file (auto-generated)
├── public/
│   ├── index.html           # Main UI Shell & HUD Header
│   ├── css/
│   │   ├── style.css        # RPG Design system, Obsidian dark theme, typography
│   │   ├── components.css   # Cards, quest badges, boss bar, modal styling
│   │   └── animations.css   # Confetti, float damage numbers, star celebrations
│   └── js/
│       ├── audio.js         # Web Audio API synthesizers
│       ├── api.js           # REST API client
│       ├── state.js         # Reactive store, quest timer, confetti engine
│       ├── app.js           # View router, modal bindings, bootstrapper
│       └── views/
│           ├── dashboard.js    # Daily Quest Board & Hero Card
│           ├── campaign.js     # Multi-chapter Roadmap Tree
│           ├── boss.js         # Boss Battle Arena
│           ├── profile.js      # 6 RPG Attributes & Avatars
│           ├── shop.js         # Shop & Inventory bag
│           ├── achievements.js # Hall of Heroes
│           └── gameMaster.js   # AI Game Master Chat Sanctum
└── package.json
```

---

## 🔑 Optional Google Gemini API Configuration
The app runs seamlessly offline out-of-the-box with its built-in procedural RPG engine. If you want live Gemini AI generations:
1. Click **"🔑 Configure Gemini Key"** in the **Game Master** tab.
2. Enter your Gemini API key (stored in local browser storage, never exposed publicly).
3. Or set `GEMINI_API_KEY=your_key` in a `.env` file on the backend.
