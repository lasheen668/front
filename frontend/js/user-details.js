document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userDetailsContainer = document.getElementById('userDetails');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const attacksList = document.getElementById('attacksList');
    const quizzesList = document.getElementById('quizzesList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Get user ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    // Initialize page
    init();
    
    function init() {
        // Check if we have a user ID
        if (!userId) {
            showError('User ID is missing. Please provide a valid user ID.');
            return;
        }
        
        // Check if user is logged in
        if (!token) {
            showError('You must be logged in to view user details.');
            return;
        }
        
        // Setup tab functionality
        setupTabs();
        
        // Fetch user data
        fetchUserDetails();
    }
    
    async function fetchUserDetails() {
        try {
            // Show loading state
            showLoading(true);
            
            // Fetch user data from API
            const response = await fetch(`/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Handle non-successful responses
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user details');
            }
            
            // Parse the JSON response
            const userData = await response.json();
            
            // Update the UI with user data
            displayUserDetails(userData);
            
            // Populate related data tabs
            populateAttacks(userData.attacks || []);
            populateQuizzes(userData.quizzes || []);
            
            // Hide loading indicator
            showLoading(false);
            
        } catch (error) {
            console.error('Error fetching user details:', error);
            showError(error.message || 'An error occurred while fetching user details');
            showLoading(false);
        }
    }
    
    function displayUserDetails(user) {
        // Create initial letter for avatar
        const initialLetter = user.userName ? user.userName.charAt(0).toUpperCase() : '?';
        
        // Format dates
        const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
        const updatedAt = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A';
        
        // Create HTML for user details
        const userDetailsHTML = `
            <div class="user-header">
                <div class="user-avatar">${initialLetter}</div>
                <div class="user-info">
                    <h2>${user.userName || 'No Name'}</h2>
                    <div class="user-role">${user.role || 'User'}</div>
                </div>
            </div>
            <div class="user-meta">
                <div class="meta-item">
                    <div class="meta-label">Phone:</div>
                    <div class="meta-value">${user.phone || 'Not provided'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Created:</div>
                    <div class="meta-value">${createdAt}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Last Updated:</div>
                    <div class="meta-value">${updatedAt}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Attacks:</div>
                    <div class="meta-value">${user.attacks ? user.attacks.length : 0}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Quizzes:</div>
                    <div class="meta-value">${user.quizzes ? user.quizzes.length : 0}</div>
                </div>
            </div>
        `;
        
        // Update the DOM
        userDetailsContainer.innerHTML = userDetailsHTML;
        userDetailsContainer.style.display = 'block';
    }
    
    function populateAttacks(attacks) {
        if (!attacks || attacks.length === 0) {
            attacksList.innerHTML = `
                <div class="empty-state">
                    <p>No attacks found for this user.</p>
                </div>
            `;
            return;
        }
        
        // Create HTML for each attack
        let attacksHTML = '';
        attacks.forEach(attack => {
            const createdAt = attack.createdAt ? new Date(attack.createdAt).toLocaleDateString() : 'N/A';
            
            attacksHTML += `
                <div class="item-card">
                    <div class="item-title">${attack.title || 'Untitled Attack'}</div>
                    <div class="item-description">${attack.description || 'No description available'}</div>
                    <div class="item-meta">
                        <span>Created: ${createdAt}</span>
                        <span>Type: ${attack.type || 'Unknown'}</span>
                    </div>
                </div>
            `;
        });
        
        // Update the DOM
        attacksList.innerHTML = attacksHTML;
    }
    
    function populateQuizzes(quizzes) {
        if (!quizzes || quizzes.length === 0) {
            quizzesList.innerHTML = `
                <div class="empty-state">
                    <p>No quizzes found for this user.</p>
                </div>
            `;
            return;
        }
        
        // Create HTML for each quiz
        let quizzesHTML = '';
        quizzes.forEach(quiz => {
            const createdAt = quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A';
            
            quizzesHTML += `
                <div class="item-card">
                    <div class="item-title">${quiz.title || 'Untitled Quiz'}</div>
                    <div class="item-description">${quiz.description || 'No description available'}</div>
                    <div class="item-meta">
                        <span>Created: ${createdAt}</span>
                        <span>Questions: ${quiz.questions ? quiz.questions.length : 0}</span>
                    </div>
                </div>
            `;
        });
        
        // Update the DOM
        quizzesList.innerHTML = quizzesHTML;
    }
    
    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Remove active class from all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding tab content
                const tabName = this.getAttribute('data-tab');
                document.getElementById(`${tabName}Tab`).classList.add('active');
            });
        });
    }
    
    function showLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.style.display = 'flex';
            userDetailsContainer.style.display = 'none';
            errorMessage.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        userDetailsContainer.style.display = 'none';
    }
});