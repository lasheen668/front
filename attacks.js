document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    const attackForm = document.getElementById('attackForm');
    const messageDiv = document.getElementById('message');
    
    attackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const type = document.getElementById('attackType').value;
        const description = document.getElementById('description').value;
        
        // Validate form
        if (!type || !description) {
            showMessage('Please fill all fields', 'error');
            return;
        }
        
        // Prepare data to send
        const attackData = {
            type: type,
            description: description,
            reportedBy: userId
        };
        
        try {
            // Send request to backend
            const response = await fetch('/api/attacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(attackData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('Attack report submitted successfully!', 'success');
                attackForm.reset();
            } else {
                showMessage(data.message || 'Failed to submit attack report', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Server error. Please try again later.', 'error');
        }
    });
    
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
async function loadAttacks() {
    try {
        const response = await fetch('/api/attacks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load attacks');
        }
        
        const attacks = await response.json();
        const attacksContainer = document.getElementById('attacksList');
        attacksContainer.innerHTML = '';
        
        if (attacks.length === 0) {
            attacksContainer.innerHTML = '<p>No attack reports found.</p>';
            return;
        }
        
        // Create a table to display attacks
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        attacks.forEach(attack => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${attack.type}</td>
                <td>${attack.description}</td>
                <td>
                    <a href="edit-attack.html?id=${attack._id}" class="btn btn-sm btn-primary">Edit</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        attacksContainer.appendChild(table);
        
    } catch (error) {
        console.error('Error loading attacks:', error);
        showMessage('Could not load attack reports. Please try again later.', 'error');
    }
}

// Call this function when the page loads
loadAttacks();
async function loadAttacks() {
    try {
        const response = await fetch('/api/attacks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load attacks');
        }
        
        const attacks = await response.json();
        const attacksContainer = document.getElementById('attacksList');
        attacksContainer.innerHTML = '';
        
        if (attacks.length === 0) {
            attacksContainer.innerHTML = '<p>No attack reports found.</p>';
            return;
        }
        
        // Create a table to display attacks
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        attacks.forEach(attack => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${attack.type}</td>
                <td>${attack.description}</td>
                <td>
                    <a href="edit-attack.html?id=${attack._id}" class="btn btn-sm btn-primary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${attack._id}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        attacksContainer.appendChild(table);
        
        // Add event listeners to delete buttons
        addDeleteEventListeners();
        
    } catch (error) {
        console.error('Error loading attacks:', error);
        showMessage('Could not load attack reports. Please try again later.', 'error');
    }
}

// Function to add event listeners to delete buttons
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const attackId = this.getAttribute('data-id');
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to delete this attack report?')) {
                deleteAttack(attackId);
            }
        });
    });
}

// Function to delete an attack
async function deleteAttack(attackId) {
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
        
        // Show success message
        showMessage('Attack deleted successfully', 'success');
        
        // Reload attacks list
        loadAttacks();
        
    } catch (error) {
        console.error('Error deleting attack:', error);
        showMessage(error.message || 'Error deleting attack. Please try again.', 'error');
    }
}
async function loadAttacks() {
    try {
        // Check for messages from other pages
        checkForMessages();
        
        const response = await fetch('/api/attacks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load attacks');
        }
        
        const attacks = await response.json();
        const attacksContainer = document.getElementById('attacksList');
        attacksContainer.innerHTML = '';
        
        if (attacks.length === 0) {
            attacksContainer.innerHTML = '<p>No attack reports found.</p>';
            return;
        }
        
        // Create a table to display attacks
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        attacks.forEach(attack => {
            // Truncate description for the table
            const shortDesc = attack.description && attack.description.length > 50 
                ? attack.description.substring(0, 50) + '...' 
                : attack.description || 'No description';
                
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${attack.type}</td>
                <td>${shortDesc}</td>
                <td>
                    <a href="attack-details.html?id=${attack._id}" class="btn btn-sm btn-info">View</a>
                    <a href="edit-attack.html?id=${attack._id}" class="btn btn-sm btn-primary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${attack._id}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        attacksContainer.appendChild(table);
        
        // Add event listeners to delete buttons
        addDeleteEventListeners();
        
    } catch (error) {
        console.error('Error loading attacks:', error);
        showMessage('Could not load attack reports. Please try again later.', 'error');
    }
}

// Add this function to your attacks.js file
function checkForMessages() {
    const message = localStorage.getItem('message');
    const messageType = localStorage.getItem('messageType');
    
    if (message) {
        showMessage(message, messageType || 'info');
        
        // Clear the message from localStorage
        localStorage.removeItem('message');
        localStorage.removeItem('messageType');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // DOM elements
    const attackForm = document.getElementById('attackForm');
    const messageDiv = document.getElementById('message');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const pageNumbers = document.getElementById('pageNumbers');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    // Pagination state
    let currentPage = 1;
    let totalPages = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value);
    
    // Event listeners
    attackForm.addEventListener('submit', handleFormSubmit);
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    itemsPerPageSelect.addEventListener('change', handleItemsPerPageChange);
    
    // Check for messages from other pages
    checkForMessages();
    
    // Load initial data
    loadAttacks(currentPage, itemsPerPage);
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const type = document.getElementById('attackType').value;
        const description = document.getElementById('description').value;
        
        // Validate form
        if (!type || !description) {
            showMessage('Please fill all fields', 'error');
            return;
        }
        
        // Prepare data to send
        const attackData = {
            type: type,
            description: description,
            reportedBy: userId
        };
        
        try {
            // Send request to backend
            const response = await fetch('/api/attacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(attackData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showMessage('Attack report submitted successfully!', 'success');
                attackForm.reset();
                
                // Reload the attacks list to show the new entry
                loadAttacks(currentPage, itemsPerPage);
            } else {
                showMessage(data.message || 'Failed to submit attack report', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Server error. Please try again later.', 'error');
        }
    }
    
    // Function to load and display all attacks with pagination
    async function loadAttacks(page, limit) {
        try {
            const response = await fetch(`/api/attacks?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load attacks');
            }
            
            const data = await response.json();
            const { docs: attacks, totalDocs, page: currentPageFromServer, totalPages: totalPagesFromServer, limit } = data;
            
            // Update pagination state
            currentPage = currentPageFromServer;
            totalPages = totalPagesFromServer;
            
            // Update UI with attack data
            updateAttacksUI(attacks);
            
            // Update pagination controls
            updatePaginationControls();
            
        } catch (error) {
            console.error('Error loading attacks:', error);
            showMessage('Could not load attack reports. Please try again later.', 'error');
        }
    }
    
    // Function to update the attacks table UI
    function updateAttacksUI(attacks) {
        const attacksContainer = document.getElementById('attacksList');
        attacksContainer.innerHTML = '';
        
        if (attacks.length === 0) {
            attacksContainer.innerHTML = '<p>No attack reports found.</p>';
            return;
        }
        
        // Create a table to display attacks
        const table = document.createElement('table');
        table.className = 'data-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        attacks.forEach(attack => {
            // Format reporter name
            const reporter = attack.reportedBy 
                ? (attack.reportedBy.name || attack.reportedBy.username || attack.reportedBy.email || 'Unknown')
                : 'Unknown';
                
            // Format date
            const date = attack.createdAt 
                ? new Date(attack.createdAt).toLocaleDateString()
                : 'Unknown';
                
            // Truncate description for the table
            const shortDesc = attack.description && attack.description.length > 30 
                ? attack.description.substring(0, 30) + '...' 
                : attack.description || 'No description';
                
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${attack.type}</td>
                <td>${shortDesc}</td>
                <td>${reporter}</td>
                <td>${date}</td>
                <td>
                    <a href="attack-details.html?id=${attack._id}" class="btn btn-sm btn-info">View</a>
                    <a href="edit-attack.html?id=${attack._id}" class="btn btn-sm btn-primary">Edit</a>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${attack._id}">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        attacksContainer.appendChild(table);
        
        // Add event listeners to delete buttons
        addDeleteEventListeners();
    }
    
    // Function to update pagination controls
    function updatePaginationControls() {
        // Update page info text
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Enable/disable prev/next buttons
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // Generate page number buttons
        pageNumbers.innerHTML = '';
        
        // Determine range of page numbers to display
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add first page button if not already in range
        if (startPage > 1) {
            addPageButton(1);
            
            if (startPage > 2) {
                // Add ellipsis if there's a gap
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
        }
        
        // Add page number buttons
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i);
        }
        
        // Add last page button if not already in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                // Add ellipsis if there's a gap
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                pageNumbers.appendChild(ellipsis);
            }
            
            addPageButton(totalPages);
        }
    }
    
    // Function to add a page number button
    function addPageButton(pageNum) {
        const button = document.createElement('button');
        button.textContent = pageNum;
        button.className = `page-btn ${pageNum === currentPage ? 'active' : ''}`;
        button.addEventListener('click', () => goToPage(pageNum));
        pageNumbers.appendChild(button);
    }
    
    // Function to navigate to a specific page
    function goToPage(pageNum) {
        if (pageNum < 1 || pageNum > totalPages || pageNum === currentPage) {
            return;
        }
        
        // Update current page and load data
        currentPage = pageNum;
        loadAttacks(currentPage, itemsPerPage);
    }
    
    // Function to handle items per page change
    function handleItemsPerPageChange() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1; // Reset to first page
        loadAttacks(currentPage, itemsPerPage);
    }
    
    // Function to add event listeners to delete buttons
    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const attackId = this.getAttribute('data-id');
                
                // Show confirmation dialog
                if (confirm('Are you sure you want to delete this attack report?')) {
                    deleteAttack(attackId);
                }
            });
        });
    }
    
    // Function to delete an attack
    async function deleteAttack(attackId) {
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
            
            // Show success message
            showMessage('Attack deleted successfully', 'success');
            
            // Reload attacks list (with current page and limit)
            // If the current page has no items after deletion, go to previous page
            loadAttacks(currentPage, itemsPerPage);
            
        } catch (error) {
            console.error('Error deleting attack:', error);
            showMessage(error.message || 'Error deleting attack. Please try again.', 'error');
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
    
    // Function to check for messages from other pages
    function checkForMessages() {
        const message = localStorage.getItem('message');
        const messageType = localStorage.getItem('messageType');
        
        if (message) {
            showMessage(message, messageType || 'info');
            
            // Clear the message from localStorage
            localStorage.removeItem('message');
            localStorage.removeItem('messageType');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    fetchAllAttacks();
  });
  
  async function fetchAllAttacks() {
    const attacksList = document.getElementById('attacks-list');
    
    try {
      const attacks = await getAllAttacks();
      
      if (attacks.length === 0) {
        attacksList.innerHTML = '<p>No attacks available.</p>';
        return;
      }
      
      let attacksHTML = '<div class="attacks-grid">';
      
      attacks.forEach(attack => {
        attacksHTML += `
          <div class="attack-card ${attack.severity.toLowerCase()}">
            <h3>${attack.name}</h3>
            <div class="attack-meta">
              <span class="attack-severity">Severity: ${attack.severity}</span>
              <span class="attack-category">Category: ${attack.category}</span>
            </div>
            <p class="attack-preview">${truncateText(attack.description, 120)}</p>
            <a href="attack-details.html?id=${attack._id}" class="btn-small">Learn More</a>
          </div>
        `;
      });
      
      attacksHTML += '</div>';
      attacksList.innerHTML = attacksHTML;
      
    } catch (error) {
      attacksList.innerHTML = `<div class="error">Error loading attacks: ${error.message}</div>`;
    }
  }
  
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  document.addEventListener('DOMContentLoaded', function() {
    fetchAttacks();
});

function fetchAttacks() {
    // Assuming you have an API endpoint to fetch all attacks
    api.getAllAttacks()
        .then(attacks => {
            displayAttacks(attacks);
        })
        .catch(error => {
            console.error('Error fetching attacks:', error);
            displayError('Failed to load attacks. Please try again later.');
        });
}

function displayAttacks(attacks) {
    const attacksContainer = document.getElementById('attacks-container');
    
    if (!attacks || attacks.length === 0) {
        attacksContainer.innerHTML = '<p>No attacks found.</p>';
        return;
    }
    
    let html = '<div class="attacks-grid">';
    
    attacks.forEach(attack => {
        html += `
            <div class="attack-card">
                <h3>${attack.name}</h3>
                <p>${attack.shortDescription}</p>
                <a href="attack-details.html?id=${attack.id}" class="btn">Learn More</a>
            </div>
        `;
    });
    
    html += '</div>';
    attacksContainer.innerHTML = html;
}

function displayError(message) {
    const attacksContainer = document.getElementById('attacks-container');
    attacksContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
document.addEventListener('DOMContentLoaded', function() {
    fetchAttacks();
});

// If you don't have a backend API yet, you can use this sample data
// based on your document content
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

function fetchAttacks() {
    // If you have a backend API, use:
    // api.getAllAttacks()
    //     .then(attacks => {
    //         displayAttacks(attacks);
    //     })
    //     .catch(error => {
    //         console.error('Error fetching attacks:', error);
    //         displayError('Failed to load attacks. Please try again later.');
    //     });
    
    // If you don't have a backend yet, use the sample data:
    setTimeout(() => {
        displayAttacks(attacksData);
    }, 500); // Simulate loading time
}

function displayAttacks(attacks) {
    const attacksContainer = document.getElementById('attacks-container');
    
    if (!attacks || attacks.length === 0) {
        attacksContainer.innerHTML = '<p>No attacks found.</p>';
        return;
    }
    
    let html = '<div class="attacks-grid">';
    
    attacks.forEach(attack => {
        html += `
            <div class="attack-card">
                <h3>${attack.name}</h3>
                <p>${attack.shortDescription}</p>
                <a href="attack-details.html?id=${attack.id}" class="btn">Learn More</a>
            </div>
        `;
    });
    
    html += '</div>';
    attacksContainer.innerHTML = html;
}

function displayError(message) {
    const attacksContainer = document.getElementById('attacks-container');
    attacksContainer.innerHTML = `<div class="error-message">${message}</div>`;
}