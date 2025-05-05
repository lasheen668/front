document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const profileInfo = document.getElementById('profileInfo');
    const currentUserName = document.getElementById('currentUserName');
    const userPhone = document.getElementById('userPhone');
    const userRole = document.getElementById('userRole');
    const updateForm = document.getElementById('updateForm');
    const userNameInput = document.getElementById('userName');
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Delete account elements
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    let userId = null;
    
    // Check if user is logged in
    if (!token) {
        showUnauthorized();
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Handle form submission
    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateUserProfile();
    });
    
    // Handle logout
    logoutBtn.addEventListener('click', function() {
        logout();
    });
    
    // Handle delete account button
    deleteAccountBtn.addEventListener('click', function() {
        // Show delete confirmation modal
        deleteModal.classList.add('show');
    });
    
    // Handle cancel delete
    cancelDeleteBtn.addEventListener('click', function() {
        // Hide delete confirmation modal
        deleteModal.classList.remove('show');
    });
    
    // Handle confirm delete
    confirmDeleteBtn.addEventListener('click', function() {
        deleteUserAccount();
    });
    
    // Function to load user data from localStorage
    function loadUserData() {
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            
            if (!userData || !userData._id) {
                showUnauthorized();
                return;
            }
            
            // Store user ID for update/delete requests
            userId = userData._id;
            
            // Display user information
            currentUserName.textContent = userData.userName || 'No Name';
            userPhone.textContent = userData.phone || 'No Phone';
            userRole.textContent = `Role: ${userData.role || 'User'}`;
            
            // Pre-fill the update form
            userNameInput.value = userData.userName || '';
            
        } catch (error) {
            console.error('Error loading user data:', error);
            showUnauthorized();
        }
    }
    
    // Function to update user profile
    async function updateUserProfile() {
        if (!userId) {
            showMessage('User ID not found. Please login again.', 'error');
            return;
        }
        
        const userName = userNameInput.value.trim();
        
        if (!userName) {
            showMessage('Please enter a username', 'error');
            return;
        }
        
        try {
            const response = await fetch(`/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userName })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update successful
                showMessage('Profile updated successfully!', 'success');
                
                // Update userData in localStorage
                try {
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    userData.userName = userName;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Update displayed name
                    currentUserName.textContent = userName;
                } catch (e) {
                    console.error('Error updating local storage:', e);
                }
            } else {
                // Handle error
                showMessage(data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        }
    }
    
    // Function to delete user account
    async function deleteUserAccount() {
        if (!userId) {
            showMessage('User ID not found. Please login again.', 'error');
            deleteModal.classList.remove('show');
            return;
        }
        
        try {
            // Show loading state
            confirmDeleteBtn.textContent = 'Deleting...';
            confirmDeleteBtn.disabled = true;
            
            const response = await fetch(`/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Delete successful
                showMessage('Account deleted successfully!', 'success');
                
                // Clear user data from localStorage
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                
                // Redirect to signup page after short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Parse error response
                const data = await response.json();
                // Handle error
                showMessage(data.message || 'Failed to delete account', 'error');
                deleteModal.classList.remove('show');
                
                // Reset button state
                confirmDeleteBtn.textContent = 'Delete Account';
                confirmDeleteBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
            deleteModal.classList.remove('show');
            
            // Reset button state
            confirmDeleteBtn.textContent = 'Delete Account';
            confirmDeleteBtn.disabled = false;
        }
    }
    
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
    
    // Function to handle unauthorized state
    function showUnauthorized() {
        const container = document.querySelector('.form-container');
        container.innerHTML = `
            <div class="unauthorized">
                <h2>Unauthorized Access</h2>
                <p>Please login to view and update your profile.</p>
                <a href="login.html">Login Now</a>
            </div>
        `;
    }
    
    // Function to handle logout
    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
});