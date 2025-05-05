document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-quiz-form');
    const loadingContainer = document.getElementById('loading-container');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question');
    const questionTemplate = document.getElementById('question-template');
    const messageElement = document.getElementById('message');
    const cancelButton = document.getElementById('cancel-button');
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    // Redirect if no ID is provided
    if (!quizId) {
        window.location.href = 'quizzes.html';
        return;
    }
    
    // Initialize
    let quiz = null;
    
    // Fetch quiz data
    fetchQuiz();
    
    // Add event listeners
    editForm.addEventListener('submit', handleSubmit);
    addQuestionBtn.addEventListener('click', addQuestion);
    cancelButton.addEventListener('click', () => window.location.href = 'quizzes.html');
    
    async function fetchQuiz() {
        try {
            const response = await fetch(`/api/quizzes/${quizId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch quiz data');
            }
            
            quiz = await response.json();
            populateForm(quiz);
            
            // Hide loading, show form
            loadingContainer.classList.add('hidden');
            editForm.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error fetching quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while fetching quiz data';
            messageElement.classList.remove('hidden', 'success', 'info');
            messageElement.classList.add('error');
            loadingContainer.innerHTML = '<p>Failed to load quiz. Please try again later.</p>';
        }
    }
    
    function populateForm(quiz) {
        // Set title and type
        document.getElementById('quiz-title').value = quiz.title || '';
        document.getElementById('quiz-type').value = quiz.type || '';
        
        // Clear questions container
        questionsContainer.innerHTML = '';
        
        // Add questions
        if (quiz.questions && quiz.questions.length > 0) {
            quiz.questions.forEach((question, index) => {
                addQuestion(null, question, index);
            });
        } else {
            // Add one empty question if none exist
            addQuestion();
        }
    }
    
    function addQuestion(event, questionData = null, questionIndex = null) {
        const questionNumber = questionIndex !== null ? 
            questionIndex + 1 : 
            questionsContainer.children.length + 1;
        
        // Clone the template
        const questionNode = document.importNode(questionTemplate.content, true);
        
        // Update question number
        questionNode.querySelector('.question-number').textContent = questionNumber;
        
        // Set unique name for radio buttons
        const radioButtons = questionNode.querySelectorAll('.correct-answer');
        radioButtons.forEach(radio => {
            radio.name = `correct-answer-${questionNumber}`;
        });
        
        // Populate with data if provided
        if (questionData) {
            questionNode.querySelector('.question-text').value = questionData.questionText || '';
            
            // Populate options
            const optionInputs = questionNode.querySelectorAll('.option-text');
            if (questionData.options && questionData.options.length > 0) {
                questionData.options.forEach((option, i) => {
                    if (i < optionInputs.length) {
                        optionInputs[i].value = option || '';
                        
                        // Check correct answer radio button
                        if (option === questionData.correctAnswer) {
                            radioButtons[i].checked = true;
                        }
                    }
                });
            }
        }
        
        // Add event listener to remove button
        const removeBtn = questionNode.querySelector('.remove-question');
        removeBtn.addEventListener('click', function() {
            this.closest('.question-box').remove();
            updateQuestionNumbers();
        });
        
        // Append to container
        questionsContainer.appendChild(questionNode);
    }
    
    function updateQuestionNumbers() {
        const questionBoxes = questionsContainer.querySelectorAll('.question-box');
        questionBoxes.forEach((box, index) => {
            box.querySelector('.question-number').textContent = index + 1;
            
            // Update radio button names
            const radioButtons = box.querySelectorAll('.correct-answer');
            radioButtons.forEach(radio => {
                radio.name = `correct-answer-${index + 1}`;
            });
        });
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            // Show loading message
            messageElement.textContent = 'Saving changes...';
            messageElement.classList.remove('hidden', 'error');
            messageElement.classList.add('info');
            
            // Gather form data
            const quizData = {
                title: document.getElementById('quiz-title').value.trim(),
                type: document.getElementById('quiz-type').value.trim(),
                questions: []
            };
            
            // Process questions
            const questionBoxes = questionsContainer.querySelectorAll('.question-box');
            questionBoxes.forEach(box => {
                const questionText = box.querySelector('.question-text').value.trim();
                const options = [];
                const optionInputs = box.querySelectorAll('.option-text');
                
                // Get options
                optionInputs.forEach(input => {
                    options.push(input.value.trim());
                });
                
                // Find correct answer
                const correctAnswerRadios = box.querySelectorAll('.correct-answer');
                let correctAnswerIndex = 0;
                
                correctAnswerRadios.forEach((radio, index) => {
                    if (radio.checked) {
                        correctAnswerIndex = index;
                    }
                });
                
                // Add question to data
                quizData.questions.push({
                    questionText: questionText,
                    options: options,
                    correctAnswer: options[correctAnswerIndex]
                });
            });
            
            // Send update request
            const response = await fetch(`/api/quizzes/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update quiz');
            }
            
            // Show success message
            messageElement.textContent = 'Quiz updated successfully!';
            messageElement.classList.remove('info', 'error');
            messageElement.classList.add('success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'quizzes.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error updating quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while updating the quiz';
            messageElement.classList.remove('info', 'success');
            messageElement.classList.add('error');
        }
    }
});