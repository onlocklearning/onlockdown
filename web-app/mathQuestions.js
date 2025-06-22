export const mathQuestions = [
  {
    question: "\\cos(90^\\circ)",
    answer: "0",
    wrongAnswers: ["1", "-1", "\\frac{1}{2}"],
    timeLimit: 8000 // 8 seconds
  },
  {
    question: "\\int_0^1 x^2 \\, dx",
    answer: "\\frac{1}{3}",
    wrongAnswers: ["\\frac{1}{2}", "1", "0"],
    timeLimit: 12000 // 12 seconds
  },
  {
    question: "\\sqrt{49}",
    answer: "7",
    wrongAnswers: ["6", "8", "\\sqrt{7}"],
    timeLimit: 7000 // 7 seconds
  },
  {
    question: "e^{\\pi i} + 1",
    answer: "0",
    wrongAnswers: ["1", "2", "i"],
    timeLimit: 10000 // 10 seconds
  },

  // New questions added below
  {
    question: "\\frac{d}{dx} (x^3)",
    answer: "3x^2",
    wrongAnswers: ["x^3", "3x", "x^2"],
    timeLimit: 9000
  },
  {
    question: "\\sin(0)",
    answer: "0",
    wrongAnswers: ["1", "-1", "\\frac{1}{2}"],
    timeLimit: 6000
  },
  {
    question: "\\log_{10}(1000)",
    answer: "3",
    wrongAnswers: ["2", "10", "100"],
    timeLimit: 8000
  },
  {
    question: "1 + 1",
    answer: "2",
    wrongAnswers: ["1", "3", "0"],
    timeLimit: 5000
  },
  {
    question: "\\int_1^2 2x \\, dx",
    answer: "3",
    wrongAnswers: ["2", "4", "1"],
    timeLimit: 11000
  }
];
