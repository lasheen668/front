// feedback-details.js
document.addEventListener('DOMContentLoaded', () => {
    const feedbackContainer = document.getElementById('feedback-container');
    
    // Get the feedback ID from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const feedbackId = urlParams.get('id');
    
    if (!feedbackId) {
      feedbackContainer.innerHTML = `<div class="error">No feedback ID provided</div>`;
      return;
    }
    
    // Fetch and display the feedback
    fetchFeedbackDetails(feedbackId);
  });
  
  async function fetchFeedbackDetails(id) {
    const feedbackContainer = document.getElementById('feedback-container');
    
    try {
      const feedback = await getFeedbackById(id);
      
      // Format the date
      const formattedDate = new Date(feedback.createdAt).toLocaleString();
      
      // Display the feedback details
      feedbackContainer.innerHTML = `
        <div class="feedback-detail">
          <h3>User: ${feedback.username || 'Anonymous'}</h3>
          <p class="date">Submitted on: ${formattedDate}</p>
          <div class="rating">Rating: ${displayStars(feedback.rating)}</div>
          <div class="message">
            <h4>Message:</h4>
            <p>${feedback.message}</p>
          </div>
          ${feedback.quizId ? `<p>Related Quiz: <a href="quiz-details.html?id=${feedback.quizId}">View Quiz</a></p>` : ''}
        </div>
      `;
    } catch (error) {
      feedbackContainer.innerHTML = `<div class="error">Error loading feedback: ${error.message}</div>`;
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