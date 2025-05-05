document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!phone || !password) {
            showMessage('Please enter both phone number and password', 'error');
            return;
        }
        
        // Set button to loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        // Create request data
        const loginData = {
            phone,
            password
        };
        
        try {
            // Send API request
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const data = await response.json();
            
            if (response.status === 200) {
                // Success - Store user data and token
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                showMessage('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard or home page
                setTimeout(() => {
                    window.location.href = '/dashboard.html'; // Change to your desired redirect page
                }, 1500);
            } else {
                // Handle error responses
                showMessage(data.message || 'Invalid phone number or password', 'error');
                resetButton();
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
            resetButton();
        }
    });
    
    // Function to display messages
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = 'message ' + type;
        
        // Hide message after 5 seconds for error messages
        if (type === 'error') {
            setTimeout(() => {
                messageDiv.className = 'message';
            }, 5000);
        }
    }
    
    // Reset button state
    function resetButton() {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
});