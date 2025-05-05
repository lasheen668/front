document.addEventListener('DOMContentLoaded', () => {
    const loadingContainer = document.getElementById('loading-container');
    const quizDetailsContainer = document.getElementById('quiz-details');
    const quizTitle = document.getElementById('quiz-title');
    const quizType = document.getElementById('quiz-type');
    const questionsContainer = document.getElementById('questions-container');
    const editButton = document.getElementById('edit-button');
    const deleteButton = document.getElementById('delete-button');
    const backButton = document.getElementById('back-button');
    const messageElement = document.getElementById('message');
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    // Redirect if no ID is provided
    if (!quizId) {
        window.location.href = 'quizzes.html';
        return;
    }
    
    // Add event listeners
    editButton.addEventListener('click', () => window.location.href = `edit-quiz.html?id=${quizId}`);
    deleteButton.addEventListener('click', deleteQuiz);
    backButton.addEventListener('click', () => window.location.href = 'quizzes.html');
    
    // Fetch quiz data
    fetchQuiz();
    
    async function fetchQuiz() {
        try {
            const response = await fetch(`/api/quizzes/${quizId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch quiz data');
            }
            
            const quiz = await response.json();
            displayQuizDetails(quiz);
            
            // Hide loading, show details
            loadingContainer.classList.add('hidden');
            quizDetailsContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error fetching quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while fetching quiz data';
            messageElement.classList.remove('hidden', 'success', 'info');
            messageElement.classList.add('error');
            loadingContainer.innerHTML = '<p>Failed to load quiz. Please try again later.</p>';
        }
    }
    
    function displayQuizDetails(quiz) {
        // Set title and type
        quizTitle.textContent = quiz.title || 'Untitled Quiz';
        quizType.textContent = quiz.type ? `Type: ${quiz.type}` : '';
        
        // Display questions
        questionsContainer.innerHTML = '';
        
        if (quiz.questions && quiz.questions.length > 0) {
            quiz.questions.forEach((question, index) => {
                const questionElement = createQuestionElement(question, index + 1);
                questionsContainer.appendChild(questionElement);
            });
        } else {
            questionsContainer.innerHTML = '<p>This quiz has no questions.</p>';
        }
    }
    
    function createQuestionElement(question, number) {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${number}: ${question.questionText}`;
        
        const optionsList = document.createElement('ul');
        optionsList.className = 'options-list';
        
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                const optionItem = document.createElement('li');
                optionItem.className = 'option-item';
                
                // Highlight correct answer
                if (option === question.correctAnswer) {
                    optionItem.classList.add('correct');
                }
                
                optionItem.textContent = option;
                optionsList.appendChild(optionItem);
            });
        }
        
        questionItem.appendChild(questionTitle);
        questionItem.appendChild(optionsList);
        
        return questionItem;
    }
    
    async function deleteQuiz() {
        if (!confirm('Are you sure you want to delete this quiz?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/quizzes/${quizId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete quiz');
            }
            
            // Show success message
            messageElement.textContent = 'Quiz deleted successfully!';
            messageElement.classList.remove('hidden', 'error', 'info');
            messageElement.classList.add('success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'quizzes.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error deleting quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while deleting the quiz';
            messageElement.classList.remove('hidden', 'success', 'info');
            messageElement.classList.add('error');
        }
    }
});
async function deleteQuiz() {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Show loading state
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Deleting quiz...';
        messageElement.classList.remove('hidden', 'error', 'success');
        messageElement.classList.add('info');
        
        // Get quiz ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id');
        
        if (!quizId) {
            throw new Error('Quiz ID not found');
        }
        
        // Send delete request
        const response = await fetch(`/api/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Handle errors
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete quiz');
        }
        
        // Show success message
        messageElement.textContent = 'Quiz deleted successfully! Redirecting...';
        messageElement.classList.remove('info', 'error');
        messageElement.classList.add('success');
        
        // Redirect to quiz list after deletion
        setTimeout(() => {
            window.location.href = 'quizzes.html';
        }, 2000);
        
    } catch (error) {
        // Handle and display errors
        console.error('Error deleting quiz:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = error.message || 'An error occurred while deleting the quiz';
        messageElement.classList.remove('hidden', 'info', 'success');
        messageElement.classList.add('error');
    }
}
// quiz-details.js - Logic for displaying a single quiz

document.addEventListener('DOMContentLoaded', function() {
    // Get quiz ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (!quizId) {
        displayError('Quiz ID is missing');
        return;
    }
    
    // Load quiz details
    loadQuizDetails(quizId);
    
    // Set up event listeners for any interactive elements
    setupEventListeners();
});

async function loadQuizDetails(quizId) {
    try {
        // Show loading state
        const contentContainer = document.getElementById('quiz-details-container');
        contentContainer.innerHTML = '<p>Loading quiz details...</p>';
        
        // Fetch quiz data
        const quiz = await quizService.getQuizById(quizId);
        
        // Render quiz details
        renderQuizDetails(quiz);
    } catch (error) {
        displayError(`Failed to load quiz: ${error.message}`);
    }
}

function renderQuizDetails(quiz) {
    const contentContainer = document.getElementById('quiz-details-container');
    
    // Create HTML content for the quiz
    const quizHTML = `
        <div class="quiz-details">
            <h1>${quiz.title}</h1>
            <p class="quiz-description">${quiz.description || 'No description available'}</p>
            
            <div class="quiz-meta">
                <span class="quiz-category">${quiz.category || 'Uncategorized'}</span>
                <span class="quiz-difficulty">${quiz.difficulty || 'Not specified'}</span>
            </div>
            
            <h2>Questions</h2>
            <div class="questions-list">
                ${renderQuestions(quiz.questions || [])}
            </div>
            
            <div class="quiz-actions">
                <button id="edit-quiz-btn" class="btn btn-primary">Edit Quiz</button>
                <button id="delete-quiz-btn" class="btn btn-danger">Delete Quiz</button>
            </div>
        </div>
    `;
    
    contentContainer.innerHTML = quizHTML;
}

function renderQuestions(questions) {
    if (questions.length === 0) {
        return '<p>No questions available</p>';
    }
    
    return questions.map((question, index) => `
        <div class="question-item">
            <h3>Question ${index + 1}: ${question.text}</h3>
            <ul class="options-list">
                ${renderOptions(question.options, question.correct_answer)}
            </ul>
        </div>
    `).join('');
}

function renderOptions(options, correctAnswer) {
    if (!options || options.length === 0) {
        return '<li>No options available</li>';
    }
    
    return options.map((option, index) => `
        <li class="${option === correctAnswer ? 'correct-answer' : ''}">
            ${option}
            ${option === correctAnswer ? ' <span class="correct-badge">✓</span>' : ''}
        </li>
    `).join('');
}

function setupEventListeners() {
    // After quiz details are loaded, set up event listeners
    document.addEventListener('click', function(event) {
        // Edit button
        if (event.target.id === 'edit-quiz-btn') {
            const urlParams = new URLSearchParams(window.location.search);
            const quizId = urlParams.get('id');
            window.location.href = `edit-quiz.html?id=${quizId}`;
        }
        
        // Delete button (already in your existing code, mentioned in your description)
        // You mentioned this is already implemented
    });
}

function displayError(message) {
    const contentContainer = document.getElementById('quiz-details-container');
    contentContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <a href="quizzes.html">Back to Quizzes</a>
        </div>
    `;
}
// Feedback modal functionality
function setupFeedbackModal() {
    // Get modal elements
    const modal = document.getElementById('feedback-modal');
    const openModalBtn = document.getElementById('open-feedback-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const modalForm = document.getElementById('modal-feedback-form');
    
    // Open modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // Close modal
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
            // Reset form and messages
            document.getElementById('modal-feedback-content').value = '';
            document.getElementById('modal-feedback-success').style.display = 'none';
            document.getElementById('modal-feedback-error').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    if (modalForm) {
        modalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous messages
            document.getElementById('modal-feedback-success').style.display = 'none';
            document.getElementById('modal-feedback-error').style.display = 'none';
            
            // Get form data
            const userId = document.getElementById('modal-user-id').value;
            const content = document.getElementById('modal-feedback-content').value;
            
            // Validate
            if (!userId || !content) {
                document.getElementById('modal-feedback-error').textContent = 'Please fill in all fields';
                document.getElementById('modal-feedback-error').style.display = 'block';
                return;
            }
            
            // Prepare data
            const feedbackData = {
                user: userId,
                content: content
            };
            
            try {
                // Submit feedback
                await feedbackService.createFeedback(feedbackData);
                
                // Show success
                document.getElementById('modal-feedback-success').style.display = 'block';
                document.getElementById('modal-feedback-content').value = '';
                
                // Close modal after delay
                setTimeout(function() {
                    modal.style.display = 'none';
                    document.getElementById('modal-feedback-success').style.display = 'none';
                }, 3000);
                
            } catch (error) {
                // Show error
                document.getElementById('modal-feedback-error').textContent = 
                    error.message || 'Failed to submit feedback';
                document.getElementById('modal-feedback-error').style.display = 'block';
            }
        });
    }
}

// Add to your existing event listeners setup
function setupEventListeners() {
    // Existing code...
    
    // Setup feedback modal
    setupFeedbackModal();
}
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    const attackId = urlParams.get('attackId');
    
    if (quizId) {
        fetchQuizById(quizId);
    } else if (attackId) {
        fetchQuizByAttackId(attackId);
    } else {
        displayError('Quiz or Attack ID is missing');
    }
    
    // Set up form submission
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', handleQuizSubmission);
    }
});

function fetchQuizById(quizId) {
    api.getQuizById(quizId)
        .then(quiz => {
            displayQuiz(quiz);
        })
        .catch(error => {
            console.error('Error fetching quiz:', error);
            displayError('Failed to load quiz. Please try again later.');
        });
}

function fetchQuizByAttackId(attackId) {
    api.getQuizByAttackId(attackId)
        .then(quiz => {
            displayQuiz(quiz);
        })
        .catch(error => {
            console.error('Error fetching quiz for attack:', error);
            displayError('Failed to load quiz for this attack. Please try again later.');
        });
}

function displayQuiz(quiz) {
    const quizContainer = document.getElementById('quiz-container');
    
    if (!quiz) {
        quizContainer.innerHTML = '<p>Quiz not found.</p>';
        return;
    }
    
    document.title = `${quiz.title} | CyberDefender`;
    
    let html = `
        <div class="quiz-header">
            <h1>${quiz.title}</h1>
            <p>${quiz.description}</p>
        </div>
        <form id="quiz-form" data-quiz-id="${quiz.id}">
    `;
    
    quiz.questions.forEach((question, index) => {
        html += `
            <div class="question">
                <p><strong>Question ${index + 1}:</strong> ${question.text}</p>
                <div class="options">
        `;
        
        question.options.forEach((option, optIndex) => {
            html += `
                <div class="option">
                    <input type="radio" name="question-${question.id}" id="q${question.id}-option${optIndex}" value="${optIndex}">
                    <label for="q${question.id}-option${optIndex}">${option}</label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
            <div class="quiz-actions">
                <button type="submit" class="btn btn-primary">Submit Answers</button>
            </div>
        </form>
    `;
    
    quizContainer.innerHTML = html;
}

function handleQuizSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const quizId = form.getAttribute('data-quiz-id');
    const answers = [];
    
    // Collect all answers
    const questions = form.querySelectorAll('.question');
    
    questions.forEach((questionEl, index) => {
        const questionId = questionEl.querySelector('input').name.split('-')[1];
        const selectedOption = form.querySelector(`input[name="question-${questionId}"]:checked`);
        
        if (selectedOption) {
            answers.push({
                questionId: questionId,
                selectedOption: parseInt(selectedOption.value)
            });
        } else {
            answers.push({
                questionId: questionId,
                selectedOption: null
            });
        }
    });
    
    // Submit answers to API
    api.submitQuizAnswers(quizId, answers)
        .then(result => {
            displayQuizResults(result);
        })
        .catch(error => {
            console.error('Error submitting quiz answers:', error);
            alert('Failed to submit your answers. Please try again.');
        });
}

function displayQuizResults(result) {
    const quizContainer = document.getElementById('quiz-container');
    
    let html = `
        <div class="quiz-results">
            <h2>Quiz Results</h2>
            <div class="score">
                <p>You scored <strong>${result.score}%</strong> (${result.correctAnswers} out of ${result.totalQuestions})</p>
            </div>
    `;
    
    if (result.feedback) {
        html += `
            <div class="feedback">
                <h3>Feedback</h3>
                <p>${result.feedback}</p>
            </div>
        `;
    }
    
    html += `
            <div class="questions-review">
                <h3>Review</h3>
    `;
    
    result.questions.forEach((question, index) => {
        const isCorrect = question.userAnswer === question.correctAnswer;
        const statusClass = isCorrect ? 'correct' : 'incorrect';
        
        html += `
            <div class="question ${statusClass}">
                <p><strong>Question ${index + 1}:</strong> ${question.text}</p>
                <div class="user-answer">
                    <p>Your answer: <span class="${statusClass}">${question.options[question.userAnswer]}</span></p>
                </div>
                <div class="correct-answer">
                    <p>Correct answer: ${question.options[question.correctAnswer]}</p>
                </div>
                <div class="explanation">
                    <p>${question.explanation}</p>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
                <div class="actions">
                    <a href="quizzes.html" class="btn">Back to Quizzes</a>
                    <a href="attacks.html" class="btn">Learn More Attacks</a>
                </div>
            </div>
    `;
    
    quizContainer.innerHTML = html;
}

function displayError(message) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
