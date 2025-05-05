document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedAttacks();
  });
  
  async function loadFeaturedAttacks() {
    const featuredContainer = document.getElementById('featured-attacks');
    
    try {
      const attacks = await getAllAttacks();
      
      // Take the first 3 attacks as featured
      const featuredAttacks = attacks.slice(0, 3);
      
      if (featuredAttacks.length === 0) {
        featuredContainer.innerHTML = '<p>No featured content available.</p>';
        return;
      }
      
      let featuredHTML = '';
      
      featuredAttacks.forEach(attack => {
        featuredHTML += `
          <div class="featured-card ${attack.severity.toLowerCase()}">
            <h4>${attack.name}</h4>
            <p>${truncateText(attack.description, 80)}</p>
            <a href="attack-details.html?id=${attack._id}" class="btn-small">Learn More</a>
          </div>
        `;
      });
      
      featuredContainer.innerHTML = featuredHTML;
      
    } catch (error) {
      featuredContainer.innerHTML = `<div class="error">Error loading featured content: ${error.message}</div>`;
    }
  }
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }