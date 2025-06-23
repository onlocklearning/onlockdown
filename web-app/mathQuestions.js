export const mathQuestions = [
  // Tier 1 (Very Easy)
  {
    question: "1 + 1",
    answer: "2",
    wrongAnswers: ["1", "3", "0"],
    timeLimit: 5000,
    difficulty: "tier1"
  },
  {
    question: "3 + 2",
    answer: "5",
    wrongAnswers: ["4", "6", "7"],
    timeLimit: 8000,
    difficulty: "tier1"
  },

  {
    question: "5 - 3",
    answer: "2",
    wrongAnswers: ["1", "3", "0"],
    timeLimit: 5000,
    difficulty: "tier1"
  },
  {
    question: "2 × 3",
    answer: "6",
    wrongAnswers: ["5", "4", "8"],
    timeLimit: 6000,
    difficulty: "tier1"
  },

  // Tier 2 (Easy)
  {
    question: "\\sqrt{49}",
    answer: "7",
    wrongAnswers: ["6", "8", "\\sqrt{7}"],
    timeLimit: 7000,
    difficulty: "tier2"
  },
  {
    question: "\\log_{10}(1000)",
    answer: "3",
    wrongAnswers: ["2", "10", "100"],
    timeLimit: 8000,
    difficulty: "tier2"
  },
  {
    question: "\\cos(90^\\circ)",
    answer: "0",
    wrongAnswers: ["1", "-1", "\\frac{1}{2}"],
    timeLimit: 8000,
    difficulty: "tier2"
  },
  {
    question: "10 ÷ 2",
    answer: "5",
    wrongAnswers: ["2", "4", "6"],
    timeLimit: 7000,
    difficulty: "tier2"
  },
  {
    question: "7 + 6",
    answer: "13",
    wrongAnswers: ["12", "14", "15"],
    timeLimit: 8000,
    difficulty: "tier2"
  },

  // Tier 3 (Moderate)
  {
    question: "\\frac{d}{dx} (x^3)",
    answer: "3x^2",
    wrongAnswers: ["x^3", "3x", "x^2"],
    timeLimit: 9000,
    difficulty: "tier3"
  },
  {
    question: "12 × 12",
    answer: "144",
    wrongAnswers: ["132", "124", "154"],
    timeLimit: 10000,
    difficulty: "tier3"
  },
  {
    question: "\\tan(45^\\circ)",
    answer: "1",
    wrongAnswers: ["0", "\\sqrt{3}", "2"],
    timeLimit: 8000,
    difficulty: "tier3"
  },
  {
    question: "Area of a circle with r = 1",
    answer: "\\pi",
    wrongAnswers: ["2\\pi", "1", "\\pi^2"],
    timeLimit: 10000,
    difficulty: "tier3"
  },
  {
    question: "5^2",
    answer: "25",
    wrongAnswers: ["10", "15", "20"],
    timeLimit: 7000,
    difficulty: "tier3"
  },

  // Tier 4 (Tricky)
  {
    question: "e^{\\pi i} + 1",
    answer: "0",
    wrongAnswers: ["1", "2", "i"],
    timeLimit: 10000,
    difficulty: "tier4"
  },
  {
    question: "\\int_0^1 x^2 \\, dx",
    answer: "\\frac{1}{3}",
    wrongAnswers: ["\\frac{1}{2}", "1", "0"],
    timeLimit: 12000,
    difficulty: "tier4"
  },
  {
    question: "\\frac{d}{dx} (\\sin x)",
    answer: "\\cos x",
    wrongAnswers: ["-\\sin x", "-\\cos x", "x\\cos x"],
    timeLimit: 9000,
    difficulty: "tier4"
  },
  {
    question: "\\lim_{x \\to 0} \\frac{\\sin x}{x}",
    answer: "1",
    wrongAnswers: ["0", "x", "\\infty"],
    timeLimit: 11000,
    difficulty: "tier4"
  },
  {
    question: "\\ln(e^2)",
    answer: "2",
    wrongAnswers: ["1", "e", "2e"],
    timeLimit: 9000,
    difficulty: "tier4"
  },

  // Tier 5 (Hard)
  {
    question: "√225",
    answer: "15",
    wrongAnswers: ["14", "12", "10"],
    timeLimit: 12000,
    difficulty: "tier5"
  },
  {
    question: "Derivative of \\ln x",
    answer: "\\frac{1}{x}",
    wrongAnswers: ["x", "x\\ln x", "\\ln x"],
    timeLimit: 11000,
    difficulty: "tier5"
  },
  {
    question: "\\frac{d}{dx}(x^2 \\cdot \\sin x)",
    answer: "2x\\sin x + x^2\\cos x",
    wrongAnswers: ["2x\\cos x", "x^2\\sin x", "\\cos x"],
    timeLimit: 14000,
    difficulty: "tier5"
  },
  {
    question: "\\int x \\, dx",
    answer: "\\frac{x^2}{2} + C",
    wrongAnswers: ["x + C", "2x + C", "\\ln x + C"],
    timeLimit: 10000,
    difficulty: "tier5"
  },
  {
    question: "Limit of \\frac{1}{x} as x → ∞",
    answer: "0",
    wrongAnswers: ["∞", "1", "Undefined"],
    timeLimit: 8000,
    difficulty: "tier5"
  },

  // Tier 6 (Advanced)
  {
    question: "\\int_1^2 2x \\, dx",
    answer: "3",
    wrongAnswers: ["2", "4", "1"],
    timeLimit: 20000,
    difficulty: "tier6"
  },
  {
    question: "\\lim_{x \\to \\infty} \\frac{1}{x^2}",
    answer: "0",
    wrongAnswers: ["\\infty", "1", "Undefined"],
    timeLimit: 10000,
    difficulty: "tier6"
  },
  {
    question: "\\int_0^\\pi \\sin x \\, dx",
    answer: "2",
    wrongAnswers: ["0", "\\pi", "1"],
    timeLimit: 15000,
    difficulty: "tier6"
  },
  {
    question: "\\frac{d}{dx}(e^x \\cos x)",
    answer: "e^x \\cos x - e^x \\sin x",
    wrongAnswers: ["e^x \\sin x", "e^x \\cos x", "e^x + \\cos x"],
    timeLimit: 15000,
    difficulty: "tier6"
  },
  {
    question: "d/dx (\\tan x)",
    answer: "\\sec^2 x",
    wrongAnswers: ["\\cot x", "\\sec x", "1 + \\tan x"],
    timeLimit: 12000,
    difficulty: "tier6"
  },

  // Tier 7 (Very Advanced)
  {
    question: "\\int x e^x \\, dx",
    answer: "x e^x - e^x + C",
    wrongAnswers: ["e^x + C", "x e^x + C", "x^2 e^x + C"],
    timeLimit: 20000,
    difficulty: "tier7"
  },
  {
    question: "d/dx (\\ln(\\sin x))",
    answer: "\\cot x",
    wrongAnswers: ["\\sec x", "\\csc x", "\\tan x"],
    timeLimit: 18000,
    difficulty: "tier7"
  },
  {
    question: "\\int \\sec x \\, dx",
    answer: "\\ln |\\sec x + \\tan x| + C",
    wrongAnswers: ["\\tan x + C", "\\sec x + C", "\\ln x + C"],
    timeLimit: 20000,
    difficulty: "tier7"
  },
  {
    question: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2}",
    answer: "\\frac{\\pi^2}{6}",
    wrongAnswers: ["\\pi", "1", "\\infty"],
    timeLimit: 20000,
    difficulty: "tier7"
  },
  {
    question: "\\lim_{x\\to0} \\frac{e^x - 1}{x}",
    answer: "1",
    wrongAnswers: ["0", "e", "\\infty"],
    timeLimit: 12000,
    difficulty: "tier7"
  },

  // Tier 8 (Expert)
  {
    question: "\\int_0^\\infty e^{-x} \\, dx",
    answer: "1",
    wrongAnswers: ["0", "\\infty", "e"],
    timeLimit: 25000,
    difficulty: "tier8"
  },
  {
    question: "Fourier Transform of \\delta(t)",
    answer: "1",
    wrongAnswers: ["0", "\\delta(f)", "∞"],
    timeLimit: 25000,
    difficulty: "tier8"
  },
  {
    question: "d/dx (\\arctan x)",
    answer: "\\frac{1}{1 + x^2}",
    wrongAnswers: ["\\frac{1}{x}", "x^2", "\\arctan x"],
    timeLimit: 18000,
    difficulty: "tier8"
  },
  {
    question: "\\int_0^1 \\ln x \\, dx",
    answer: "-1",
    wrongAnswers: ["0", "1", "\\infty"],
    timeLimit: 25000,
    difficulty: "tier8"
  },
  {
    question: "Taylor series of e^x at x = 0 (first term)",
    answer: "1",
    wrongAnswers: ["x", "e", "0"],
    timeLimit: 20000,
    difficulty: "tier8"
  }
];
