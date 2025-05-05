document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Get attack ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const attackId = urlParams.get('id');
    
    if (!attackId) {
        // Redirect to attacks list if no ID is provided
        window.location.href = 'attacks.html';
        return;
    }
    
    const editForm = document.getElementById('editAttackForm');
    const typeSelect = document.getElementById('attackType');
    const descriptionField = document.getElementById('description');
    const messageDiv = document.getElementById('message');
    
    // Load attack data
    loadAttackData();
    
    // Handle form submission
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get updated values
        const type = typeSelect.value;
        const description = descriptionField.value;
        
        // Validate form
        if (!type) {
            showMessage('Please select an attack type', 'error');
            return;
        }
        
        // Create data object with only the fields to update
        const updateData = {
            type: type
        };
        
        // Add description only if it's not empty
        if (description.trim()) {
            updateData.description = description;
        }
        
        try {
            // Send PUT request to update the attack
            const response = await fetch(`/api/attacks/${attackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('Attack report updated successfully!', 'success');
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = 'attacks.html';
                }, 2000);
            } else {
                showMessage(data.message || 'Failed to update attack report', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Server error. Please try again later.', 'error');
        }
    });
    
    // Function to load attack data from the server
    async function loadAttackData() {
        try {
            const response = await fetch(`/api/attacks/${attackId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load attack data');
            }
            
            const attack = await response.json();
            
            // Populate form with existing data
            typeSelect.value = attack.type || '';
            descriptionField.value = attack.description || '';
            
        } catch (error) {
            console.error('Error loading attack data:', error);
            showMessage('Could not load attack data. Please try again later.', 'error');
        }
    }
    
    // Function to display messages to the user
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
});