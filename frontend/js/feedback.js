// feedback.js - Logic for handling feedback form submission

document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the feedback form
    const feedbackForm = document.getElementById('feedback-form');
    
    // Add submit event listener
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    
    // Load user ID if available (e.g., from URL parameters or localStorage)
    loadUserData();
});

function loadUserData() {
    // Check if we have a user ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (userId) {
        // If user ID is in URL, set it in the form
        const userIdInput = document.getElementById('user-id');
        if (userIdInput) {
            userIdInput.value = userId;
        }
    } else {
        // You might also check localStorage or other storage for a user ID
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            const userIdInput = document.getElementById('user-id');
            if (userIdInput) {
                userIdInput.value = storedUserId;
            }
        }
    }
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = document.querySelector('#feedback-form button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Clear previous error messages
    const errorDisplay = document.getElementById('feedback-error');
    errorDisplay.textContent = '';
    errorDisplay.style.display = 'none';
    
    // Get form data
    const userId = document.getElementById('user-id').value;
    const content = document.getElementById('feedback-content').value;
    
    // Validate form data
    if (!userId || !content) {
        errorDisplay.textContent = 'Please fill in all fields';
        errorDisplay.style.display = 'block';
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // Prepare data for submission
    const feedbackData = {
        user: userId,
        content: content
    };
    
    try {
        // Submit feedback
        const response = await feedbackService.createFeedback(feedbackData);
        
        // Show success message
        document.getElementById('feedback-success').style.display = 'block';
        
        // Clear the form
        document.getElementById('feedback-content').value = '';
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Hide success message after some time
        setTimeout(() => {
            document.getElementById('feedback-success').style.display = 'none';
        }, 5000);
        
    } catch (error) {
        // Display error message
        errorDisplay.textContent = error.message || 'Failed to submit feedback. Please try again.';
        errorDisplay.style.display = 'block';
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}
