document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const usersTableBody = document.getElementById('usersTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const limitSelect = document.getElementById('limitSelect');
    
    // State variables
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 0;
    let searchTerm = '';
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Initialize page
    init();
    
    function init() {
        // Check if user is logged in
        if (!token) {
            showError('You must be logged in to view users.');
            return;
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Load initial data
        fetchUsers();
    }
    
    function setupEventListeners() {
        // Search button click
        searchBtn.addEventListener('click', function() {
            searchTerm = searchInput.value.trim();
            currentPage = 1; // Reset to first page when searching
            fetchUsers();
        });
        
        // Search input enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTerm = searchInput.value.trim();
                currentPage = 1;
                fetchUsers();
            }
        });
        
        // Items per page change
        limitSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1; // Reset to first page when changing limit
            fetchUsers();
        });
    }
    
    async function fetchUsers() {
        try {
            // Show loading state
            showLoading(true);
            
            // Build query parameters
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage
            });
            
            // Add search term if provided
            if (searchTerm) {
                queryParams.append('search', searchTerm);
            }
            
            // Fetch users data from API
            const response = await fetch(`/?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Handle non-successful responses
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch users');
            }
            
            // Parse the JSON response
            const data = await response.json();
            
            // Update pagination state
            totalPages = data.totalPages || 0;
            currentPage = data.page || 1;
            
            // Update the UI with user data
            renderUsers(data.docs || []);
            renderPagination();
            
            // Hide loading indicator
            showLoading(false);
            
        } catch (error) {
            console.error('Error fetching users:', error);
            showError(error.message || 'An error occurred while fetching users');
            showLoading(false);
        }
    }
    
    function renderUsers(users) {
        // Clear existing table rows
        usersTableBody.innerHTML = '';
        
        // Hide/show empty state
        if (users.length === 0) {
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }
        
        // Create HTML for each user
        users.forEach(user => {
            // Format date
            const createdAt = user.createdAt 
                ? new Date(user.createdAt).toLocaleDateString() 
                : 'N/A';
                
            // Determine role class
            const roleClass = user.role === 'admin' ? 'admin' : 'user';
            
            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userName || 'No Name'}</td>
                <td>${user.phone || 'No Phone'}</td>
                <td><span class="user-role ${roleClass}">${user.role || 'user'}</span></td>
                <td>${createdAt}</td>
                <td class="user-actions">
                    <a href="user-details.html?id=${user._id}" class="action-btn view">View</a>
                    <a href="profile.html?id=${user._id}" class="action-btn edit">Edit</a>
                    <button class="action-btn delete" data-id="${user._id}">Delete</button>
                </td>
            `;
            
            // Add delete event listener
            const deleteBtn = row.querySelector('.delete');
            deleteBtn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                confirmDelete(userId);
            });
            
            // Add row to table
            usersTableBody.appendChild(row);
        });
    }
    
    function renderPagination() {
        // Clear existing pagination
        pagination.innerHTML = '';
        
        if (totalPages <= 1) {
            return; // Don't show pagination if only one page
        }
        
        // Create previous button
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('pagination-btn');
        prevBtn.textContent = 'Previous';
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    fetchUsers();
                }
            });
        }
        pagination.appendChild(prevBtn);
        
        // Calculate range of page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start if end is at max
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('pagination-btn');
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                fetchUsers();
            });
            pagination.appendChild(pageBtn);
        }
        
        // Create next button
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('pagination-btn');
        nextBtn.textContent = 'Next';
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.addEventListener('click', function() {
                if (currentPage < totalPages) {
                    currentPage++;
                    fetchUsers();
                }
            });
        }
        pagination.appendChild(nextBtn);
    }
    
    function confirmDelete(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteUser(userId);
        }
    }
    
    async function deleteUser(userId) {
        try {
            const response = await fetch(`/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }
            
            // Refresh the user list
            fetchUsers();
            
            // Show success message
            alert('User deleted successfully');
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message || 'An error occurred while deleting the user');
        }
    }
    
    function showLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.style.display = 'flex';
            usersTableBody.innerHTML = '';
            errorMessage.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        emptyState.style.display = 'none';
    }
});