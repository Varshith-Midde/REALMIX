// Study & Challenge Test Engine
// Deep Academic Masterclasses + Gamified "Study with Playing" Mechanics
// Powered by Gemini AI with high-yield Telangana & National Curriculum presets

const https = require('https');

// Helper to query Gemini for deep teacher-led study masterclass + interactive game stages + quiz
async function generateTopicWithGemini(apiKey, topicTitle, subject, classId) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are 'Acharya Ramanujan AI', a legendary, deeply engaging Master Teacher & Academic Mentor for Telangana and CBSE/ICSE students.
Your core teaching philosophy is "STUDY WITH PLAYING" — turning academic mastery into an exhilarating adventure.

Teach this topic deeply, thoroughly, and captivatingly:
Topic: "${topicTitle}"
Subject: "${subject || 'General Academic'}"
Class/Grade: "${classId || 'High School / Intermediate'}"

Return ONLY valid JSON matching this exact structure:
{
  "title": "${topicTitle}",
  "subject": "${subject}",
  "teacherPersona": {
    "name": "Acharya Ramanujan AI",
    "avatar": "🧙‍♂️",
    "quote": "An inspirational teacher quote connecting this topic to real life or gaming intuition.",
    "speechScript": "A warm, 2-3 sentence enthusiastic teacher spoken intro for voice-over explaining why today's lesson will blow their mind."
  },
  "realWorldLore": {
    "hookTitle": "🎮 The Real-World Superpower",
    "story": "Deep explanation of where this concept appears in real life, video game engines, space exploration, rocket science, CGI movies, or everyday technology."
  },
  "stages": [
    {
      "id": 1,
      "badge": "🌟 Origin & Intuition",
      "title": "Stage 1: The Core Intuition",
      "teacherTalk": "Deep conceptual explanation written like a passionate teacher explaining to a student sitting beside them. Use analogies, eliminate confusion, and build intuitive clarity before any math.",
      "visualCard": "A clean formatted box, formula diagram, or ASCII structure illustrating the concept.",
      "memoryHack": "A catchy memory trick or mnemonic to never forget this step."
    },
    {
      "id": 2,
      "badge": "⚡ Masterclass Derivation",
      "title": "Stage 2: Deep Mathematical / Scientific Breakdown",
      "teacherTalk": "Thorough step-by-step masterclass. Unpack the core equations, step-by-step logic, proofs, and working mechanisms. Explain what every symbol means and why the steps follow.",
      "visualCard": "Core equations, step 1-2-3 breakdown, or diagrammatic summary.",
      "memoryHack": "Pro-tip on how examiners test this in Telangana IPE / SCERT board exams."
    },
    {
      "id": 3,
      "badge": "🎯 Examiner Traps & Cheat Codes",
      "title": "Stage 3: Secret Traps & Shortcut Hacks",
      "teacherTalk": "Reveal the subtle mistakes 90% of students make in exams, negative marking traps, and the secret shortcuts to solve problems in under 30 seconds.",
      "visualCard": "Do's and Don'ts comparison or bulleted cheat-sheet.",
      "memoryHack": "Golden rule for getting 100% full marks on this question type."
    },
    {
      "id": 4,
      "badge": "⚔️ Interactive Micro-Trial",
      "title": "Stage 4: Playful Concept Drill",
      "teacherTalk": "Test your instincts before the grand challenge test! Try this interactive drill.",
      "interactiveCheck": {
        "question": "An intuitive, thought-provoking micro question to test understanding immediately.",
        "options": ["Option A", "Option B", "Option C"],
        "correctIndex": 0,
        "rewardNote": "Explanation of why this is correct and celebratory teacher praise!"
      }
    }
  ],
  "cheatSheet": [
    "High-yield formula 1 or rule",
    "High-yield formula 2 or rule",
    "High-yield formula 3 or rule"
  ],
  "questions": [
    {
      "id": 1,
      "question": "Deep multiple choice question testing conceptual depth",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Deep teacher explanation of why Option A is correct and why the other choices fail."
    },
    {
      "id": 2,
      "question": "Calculation or analytical question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Step-by-step working showing exact mathematical steps."
    },
    {
      "id": 3,
      "question": "Application or board exam favorite question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Complete examiner breakdown with tips for full marks."
    }
  ]
}`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) resolve(JSON.parse(text));
            else reject(new Error('No text in Gemini output'));
          } catch (e) {
            reject(new Error(`Failed to parse Gemini quiz JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`Gemini status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// ─── BUILT-IN RICH PRESETS WITH DEEP TEACHER MASTERCLASSES ───────────────────
const TOPIC_PRESETS = {
  // Maths 1A: Matrices & Determinants
  matrices: {
    title: "Matrices & Determinants (TSBIE Maths 1A)",
    subject: "Mathematics 1A",
    teacherPersona: {
      name: "Acharya Ramanujan AI",
      avatar: "🧙‍♂️",
      quote: "Matrices are not dry grids of numbers — they are the mathematical warp drives of 3D video game graphics and quantum physics!",
      speechScript: "Welcome, brave scholar! Today we unlock the mystic power of Matrices and Cramer's Rule. Once you see how matrices warp space, linear equations will feel like second nature."
    },
    realWorldLore: {
      hookTitle: "🎮 How Video Games Render 3D Worlds",
      story: "Every time your camera rotates in Minecraft, GTA, or Unreal Engine 5, millions of 3D vertices (x, y, z) are multiplied by a 4×4 transformation matrix in your GPU. Without matrix multiplication, 3D computer graphics, facial recognition, and GPS satellite coordinates simply could not exist."
    },
    stages: [
      {
        id: 1,
        badge: "🌟 Origin & Intuition",
        title: "Stage 1: The Intuition of Matrices & Determinants",
        teacherTalk: "Think of a matrix not as a boring table, but as a machine that transforms space! When you have a system of linear equations like 2x + 3y = 8 and 5x - y = 3, you are asking: 'Where do these two planes intersect in space?' The Determinant det(A) tells you the volume scaling factor of that transformation. If det(A) = 0, the space has been squashed flat into a line or point — meaning the matrix is singular and cannot be inverted!",
        visualCard: "A = [[a, b], [c, d]]  ⟹  det(A) = ad - bc\nGeometric Meaning: det(A) represents the Area of the parallelogram formed by column vectors!",
        memoryHack: "💡 Non-Singular = det(A) ≠ 0. If det is 0, the door is locked; no inverse exists!"
      },
      {
        id: 2,
        badge: "⚡ Masterclass Derivation",
        title: "Stage 2: The Core Arcana — Cramer's Rule & Inversion",
        teacherTalk: "Let's master Cramer's Rule step-by-step. For the system AX = B:\n1. Compute the coefficient determinant Δ = det(A).\n2. Replace column 1 with constant vector B to get Δ₁.\n3. Replace column 2 with constant vector B to get Δ₂.\n4. Replace column 3 with B to get Δ₃.\nThe unique solutions are simply: x = Δ₁/Δ, y = Δ₂/Δ, z = Δ₃/Δ. That's it! As long as Δ ≠ 0, you get full 7 marks in IPE Board Exams without any messy row operations.",
        visualCard: "x = Δ₁ / Δ    |    y = Δ₂ / Δ    |    z = Δ₃ / Δ\nInverse Formula: A⁻¹ = (1 / det(A)) × Adj(A)\nAdjoint Property: det(Adj A) = (det A)^(n - 1)",
        memoryHack: "🔥 IPE 7-Mark Rule: Always write 'Since Δ ≠ 0, unique solution exists by Cramer's Rule' to get that guaranteed presentation mark!"
      },
      {
        id: 3,
        badge: "🎯 Examiner Traps & Cheat Codes",
        title: "Stage 3: Common Pitfalls & High-Speed Shortcuts",
        teacherTalk: "Watch out for this classic examiner trap: For an n×n matrix and scalar k, det(kA) is NOT k × det(A)! Each of the n rows is multiplied by k, so det(kA) = kⁿ × det(A). If n = 3 and k = 2, det(2A) = 2³ × det(A) = 8 × det(A). Thousands of students lose marks here every year. Don't be one of them!",
        visualCard: "⚠️ TRAP: det(kA) = kⁿ det(A)   [NOT k det(A)!]\n⚠️ PROPERTY: det(AB) = det(A) × det(B)\n⚠️ TRANSPOSE: det(Aᵀ) = det(A)",
        memoryHack: "⚡ Mnemonic: 'Powers correspond to Dimensions!' 3D matrix (3×3) scales by k³."
      },
      {
        id: 4,
        badge: "⚔️ Interactive Micro-Trial",
        title: "Stage 4: Quick-Fire Reflex Drill",
        teacherTalk: "Let's test your reflexes right now! Can you apply the scalar determinant rule without flinching?",
        interactiveCheck: {
          question: "If A is a 3×3 matrix with det(A) = 4, what is the value of det(3A)?",
          options: ["12", "36", "108"],
          correctIndex: 2,
          rewardNote: "🎯 Brilliant! Because n = 3, det(3A) = 3³ × det(A) = 27 × 4 = 108. You nailed it!"
        }
      }
    ],
    cheatSheet: [
      "Matrix Inversion: A⁻¹ = (1/|A|) Adj(A), valid only when |A| ≠ 0.",
      "Scalar Multiplier: |kA| = kⁿ |A| where n is the matrix order.",
      "Adjoint Power Law: |Adj(A)| = |A|ⁿ⁻¹; |Adj(Adj(A))| = |A|^{(n-1)²}.",
      "Cramer's Rule: x = Δ₁/Δ, y = Δ₂/Δ, z = Δ₃/Δ."
    ],
    questions: [
      {
        id: 1,
        question: "Under Cramer's Rule, a unique solution exists for a system of linear equations if and only if:",
        options: [
          "The coefficient determinant Δ ≠ 0",
          "The coefficient determinant Δ = 0",
          "All constant terms are strictly positive",
          "The matrix is non-square"
        ],
        correctIndex: 0,
        explanation: "Cramer's rule expresses solutions as x = Δ₁/Δ. Division by zero is undefined, so a unique solution strictly requires Δ ≠ 0."
      },
      {
        id: 2,
        question: "If A is a square matrix of order 3 and det(A) = 5, what is the value of det(Adj A)?",
        options: [
          "5",
          "25",
          "125",
          "0"
        ],
        correctIndex: 1,
        explanation: "By the determinant property of the adjoint, det(Adj A) = (det A)^(n - 1). For order n = 3, det(Adj A) = 5^(3 - 1) = 5² = 25."
      },
      {
        id: 3,
        question: "For a 3×3 matrix A with det(A) = 2, what is det(4A)?",
        options: [
          "8",
          "24",
          "128",
          "64"
        ],
        correctIndex: 2,
        explanation: "det(kA) = kⁿ × det(A). Here k = 4 and n = 3, so 4³ × 2 = 64 × 2 = 128."
      }
    ]
  },

  // Maths 2A: Complex Numbers & De Moivre's Theorem
  complex_numbers: {
    title: "Complex Numbers & De Moivre's Theorem (TSBIE Maths 2A)",
    subject: "Mathematics 2A",
    teacherPersona: {
      name: "Acharya Ramanujan AI",
      avatar: "🧙‍♂️",
      quote: "Imaginary numbers are not imaginary at all — they are the two-dimensional steering wheel of electrical engineering and quantum mechanics!",
      speechScript: "Greetings, young prodigy! Today we step beyond the one-dimensional number line into the 2D plane of Complex Numbers. Let's tame the imaginary unit i and discover De Moivre's secret weapon!"
    },
    realWorldLore: {
      hookTitle: "⚡ Power Grids & Alternating Current (AC)",
      story: "The electricity powering your fan and computer is AC (Alternating Current). Electrical engineers at Telangana Transco represent voltage, current, and impedance using complex numbers (z = R + jX). Without complex numbers, modern power grids, audio synthesizer filters, and quantum computers would collapse."
    },
    stages: [
      {
        id: 1,
        badge: "🌟 Origin & Intuition",
        title: "Stage 1: The Magic of Rotation — Why 'i' Exists",
        teacherTalk: "When mathematicians tried to solve x² + 1 = 0, they hit a wall: no real number squared gives -1. Then came the breakthrough: think of multiplying by -1 as a 180° rotation on the number line. So what is a 90° rotation? It is multiplying by 'i'! If you rotate 90° twice (i × i), you get 180° (-1). Thus, i² = -1. Complex numbers z = x + iy simply describe coordinates (x, y) on the Argand plane!",
        visualCard: "z = x + iy = r(cos θ + i sin θ) = r e^(iθ)\nModulus r = √(x² + y²)  |  Argument θ = tan⁻¹(y/x)",
        memoryHack: "💡 Multiplication by 'i' is simply a 90° counter-clockwise turn on the plane!"
      },
      {
        id: 2,
        badge: "⚡ Masterclass Derivation",
        title: "Stage 2: De Moivre's Theorem & Cube Roots of Unity",
        teacherTalk: "Multiplying complex numbers in cartesian form is tedious. But in polar form, when you multiply two numbers, you MULTIPLY their moduli and ADD their angles! This gives us De Moivre's Theorem:\n(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ).\nNow look at z³ = 1 (Cube Roots of Unity): The solutions are 1, ω, and ω². Notice the magical symmetry: 1 + ω + ω² = 0, and ω³ = 1. In any Telangana IPE exam question, whenever you see high powers of ω, replace ω³ with 1!",
        visualCard: "(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)\nCube Roots: 1 + ω + ω² = 0\nPower Rule: ω³ = 1  ⟹  ω⁷ = (ω³)² · ω = ω",
        memoryHack: "🔥 Master Rule: (1 + ω) = -ω², and (1 + ω²) = -ω. Substitute these to crush IPE questions instantly!"
      },
      {
        id: 3,
        badge: "🎯 Examiner Traps & Cheat Codes",
        title: "Stage 3: Principal Argument Traps",
        teacherTalk: "Beware of quadrant errors when finding arg(z)! The formula θ = tan⁻¹(y/x) is only valid in the 1st quadrant. If z is in Quadrant 2 (-x + iy), θ = π - tan⁻¹(|y/x|). If z is in Quadrant 3 (-x - iy), θ = -π + tan⁻¹(|y/x|). Always plot the point on the Argand plane before writing the argument!",
        visualCard: "Q1 (+, +): θ = α\nQ2 (-, +): θ = π - α\nQ3 (-, -): θ = -(π - α)\nQ4 (+, -): θ = -α",
        memoryHack: "⚡ Mnemonic: 'CAST rule + Argand Quadrants'. Keep the principal argument in (-π, π]!"
      },
      {
        id: 4,
        badge: "⚔️ Interactive Micro-Trial",
        title: "Stage 4: Rapid Cube Root Drill",
        teacherTalk: "Quick check: Can you simplify this cube root expression in 5 seconds?",
        interactiveCheck: {
          question: "Simplify: (1 - ω + ω²) · (1 + ω - ω²)",
          options: ["4", "2", "-4"],
          correctIndex: 0,
          rewardNote: "🎯 Genius! Since 1 + ω² = -ω, the first bracket is (-ω - ω) = -2ω. Since 1 + ω = -ω², the second is (-ω² - ω²) = -2ω². (-2ω)(-2ω²) = 4ω³ = 4!"
        }
      }
    ],
    cheatSheet: [
      "De Moivre: (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ).",
      "Cube Roots of Unity: 1 + ω + ω² = 0, ω³ = 1.",
      "Modulus: |z₁ · z₂| = |z₁| · |z₂|, and |z₁ / z₂| = |z₁| / |z₂|.",
      "Conjugate: z · z̄ = |z|² = x² + y²."
    ],
    questions: [
      {
        id: 1,
        question: "What is the exact value of 1 + ω + ω² where ω is a complex cube root of unity?",
        options: [
          "1",
          "-1",
          "0",
          "3"
        ],
        correctIndex: 2,
        explanation: "The roots of z³ - 1 = 0 factor into (z - 1)(z² + z + 1) = 0. Since ω ≠ 1, ω² + ω + 1 = 0."
      },
      {
        id: 2,
        question: "Using De Moivre's Theorem, what is the value of [cos(π/6) + i sin(π/6)]⁶?",
        options: [
          "1",
          "-1",
          "i",
          "-i"
        ],
        correctIndex: 1,
        explanation: "By De Moivre's Theorem, [cos(π/6) + i sin(π/6)]⁶ = cos(6 × π/6) + i sin(6 × π/6) = cos(π) + i sin(π) = -1 + 0 = -1."
      },
      {
        id: 3,
        question: "What is the modulus of the complex number z = 5 - 12i?",
        options: [
          "7",
          "13",
          "17",
          "169"
        ],
        correctIndex: 1,
        explanation: "|z| = √(5² + (-12)²) = √(25 + 144) = √169 = 13."
      }
    ]
  },

  // Physics: Laws of Motion & Friction
  laws_of_motion: {
    title: "Newton's Laws of Motion & Friction (TSBIE Physics)",
    subject: "Physics",
    teacherPersona: {
      name: "Acharya Ramanujan AI",
      avatar: "🧙‍♂️",
      quote: "Force is not what keeps objects moving — force is what changes how they move. Master F = ma, and you master the universe!",
      speechScript: "Greetings, future engineer! Newton's laws are the bedrock of everything that moves, from a cricket ball driven through covers in Hyderabad to ISRO rockets piercing Earth's atmosphere."
    },
    realWorldLore: {
      hookTitle: "🚀 Rocket Propulsion & Formula 1 Braking",
      story: "When ISRO launches the Chandrayaan rocket from Sriharikota, high-velocity exhaust gas pushes downward, and by Newton's Third Law, the rocket accelerates into space. In Formula 1 racing, downforce increases normal reaction N, massively boosting tire static friction so cars can take sharp corners at 250 km/h without skidding!"
    },
    stages: [
      {
        id: 1,
        badge: "🌟 Origin & Intuition",
        title: "Stage 1: The Three Laws Unveiled",
        teacherTalk: "Galileo and Newton revolutionized human thought with one insight: Objects don't need a force to keep moving! In deep space, a thrown wrench will coast forever at constant velocity. Force is only needed to CHANGE velocity (acceleration).\n1. Law I (Inertia): Tendency to resist change in state of motion.\n2. Law II (Momentum): Force is the time derivative of momentum: F = dp/dt. When mass is constant, F = ma.\n3. Law III (Action-Reaction): For every action, an equal and opposite reaction acting on DIFFERENT bodies.",
        visualCard: "F_net = m · a    |    p = m · v    |    Impulse J = ∫ F dt = Δp\nAction-Reaction Pair: F_AB = - F_BA (Never cancel because they act on different bodies!)",
        memoryHack: "💡 Golden Rule: Action and Reaction NEVER cancel each other because they act on two DIFFERENT objects!"
      },
      {
        id: 2,
        badge: "⚡ Masterclass Derivation",
        title: "Stage 2: The Physics of Friction — Static vs Kinetic",
        teacherTalk: "Friction is electromagnetic in origin: microscopic peaks and valleys on surfaces interlock and form cold welds.\n- Static Friction (f_s) is a SELF-ADJUSTING force! If you push a 100 kg box with 5 N, friction pushes back with exactly 5 N. It only reaches its maximum value (Limiting Friction f_L = μ_s N) right before slipping.\n- Once motion starts, surface peaks don't have time to interlock deeply, so Kinetic Friction f_k = μ_k N is ALWAYS less than limiting static friction (μ_k < μ_s).",
        visualCard: "Limiting Friction: f_L = μ_s · N\nKinetic Friction: f_k = μ_k · N\nCondition: μ_k < μ_s   ⟹   f_k < f_L",
        memoryHack: "🔥 IPE Exam Favorite: 'Why is it easier to keep a heavy body in motion than to start it?' Answer: Kinetic friction is less than limiting static friction!"
      },
      {
        id: 3,
        badge: "🎯 Examiner Traps & Cheat Codes",
        title: "Stage 3: Normal Reaction & Incline Plane Traps",
        teacherTalk: "Trap Alert: Normal reaction N is NOT always equal to mg! On an incline of angle θ:\n- Perpendicular to incline: N = mg cos θ\n- Parallel to incline: Driving force is mg sin θ\n- Acceleration down a rough incline: a = g(sin θ - μ_k cos θ)\nAlways draw a Free Body Diagram (FBD) and resolve forces into parallel and perpendicular axes!",
        visualCard: "Rough Incline Acceleration: a = g(sin θ - μ cos θ)\nAngle of Repose: tan φ = μ_s\nBanking of Roads: v_max = √(r g tan θ)",
        memoryHack: "⚡ Mnemonic: 'Normal is Perpendicular!' Resolve mg into mg cos θ (perpendicular) and mg sin θ (sliding down)."
      },
      {
        id: 4,
        badge: "⚔️ Interactive Micro-Trial",
        title: "Stage 4: Free-Body Reflex Drill",
        teacherTalk: "Ready for a battle drill? Calculate this acceleration in your head!",
        interactiveCheck: {
          question: "A net force of 30 N pulls a 6 kg cart along a frictionless floor. What is its acceleration?",
          options: ["5 m/s²", "180 m/s²", "0.2 m/s²"],
          correctIndex: 0,
          rewardNote: "🎯 Perfect! a = F / m = 30 N / 6 kg = 5 m/s². Clean and instantaneous calculation!"
        }
      }
    ],
    cheatSheet: [
      "Newton's 2nd Law: F = dp/dt = ma (when mass is constant).",
      "Impulse-Momentum Theorem: J = F · Δt = m(v - u).",
      "Friction Relations: f_s ≤ μ_s N; f_k = μ_k N; μ_k < μ_s.",
      "Safe Turning on Banked Road: v = √(R g tan θ)."
    ],
    questions: [
      {
        id: 1,
        question: "Why does kinetic friction have a lower magnitude than limiting static friction?",
        options: [
          "Because once motion begins, surface contact asperities have less time to interlock and form cold welds",
          "Because gravity decreases once an object begins moving",
          "Because the mass of the object reduces dynamically",
          "Because air resistance neutralizes friction"
        ],
        correctIndex: 0,
        explanation: "When surfaces slide relative to each other, microscopic irregularities skim over one another without establishing deep molecular contact welds, reducing resistance."
      },
      {
        id: 2,
        question: "A cricket ball of mass 0.15 kg moving at 20 m/s is caught by a player in 0.1 seconds. What is the average force exerted on the player's hands?",
        options: [
          "3 N",
          "30 N",
          "300 N",
          "0.3 N"
        ],
        correctIndex: 1,
        explanation: "Δp = m · Δv = 0.15 kg × (0 - 20 m/s) = -3 kg·m/s. F = |Δp| / Δt = 3 / 0.1 = 30 N."
      },
      {
        id: 3,
        question: "An object rests on an inclined plane. If the angle of inclination is gradually increased until the object just begins to slide, that critical angle is known as:",
        options: [
          "Angle of Banking",
          "Angle of Deviation",
          "Angle of Repose",
          "Critical Angle of Refraction"
        ],
        correctIndex: 2,
        explanation: "The Angle of Repose is the maximum inclination of a plane at which a body remains in equilibrium under friction alone (tan θ = μ_s)."
      }
    ]
  },

  // Maths: Quadratic Expressions & Equations
  quadratic_equations: {
    title: "Quadratic Expressions & Equations (TSBIE Maths 2A / SSC 10)",
    subject: "Mathematics",
    teacherPersona: {
      name: "Acharya Ramanujan AI",
      avatar: "🧙‍♂️",
      quote: "Every parabola in nature, from the arc of a basketball shot to the curve of satellite dishes, sings the song of the quadratic equation!",
      speechScript: "Welcome! Today we master Quadratic Expressions. With the discriminant D as your magic compass, you will predict roots and signs of expressions without even graphing them!"
    },
    realWorldLore: {
      hookTitle: "🏀 Basketball Trajectories & Parabolic Mirrors",
      story: "When Stephen Curry shoots a three-pointer, gravity pulls downward with constant acceleration while the ball travels forward. Its height over time follows the quadratic parabola: h(t) = -½gt² + v₀t + h₀. Solar collectors and car headlights also use parabolic quadratic cross-sections to focus light into a single blazing beam."
    },
    stages: [
      {
        id: 1,
        badge: "🌟 Origin & Intuition",
        title: "Stage 1: Nature of Roots & The Discriminant Compass",
        teacherTalk: "For any quadratic equation ax² + bx + c = 0, the roots are given by x = (-b ± √D) / 2a, where the Discriminant D = b² - 4ac. Think of D as your diagnostic scanner:\n- D > 0: The parabola cuts the x-axis twice ⟹ Real and Distinct roots.\n- D = 0: The parabola touches the x-axis at its vertex ⟹ Real and Equal roots (x = -b/2a).\n- D < 0: The parabola floats entirely above or below the x-axis ⟹ Complex Conjugate roots.",
        visualCard: "ax² + bx + c = 0    |    D = b² - 4ac\nRoots: α, β = (-b ± √D) / 2a\nSum of Roots: α + β = -b/a    |    Product: αβ = c/a",
        memoryHack: "💡 Golden Rule: If coefficients a, b, c are rational and D is not a perfect square, roots always occur in conjugate surd pairs (p + √q and p - √q)!"
      },
      {
        id: 2,
        badge: "⚡ Masterclass Derivation",
        title: "Stage 2: Sign of Quadratic Expressions & Extreme Values",
        teacherTalk: "In Telangana IPE Board exams, this is a guaranteed 4-mark question: 'Determine when ax² + bx + c is always positive or negative.'\n1. If a > 0 and D < 0, the expression is POSITIVE for all real x (parabola smiles and never touches the x-axis).\n2. If a < 0 and D < 0, the expression is NEGATIVE for all real x.\nThe maximum or minimum value always occurs at x = -b / (2a), and that extreme value is (4ac - b²) / (4a)!",
        visualCard: "Always Positive: a > 0  AND  b² - 4ac < 0\nAlways Negative: a < 0  AND  b² - 4ac < 0\nVertex Extremum: x = -b / (2a),  f(x) = (4ac - b²) / (4a)",
        memoryHack: "🔥 Sign Rule: 'a dictates the smile; D dictates the touch!' If D < 0, f(x) has the SAME sign as 'a' everywhere!"
      },
      {
        id: 3,
        badge: "🎯 Examiner Traps & Cheat Codes",
        title: "Stage 3: Common Root Traps & Symmetric Expressions",
        teacherTalk: "When you see expressions involving α² + β², don't calculate α and β separately! Always convert into symmetric sums:\n- α² + β² = (α + β)² - 2αβ = (-b/a)² - 2(c/a)\n- α³ + β³ = (α + β)³ - 3αβ(α + β)\nThis saves 5 minutes and prevents messy square root calculations in competitive exams.",
        visualCard: "α² + β² = (α + β)² - 2αβ\n1/α + 1/β = (α + β) / (αβ)\n|α - β| = √D / |a|",
        memoryHack: "⚡ Mnemonic: 'Sum and Product are King!' Never solve for individual roots when sum and product suffice."
      },
      {
        id: 4,
        badge: "⚔️ Interactive Micro-Trial",
        title: "Stage 4: Discriminant Reflex Drill",
        teacherTalk: "Instant test! What is the nature of roots for 2x² - 4x + 2 = 0?",
        interactiveCheck: {
          question: "For 2x² - 4x + 2 = 0, what is D and the nature of roots?",
          options: ["D = 0, Real and Equal", "D = 16, Real and Distinct", "D = -16, Complex"],
          correctIndex: 0,
          rewardNote: "🎯 Spot on! D = (-4)² - 4(2)(2) = 16 - 16 = 0. Roots are real and equal (x = 1)!"
        }
      }
    ],
    cheatSheet: [
      "Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a).",
      "Sum α + β = -b/a, Product αβ = c/a.",
      "Same Sign Condition: ax² + bx + c has same sign as 'a' for all real x ⟺ D < 0.",
      "Extreme Value: f_min or f_max = (4ac - b²) / (4a) at x = -b / (2a)."
    ],
    questions: [
      {
        id: 1,
        question: "For what condition is the quadratic expression ax² + bx + c strictly positive for every real value of x?",
        options: [
          "a > 0 and b² - 4ac < 0",
          "a > 0 and b² - 4ac > 0",
          "a < 0 and b² - 4ac < 0",
          "a > 0 and b² - 4ac = 0"
        ],
        correctIndex: 0,
        explanation: "When a > 0, the parabola opens upwards. When D < 0, it never intersects or touches the x-axis, remaining strictly positive for all x ∈ ℝ."
      },
      {
        id: 2,
        question: "If α and β are the roots of x² - 7x + 12 = 0, what is the value of α² + β²?",
        options: [
          "49",
          "25",
          "37",
          "13"
        ],
        correctIndex: 1,
        explanation: "α + β = 7, αβ = 12. α² + β² = (α + β)² - 2αβ = 7² - 2(12) = 49 - 24 = 25."
      },
      {
        id: 3,
        question: "What is the minimum value of the quadratic function f(x) = x² - 6x + 14?",
        options: [
          "14",
          "3",
          "5",
          "-5"
        ],
        correctIndex: 2,
        explanation: "The minimum occurs at x = -b/(2a) = 6/2 = 3. Substituting x = 3: f(3) = 3² - 6(3) + 14 = 9 - 18 + 14 = 5."
      }
    ]
  }
};

// Generic dynamic masterclass generator with rich teacher pedagogy for ANY topic
function generateGenericMasterclass(topicTitle, subject, classId) {
  return {
    title: topicTitle,
    subject: subject || "Telangana Academic Curriculum",
    teacherPersona: {
      name: "Acharya Ramanujan AI",
      avatar: "🧙‍♂️",
      quote: `Mastering '${topicTitle}' isn't about rote learning — it's about seeing the universal pattern and unlocking effortless clarity!`,
      speechScript: `Welcome to our special masterclass on ${topicTitle}! Pay close attention to the 4 stages. We will build rock-solid intuition, reveal board exam cheat codes, and conquer the challenge test together!`
    },
    realWorldLore: {
      hookTitle: "🌐 Why This Knowledge Is A Superpower",
      story: `The concepts in '${topicTitle}' form the foundation of modern science, data analytics, and state-of-the-art engineering. Whether it is calculating orbital mechanics, architecting software algorithms, or passing Telangana board exams with an S-Rank, this topic provides the mental tools used by world-class thinkers.`
    },
    stages: [
      {
        id: 1,
        badge: "🌟 Origin & Intuition",
        title: "Stage 1: Foundational Lore & Core Intuition",
        teacherTalk: `Every complex theory in '${topicTitle}' begins with a very simple question. Before memorizing any definitions, ask: 'What problem was this concept created to solve?' Once you understand the original roadblock that scholars faced, the solution feels natural, logical, and inevitable.`,
        visualCard: `Core Premise: [Input Concepts] ──(Transformative Logic)──> [Output Laws & Answers]\nKey Rule: Active understanding beats 100 hours of blind memorization!`,
        memoryHack: "💡 Focus on the 'WHY' before the 'HOW'. When the why is clear, formulas become intuitive."
      },
      {
        id: 2,
        badge: "⚡ Masterclass Derivation",
        title: "Stage 2: Deep Conceptual & Technical Breakdown",
        teacherTalk: `Let's break down the primary mechanisms of '${topicTitle}'. In academic exams, answers that receive full marks contain 3 critical pillars: (1) Clear standard definitions, (2) Step-wise logical working with explicit formulas, and (3) Proper scientific units or geometric rationale. Practice writing derivations by hand without glancing at textbook solutions.`,
        visualCard: `Pillar 1: Standard Definition with exact terminology\nPillar 2: Step-by-step substitution and algebraic/logical flow\nPillar 3: Final statement with units and significance`,
        memoryHack: "🔥 IPE Board Secret: Telangana examiners look for explicit formula statements in the first 2 lines of your solution."
      },
      {
        id: 3,
        badge: "🎯 Examiner Traps & Cheat Codes",
        title: "Stage 3: High-Yield Exam Pitfalls & Shortcut Hacks",
        teacherTalk: `The most common mistake students make in '${topicTitle}' is skipping sign conventions, forgetting boundary constraints, or making arithmetic slips under time pressure. When solving multi-step problems, verify your intermediate steps by checking limiting cases or dimensional consistency.`,
        visualCard: `⚠️ Trap 1: Misinterpreting negative signs or direction\n⚠️ Trap 2: Skipping intermediate working lines\n✔️ Hack: Double-check boundary conditions (e.g. at x=0 or extreme limits)`,
        memoryHack: "⚡ Mental Check: 'Does my answer make physical/mathematical sense in the real world?'"
      },
      {
        id: 4,
        badge: "⚔️ Interactive Micro-Trial",
        title: "Stage 4: Quick-Fire Reflex Drill",
        teacherTalk: "Put your knowledge into action before taking the main challenge test!",
        interactiveCheck: {
          question: `Which approach is essential for achieving a perfect 100% score on questions about "${topicTitle}"?`,
          options: [
            "Stating formulas clearly, showing all steps, and stating final units",
            "Skipping steps and only writing the numerical value",
            "Memorizing past answers without understanding logic"
          ],
          correctIndex: 0,
          rewardNote: "🎯 Outstanding! Step-wise clarity and precision earn top marks in every board examination!"
        }
      }
    ],
    cheatSheet: [
      `Foundational Principle: Understand standard definitions and boundary constraints for ${topicTitle}.`,
      `Core Methodology: Write out derivations step-by-step with explicit formula mentions.`,
      `Exam Strategy: Solve previous-year board questions under timed exam conditions.`
    ],
    questions: [
      {
        id: 1,
        question: `Which fundamental principle is central to mastering "${topicTitle}"?`,
        options: [
          "Rigorous derivation of core formulas and consistent active recall",
          "Passive reading without solving textbook exercises",
          "Memorizing answers without understanding underlying logic",
          "Skipping prerequisite concepts"
        ],
        correctIndex: 0,
        explanation: "Active recall and solving textbook derivations ensures long-term retention and board exam precision."
      },
      {
        id: 2,
        question: `When answering high-weightage board exam questions on ${topicTitle}, what guarantees full marks?`,
        options: [
          "Writing clear step-by-step steps, stating formulas used, and highlighting final units",
          "Writing only the final numerical answer without intermediate working",
          "Using non-standard short abbreviations",
          "Skipping labelled diagrams"
        ],
        correctIndex: 0,
        explanation: "Telangana state board examiners award step-wise marks for formula, substitution, working, and units."
      },
      {
        id: 3,
        question: `What is the most effective approach to prepare for challenging problems in ${topicTitle}?`,
        options: [
          "Solve 3-5 previous-year board questions under timed exam conditions",
          "Skim through solved examples right before the test",
          "Rely entirely on luck",
          "Only memorize definitions"
        ],
        correctIndex: 0,
        explanation: "Timed practice of previous-year board problems builds speed, composure, and algorithmic accuracy."
      }
    ]
  };
}

// Main function to fetch or generate topic content & quiz
async function getTopicStudyAndQuiz(topicTitle, subject, classId) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const generated = await generateTopicWithGemini(apiKey, topicTitle, subject, classId);
      if (generated && generated.stages && Array.isArray(generated.questions)) {
        return generated;
      }
    } catch (err) {
      console.warn('⚠️ Gemini study generation fallback:', err.message);
    }
  }

  // Fallback to intelligent procedural presets
  const lower = (topicTitle || '').toLowerCase();
  if (lower.includes('matrix') || lower.includes('matrices') || lower.includes('determinant')) {
    return TOPIC_PRESETS.matrices;
  }
  if (lower.includes('complex') || lower.includes('moivre')) {
    return TOPIC_PRESETS.complex_numbers;
  }
  if (lower.includes('motion') || lower.includes('force') || lower.includes('friction') || lower.includes('newton')) {
    return TOPIC_PRESETS.laws_of_motion;
  }
  if (lower.includes('quadratic') || lower.includes('polynomial') || lower.includes('equation')) {
    return TOPIC_PRESETS.quadratic_equations;
  }

  // Generic dynamic masterclass generator with teacher pedagogy
  return generateGenericMasterclass(topicTitle, subject, classId);
}

module.exports = {
  getTopicStudyAndQuiz
};
