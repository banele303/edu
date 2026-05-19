import { mutation } from "./_generated/server";

/**
 * Seeds comprehensive CAPS curriculum data for Grades 1-12
 * across all 11 official South African languages.
 * 
 * Run: npx convex run capsSeed:seedAll
 */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing CAPS data to avoid duplication on multiple seed runs
    const allLanguages = await ctx.db.query("languages").collect();
    for (const l of allLanguages) await ctx.db.delete(l._id);

    const allCapsSubjects = await ctx.db.query("capsSubjects").collect();
    for (const s of allCapsSubjects) await ctx.db.delete(s._id);

    const allSyllabusTopics = await ctx.db.query("syllabusTopics").collect();
    for (const t of allSyllabusTopics) await ctx.db.delete(t._id);

    const allPastPapers = await ctx.db.query("pastPapers").collect();
    for (const p of allPastPapers) await ctx.db.delete(p._id);

    const allStudyResources = await ctx.db.query("studyResources").collect();
    for (const r of allStudyResources) await ctx.db.delete(r._id);

    const allGenExams = await ctx.db.query("generatedExams").collect();
    for (const e of allGenExams) await ctx.db.delete(e._id);

    // Ensure we have a default user to act as uploader/creator
    let defaultUser = await ctx.db.query("users").first();
    if (!defaultUser) {
      const defaultUserId = await ctx.db.insert("users", {
        name: "Admin User",
        email: "alexsouthflow@gmail.com",
        role: "admin",
        isActive: true,
      });
      defaultUser = await ctx.db.get(defaultUserId);
    }
    const adminId = defaultUser!._id;

    // ── 1. LANGUAGES (all 11 official) ──
    const languages = [
      { name: "English", code: "en", isOfficial: true },
      { name: "isiZulu", code: "zu", isOfficial: true },
      { name: "isiXhosa", code: "xh", isOfficial: true },
      { name: "Afrikaans", code: "af", isOfficial: true },
      { name: "Sepedi (Northern Sotho)", code: "nso", isOfficial: true },
      { name: "Setswana", code: "tn", isOfficial: true },
      { name: "Sesotho", code: "st", isOfficial: true },
      { name: "Xitsonga", code: "ts", isOfficial: true },
      { name: "siSwati", code: "ss", isOfficial: true },
      { name: "Tshivenda", code: "ve", isOfficial: true },
      { name: "isiNdebele", code: "nr", isOfficial: true },
    ];
    const langIds: Record<string, any> = {};
    for (const l of languages) {
      langIds[l.code] = await ctx.db.insert("languages", l);
    }

    // ── 2. CAPS SUBJECTS per GRADE ──
    // Foundation Phase (Gr 1-3)
    const foundationSubjects = [
      { code: "LIFE-SKILLS", name: "Life Skills", compulsory: true, isLang: false },
      { code: "MATH", name: "Mathematics", compulsory: true, isLang: false },
      { code: "HL", name: "Home Language", compulsory: true, isLang: true },
      { code: "FAL", name: "First Additional Language", compulsory: true, isLang: true },
    ];

    // Intermediate Phase (Gr 4-6)
    const intermediateSubjects = [
      { code: "HL", name: "Home Language", compulsory: true, isLang: true },
      { code: "FAL", name: "First Additional Language", compulsory: true, isLang: true },
      { code: "MATH", name: "Mathematics", compulsory: true, isLang: false },
      { code: "NS", name: "Natural Sciences", compulsory: true, isLang: false },
      { code: "SS", name: "Social Sciences", compulsory: true, isLang: false },
      { code: "TECH", name: "Technology", compulsory: true, isLang: false },
      { code: "EMS", name: "Economic and Management Sciences", compulsory: true, isLang: false },
      { code: "LO", name: "Life Orientation", compulsory: true, isLang: false },
      { code: "CA", name: "Creative Arts", compulsory: true, isLang: false },
    ];

    // Senior Phase (Gr 7-9)
    const seniorSubjects = [
      { code: "HL", name: "Home Language", compulsory: true, isLang: true },
      { code: "FAL", name: "First Additional Language", compulsory: true, isLang: true },
      { code: "MATH", name: "Mathematics", compulsory: true, isLang: false },
      { code: "NS", name: "Natural Sciences", compulsory: true, isLang: false },
      { code: "SS", name: "Social Sciences", compulsory: true, isLang: false },
      { code: "TECH", name: "Technology", compulsory: true, isLang: false },
      { code: "EMS", name: "Economic and Management Sciences", compulsory: true, isLang: false },
      { code: "LO", name: "Life Orientation", compulsory: true, isLang: false },
      { code: "CA", name: "Creative Arts", compulsory: true, isLang: false },
    ];

    // FET Phase (Gr 10-12)
    const fetSubjects = [
      { code: "HL", name: "Home Language", compulsory: true, isLang: true },
      { code: "FAL", name: "First Additional Language", compulsory: true, isLang: true },
      { code: "MATH", name: "Mathematics", compulsory: true, isLang: false },
      { code: "MATH-LIT", name: "Mathematical Literacy", compulsory: false, isLang: false },
      { code: "PHY-SCI", name: "Physical Sciences", compulsory: false, isLang: false },
      { code: "LIFE-SCI", name: "Life Sciences", compulsory: false, isLang: false },
      { code: "GEO", name: "Geography", compulsory: false, isLang: false },
      { code: "HIST", name: "History", compulsory: false, isLang: false },
      { code: "ECON", name: "Economics", compulsory: false, isLang: false },
      { code: "ACC", name: "Accounting", compulsory: false, isLang: false },
      { code: "BUS", name: "Business Studies", compulsory: false, isLang: false },
      { code: "TOUR", name: "Tourism", compulsory: false, isLang: false },
      { code: "CAT", name: "Computer Applications Technology", compulsory: false, isLang: false },
      { code: "IT", name: "Information Technology", compulsory: false, isLang: false },
      { code: "ENG", name: "Engineering Graphics and Design", compulsory: false, isLang: false },
      { code: "LO", name: "Life Orientation", compulsory: true, isLang: false },
      { code: "MUS", name: "Music", compulsory: false, isLang: false },
      { code: "VIS-ART", name: "Visual Arts", compulsory: false, isLang: false },
      { code: "DRAM", name: "Dramatic Arts", compulsory: false, isLang: false },
      { code: "AGRI", name: "Agricultural Sciences", compulsory: false, isLang: false },
      { code: "CONS", name: "Consumer Studies", compulsory: false, isLang: false },
      { code: "HOSP", name: "Hospitality Studies", compulsory: false, isLang: false },
    ];

    const capsSubjectIds: Record<string, Record<number, any>> = {};

    for (let grade = 1; grade <= 12; grade++) {
      let subjects: typeof foundationSubjects;
      let phase: string;
      if (grade <= 3) { subjects = foundationSubjects; phase = "Foundation"; }
      else if (grade <= 6) { subjects = intermediateSubjects; phase = "Intermediate"; }
      else if (grade <= 9) { subjects = seniorSubjects; phase = "Senior"; }
      else { subjects = fetSubjects; phase = "FET"; }

      for (const s of subjects) {
        const sid = await ctx.db.insert("capsSubjects", {
          name: s.name,
          code: s.code,
          grade,
          phase,
          description: `${s.name} for Grade ${grade} (${phase} Phase)`,
          isCompulsory: s.compulsory,
          isLanguage: s.isLang,
        });
        if (!capsSubjectIds[s.code]) capsSubjectIds[s.code] = {};
        capsSubjectIds[s.code][grade] = sid;
      }
    }

    // ── 3. SYLLABUS TOPICS (key subjects, Grades 1-12) ──
    const syllabusData: Array<{
      subjectCode: string; grade: number; term: number;
      topic: string; subTopics: string[]; outline: string; hours: number; lang: string;
    }> = [];

    // ── MATHEMATICS (Gr 1-12) ──
    const mathTopics: Array<[number, number, string, string[], string, number]> = [
      // [grade, term, topic, subTopics, outline, hours]
      // Foundation Phase
      [1, 1, "Numbers, Operations and Relationships", ["Counting 1-10", "Number recognition", "Addition within 10"], "Count, recognize numbers, simple addition", 8],
      [1, 2, "Patterns, Functions and Algebra", ["Number patterns", "Geometric patterns"], "Identify and create simple patterns", 4],
      [1, 3, "Space and Shape", ["2D shapes", "3D objects", "Position"], "Recognize shapes, describe position", 6],
      [1, 4, "Measurement", ["Length", "Mass", "Time", "Money"], "Compare lengths, tell time, recognize coins", 6],
      [2, 1, "Numbers, Operations and Relationships", ["Counting 1-200", "Addition within 20", "Subtraction within 20"], "Count, add and subtract within 20", 10],
      [2, 2, "Numbers, Operations and Relationships", ["Multiplication (2,5,10)", "Division", "Word problems"], "Multiply and divide, solve word problems", 10],
      [2, 3, "Fractions", ["Halves", "Quarters", "Eighths"], "Recognize and create fractions", 6],
      [2, 4, "Measurement and Data", ["Length (cm)", "Capacity", "Data handling"], "Measure in cm, collect data", 6],
      [3, 1, "Numbers, Operations and Relationships", ["Counting 1-1000", "Addition/Subtraction within 1000", "Multiplication tables"], "Operations within 1000, times tables", 12],
      [3, 2, "Fractions", ["Common fractions", "Fraction of a whole"], "Understand and compare fractions", 8],
      [3, 3, "Space and Shape", ["Properties of 2D and 3D shapes", "Symmetry"], "Describe shapes, identify symmetry", 6],
      [3, 4, "Measurement and Data", ["Perimeter", "Area", "Data graphs"], "Calculate perimeter, read graphs", 8],
      // Intermediate Phase
      [4, 1, "Whole Numbers", ["Place value to 1,000,000", "Rounding", "Addition/Subtraction"], "Operations with large numbers", 10],
      [4, 2, "Common Fractions", ["Equivalent fractions", "Adding/Subtracting fractions"], "Fraction operations", 8],
      [4, 3, "Decimal Fractions", ["Introduction to decimals", "Place value"], "Understand decimal notation", 8],
      [4, 4, "Measurement and Geometry", ["Area and perimeter", "Properties of shapes"], "Calculate area, classify shapes", 8],
      [5, 1, "Whole Numbers and Integers", ["Factors and multiples", "Prime numbers", "LCM and HCF"], "Number theory concepts", 10],
      [5, 2, "Common and Decimal Fractions", ["Operations with fractions", "Percentage introduction"], "Fraction and percentage calculations", 10],
      [5, 3, "Patterns and Algebra", ["Number patterns", "Introduction to variables"], "Algebraic thinking", 8],
      [5, 4, "Measurement and Data", ["Volume and capacity", "Probability"], "3D measurement, basic probability", 8],
      [6, 1, "Ratio, Rate and Proportion", ["Ratio concepts", "Rate problems", "Direct and inverse proportion"], "Proportional reasoning", 10],
      [6, 2, "Finance", ["Profit and loss", "Budget", "Interest"], "Financial mathematics", 8],
      [6, 3, "Algebra", ["Algebraic expressions", "Simple equations"], "Solve for unknowns", 10],
      [6, 4, "Geometry and Measurement", ["Pythagorean theorem", "Surface area", "Volume"], "Advanced geometry", 10],
      // Senior Phase
      [7, 1, "Algebraic Expressions", ["Variables and constants", "Simplification", "Substitution"], "Manipulate algebraic expressions", 10],
      [7, 2, "Equations and Inequalities", ["Solving linear equations", "Word problems"], "Solve equations with one unknown", 10],
      [7, 3, "Geometry", ["Angles", "Triangles", "Congruence"], "Geometric reasoning", 10],
      [7, 4, "Measurement and Data", ["Area and perimeter of circles", "Surface area", "Volume of prisms"], "Advanced measurement", 10],
      [8, 1, "Algebra", ["Factorisation", "Quadratic equations"], "Advanced algebraic techniques", 12],
      [8, 2, "Functions and Graphs", ["Linear functions", "Graphing", "Gradient"], "Understand and plot functions", 12],
      [8, 3, "Geometry", ["Similarity", "Trigonometry introduction"], "Similarity ratios, basic trig", 10],
      [8, 4, "Data Handling", ["Measures of central tendency", "Probability"], "Statistics and probability", 8],
      [9, 1, "Algebra", ["Exponents", "Surds", "Quadratic formula"], "Advanced algebra", 12],
      [9, 2, "Functions", ["Parabolas", "Hyperbolas", "Exponential functions"], "Graph and analyse functions", 12],
      [9, 3, "Trigonometry", ["Sine, cosine, tangent", "Trig identities", "Applications"], "Trigonometric ratios and applications", 12],
      [9, 4, "Euclidean Geometry", ["Circle geometry", "Proofs", "Similarity"], "Geometric proofs", 10],
      // FET Phase
      [10, 1, "Algebra", ["Quadratic equations", "Exponents", "Surds"], "Advanced algebraic manipulation", 12],
      [10, 2, "Functions and Graphs", ["Linear, quadratic, exponential, trigonometric functions"], "Graph and analyse all function types", 14],
      [10, 3, "Trigonometry", ["Reduction formulae", "Identities", "Graphs"], "Advanced trigonometry", 12],
      [10, 4, "Euclidean Geometry", ["Proportionality", "Similarity", "Circle theorems"], "Geometric proofs and applications", 10],
      [11, 1, "Calculus", ["Limits", "Differentiation rules", "Applications"], "Introduction to differential calculus", 14],
      [11, 2, "Trigonometry", ["Compound angles", "Double angle formulae", "Equations"], "Advanced trig equations", 12],
      [11, 3, "Analytical Geometry", ["Equations of lines", "Circles", "Tangents"], "Coordinate geometry", 12],
      [11, 4, "Euclidean Geometry and Measurement", ["Proofs", "Surface area", "Volume"], "Advanced geometry", 10],
      [12, 1, "Calculus", ["Integration", "Area under curves", "Applications"], "Integral calculus", 14],
      [12, 2, "Sequences and Series", ["Arithmetic and geometric sequences", "Sigma notation", "Convergence"], "Sequences, series, finance maths", 12],
      [12, 3, "Probability and Counting", ["Counting principles", "Probability distributions"], "Advanced probability", 10],
      [12, 4, "Revision and Exam Preparation", ["Past paper practice", "Exam techniques"], "Comprehensive revision", 12],
    ];

    for (const [grade, term, topic, subTopics, outline, hours] of mathTopics) {
      if (capsSubjectIds["MATH"]?.[grade]) {
        syllabusData.push({
          subjectCode: "MATH", grade, term, topic, subTopics, outline, hours, lang: "en",
        });
      }
    }

    // ── PHYSICAL SCIENCES (Gr 10-12) ──
    const sciTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "Mechanics", ["Kinematics", "Newton's Laws", "Momentum"], "Motion and forces", 12],
      [10, 2, "Waves, Sound and Light", ["Wave properties", "Sound", "Electromagnetic waves"], "Wave phenomena", 10],
      [10, 3, "Electricity and Magnetism", ["Electrostatics", "Circuits", "Magnetism"], "Electric and magnetic fields", 12],
      [10, 4, "Matter and Materials", ["Atomic structure", "Bonding", "States of matter"], "Properties of matter", 10],
      [11, 1, "Mechanics (Advanced)", ["Projectile motion", "Work-energy", "Power"], "Advanced mechanics", 12],
      [11, 2, "Chemical Bonding and Molecular Structure", ["Intermolecular forces", "Molecular geometry"], "Chemical bonding", 10],
      [11, 3, "Electricity and Magnetism (Advanced)", ["Electromagnetic induction", "AC circuits"], "Electromagnetism", 12],
      [11, 4, "Optical Phenomena", ["Refraction", "Diffraction", "Interference"], "Light phenomena", 10],
      [12, 1, "Mechanics (Calculus-based)", ["Rotational dynamics", "Gravitation"], "Advanced mechanics with calculus", 12],
      [12, 2, "Chemical Change", ["Stoichiometry", "Thermochemistry", "Chemical equilibrium"], "Chemical reactions", 14],
      [12, 3, "Electricity and Magnetism (Calculus)", ["Capacitance", "Inductance", "EM waves"], "Advanced electromagnetism", 12],
      [12, 4, "Modern Physics", ["Photoelectric effect", "Atomic models", "Nuclear physics"], "Quantum and nuclear physics", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of sciTopics) {
      if (capsSubjectIds["PHY-SCI"]?.[grade]) {
        syllabusData.push({ subjectCode: "PHY-SCI", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── LIFE SCIENCES (Gr 10-12) ──
    const lifeSciTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "Biodiversity and Classification", ["Taxonomy", "Five kingdoms", "Classification systems"], "Classify living organisms", 10],
      [10, 2, "History of Life on Earth", ["Evolution", "Fossil record", "Natural selection"], "Evolutionary biology", 10],
      [10, 3, "Animal and Plant Diversity", ["Body plans", "Adaptations"], "Diversity of life", 10],
      [10, 4, "Environmental Studies", ["Biomes", "Ecosystems", "Human impact"], "Ecology and environment", 10],
      [11, 1, "Biochemistry and Cell Biology", ["Biomolecules", "Cell structure", "Cell processes"], "Cellular biology", 12],
      [11, 2, "Plant and Animal Physiology", ["Transport systems", "Gas exchange", "Excretion"], "Physiological processes", 14],
      [11, 3, "Genetics", ["DNA structure", "Inheritance", "Genetic engineering"], "Genetics and inheritance", 12],
      [11, 4, "Ecology and Population Dynamics", ["Population ecology", "Community ecology"], "Ecological systems", 10],
      [12, 1, "Molecular Genetics", ["DNA replication", "Protein synthesis", "Gene expression"], "Molecular biology", 12],
      [12, 2, "Evolution and Speciation", ["Speciation mechanisms", "Human evolution"], "Advanced evolution", 12],
      [12, 3, "Human Physiology", ["Nervous system", "Endocrine system", "Reproduction"], "Human body systems", 14],
      [12, 4, "Environmental Management", ["Sustainability", "Conservation", "Climate change"], "Environmental science", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of lifeSciTopics) {
      if (capsSubjectIds["LIFE-SCI"]?.[grade]) {
        syllabusData.push({ subjectCode: "LIFE-SCI", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── ENGLISH HL (Gr 1-12) ──
    const engTopics: Array<[number, number, string, string[], string, number]> = [
      [1, 1, "Listening and Speaking", ["Greetings", "Following instructions", "Story listening"], "Basic oral communication", 6],
      [1, 2, "Phonics and Reading", ["Letter sounds", "Simple words", "Shared reading"], "Foundational literacy", 8],
      [1, 3, "Writing", ["Letter formation", "Simple sentences", "Personal writing"], "Basic writing skills", 6],
      [1, 4, "Language Structures", ["Nouns", "Verbs", "Simple sentences"], "Basic grammar", 4],
      [4, 1, "Reading and Viewing", ["Comprehension", "Visual literacy", "Dictionary skills"], "Reading strategies", 8],
      [4, 2, "Writing and Presenting", ["Narrative essays", "Personal recounts", "Process writing"], "Extended writing", 8],
      [4, 3, "Language Structures", ["Parts of speech", "Tenses", "Punctuation"], "Grammar and conventions", 6],
      [4, 4, "Oral Communication", ["Prepared speech", "Unprepared reading", "Listening"], "Oral skills", 6],
      [7, 1, "Reading and Viewing", ["Literary texts", "Comprehension strategies", "Summary"], "Advanced reading", 10],
      [7, 2, "Writing and Presenting", ["Descriptive essays", "Argumentative writing", "Transactional texts"], "Essay writing", 10],
      [7, 3, "Language Structures", ["Active/passive voice", "Direct/indirect speech", "Complex sentences"], "Advanced grammar", 8],
      [7, 4, "Oral Communication", ["Prepared speeches", "Interviews", "Discussion"], "Advanced oral", 8],
      [10, 1, "Novel Study", ["Literary analysis", "Characterisation", "Themes"], "Prose analysis", 12],
      [10, 2, "Poetry", ["Poetic devices", "Analysis", "Interpretation"], "Poetry analysis", 10],
      [10, 3, "Drama", ["Dramatic techniques", "Character analysis", "Stage directions"], "Drama study", 10],
      [10, 4, "Writing", ["Essay writing", "Transactional writing", "Summary"], "Advanced writing", 10],
      [12, 1, "Shakespeare/Novel", ["Literary analysis", "Critical essay writing"], "Paper 1 preparation", 14],
      [12, 2, "Poetry and Drama", ["Unseen poetry", "Contextual questions"], "Paper 2 preparation", 14],
      [12, 3, "Language and Editing", ["Summary", "Comprehension", "Language structures"], "Paper 3 preparation", 12],
      [12, 4, "Exam Preparation", ["Past papers", "Timed practice", "Revision"], "Final exam prep", 12],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of engTopics) {
      if (capsSubjectIds["HL"]?.[grade]) {
        syllabusData.push({ subjectCode: "HL", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── HISTORY (Gr 10-12) ──
    const histTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "The World Around 1600", ["Renaissance", "Age of exploration", "Scientific revolution"], "Global history foundations", 10],
      [10, 2, "French Revolution", ["Causes", "Key events", "Impact"], "Revolutionary change", 10],
      [10, 3, "Industrial Revolution", ["Inventions", "Social change", "Urbanisation"], "Industrial transformation", 10],
      [10, 4, "Imperialism", ["Scramble for Africa", "Colonialism", "Resistance"], "Colonial expansion", 10],
      [11, 1, "World War I", ["Causes", "Course", "Treaty of Versailles"], "The Great War", 12],
      [11, 2, "Russian Revolution", ["Tsarist Russia", "Bolsheviks", "Stalinism"], "Communist revolution", 10],
      [11, 3, "World War II", ["Rise of Nazis", "Holocaust", "Pacific War"], "Second World War", 12],
      [11, 4, "Cold War", ["Superpower rivalry", "Nuclear age", "Proxy wars"], "Cold War era", 10],
      [12, 1, "Civil Rights Movements", ["USA", "South Africa", "Global"], "Struggle for equality", 12],
      [12, 2, "African Independence", ["Decolonisation", "Pan-Africanism", "Nation building"], "African liberation", 12],
      [12, 3, "Apartheid South Africa", ["Rise of apartheid", "Resistance", "Negotiations"], "SA history", 14],
      [12, 4, "Post-Apartheid South Africa", ["Democracy", "Reconciliation", "Challenges"], "New South Africa", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of histTopics) {
      if (capsSubjectIds["HIST"]?.[grade]) {
        syllabusData.push({ subjectCode: "HIST", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── GEOGRAPHY (Gr 10-12) ──
    const geoTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "The Atmosphere", ["Composition", "Weather systems", "Climate"], "Atmospheric processes", 12],
      [10, 2, "Geomorphology", ["Rocks", "Landforms", "Plate tectonics"], "Earth's structure", 10],
      [10, 3, "Population Geography", ["Population growth", "Migration", "Settlement"], "Human geography", 10],
      [10, 4, "Water Resources", ["Hydrology", "Water management", "Droughts"], "Water systems", 10],
      [11, 1, "Climate and Weather", ["Synoptic charts", "Tropical cyclones", "Local climates"], "Advanced climatology", 12],
      [11, 2, "Geomorphology (Advanced)", ["Slopes", "Mass movement", "Rivers"], "Advanced landforms", 10],
      [11, 3, "Development Geography", ["Development indicators", "Trade", "Aid"], "Global development", 10],
      [11, 4, "Resources and Sustainability", ["Energy", "Food security", "Sustainability"], "Resource management", 10],
      [12, 1, "Climate Change and Variability", ["Global warming", "El Niño", "Impacts"], "Climate science", 12],
      [12, 2, "People and Places", ["Urbanisation", "Rural-urban migration", "Informal settlements"], "Settlement geography", 10],
      [12, 3, "People and their Needs", ["Agriculture", "Industry", "Tourism"], "Economic geography", 12],
      [12, 4, "GIS and Fieldwork", ["Geographic information systems", "Mapwork", "Field studies"], "Practical geography", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of geoTopics) {
      if (capsSubjectIds["GEO"]?.[grade]) {
        syllabusData.push({ subjectCode: "GEO", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── ACCOUNTING (Gr 10-12) ──
    const accTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "Basic Accounting Concepts", ["Accounting equation", "Double entry", "Source documents"], "Foundations of accounting", 12],
      [10, 2, "Ledger and Trial Balance", ["Posting to ledger", "Trial balance", "Subsidiary journals"], "Recording transactions", 12],
      [10, 3, "Final Accounts", ["Income statement", "Balance sheet", "Adjustments"], "Financial statements", 12],
      [10, 4, "Cost Accounting", ["Cost concepts", "Cost calculations", "Break-even"], "Costing principles", 10],
      [11, 1, "Reconciliations", ["Bank reconciliation", "Debtors/Creditors control"], "Reconciliation procedures", 10],
      [11, 2, "Fixed Assets", ["Asset register", "Depreciation", "Disposal"], "Asset management", 10],
      [11, 3, "Partnerships", ["Partnership accounts", "Financial statements"], "Partnership accounting", 12],
      [11, 4, "Companies", ["Company accounts", "Taxation", "Audit"], "Corporate accounting", 12],
      [12, 1, "Cash Flow Statements", ["Operating, investing, financing activities"], "Cash flow analysis", 12],
      [12, 2, "Analysis and Interpretation", ["Ratios", "Financial analysis", "Audit reports"], "Financial analysis", 12],
      [12, 3, "Budgeting", ["Cash budget", "Projected income statement"], "Budget preparation", 10],
      [12, 4, "Inventory and VAT", ["Inventory systems", "VAT calculations", "Ethics"], "Advanced topics", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of accTopics) {
      if (capsSubjectIds["ACC"]?.[grade]) {
        syllabusData.push({ subjectCode: "ACC", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── BUSINESS STUDIES (Gr 10-12) ──
    const busTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "Business Environment", ["Micro, market, macro environments", "Business sectors"], "Business context", 10],
      [10, 2, "Business Operations", ["Production", "Quality control", "Safety"], "Operations management", 10],
      [10, 3, "Business Roles", ["Leadership", "Management", "Teamwork"], "Management skills", 10],
      [10, 4, "Business Ventures", ["Entrepreneurship", "Business plans", "Forms of ownership"], "Starting a business", 10],
      [11, 1, "Business Strategies", ["Strategic management", "Corporate social responsibility"], "Strategic planning", 12],
      [11, 2, "Business Environment (Advanced)", ["Legislation", "Labour relations", "Globalisation"], "Advanced business context", 12],
      [11, 3, "Business Roles (Advanced)", ["Ethics", "Professionalism", "Social responsibility"], "Business ethics", 10],
      [11, 4, "Business Operations (Advanced)", ["Human resources", "Quality management"], "Advanced operations", 10],
      [12, 1, "Management and Leadership", ["Leadership theories", "Change management"], "Leadership", 12],
      [12, 2, "Investment and Insurance", ["Investment options", "Insurance concepts"], "Financial planning", 10],
      [12, 3, "Team Performance", ["Conflict management", "Assessment", "Professionalism"], "Team dynamics", 10],
      [12, 4, "Exam Preparation", ["Case studies", "Past papers", "Revision"], "Final exam prep", 12],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of busTopics) {
      if (capsSubjectIds["BUS"]?.[grade]) {
        syllabusData.push({ subjectCode: "BUS", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── ECONOMICS (Gr 10-12) ──
    const econTopics: Array<[number, number, string, string[], string, number]> = [
      [10, 1, "Basic Economic Concepts", ["Scarcity", "Opportunity cost", "Economic systems"], "Foundations of economics", 10],
      [10, 2, "Circular Flow", ["Factor market", "Product market", "Government"], "Economic flows", 10],
      [10, 3, "Public Sector", ["Government intervention", "Taxation", "Public goods"], "Government economics", 10],
      [10, 4, "International Trade", ["Exchange rates", "Balance of payments", "Trade policies"], "Global economics", 10],
      [11, 1, "Microeconomics", ["Demand and supply", "Elasticity", "Market structures"], "Market analysis", 14],
      [11, 2, "Macroeconomics", ["National income", "Fiscal policy", "Monetary policy"], "Macro analysis", 14],
      [11, 3, "Economic Development", ["Growth vs development", "Development indicators"], "Development economics", 10],
      [11, 4, "International Economics", ["Globalisation", "Trade agreements", "Protectionism"], "International trade", 10],
      [12, 1, "Microeconomics (Advanced)", ["Perfect competition", "Monopoly", "Oligopoly"], "Advanced market theory", 14],
      [12, 2, "Macroeconomics (Advanced)", ["Business cycles", "Inflation", "Unemployment"], "Advanced macro", 14],
      [12, 3, "Economic Development (Advanced)", ["SA economy", "Industrial policy", "Rural development"], "SA economic issues", 12],
      [12, 4, "Exam Preparation", ["Data response", "Essay writing", "Case studies"], "Final exam prep", 12],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of econTopics) {
      if (capsSubjectIds["ECON"]?.[grade]) {
        syllabusData.push({ subjectCode: "ECON", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── LIFE ORIENTATION (Gr 1-12) ──
    const loTopics: Array<[number, number, string, string[], string, number]> = [
      [1, 1, "Beginning Knowledge", ["Body parts", "Feelings", "Family"], "Self-awareness", 4],
      [1, 2, "Health and Safety", ["Hygiene", "Safety rules", "Healthy habits"], "Personal health", 4],
      [1, 3, "Social Responsibility", ["Sharing", "Kindness", "Rules"], "Social skills", 4],
      [1, 4, "Personal Development", ["Strengths", "Goals", "Self-esteem"], "Self-development", 4],
      [4, 1, "Development of Self", ["Self-image", "Emotions", "Relationships"], "Personal growth", 6],
      [4, 2, "Health and Environmental Responsibility", ["Substance abuse", "Environmental issues"], "Health education", 6],
      [4, 3, "Social Responsibility", ["Democracy", "Human rights", "Social issues"], "Citizenship", 6],
      [4, 4, "Careers and Career Choices", ["Different careers", "Work", "Skills"], "Career awareness", 6],
      [7, 1, "Development of Self in Society", ["Self-concept", "Power relations", "Citizenship"], "Personal development", 8],
      [7, 2, "Health, Social and Environmental Responsibility", ["STIs", "HIV/AIDS", "Environmental health"], "Health education", 8],
      [7, 3, "Constitution and Citizenship", ["Human rights", "Gender equity", "Democracy"], "Civic education", 8],
      [7, 4, "Careers and Career Choices", ["Subject choices", "Career paths", "Study skills"], "Career planning", 8],
      [10, 1, "Development of Self", ["Self-knowledge", "Goal setting", "Life skills"], "Personal development", 8],
      [10, 2, "Social and Environmental Responsibility", ["Democracy", "Human rights", "Environmental issues"], "Citizenship", 8],
      [10, 3, "Careers and Career Choices", ["Subject requirements", "Career research", "Study plan"], "Career planning", 8],
      [10, 4, "Study Skills and Exam Techniques", ["Study methods", "Time management", "Exam prep"], "Academic skills", 8],
      [12, 1, "Self-Knowledge and Career Planning", ["Career research", "Application", "Interview skills"], "Career readiness", 10],
      [12, 2, "Social Responsibility", ["Community service", "Current affairs", "Global issues"], "Active citizenship", 8],
      [12, 3, "Study Skills and Exam Preparation", ["Revision strategies", "Stress management", "Exam techniques"], "Exam readiness", 10],
      [12, 4, "Life After School", ["Tertiary education", "Employment", "Entrepreneurship"], "Future planning", 8],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of loTopics) {
      if (capsSubjectIds["LO"]?.[grade]) {
        syllabusData.push({ subjectCode: "LO", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── NATURAL SCIENCES (Gr 4-9) ──
    const nsTopics: Array<[number, number, string, string[], string, number]> = [
      [4, 1, "Living and Non-Living", ["Characteristics of life", "Classification"], "Life science basics", 6],
      [4, 2, "Materials", ["Properties of materials", "Solids, liquids, gases"], "Materials science", 6],
      [4, 3, "Energy and Change", ["Energy types", "Heat transfer"], "Energy concepts", 6],
      [4, 4, "Planet Earth", ["Solar system", "Seasons", "Weather"], "Earth science", 6],
      [7, 1, "Biodiversity", ["Classification", "Evolution", "Adaptation"], "Life science", 10],
      [7, 2, "Properties of Materials", ["Atomic structure", "Bonding", "Reactions"], "Chemistry basics", 10],
      [7, 3, "Energy", ["Kinetic and potential energy", "Conservation", "Transfer"], "Physics", 10],
      [7, 4, "Earth and Beyond", ["Solar system", "Gravity", "Tides"], "Earth science", 8],
      [9, 1, "Chemistry", ["Atomic structure", "Chemical reactions", "Stoichiometry"], "Chemistry", 12],
      [9, 2, "Physics", ["Motion", "Forces", "Energy"], "Mechanics", 12],
      [9, 3, "Life Processes", ["Photosynthesis", "Respiration", "Homeostasis"], "Biology", 10],
      [9, 4, "Earth and Space", ["Plate tectonics", "Climate change", "Astronomy"], "Earth science", 10],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of nsTopics) {
      if (capsSubjectIds["NS"]?.[grade]) {
        syllabusData.push({ subjectCode: "NS", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // ── SOCIAL SCIENCES (Gr 4-9) ──
    const ssTopics: Array<[number, number, string, string[], string, number]> = [
      [4, 1, "Local History", ["Family history", "Community history"], "History basics", 6],
      [4, 2, "Geography Skills", ["Maps", "Directions", "Landmarks"], "Map skills", 6],
      [4, 3, "Local Geography", ["Weather", "Climate", "Water"], "Local environment", 6],
      [4, 4, "Citizenship", ["Rights and responsibilities", "Community"], "Civics", 6],
      [7, 1, "Colonialism in the Americas", ["Columbus", "Colonialism", "Slavery"], "World history", 10],
      [7, 2, "The Mineral Revolution in SA", ["Diamonds", "Gold", "Migrant labour"], "SA history", 10],
      [7, 3, "Population Growth", ["Population concepts", "Migration", "Settlement"], "Population geography", 10],
      [7, 4, "Natural Resources", ["Water", "Energy", "Conservation"], "Resource management", 8],
      [9, 1, "World War I", ["Causes", "Course", "Impact"], "World history", 10],
      [9, 2, "The Rise of Nazi Germany", ["Hitler", "Holocaust", "WWII"], "European history", 10],
      [9, 3, "Apartheid in SA", ["Segregation", "Resistance", "Democracy"], "SA history", 12],
      [9, 4, "Globalisation", ["Trade", "Technology", "Culture"], "Global issues", 8],
    ];
    for (const [grade, term, topic, subTopics, outline, hours] of ssTopics) {
      if (capsSubjectIds["SS"]?.[grade]) {
        syllabusData.push({ subjectCode: "SS", grade, term, topic, subTopics, outline, hours, lang: "en" });
      }
    }

    // Insert all syllabus topics
    for (const s of syllabusData) {
      const subjectId = capsSubjectIds[s.subjectCode]?.[s.grade];
      if (subjectId) {
        await ctx.db.insert("syllabusTopics", {
          capsSubject: subjectId,
          grade: s.grade,
          term: s.term,
          topic: s.topic,
          subTopics: s.subTopics,
          contentOutline: s.outline,
          hoursPerTerm: s.hours,
          language: s.lang,
        });
      }
    }

    // ── 4. SAMPLE PAST PAPERS (metadata only — admin uploads actual files) ──
    const pastPaperTemplates = [
      { grade: 12, subjectCode: "MATH", year: 2024, term: 0, type: "exam", title: "Grade 12 Mathematics Paper 1 — November 2024" },
      { grade: 12, subjectCode: "MATH", year: 2024, term: 0, type: "exam", title: "Grade 12 Mathematics Paper 2 — November 2024" },
      { grade: 12, subjectCode: "MATH", year: 2023, term: 0, type: "exam", title: "Grade 12 Mathematics Paper 1 — November 2023" },
      { grade: 12, subjectCode: "MATH", year: 2023, term: 0, type: "exam", title: "Grade 12 Mathematics Paper 2 — November 2023" },
      { grade: 12, subjectCode: "PHY-SCI", year: 2024, term: 0, type: "exam", title: "Grade 12 Physical Sciences Paper 1 — November 2024" },
      { grade: 12, subjectCode: "PHY-SCI", year: 2024, term: 0, type: "exam", title: "Grade 12 Physical Sciences Paper 2 — November 2024" },
      { grade: 12, subjectCode: "LIFE-SCI", year: 2024, term: 0, type: "exam", title: "Grade 12 Life Sciences Paper 1 — November 2024" },
      { grade: 12, subjectCode: "LIFE-SCI", year: 2024, term: 0, type: "exam", title: "Grade 12 Life Sciences Paper 2 — November 2024" },
      { grade: 12, subjectCode: "HIST", year: 2024, term: 0, type: "exam", title: "Grade 12 History Paper 1 — November 2024" },
      { grade: 12, subjectCode: "HIST", year: 2024, term: 0, type: "exam", title: "Grade 12 History Paper 2 — November 2024" },
      { grade: 12, subjectCode: "GEO", year: 2024, term: 0, type: "exam", title: "Grade 12 Geography Paper 1 — November 2024" },
      { grade: 12, subjectCode: "GEO", year: 2024, term: 0, type: "exam", title: "Grade 12 Geography Paper 2 — November 2024" },
      { grade: 12, subjectCode: "ACC", year: 2024, term: 0, type: "exam", title: "Grade 12 Accounting Paper 1 — November 2024" },
      { grade: 12, subjectCode: "ACC", year: 2024, term: 0, type: "exam", title: "Grade 12 Accounting Paper 2 — November 2024" },
      { grade: 12, subjectCode: "BUS", year: 2024, term: 0, type: "exam", title: "Grade 12 Business Studies Paper 1 — November 2024" },
      { grade: 12, subjectCode: "BUS", year: 2024, term: 0, type: "exam", title: "Grade 12 Business Studies Paper 2 — November 2024" },
      { grade: 12, subjectCode: "ECON", year: 2024, term: 0, type: "exam", title: "Grade 12 Economics Paper 1 — November 2024" },
      { grade: 12, subjectCode: "ECON", year: 2024, term: 0, type: "exam", title: "Grade 12 Economics Paper 2 — November 2024" },
      { grade: 12, subjectCode: "HL", year: 2024, term: 0, type: "exam", title: "Grade 12 English HL Paper 1 — November 2024" },
      { grade: 12, subjectCode: "HL", year: 2024, term: 0, type: "exam", title: "Grade 12 English HL Paper 2 — November 2024" },
      { grade: 12, subjectCode: "HL", year: 2024, term: 0, type: "exam", title: "Grade 12 English HL Paper 3 — November 2024" },
      // Grade 11
      { grade: 11, subjectCode: "MATH", year: 2024, term: 3, type: "exam", title: "Grade 11 Mathematics Paper 1 — June 2024" },
      { grade: 11, subjectCode: "MATH", year: 2024, term: 3, type: "exam", title: "Grade 11 Mathematics Paper 2 — June 2024" },
      { grade: 11, subjectCode: "PHY-SCI", year: 2024, term: 3, type: "exam", title: "Grade 11 Physical Sciences Paper 1 — June 2024" },
      { grade: 11, subjectCode: "LIFE-SCI", year: 2024, term: 3, type: "exam", title: "Grade 11 Life Sciences Paper 1 — June 2024" },
      // Grade 10
      { grade: 10, subjectCode: "MATH", year: 2024, term: 3, type: "exam", title: "Grade 10 Mathematics Paper 1 — June 2024" },
      { grade: 10, subjectCode: "MATH", year: 2024, term: 3, type: "exam", title: "Grade 10 Mathematics Paper 2 — June 2024" },
      { grade: 10, subjectCode: "PHY-SCI", year: 2024, term: 3, type: "exam", title: "Grade 10 Physical Sciences Paper 1 — June 2024" },
      { grade: 10, subjectCode: "LIFE-SCI", year: 2024, term: 3, type: "exam", title: "Grade 10 Life Sciences Paper 1 — June 2024" },
      // Foundation Phase
      { grade: 3, subjectCode: "MATH", year: 2024, term: 4, type: "test", title: "Grade 3 Mathematics Term 4 Test — 2024" },
      { grade: 3, subjectCode: "HL", year: 2024, term: 4, type: "test", title: "Grade 3 English HL Term 4 Test — 2024" },
      { grade: 3, subjectCode: "LIFE-SKILLS", year: 2024, term: 4, type: "test", title: "Grade 3 Life Skills Term 4 Test — 2024" },
      // Intermediate Phase
      { grade: 6, subjectCode: "MATH", year: 2024, term: 4, type: "exam", title: "Grade 6 Mathematics Final Exam — 2024" },
      { grade: 6, subjectCode: "HL", year: 2024, term: 4, type: "exam", title: "Grade 6 English HL Final Exam — 2024" },
      { grade: 6, subjectCode: "NS", year: 2024, term: 4, type: "exam", title: "Grade 6 Natural Sciences Final Exam — 2024" },
      { grade: 6, subjectCode: "SS", year: 2024, term: 4, type: "exam", title: "Grade 6 Social Sciences Final Exam — 2024" },
      // Senior Phase
      { grade: 9, subjectCode: "MATH", year: 2024, term: 4, type: "exam", title: "Grade 9 Mathematics Final Exam — 2024" },
      { grade: 9, subjectCode: "NS", year: 2024, term: 4, type: "exam", title: "Grade 9 Natural Sciences Final Exam — 2024" },
      { grade: 9, subjectCode: "SS", year: 2024, term: 4, type: "exam", title: "Grade 9 Social Sciences Final Exam — 2024" },
    ];

    // Fix: some entries use `code` instead of `subjectCode`
    for (const pp of pastPaperTemplates) {
      const subjectCode = (pp as any).subjectCode || (pp as any).code;
      const subjectId = capsSubjectIds[subjectCode]?.[pp.grade];
      if (subjectId) {
        await ctx.db.insert("pastPapers", {
          title: pp.title,
          grade: pp.grade,
          subject: subjectId,
          language: "en",
          year: pp.year,
          term: pp.term,
          paperType: pp.type,
          fileUrl: `https://example.com/past-papers/${pp.grade}/${subjectCode}/${pp.year}/${pp.type}.pdf`,
          fileType: "pdf",
          fileSize: 0,
          uploadedBy: adminId,
          isPublished: true,
          tags: [subjectCode.toLowerCase(), `grade-${pp.grade}`, pp.type, String(pp.year)],
        });
      }
    }

    // ── 5. SAMPLE STUDY RESOURCES ──
    const studyResources = [
      { title: "Grade 12 Maths Formula Sheet", description: "Complete formula reference for Grade 12 Mathematics", grade: 12, subjectCode: "MATH", type: "notes", tags: ["formulas", "reference"] },
      { title: "Grade 12 Physics Equations", description: "All Physical Sciences equations and constants", grade: 12, subjectCode: "PHY-SCI", type: "notes", tags: ["equations", "reference"] },
      { title: "Grade 12 Life Sciences Diagrams", description: "Labeled diagrams for all Life Sciences topics", grade: 12, subjectCode: "LIFE-SCI", type: "notes", tags: ["diagrams", "visual"] },
      { title: "Grade 12 History Timeline", description: "Comprehensive timeline of SA and world history", grade: 12, subjectCode: "HIST", type: "notes", tags: ["timeline", "reference"] },
      { title: "Grade 12 Geography Mapwork Guide", description: "Mapwork techniques and practice exercises", grade: 12, subjectCode: "GEO", type: "worksheet", tags: ["mapwork", "practice"] },
      { title: "Grade 12 Accounting Equations", description: "Accounting equation practice and solutions", grade: 12, subjectCode: "ACC", type: "worksheet", tags: ["practice", "solutions"] },
      { title: "Grade 12 Business Studies Case Studies", description: "Practice case studies with model answers", grade: 12, subjectCode: "BUS", type: "worksheet", tags: ["case-study", "practice"] },
      { title: "Grade 12 Economics Graphs", description: "Key economic graphs and interpretations", grade: 12, subjectCode: "ECON", type: "notes", tags: ["graphs", "reference"] },
      { title: "Grade 12 English Essay Writing Guide", description: "How to write essays for Paper 1 and Paper 3", grade: 12, subjectCode: "HL", type: "notes", tags: ["essay", "writing"] },
      { title: "Grade 10 Maths Workbook", description: "Practice exercises for all Grade 10 Maths topics", grade: 10, subjectCode: "MATH", type: "worksheet", tags: ["practice", "exercises"] },
      { title: "Grade 9 Natural Sciences Summary", description: "Term-by-term summary notes", grade: 9, subjectCode: "NS", type: "notes", tags: ["summary", "revision"] },
      { title: "Grade 6 Mathematics Workbook", description: "CAPS-aligned practice for all terms", grade: 6, subjectCode: "MATH", type: "worksheet", tags: ["practice", "caps"] },
      { title: "Grade 3 Phonics Guide", description: "Letter sounds and phonics activities", grade: 3, subjectCode: "HL", type: "notes", tags: ["phonics", "foundation"] },
      { title: "Grade 1 Life Skills Activities", description: "Printable Life Skills worksheets", grade: 1, subjectCode: "LIFE-SKILLS", type: "worksheet", tags: ["activities", "foundation"] },
    ];

    for (const r of studyResources) {
      const subjectId = capsSubjectIds[r.subjectCode]?.[r.grade];
      if (subjectId) {
        await ctx.db.insert("studyResources", {
          title: r.title,
          description: r.description,
          grade: r.grade,
          subject: subjectId,
          language: "en",
          resourceType: r.type,
          fileUrl: `https://example.com/resources/${r.grade}/${r.subjectCode}/${r.title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
          fileType: "pdf",
          fileSize: 0,
          uploadedBy: adminId,
          isPublished: true,
          tags: r.tags,
        });
      }
    }

    // Count what was created
    const langCount = Object.keys(langIds).length;
    const subjectCount = Object.values(capsSubjectIds).reduce((sum, grades) => sum + Object.keys(grades).length, 0);
    const topicCount = syllabusData.length;
    const paperCount = pastPaperTemplates.length;
    const resourceCount = studyResources.length;

    return `CAPS Seed Complete! Created: ${langCount} languages, ${subjectCount} grade-subject combinations, ${topicCount} syllabus topics, ${paperCount} past paper records, ${resourceCount} study resources.`;
  },
});
