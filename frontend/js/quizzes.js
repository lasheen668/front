document.addEventListener('DOMContentLoaded', () => {
    const quizzesContainer = document.getElementById('quizzes-container');
    const messageElement = document.getElementById('message');
    
    // Fetch all quizzes when page loads
    fetchQuizzes();
    
    async function fetchQuizzes() {
        try {
            const response = await fetch('/api/quizzes');
            
            if (!response.ok) {
                throw new Error('Failed to fetch quizzes');
            }
            
            const quizzes = await response.json();
            displayQuizzes(quizzes);
            
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            messageElement.textContent = error.message || 'An error occurred while fetching quizzes';
            messageElement.classList.remove('hidden', 'success', 'info');
            messageElement.classList.add('error');
            quizzesContainer.innerHTML = '<p>Failed to load quizzes. Please try again later.</p>';
        }
    }
    
    function displayQuizzes(quizzes) {
        // Clear loading message
        quizzesContainer.innerHTML = '';
        
        if (quizzes.length === 0) {
            quizzesContainer.innerHTML = '<p>No quizzes found. Create your first quiz!</p>';
            return;
        }
        
        // Create quiz cards
        const quizGrid = document.createElement('div');
        quizGrid.className = 'quiz-grid';
        
        quizzes.forEach(quiz => {
            const quizCard = createQuizCard(quiz);
            quizGrid.appendChild(quizCard);
        });
        
        quizzesContainer.appendChild(quizGrid);
    }
    
    function createQuizCard(quiz) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        
        const title = document.createElement('h3');
        title.textContent = quiz.title;
        
        const questionCount = document.createElement('p');
        questionCount.textContent = `${quiz.questions.length} questions`;
        
        const viewButton = document.createElement('a');
        viewButton.href = `quiz-details.html?id=${quiz._id}`;
        viewButton.className = 'btn btn-primary';
        viewButton.textContent = 'View Quiz';
        
        const editButton = document.createElement('a');
        editButton.href = `edit-quiz.html?id=${quiz._id}`;
        editButton.className = 'btn btn-secondary';
        editButton.textContent = 'Edit';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteQuiz(quiz._id));
        
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.appendChild(viewButton);
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        
        card.appendChild(title);
        card.appendChild(questionCount);
        card.appendChild(buttonGroup);
        
        return card;
    }
    
    async function deleteQuiz(quizId) {
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
            
            // Refresh the quiz list
            fetchQuizzes();
            
            // Hide message after 3 seconds
            setTimeout(() => {
                messageElement.classList.add('hidden');
            }, 3000);
            
        } catch (error) {
            console.error('Error deleting quiz:', error);
            messageElement.textContent = error.message || 'An error occurred while deleting the quiz';
            messageElement.classList.remove('hidden', 'success', 'info');
            messageElement.classList.add('error');
        }
    }
});
async function deleteQuiz(quizId) {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        return;
    }
    
    try {
        // Display loading state
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Deleting quiz...';
        messageElement.classList.remove('hidden', 'error', 'success');
        messageElement.classList.add('info');
        
        // Send delete request to the endpoint
        const response = await fetch(`/api/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Handle error responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete quiz');
        }
        
        // Show success message
        messageElement.textContent = 'Quiz deleted successfully!';
        messageElement.classList.remove('info', 'error');
        messageElement.classList.add('success');
        
        // Refresh quiz list to reflect the deletion
        fetchQuizzes();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
        
    } catch (error) {
        // Handle and display errors
        console.error('Error deleting quiz:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = error.message || 'An error occurred while deleting the quiz';
        messageElement.classList.remove('hidden', 'info', 'success');
        messageElement.classList.add('error');
    }
}
// quizzes.js - Logic for displaying all quizzes

document.addEventListener('DOMContentLoaded', function() {
    // Load all quizzes when the page loads
    loadAllQuizzes();
    
    // Set up search and filter functionality if needed
    setupEventListeners();
});

async function loadAllQuizzes() {
    try {
        // Show loading state
        const quizzesContainer = document.getElementById('quizzes-container');
        quizzesContainer.innerHTML = '<p class="loading">Loading quizzes...</p>';
        
        // Fetch all quizzes
        const quizzes = await quizService.getAllQuizzes();
        
        // Render quizzes
        renderQuizzes(quizzes);
    } catch (error) {
        displayError(`Failed to load quizzes: ${error.message}`);
    }
}

function renderQuizzes(quizzes) {
    const quizzesContainer = document.getElementById('quizzes-container');
    
    if (!quizzes || quizzes.length === 0) {
        quizzesContainer.innerHTML = `
            <div class="no-quizzes">
                <p>No quizzes found.</p>
                <a href="create-quiz.html" class="btn btn-primary">Create Your First Quiz</a>
            </div>
        `;
        return;
    }
    
    // Create quiz cards
    const quizzesHTML = quizzes.map(quiz => `
        <div class="quiz-card">
            <h3 class="quiz-title">${quiz.title}</h3>
            <p class="quiz-description">${quiz.description || 'No description available'}</p>
            
            <div class="quiz-meta">
                <span class="quiz-category">${quiz.category || 'Uncategorized'}</span>
                <span class="quiz-questions">${quiz.questions?.length || 0} Questions</span>
            </div>
            
            <div class="quiz-actions">
                <a href="quiz-details.html?id=${quiz._id}" class="btn btn-primary">View Details</a>
                <button class="btn btn-danger delete-quiz-btn" data-quiz-id="${quiz._id}">Delete Quiz</button>
            </div>
        </div>
    `).join('');
    
    quizzesContainer.innerHTML = quizzesHTML;
    
    // Reattach event listeners for delete buttons
    setupDeleteButtons();
}

function setupDeleteButtons() {
    // You mentioned delete functionality is already included
    // This function will reattach event listeners to the newly created delete buttons
    const deleteButtons = document.querySelectorAll('.delete-quiz-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const quizId = this.getAttribute('data-quiz-id');
            
            // Show confirmation dialog
            const deleteConfirmation = document.getElementById('delete-confirmation');
            deleteConfirmation.style.display = 'block';
            
            // Store the quiz ID for use by the confirm button
            document.getElementById('confirm-delete').setAttribute('data-quiz-id', quizId);
        });
    });
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-quiz');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Implement search functionality if needed
        });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            // Implement category filtering if needed
        });
    }
    
    // Cancel delete
    const cancelDelete = document.getElementById('cancel-delete');
    if (cancelDelete) {
        cancelDelete.addEventListener('click', function() {
            document.getElementById('delete-confirmation').style.display = 'none';
        });
    }
    
    // Confirm delete functionality is already implemented in your existing code
}

function displayError(message) {
    const quizzesContainer = document.getElementById('quizzes-container');
    quizzesContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button class="btn btn-primary" onclick="loadAllQuizzes()">Try Again</button>
        </div>
    `;
}