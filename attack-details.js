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
    
    // DOM elements
    const loadingMessage = document.getElementById('loadingMessage');
    const attackDetails = document.getElementById('attackDetails');
    const errorMessage = document.getElementById('errorMessage');
    const attackType = document.getElementById('attackType');
    const attackDescription = document.getElementById('attackDescription');
    const attackReporter = document.getElementById('attackReporter');
    const attackDate = document.getElementById('attackDate');
    const attackTitle = document.getElementById('attackTitle');
    const editLink = document.getElementById('editLink');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Load attack details
    loadAttackDetails();
    
    // Add event listener to delete button
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this attack report?')) {
            deleteAttack();
        }
    });
    
    // Function to load attack details
    async function loadAttackDetails() {
        try {
            const response = await fetch(`/api/attacks/${attackId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load attack details');
            }
            
            const attack = await response.json();
            
            // Update the page title
            document.title = `Attack Details: ${attack.type}`;
            
            // Populate the attack details
            attackType.textContent = attack.type;
            attackTitle.textContent = attack.type;
            attackDescription.textContent = attack.description || 'No description provided';
            
            // Format the reporter name if available
            if (attack.reportedBy) {
                const reporter = attack.reportedBy;
                const reporterName = reporter.name || reporter.username || reporter.email || 'Unknown User';
                attackReporter.textContent = reporterName;
            } else {
                attackReporter.textContent = 'Unknown';
            }
            
            // Format the date if available
            if (attack.createdAt) {
                const date = new Date(attack.createdAt);
                attackDate.textContent = date.toLocaleString();
            } else {
                attackDate.textContent = 'Unknown';
            }
            
            // Set the edit link
            editLink.href = `edit-attack.html?id=${attackId}`;
            
            // Show the details and hide loading message
            loadingMessage.style.display = 'none';
            attackDetails.style.display = 'block';
            
        } catch (error) {
            console.error('Error loading attack details:', error);
            loadingMessage.style.display = 'none';
            errorMessage.textContent = 'Could not load attack details. Please try again later.';
            errorMessage.style.display = 'block';
        }
    }
    
    // Function to delete the attack
    async function deleteAttack() {
        try {
            const response = await fetch(`/api/attacks/${attackId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete attack');
            }
            
            // Redirect to attacks list with success message
            localStorage.setItem('message', 'Attack deleted successfully');
            localStorage.setItem('messageType', 'success');
            window.location.href = 'attacks.html';
            
        } catch (error) {
            console.error('Error deleting attack:', error);
            errorMessage.textContent = error.message || 'Error deleting attack. Please try again.';
            errorMessage.style.display = 'block';
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const attackContainer = document.getElementById('attack-container');
    const videoSection = document.getElementById('attack-video');
    const videoContainer = document.querySelector('.video-container');
    const startQuizBtn = document.getElementById('start-quiz');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResults = document.getElementById('quiz-results');
    const feedbackLink = document.getElementById('feedback-link');
    
    // Get the attack ID from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const attackId = urlParams.get('id');
    
    if (!attackId) {
      attackContainer.innerHTML = `<div class="error">No attack ID provided</div>`;
      return;
    }
    
    // Update feedback link with attack ID
    feedbackLink.href = `feedback.html?attackId=${attackId}`;
    
    // Fetch and display the attack details
    fetchAttackDetails(attackId);
    
    // Set up quiz button event listener
    startQuizBtn.addEventListener('click', () => {
      startQuizBtn.classList.add('hidden');
      loadQuizQuestions(attackId);
    });
  });
  
  async function fetchAttackDetails(id) {
    const attackContainer = document.getElementById('attack-container');
    const videoSection = document.getElementById('attack-video');
    const videoContainer = document.querySelector('.video-container');
    
    try {
      const attack = await getAttackById(id);
      
      // Display attack details
      attackContainer.innerHTML = `
        <h2>${attack.name}</h2>
        <div class="attack-info">
          <div class="attack-severity ${attack.severity.toLowerCase()}">
            <strong>Severity:</strong> ${attack.severity}
          </div>
          <div class="attack-category">
            <strong>Category:</strong> ${attack.category}
          </div>
        </div>
        <div class="attack-description">
          <h3>Description</h3>
          <p>${attack.description}</p>
        </div>
        <div class="attack-prevention">
          <h3>Prevention Methods</h3>
          <p>${attack.preventionMethods}</p>
        </div>
      `;
      
      // Display video if available
      if (attack.videoUrl) {
        videoSection.classList.remove('hidden');
        videoContainer.innerHTML = `
          <video controls>
            <source src="${attack.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }
      
      // Update page title
      document.title = `${attack.name} - Security Training`;
      
    } catch (error) {
      attackContainer.innerHTML = `<div class="error">Error loading attack details: ${error.message}</div>`;
    }
  }
  
  async function loadQuizQuestions(attackId) {
    const quizQuestions = document.getElementById('quiz-questions');
    
    try {
      const quizzes = await getQuizzesByAttackId(attackId);
      
      if (quizzes.length === 0) {
        quizQuestions.innerHTML = '<p>No quizzes available for this attack yet.</p>';
        quizQuestions.classList.remove('hidden');
        return;
      }
      
      const quiz = quizzes[0]; // Use the first quiz related to this attack
      
      // Create HTML for quiz questions
      let questionsHTML = `
        <form id="quiz-form">
          <input type="hidden" name="quizId" value="${quiz._id}">
          <h4>${quiz.title}</h4>
      `;
      
      quiz.questions.forEach((question, qIndex) => {
        questionsHTML += `
          <div class="question">
            <p>${qIndex + 1}. ${question.text}</p>
            <div class="options">
        `;
        
        question.options.forEach((option, oIndex) => {
          questionsHTML += `
            <div class="option">
              <input type="radio" id="q${qIndex}_o${oIndex}" name="q${qIndex}" value="${oIndex}">
              <label for="q${qIndex}_o${oIndex}">${option}</label>
            </div>
          `;
        });
        
        questionsHTML += `
            </div>
          </div>
        `;
      });
      
      questionsHTML += `
          <button type="submit" class="btn submit-quiz">Submit Answers</button>
        </form>
      `;
      
      quizQuestions.innerHTML = questionsHTML;
      quizQuestions.classList.remove('hidden');
      
      // Add event listener for quiz submission
      document.getElementById('quiz-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuiz(quiz._id);
      });
      
    } catch (error) {
      quizQuestions.innerHTML = `<div class="error">Error loading quiz: ${error.message}</div>`;
      quizQuestions.classList.remove('hidden');
    }
  }
  
  async function submitQuiz(quizId) {
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');
    
    // Collect answers
    const answers = [];
    const questions = document.querySelectorAll('.question');
    
    questions.forEach((question, index) => {
      const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
      answers.push(selectedOption ? parseInt(selectedOption.value) : -1);
    });
    
    // Check if all questions are answered
    if (answers.includes(-1)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    try {
      const result = await submitQuizAnswers(quizId, answers);
      
      // Display results
      let resultsHTML = `
        <h4>Quiz Results</h4>
        <p>Score: ${result.score}/${result.total}</p>
      `;
      
      if (result.correctAnswers) {
        resultsHTML += `<ul class="results-list">`;
        
        result.correctAnswers.forEach((correct, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === correct;
          
          resultsHTML += `
            <li class="${isCorrect ? 'correct' : 'incorrect'}">
              Question ${index + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}
            </li>
          `;
        });
        
        resultsHTML += `</ul>`;
      }
      
      resultsHTML += `
        <p>${result.passed ? 'Congratulations! You passed the quiz.' : 'You did not pass. Please review the material and try again.'}</p>
        <button id="retry-quiz" class="btn">Try Again</button>
      `;
      
      quizResults.innerHTML = resultsHTML;
      quizResults.classList.remove('hidden');
      quizForm.classList.add('hidden');
      
      // Add event listener for retrying the quiz
      document.getElementById('retry-quiz').addEventListener('click', () => {
        quizResults.classList.add('hidden');
        quizForm.classList.remove('hidden');
        quizForm.reset();
      });
      
    } catch (error) {
      quizResults.innerHTML = `<div class="error">Error submitting quiz: ${error.message}</div>`;
      quizResults.classList.remove('hidden');
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const attackId = urlParams.get('id');
    
    if (attackId) {
        fetchAttackDetails(attackId);
    } else {
        displayError('Attack ID is missing');
    }
});

function fetchAttackDetails(attackId) {
    api.getAttackById(attackId)
        .then(attack => {
            displayAttackDetails(attack);
        })
        .catch(error => {
            console.error('Error fetching attack details:', error);
            displayError('Failed to load attack details. Please try again later.');
        });
}

function displayAttackDetails(attack) {
    const detailsContainer = document.getElementById('attack-details-container');
    
    if (!attack) {
        detailsContainer.innerHTML = '<p>Attack not found.</p>';
        return;
    }
    
    let html = `
        <div class="attack-header">
            <h1>${attack.name}</h1>
        </div>
        <div class="attack-content">
            <div class="attack-description">
                <h2>Description</h2>
                <p>${attack.description}</p>
            </div>
            <div class="attack-defense">
                <h2>Defense</h2>
                <p>${attack.defense}</p>
            </div>
        </div>
        <div class="related-quizzes">
            <h2>Test Your Knowledge</h2>
            <a href="quiz-details.html?attackId=${attack.id}" class="btn btn-primary">Take Quiz</a>
        </div>
    `;
    
    detailsContainer.innerHTML = html;
}

function displayError(message) {
    const detailsContainer = document.getElementById('attack-details-container');
    detailsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const attackId = urlParams.get('id');
  
  if (attackId) {
      fetchAttackDetails(attackId);
  } else {
      displayError('Attack ID is missing');
  }
});

// Sample data based on your document
const attacksData = [
  {
      id: 1,
      name: "Phishing Attack",
      shortDescription: "A deceptive attack where cybercriminals send fake emails or messages pretending to be trustworthy sources.",
      description: "Phishing is a deceptive attack where cybercriminals send fake emails or messages pretending to be trustworthy sources (like banks or companies) to trick victims into revealing sensitive information such as passwords or credit card numbers.",
      defense: "Always check sender details, avoid clicking suspicious links, and use anti-phishing filters in your email client or browser."
  },
  {
      id: 2,
      name: "Man-in-the-Middle (MitM) Attack",
      shortDescription: "An attack where a hacker secretly intercepts or alters communication between two parties.",
      description: "In a MitM attack, a hacker secretly intercepts or alters the communication between two parties, like between you and a website, often to steal credentials or sensitive data.",
      defense: "Use secure websites (HTTPS), enable VPNs on public Wi-Fi, and avoid accessing sensitive accounts over untrusted networks."
  },
  {
      id: 3,
      name: "Ransomware",
      shortDescription: "Malware that locks or encrypts your files and demands payment to unlock them.",
      description: "Ransomware is a type of malware that locks or encrypts your files and then demands payment (usually in cryptocurrency) to unlock them. Victims often lose access to personal or business data.",
      defense: "Regularly back up important files, avoid downloading unknown attachments, and keep your antivirus software up to date."
  },
  {
      id: 4,
      name: "SQL Injection",
      shortDescription: "An attack that targets web applications by inserting malicious SQL commands into input fields.",
      description: "This attack targets web applications by inserting malicious SQL commands into input fields to manipulate the database and gain unauthorized access to data.",
      defense: "Sanitize and validate user inputs, use parameterized queries (prepared statements), and avoid dynamic SQL in your code."
  },
  {
      id: 5,
      name: "Brute Force Attack",
      shortDescription: "An attack where hackers try every possible password combination to break into an account.",
      description: "A brute force attack is when hackers try every possible password or combination to break into an account or system. It's often automated and fast.",
      defense: "Use strong passwords (with letters, numbers, symbols), enable two-factor authentication, and set account lockout after several failed attempts."
  },
  {
      id: 6,
      name: "Cross-Site Scripting (XSS)",
      shortDescription: "Attacks that inject malicious JavaScript into web pages to run in users' browsers.",
      description: "XSS attacks occur when attackers inject malicious JavaScript into web pages, which then runs in users' browsers and can steal cookies or session tokens.",
      defense: "Sanitize user input, encode output, and use Content Security Policy (CSP) headers to limit what scripts can run."
  },
  {
      id: 7,
      name: "Denial-of-Service (DoS) Attack",
      shortDescription: "An attack that floods a server with traffic to make it unavailable to users.",
      description: "A DoS attack floods a server or network with too much traffic, making it slow or completely unavailable to real users. DDoS (Distributed DoS) uses multiple devices.",
      defense: "Implement firewalls, rate-limiting, and use cloud-based protection services like Cloudflare to absorb excess traffic."
  },
  {
    id: 8,
    name: "Credential Stuffing",
    shortDescription: "An attack that uses stolen username and password combinations to access other websites.",
    description: "In this attack, cybercriminals use lists of previously stolen usernames and passwords to try logging into other websites, hoping users reused the same credentials.",
        defense: "Never reuse passwords across sites, use a password manager, and enable multi-factor authentication (2FA) wherever possible."
    },
    {
      id: 9,
      name: "Zero-Day Exploit",
      shortDescription: "An attack that targets unknown software vulnerabilities before they can be patched.",
      description: "A zero-day exploit takes advantage of a previously unknown software vulnerability before the vendor has had time to release a fix, making it very dangerous.",
      defense: "Regularly update all software and operating systems, and use endpoint security tools that can detect unusual behavior."
  },
  {
      id: 10,
      name: "Eavesdropping (Sniffing)",
      shortDescription: "An attack where attackers secretly capture data being transmitted over a network.",
      description: "Eavesdropping or packet sniffing happens when attackers secretly capture data being transmitted over a network, especially on unsecured Wi-Fi.",
      defense: "Use encryption (HTTPS and VPN), and avoid sending sensitive information over open or public Wi-Fi networks."
  }
];

function fetchAttackDetails(attackId) {
  // If you have a backend API, use:
  // api.getAttackById(attackId)
  //     .then(attack => {
  //         displayAttackDetails(attack);
  //     })
  //     .catch(error => {
  //         console.error('Error fetching attack details:', error);
  //         displayError('Failed to load attack details. Please try again later.');
  //     });
  
  // If you don't have a backend yet, use the sample data:
  setTimeout(() => {
      const attack = attacksData.find(a => a.id === parseInt(attackId));
      if (attack) {
          displayAttackDetails(attack);
      } else {
          displayError('Attack not found');
      }
  }, 500); // Simulate loading time
}

function displayAttackDetails(attack) {
  const detailsContainer = document.getElementById('attack-details-container');
  
  if (!attack) {
      detailsContainer.innerHTML = '<p>Attack not found.</p>';
      return;
  }
  
  document.title = `${attack.name} | CyberDefender`;
  
  let html = `
      <div class="attack-header">
          <h1>${attack.name}</h1>
      </div>
      <div class="attack-content">
          <div class="attack-description">
              <h2>Description</h2>
              <p>${attack.description}</p>
          </div>
          <div class="attack-defense">
              <h2>Defense</h2>
              <p>${attack.defense}</p>
          </div>
      </div>
      <div class="related-quizzes">
          <h2>Test Your Knowledge</h2>
          <a href="quiz-details.html?attackId=${attack.id}" class="btn btn-primary">Take Quiz</a>
      </div>
  `;
  
  detailsContainer.innerHTML = html;
}

function displayError(message) {
  const detailsContainer = document.getElementById('attack-details-container');
  detailsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
document.addEventListener('DOMContentLoaded', function() {
  // Get attack ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const attackId = urlParams.get('id');
  
  if (!attackId) {
      document.querySelector('.attack-details-container').innerHTML = '<p>No attack specified</p>';
      return;
  }
  
  // Fetch attack details from the API
  fetchAttackDetails(attackId);
});

async function fetchAttackDetails(attackId) {
  try {
      const response = await fetch(`/api/attacks/${attackId}`);
      if (!response.ok) {
          throw new Error('Failed to fetch attack details');
      }
      
      const attack = await response.json();
      displayAttackDetails(attack);
  } catch (error) {
      console.error('Error:', error);
      document.querySelector('.attack-details-container').innerHTML = 
          `<p class="error">Error loading attack details: ${error.message}</p>`;
  }
}

function displayAttackDetails(attack) {
  // Display basic attack information
  document.getElementById('attack-title').textContent = attack.name;
  document.getElementById('attack-description').innerHTML = attack.description;
  
  // Display the video based on the attack type
  displayVideoForAttack(attack.name);
}

function displayVideoForAttack(attackName) {
  const videoPlayer = document.getElementById('video-player');
  let videoFileName;
  
  // Map attack names to video filenames
  switch(attackName.toLowerCase()) {
      case 'phishing attack':
      case 'phishing':
          videoFileName = 'phishing.mp4';
          break;
      case 'man-in-the-middle attack':
      case 'man-in-the-middle':
      case 'mitm attack':
      case 'mitm':
          videoFileName = 'mitm.mp4';
          break;
      case 'ransomware':
      case 'ransomware attack':
          videoFileName = 'ransomware.mp4';
          break;
      case 'sql injection':
      case 'sql injection attack':
          videoFileName = 'sql-injection.mp4';
          break;
      case 'brute force attack':
      case 'brute force':
          videoFileName = 'brute-force.mp4';
          break;
      case 'cross-site scripting':
      case 'cross-site scripting attack':
      case 'xss':
      case 'xss attack':
          videoFileName = 'xss.mp4';
          break;
      case 'denial-of-service attack':
      case 'denial-of-service':
      case 'dos attack':
      case 'dos':
          videoFileName = 'dos.mp4';
          break;
      case 'credential stuffing':
      case 'credential stuffing attack':
          videoFileName = 'credential-stuffing.mp4';
          break;
      case 'zero-day exploit':
      case 'zero-day':
      case 'zero day exploit':
          videoFileName = 'zero-day.mp4';
          break;
      case 'eavesdropping':
      case 'sniffing':
      case 'eavesdropping attack':
      case 'sniffing attack':
          videoFileName = 'eavesdropping.mp4';
          break;
      default:
          videoFileName = null;
  }
  
  if (videoFileName) {
      videoPlayer.innerHTML = `
          <video controls width="100%">
              <source src="assets/videos/${videoFileName}" type="video/mp4">
              Your browser does not support the video tag.
          </video>
      `;
      document.getElementById('video-container').style.display = 'block';
  } else {
      // Hide video container if no matching video is found
      document.getElementById('video-container').style.display = 'none';
  }
}