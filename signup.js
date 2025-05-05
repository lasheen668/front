document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const userName = document.getElementById('userName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Basic validation
        if (!userName || !phone || !password || !role) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showMessage('Password must contain at least 8 characters including uppercase, lowercase, numbers, and special characters', 'error');
            return;
        }
        
        // Create request data
        const signupData = {
            userName,
            phone,
            password,
            role
        };
        
        try {
            // Send API request
            const response = await fetch('/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            });
            
            const data = await response.json();
            
            if (response.status === 201) {
                // Success
                showMessage('Account created successfully!', 'success');
                signupForm.reset();
                
                // Redirect after successful signup (optional)
                // setTimeout(() => {
                //     window.location.href = '/login.html';
                // }, 2000);
            } else {
                // Handle error responses
                showMessage(data.message || 'Failed to create account. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    });
    
    // Function to display messages
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = 'message ' + type;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
});