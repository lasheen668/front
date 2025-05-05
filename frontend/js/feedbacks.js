// feedbacks.js - Logic for displaying all feedbacks

document.addEventListener('DOMContentLoaded', function() {
    // Load all feedbacks when the page loads
    loadAllFeedbacks();
    
    // Set up any filtering or sorting functionality
    setupEventListeners();
});

async function loadAllFeedbacks() {
    try {
        // Show loading state
        const feedbacksContainer = document.getElementById('feedbacks-container');
        feedbacksContainer.innerHTML = '<p class="loading">Loading feedbacks...</p>';
        
        // Fetch all feedbacks
        const feedbacks = await feedbackService.getAllFeedbacks();
        
        // Render feedbacks
        renderFeedbacks(feedbacks);
    } catch (error) {
        displayError(`Failed to load feedbacks: ${error.message}`);
    }
}

function renderFeedbacks(feedbacks) {
    const feedbacksContainer = document.getElementById('feedbacks-container');
    
    if (!feedbacks || feedbacks.length === 0) {
        feedbacksContainer.innerHTML = `
            <div class="no-feedbacks">
                <p>No feedbacks available yet.</p>
                <a href="feedback.html" class="btn btn-primary">Submit Feedback</a>
            </div>
        `;
        return;
    }
    
    // Create feedback list
    const feedbacksHTML = feedbacks.map(feedback => `
        <div class="feedback-item">
            <div class="feedback-content">
                <p>${feedback.content}</p>
            </div>
            <div class="feedback-meta">
                <span class="feedback-user">User: ${formatUserId(feedback.user)}</span>
                <span class="feedback-date">${formatDate(feedback.createdAt)}</span>
            </div>
        </div>
    `).join('');
    
    feedbacksContainer.innerHTML = feedbacksHTML;
}

function formatUserId(userId) {
    // Format user ID - you could replace this with username if available
    if (!userId) return 'Anonymous';
    
    // If userId is an object with a name property, use that
    if (typeof userId === 'object' && userId.name) {
        return userId.name;
    }
    
    // Otherwise show a shortened ID
    return typeof userId === 'string' 
        ? userId.substring(0, 8) + '...' 
        : userId;
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    
    // Format the date nicely
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-feedback');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const feedbackItems = document.querySelectorAll('.feedback-item');
            
            feedbackItems.forEach(item => {
                const content = item.querySelector('.feedback-content p').textContent.toLowerCase();
                
                if (content.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Sort functionality could be added here
}

function displayError(message) {
    const feedbacksContainer = document.getElementById('feedbacks-container');
    feedbacksContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button class="btn btn-primary" onclick="loadAllFeedbacks()">Try Again</button>
        </div>
    `;
}
// feedbacks.js
document.addEventListener('DOMContentLoaded', () => {
    fetchAllFeedbacks();
  });
  
  async function fetchAllFeedbacks() {
    const feedbacksList = document.getElementById('feedbacks-list');
    
    try {
      const feedbacks = await getAllFeedbacks();
      
      if (feedbacks.length === 0) {
        feedbacksList.innerHTML = '<p>No feedbacks available.</p>';
        return;
      }
      
      let feedbacksHTML = '<div class="feedbacks-grid">';
      
      feedbacks.forEach(feedback => {
        const formattedDate = new Date(feedback.createdAt).toLocaleDateString();
        
        feedbacksHTML += `
          <div class="feedback-card">
            <h3>${feedback.username || 'Anonymous'}</h3>
            <p class="date">${formattedDate}</p>
            <div class="rating">${displayStars(feedback.rating)}</div>
            <p class="message-preview">${truncateText(feedback.message, 100)}</p>
            <a href="feedback-details.html?id=${feedback._id}" class="btn-small">View Details</a>
          </div>
        `;
      });
      
      feedbacksHTML += '</div>';
      feedbacksList.innerHTML = feedbacksHTML;
      
    } catch (error) {
      feedbacksList.innerHTML = `<div class="error">Error loading feedbacks: ${error.message}</div>`;
    }
  }
  
  function displayStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(`<span class="star full">${fullStar}</span>`);
      } else {
        stars.push(`<span class="star empty">${emptyStar}</span>`);
      }
    }
    
    return stars.join('');
  }
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }