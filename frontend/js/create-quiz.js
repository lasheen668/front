document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const addQuestionBtn = document.getElementById('add-question');
    const questionsContainer = document.getElementById('questions-container');
    const questionTemplate = document.getElementById('question-template');
    const messageElement = document.getElementById('message');

    // Add the first question by default
    addQuestion();

    // Event listener for adding a new question
    addQuestionBtn.addEventListener('click', addQuestion);

    // Event listener for form submission
    quizForm.addEventListener('submit', handleSubmit);

    // Function to add a new question
    function addQuestion() {
        const questionNumber = questionsContainer.children.length + 1;
        
        // Clone the template
        const questionNode = document.importNode(questionTemplate.content, true);
        
        // Update question number
        questionNode.querySelector('.question-number').textContent = questionNumber;
        
        // Update radio button names to be unique per question
        const radioButtons = questionNode.querySelectorAll('.correct-answer');
        radioButtons.forEach(radio => {
            radio.name = `correct-answer-${questionNumber}`;
        });
        
        // Add event listener to remove question button
        const removeBtn = questionNode.querySelector('.remove-question');
        removeBtn.addEventListener('click', function() {
            this.closest('.question-box').remove();
            updateQuestionNumbers();
        });
        
        // Append the new question to the container
        questionsContainer.appendChild(questionNode);
    }

    // Function to update question numbers after removal
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

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            // Show loading state
            messageElement.textContent = 'Creating quiz...';
            messageElement.classList.remove('hidden', 'error');
            messageElement.classList.add('info');
            
            // Gather form data
            const quizData = {
                title: document.getElementById('quiz-title').value.trim(),
                questions: []
            };
            
            // Get all question boxes
            const questionBoxes = questionsContainer.querySelectorAll('.question-box');
            
            // Process each question
            questionBoxes.forEach((box, questionIndex) => {
                const questionText = box.querySelector('.question-text').value.trim();
                const options = [];
                const optionInputs = box.querySelectorAll('.option-text');
                
                // Get all options
                optionInputs.forEach(input => {
                    options.push(input.value.trim());
                });
                
                // Find the selected correct answer
                const correctAnswerRadios = box.querySelectorAll('.correct-answer');
                let correctAnswerIndex = 0;
                
                correctAnswerRadios.forEach((radio, index) => {
                    if (radio.checked) {
                        correctAnswerIndex = index;
                    }
                });
                
                // Add question to quiz data
                quizData.questions.push({
                    questionText: questionText,
                    options: options,
                    correctAnswer: options[correctAnswerIndex]
                });
            });
            
            // Send data to server
            const response = await fetch('/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });
            
            // Handle response
            if (response.ok) {
                const createdQuiz = await response.json();
                messageElement.textContent = 'Quiz created successfully!';
                messageElement.classList.remove('info', 'error');
                messageElement.classList.add('success');
                
                // Reset form after successful creation
                quizForm.reset();
                
                // Clear questions and add a new empty one
                questionsContainer.innerHTML = '';
                addQuestion();
                
                // Redirect to quiz list after a short delay
                setTimeout(() => {
                    window.location.href = 'quizzes.html';
                }, 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create quiz');
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while creating the quiz';
            messageElement.classList.remove('info', 'success');
            messageElement.classList.add('error');
        }
    }
});