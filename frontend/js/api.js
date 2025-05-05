// api.js - API service for handling requests

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust this to your API URL

// Service for quiz-related API calls
const quizService = {
    // Get a single quiz by ID
    getQuizById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch quiz');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching quiz:', error);
            throw error;
        }
    },
    getAllQuizzes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/quizzes`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch quizzes');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            throw error;
        }
    },
    getAllFeedbacks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedback`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch feedbacks');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            throw error;
        }
    },
    
    // Create new feedback
    createFeedback: async (feedbackData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    }
};
async function getFeedbackById(id) {
    try {
      const response = await fetch(`/api/feedbacks/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }
  async function submitQuizAnswers(quizId, answers) {
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit quiz answers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  } 
    // Existing methods...
    // Attack-related functions
  const api = {
    // Attack-related functions
    getAllAttacks: function() {
        // If a backend API exists, use this:
        // return fetch('/api/attacks')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation using local data:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(attacksData || []); // attacksData should be defined in attacks.js
            }, 300);
        });
    },
    
    getAttackById: function(id) {
        // If a backend API exists, use this:
        // return fetch(`/api/attacks/${id}`)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation using local data:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const attack = attacksData.find(a => a.id === parseInt(id));
                if (attack) {
                    resolve(attack);
                } else {
                    reject(new Error('Attack not found'));
                }
            }, 300);
        });
    },
    
    // Quiz-related functions
    getAllQuizzes: function() {
        // If a backend API exists, use this:
        // return fetch('/api/quizzes')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation using local data:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(quizData || []); // quizData should be defined in quiz-data.js
            }, 300);
        });
    },
    
    getQuizById: function(id) {
        // If a backend API exists, use this:
        // return fetch(`/api/quizzes/${id}`)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation using local data:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const quiz = getQuizById(parseInt(id)); // Function from quiz-data.js
                if (quiz) {
                    resolve(quiz);
                } else {
                    reject(new Error('Quiz not found'));
                }
            }, 300);
        });
    },
    
    getQuizByAttackId: function(attackId) {
        // If a backend API exists, use this:
        // return fetch(`/api/quizzes/attack/${attackId}`)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation using local data:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const quiz = getQuizByAttackId(parseInt(attackId)); // Function from quiz-data.js
                if (quiz) {
                    resolve(quiz);
                } else {
                    reject(new Error('Quiz not found for this attack'));
                }
            }, 300);
        });
    },
    
    submitQuizAnswers: function(quizId, answers) {
        // If a backend API exists, use this:
        // return fetch(`/api/quizzes/${quizId}/submit`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ answers }),
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     });
        
        // Mock implementation to grade quiz locally:
        return new Promise((resolve) => {
            setTimeout(() => {
                const quiz = getQuizById(parseInt(quizId));
                
                if (!quiz) {
                    throw new Error('Quiz not found');
                }
                
                let correctCount = 0;
                const questionsWithResults = quiz.questions.map(question => {
                    const userAnswer = answers.find(a => a.questionId === question.id);
                    const isCorrect = userAnswer && userAnswer.selectedOption === question.correctAnswer;
                    
                    if (isCorrect) {
                        correctCount++;
                    }
                    
                    return {
                        ...question,
                        userAnswer: userAnswer ? userAnswer.selectedOption : null,
                        isCorrect
                    };
                });
                
                const score = Math.round((correctCount / quiz.questions.length) * 100);
                
                let feedback = '';
                if (score >= 80) {
                    feedback = 'Excellent! You have a strong understanding of this topic.';
                } else if (score >= 60) {
                    feedback = 'Good job! You understand the basics, but there\'s room for improvement.';
                } else {
                    feedback = 'You should review this topic more thoroughly to better protect yourself.';
                }
                
                resolve({
                    score,
                    correctAnswers: correctCount,
                    totalQuestions: quiz.questions.length,
                    feedback,
                    questions: questionsWithResults
                });
            }, 800);
        });
    }
};
    // Additional methods can be added here for other endpoints
