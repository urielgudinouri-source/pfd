export function calculateScores(quiz, answers) {
  const scores = {};

  quiz.results.forEach(result => {
    scores[result.type] = 0;
  });

  answers.forEach(answer => {
    const question = quiz.questions.find(q => q.id === answer.questionId);
    if (!question) return;

    const selectedOption = question.options.find(opt => opt.id === answer.selectedOption);
    if (!selectedOption || !selectedOption.points) return;

    Object.keys(selectedOption.points).forEach(type => {
      if (scores[type] !== undefined) {
        scores[type] += selectedOption.points[type];
      }
    });
  });

  return scores;
}

export function determineResult(quiz, scores) {
  if (!quiz.strategy || quiz.strategy === 'highest_score') {
    let maxScore = -1;
    let resultType = null;

    Object.keys(scores).forEach(type => {
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        resultType = type;
      }
    });

    return quiz.results.find(r => r.type === resultType);
  }

  if (quiz.strategy === 'score_range') {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    return quiz.results.find(r =>
      totalScore >= (r.minScore || 0) && totalScore <= (r.maxScore || Infinity)
    );
  }

  if (quiz.strategy === 'percentage') {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (total === 0) return quiz.results[0];

    let maxPercentage = -1;
    let resultType = null;

    Object.keys(scores).forEach(type => {
      const percentage = (scores[type] / total) * 100;
      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        resultType = type;
      }
    });

    return quiz.results.find(r => r.type === resultType);
  }

  return quiz.results[0];
}

export function calculate(quiz, answers) {
  const scores = calculateScores(quiz, answers);
  const result = determineResult(quiz, scores);

  return {
    scores,
    result: {
      type: result.type,
      title: result.title,
      description: result.description,
      imageUrl: result.imageUrl,
      traits: result.traits || []
    }
  };
}
