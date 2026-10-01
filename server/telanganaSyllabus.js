// Telangana State Board Official Syllabus Database
// Covers TS SCERT (Class 1 to 10 SSC) and TSBIE (Intermediate 1st & 2nd Year MPC, BiPC, CEC, MEC)

const TELANGANA_CLASSES = [
  { id: "class_1", name: "Class 1 (Primary)", stage: "Primary (TS SCERT)" },
  { id: "class_2", name: "Class 2 (Primary)", stage: "Primary (TS SCERT)" },
  { id: "class_3", name: "Class 3 (Primary)", stage: "Primary (TS SCERT)" },
  { id: "class_4", name: "Class 4 (Primary)", stage: "Primary (TS SCERT)" },
  { id: "class_5", name: "Class 5 (Primary)", stage: "Primary (TS SCERT)" },
  { id: "class_6", name: "Class 6 (Upper Primary)", stage: "Upper Primary (TS SCERT)" },
  { id: "class_7", name: "Class 7 (Upper Primary)", stage: "Upper Primary (TS SCERT)" },
  { id: "class_8", name: "Class 8 (High School)", stage: "High School (TS SCERT)" },
  { id: "class_9", name: "Class 9 (High School)", stage: "High School (TS SCERT)" },
  { id: "class_10", name: "Class 10 (SSC Board Exam)", stage: "Secondary Board (TS SSC)" },
  { id: "inter_1", name: "Intermediate 1st Year (TSBIE)", stage: "Senior Secondary (TSBIE)" },
  { id: "inter_2", name: "Intermediate 2nd Year (TSBIE)", stage: "Senior Secondary (TSBIE)" }
];

const TELANGANA_SYLLABUS = {
  // Class 1 to 5 SCERT Primary
  class_1: {
    title: "TS SCERT Class 1: Foundation Arc",
    subjects: [
      {
        name: "Mathematics (గణితం)",
        chapters: [
          { title: "Pre-Mathematical Concepts & Spatial Thinking", quests: ["Identify big/small, near/far, inside/outside objects", "Count objects 1 to 9 with visual flashcards", "Practice number writing 1-9"] },
          { title: "Numbers up to 20 & Simple Addition", quests: ["Single digit pictorial addition", "Counting with beads and fingers", "Practice forward and backward counting"] },
          { title: "Introduction to Shapes & Patterns", quests: ["Identify circles, squares, and triangles in real life", "Create a repeating shape drawing pattern"] }
        ]
      },
      {
        name: "First Language Telugu (తెలుగు వాచకం)",
        chapters: [
          { title: "అచ్చులు & హల్లులు (Vowels & Consonants)", quests: ["Practice writing అ to ఔ with correct strokes", "Identify letters క to ఱ in simple words", "Recite 2 traditional Balageyalu rhymes"] }
        ]
      },
      {
        name: "English (My English World 1)",
        chapters: [
          { title: "Alphabet A-Z & Rhymes", quests: ["Trace capital and small letters A-Z", "Learn 10 everyday classroom word names", "Sing English nursery rhyme with proper pronunciation"] }
        ]
      }
    ]
  },

  class_5: {
    title: "TS SCERT Class 5: Primary Apex Arc",
    subjects: [
      {
        name: "Environmental Studies (పరిసరాల విజ్ఞానం - EVS)",
        chapters: [
          { title: "Family, Community & Traditional Occupations", quests: ["Understand family structures and occupations in Telangana villages", "Explore heritage crafts and handlooms of Telangana (Pochampally)"] },
          { title: "Plants, Animals & Forest Ecosystems", quests: ["Study local flora & fauna of Telangana (Deer - Jinka, Palapitta)", "Understand photosynthesis and leaf venation"] },
          { title: "Water Bodies & Irrigation (Mission Kakatiya)", quests: ["Study chain of tanks and lakes in Telangana", "Draw water cycle and record daily household water conservation methods"] }
        ]
      },
      {
        name: "Mathematics (గణితం)",
        chapters: [
          { title: "Large Numbers, Multiplications & Divisions", quests: ["Solve 5 4-digit addition & subtraction word problems", "Solve 5 double-digit multiplication problems"] },
          { title: "Fractions & Decimals Basics", quests: ["Represent fractions on a number line", "Solve basic equivalent fraction questions"] },
          { title: "Perimeter, Area & Measurements", quests: ["Calculate perimeter and area of school notebook and desk", "Convert kilometers to meters and liters to milliliters"] }
        ]
      }
    ]
  },

  // Class 10 TS SSC Board Exam
  class_10: {
    title: "Telangana Class 10 (TS SSC Board Examination Arc)",
    board: "Directorate of Government Examinations, Telangana",
    boss: {
      name: "The 10/10 GPA Sovereign",
      subtitle: "Guardian of the TS SSC Board Hall Ticket",
      avatar: "🏆",
      maxHp: 2000
    },
    subjects: [
      {
        name: "Mathematics (Paper I & II Composite)",
        chapters: [
          { title: "Real Numbers & Euclid's Lemma", weightage: "8 Marks", quests: ["Prove √2 and √3 are irrational using contradiction", "Find HCF using Euclid's Division Algorithm", "Determine terminating vs non-terminating decimals without division"] },
          { title: "Sets & Venn Diagrams", weightage: "6 Marks", quests: ["Represent Union, Intersection, and Difference on Venn Diagrams", "Solve subset and finite/infinite set classification problems"] },
          { title: "Polynomials & Quadratic Equations", weightage: "10 Marks", quests: ["Find zeroes of quadratic polynomials and verify relationship with coefficients", "Solve quadratic equations by quadratic formula and completing the square", "Analyze nature of roots using discriminant D = b² - 4ac"] },
          { title: "Pair of Linear Equations in Two Variables", weightage: "8 Marks", quests: ["Solve equations using substitution and elimination methods", "Graph intersecting, parallel, and coincident lines"] },
          { title: "Progressions (AP & GP)", weightage: "8 Marks", quests: ["Derive nth term of an Arithmetic Progression tn = a + (n-1)d", "Calculate sum of n terms Sn = n/2(2a + (n-1)d)", "Solve real-world word problems on Geometric Progressions"] },
          { title: "Coordinate Geometry", weightage: "8 Marks", quests: ["Calculate distance between two coordinates", "Apply section formula and find centroid of triangle", "Derive area of triangle using coordinates"] },
          { title: "Similar Triangles & Pythagoras Theorem", weightage: "8 Marks", quests: ["State and prove Basic Proportionality Theorem (Thales Theorem)", "Prove Pythagoras Theorem with neat geometric diagram"] },
          { title: "Trigonometry & Applications", weightage: "12 Marks", quests: ["Prove trigonometric identities sin²θ + cos²θ = 1", "Solve heights and distances problems with angles of elevation/depression"] },
          { title: "Mensuration", weightage: "10 Marks", quests: ["Calculate surface area and volume of combined solids (cone + cylinder)", "Solve conversion of solid shapes problems"] },
          { title: "Statistics & Probability", weightage: "12 Marks", quests: ["Calculate Mean, Median, and Mode for grouped frequency data", "Draw Less Than and More Than Ogive curves", "Solve single and compound coin/die probability problems"] }
        ]
      },
      {
        name: "Physical Science (భౌతిక రసాయన శాస్త్రాలు)",
        chapters: [
          { title: "Heat & Thermal Equilibrium", weightage: "6 Marks", quests: ["Differentiate Heat vs Temperature with kinetic theory", "Solve specific heat capacity equation Q = msΔt problems"] },
          { title: "Chemical Reactions & Equations", weightage: "6 Marks", quests: ["Balance 5 complex chemical equations", "Identify exothermic, endothermic, redox, and displacement reactions"] },
          { title: "Reflection & Refraction of Light", weightage: "8 Marks", quests: ["Draw ray diagrams for concave and convex mirrors", "Derive mirror formula and snell's law of refraction"] },
          { title: "Structure of Atom & Periodic Classification", weightage: "8 Marks", quests: ["State Aufbau principle, Pauli's exclusion principle, and Hund's rule", "Explain periodic trends: Atomic radius, Electronegativity, Ionization energy"] },
          { title: "Electric Current & Electromagnetism", weightage: "10 Marks", quests: ["Verify Ohm's Law with circuit diagram", "Calculate equivalent resistance in series and parallel circuits", "Explain Fleming's Left Hand Rule and Electric Motor principle"] },
          { title: "Principles of Metallurgy & Carbon Compounds", weightage: "10 Marks", quests: ["Explain Froth Floatation and smelting processes", "Write IUPAC names for functional hydrocarbons and explain esterification"] }
        ]
      },
      {
        name: "Biological Science (జీవ శాస్త్రం)",
        chapters: [
          { title: "Nutrition - The Energy Supplying System", quests: ["Explain light & dark reactions of photosynthesis", "Draw human digestive system and label enzymes"] },
          { title: "Respiration & Transportation (Circulatory System)", quests: ["Compare aerobic vs anaerobic respiration", "Draw internal structure of human heart and trace double circulation"] },
          { title: "Excretion & Coordination", quests: ["Explain structure of Nephron and urine formation mechanism", "Draw reflex arc and identify endocrine hormones"] },
          { title: "Reproduction & Heredity (Mendel's Laws)", quests: ["Explain Monohybrid and Dihybrid cross phenotypic ratios", "Describe human sex determination and DNA replication basics"] }
        ]
      },
      {
        name: "Social Studies (సమాజ శాస్త్రం)",
        chapters: [
          { title: "Telangana Movement & State Formation", weightage: "Special High Yield", quests: ["Study 1969 Telangana Agitation, Gentlemen's Agreement, and Mulki Rules", "Understand Million March, Sakala Janula Samme, and AP Reorganisation Act 2014"] },
          { title: "India: Relief Features, Climate & Rivers", quests: ["Trace Himalayan rivers vs Peninsular rivers", "Analyze factors influencing South-West Monsoons"] },
          { title: "World Between Wars & Indian National Movement", quests: ["Analyze causes of World War I and II and League of Nations", "Evaluate Quit India Movement and Subhash Chandra Bose's INA"] }
        ]
      }
    ]
  },

  // Intermediate 1st Year (Junior Inter TSBIE)
  inter_1: {
    title: "Telangana Intermediate 1st Year (TSBIE Junior Inter)",
    board: "Telangana Board of Intermediate Education (TSBIE)",
    streams: ["MPC", "BiPC", "CEC", "MEC"],
    boss: {
      name: "TSBIE Junior Wyrm",
      subtitle: "Master of Intermediate Public Examinations",
      avatar: "📚",
      maxHp: 2200
    },
    subjects: {
      mpc: [
        {
          name: "Mathematics 1A (75 Marks IPE)",
          chapters: [
            { title: "Functions & Types", weightage: "11 Marks", quests: ["Determine domain and range of real valued functions", "Solve injective, surjective, and bijective mapping proofs", "Find inverse functions f⁻¹(x)"] },
            { title: "Mathematical Induction", weightage: "7 Marks", quests: ["Prove 1² + 2² + ... + n² = n(n+1)(2n+1)/6 using induction", "Solve divisibility proofs by mathematical induction"] },
            { title: "Matrices & Determinants", weightage: "22 Marks (Very High)", quests: ["Find Cramer's Rule solutions for 3 linear equations", "Solve system using Matrix Inversion method", "Prove determinant properties and solve adjoint/inverse"] },
            { title: "Vector Algebra: Addition & Product", weightage: "18 Marks", quests: ["Solve scalar and vector triple products [a b c] and a × (b × c)", "Find shortest distance between skew lines", "Calculate work done and torque using vector products"] },
            { title: "Trigonometric Ratios & Transformations", weightage: "15 Marks", quests: ["Prove conditional identities (sin 2A + sin 2B + sin 2C)", "Solve trigonometric equations in given intervals", "Prove Properties of Triangles: Sine Rule, Cosine Rule, and Inradius/Circumradius"] }
          ]
        },
        {
          name: "Mathematics 1B (75 Marks IPE)",
          chapters: [
            { title: "Locus & Transformation of Axes", weightage: "8 Marks", quests: ["Find equation of locus under given geometric conditions", "Apply translation and rotation of axes formulas"] },
            { title: "The Straight Line & Pair of Straight Lines", weightage: "29 Marks (Massive Weightage)", quests: ["Derive distance of a point from a straight line", "Find point of intersection and condition for perpendicular lines", "Solve homogeneous second degree equation ax² + 2hxy + by² = 0", "Prove angle between pair of lines and condition for parallel lines"] },
            { title: "3D Coordinates & Direction Cosines/Ratios", weightage: "9 Marks", quests: ["Calculate direction cosines and direction ratios of a line", "Find angle between two lines in 3D space"] },
            { title: "Limits, Continuity & Differentiation", weightage: "24 Marks", quests: ["Evaluate algebraic and trigonometric standard limits", "Derive derivatives from first principles (sin x, tan x, xⁿ)", "Apply product, quotient, and chain rule differentiation", "Find dy/dx for parametric and implicit functions"] },
            { title: "Applications of Derivatives", weightage: "15 Marks", quests: ["Find tangents and normals to curves at specified points", "Solve rate of change of quantities word problems", "Find maximum and minimum values of functions"] }
          ]
        },
        {
          name: "Physics 1 (60 Marks IPE)",
          chapters: [
            { title: "Physical World, Units & Motion in a Straight Line", weightage: "6 Marks", quests: ["Apply dimensional analysis to verify formulas", "Derive kinematic equations v = u+at, s = ut+½at², v²-u²=2as"] },
            { title: "Motion in a Plane (Vectors & Projectiles)", weightage: "8 Marks", quests: ["Derive Maximum Height, Time of Flight, and Horizontal Range of projectile", "State Parallelogram Law of Vectors and derive resultant formula"] },
            { title: "Laws of Motion & Friction", weightage: "8 Marks", quests: ["State Newton's Second Law and derive F = ma", "Define Static and Kinetic Friction and explain why friction is a necessary evil"] },
            { title: "Work, Energy & Power", weightage: "8 Marks", quests: ["State and prove Law of Conservation of Energy for a freely falling body", "Derive work-energy theorem for variable force"] },
            { title: "System of Particles & Rotational Motion", weightage: "8 Marks", quests: ["State theorems of Parallel and Perpendicular Axes", "Distinguish between Centre of Mass and Centre of Gravity"] },
            { title: "Thermodynamics & Thermal Properties", weightage: "12 Marks", quests: ["State and explain First and Second Laws of Thermodynamics", "Explain working of Carnot Engine and calculate efficiency"] }
          ]
        },
        {
          name: "Chemistry 1 (60 Marks IPE)",
          chapters: [
            { title: "Atomic Structure", weightage: "8 Marks", quests: ["Derive Bohr's postulates for hydrogen atom and energy levels", "Explain Quantum numbers (n, l, m, s) and their significance"] },
            { title: "Periodic Table & Chemical Bonding", weightage: "16 Marks (Top Yield)", quests: ["Explain factors affecting ionization enthalpy across periods and groups", "Explain hybridization (sp, sp², sp³) in CH₄, C₂H₄, C₂H₂", "Explain Molecular Orbital Theory (MOT) and calculate bond order of O₂ and N₂"] },
            { title: "States of Matter & Stoichiometry", weightage: "10 Marks", quests: ["Derive Ideal Gas Equation PV = nRT", "Balance redox reactions by ion-electron method in acidic/basic medium"] },
            { title: "Chemical Equilibrium & Thermodynamics", weightage: "10 Marks", quests: ["State Le Chatelier's principle and apply to Haber's synthesis of Ammonia", "Explain Hess's Law of Constant Heat Summation"] },
            { title: "Organic Chemistry: Hydrocarbons", weightage: "10 Marks", quests: ["Explain electrophilic substitution in Benzene (Nitration, Halogenation, Friedel-Crafts)", "State Markownikoff's rule with mechanism"] }
          ]
        }
      ],
      bipc: [
        {
          name: "Botany 1 (60 Marks IPE)",
          chapters: [
            { title: "Plant Morphology & Taxonomy", quests: ["Explain types of inflorescence (Racemose and Cymose)", "Describe floral characteristics of Fabaceae, Solanaceae, and Liliaceae families"] },
            { title: "Cell Structure & Cell Division", quests: ["Compare Mitosis vs Meiosis stages", "Explain fluid mosaic model of plasma membrane"] }
          ]
        },
        {
          name: "Zoology 1 (60 Marks IPE)",
          chapters: [
            { title: "Animal Diversity & Human Welfare", quests: ["Classify Phylum Chordata up to classes with diagnostic features", "Describe life cycle of Plasmodium vivax in mosquito and man"] }
          ]
        }
      ]
    }
  },

  // Intermediate 2nd Year (Senior Inter TSBIE)
  inter_2: {
    title: "Telangana Intermediate 2nd Year (TSBIE Senior Inter - Final Board)",
    board: "Telangana Board of Intermediate Education (TSBIE)",
    streams: ["MPC", "BiPC", "CEC", "MEC"],
    boss: {
      name: "The Senior Inter Apex Wyrm",
      subtitle: "Supreme Sovereign of Telangana IPE Board & TG EAPCET",
      avatar: "👑",
      maxHp: 2500
    },
    subjects: {
      mpc: [
        {
          name: "Mathematics 2A (75 Marks IPE)",
          chapters: [
            { title: "Complex Numbers & De Moivre's Theorem", weightage: "16 Marks", quests: ["Find modulus, argument, and polar form of complex numbers", "Apply De Moivre's theorem to find nth roots of unity (1, ω, ω²)", "Solve algebraic equations using De Moivre's expansions"] },
            { title: "Quadratic Expressions & Theory of Equations", weightage: "15 Marks", quests: ["Find condition for roots to be opposite in sign, rational, or real", "Solve reciprocal equations and polynomial equations with repeated roots", "Apply symmetric functions of roots (α, β, γ)"] },
            { title: "Permutations & Combinations", weightage: "12 Marks", quests: ["Solve circular permutation arrangements", "Find rank of words (e.g., EAMCET, MASTER) with and without repetition", "Apply nPr and nCr theorems to selection problems"] },
            { title: "Binomial Theorem", weightage: "16 Marks", quests: ["Find general term and middle term in (x + a)ⁿ", "Solve infinite binomial series expansions (1 - x)⁻ᵖ/ᵠ", "Prove binomial coefficient identities C₀ + C₁ + ... + Cₙ = 2ⁿ"] },
            { title: "Probability & Random Variables", weightage: "20 Marks", quests: ["State and prove Addition and Multiplication theorems of probability", "State and prove Bayes' Theorem with medical/testing word problems", "Calculate Mean and Variance of Poisson and Binomial probability distributions"] }
          ]
        },
        {
          name: "Mathematics 2B (75 Marks IPE)",
          chapters: [
            { title: "Circle & System of Circles", weightage: "28 Marks (Huge Weightage)", quests: ["Find equation of circle passing through 3 non-collinear points", "Derive condition for tangent and normal to circle x² + y² = r²", "Find length of chord and power of point", "Determine radical axis and limiting points of coaxial systems"] },
            { title: "Parabola, Ellipse & Hyperbola", weightage: "17 Marks", quests: ["Derive standard equation of parabola y² = 4ax", "Derive equation of tangent and normal to ellipse x²/a² + y²/b² = 1", "Find eccentricity, foci, directrices, and asymptotes of hyperbola"] },
            { title: "Indefinite & Definite Integration", weightage: "24 Marks", quests: ["Evaluate standard integrals using substitution, partial fractions, and by parts", "Solve reduction formulas for ∫ sinⁿx dx and ∫ tanⁿx dx", "Evaluate definite integrals using properties ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx"] },
            { title: "Differential Equations", weightage: "13 Marks", quests: ["Find order and degree of differential equations", "Solve separable variables and homogeneous differential equations", "Solve linear differential equations dy/dx + Py = Q"] }
          ]
        },
        {
          name: "Physics 2 (60 Marks IPE)",
          chapters: [
            { title: "Waves & Wave Optics", weightage: "10 Marks", quests: ["Derive expression for stationary waves in stretched strings (harmonics)", "Derive Doppler Effect formulas for sound", "Explain Young's Double Slit Experiment and fringe width β = λD/d"] },
            { title: "Ray Optics & Optical Instruments", weightage: "8 Marks", quests: ["Derive Lens Maker's Formula 1/f = (μ-1)(1/R₁ - 1/R₂)", "Explain working and magnifying power of Compound Microscope and Astronomical Telescope"] },
            { title: "Current Electricity", weightage: "8 Marks", quests: ["State Kirchhoff's Junction and Loop Rules with circuit analysis", "Explain working of Wheatstone Bridge and Potentiometer for comparing EMFs"] },
            { title: "Electromagnetic Induction & Alternating Current", weightage: "10 Marks", quests: ["State Faraday's and Lenz's Laws of Induction", "Explain working of AC Generator and Transformer (step up/down)"] },
            { title: "Atoms, Nuclei & Semiconductor Electronics", weightage: "14 Marks", quests: ["Derive nuclear radius formula and explain nuclear fission/fusion in Sun", "Explain p-n junction diode as Half Wave and Full Wave Rectifier", "Explain working of solar cell and light emitting diode (LED)"] }
          ]
        },
        {
          name: "Chemistry 2 (60 Marks IPE)",
          chapters: [
            { title: "Solid State & Solutions", weightage: "10 Marks", quests: ["Calculate packing efficiency in FCC, BCC, and Simple Cubic lattices", "Derive Raoult's Law and calculate Colligative Properties (elevation in boiling point)"] },
            { title: "Electrochemistry & Chemical Kinetics", weightage: "14 Marks", quests: ["State Kohlrausch's law of independent migration of ions", "Derive integrated rate equation for First Order Reactions and half-life", "State Arrhenius equation for temperature dependence of rate constant"] },
            { title: "p-Block & Coordination Compounds", weightage: "16 Marks", quests: ["Describe manufacture of Nitric Acid by Ostwald process and Ammonia by Haber's", "Explain Werner's coordination theory and Crystal Field Splitting in Octahedral complexes"] },
            { title: "Organic Reactions: Aldehydes, Ketones, Carboxylic Acids & Amines", weightage: "16 Marks", quests: ["Explain Aldol Condensation and Cannizzaro reaction mechanisms", "Explain Gabriel Phthalimide synthesis and Carbylamine test for primary amines"] }
          ]
        }
      ]
    }
  }
};

module.exports = {
  TELANGANA_CLASSES,
  TELANGANA_SYLLABUS
};
