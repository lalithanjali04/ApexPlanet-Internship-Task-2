document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submissionsPanel = document.getElementById('submissionsPanel');
    const submissionsList = document.getElementById('submissionsList');
    const toggleSubmissions = document.getElementById('toggleSubmissions');
    const submissionCount = document.getElementById('submissionCount');
    
    // Load submissions from localStorage
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    updateSubmissionCount();
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Create submission object
            const submission = {
                id: Date.now(),
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                department: document.getElementById('department').value,
                message: document.getElementById('message').value.trim(),
                subscribe: document.getElementById('subscribe').checked,
                date: new Date().toISOString()
            };
            
            // Add to submissions array
            submissions.unshift(submission);
            
            // Save to localStorage
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // Update UI
            updateSubmissionCount();
            showSuccessMessage();
            contactForm.reset();
            
            // If submissions panel is open, refresh the list
            if (submissionsList.style.display === 'block') {
                displaySubmissions();
            }
        }
    });
    
    // Toggle submissions visibility
    toggleSubmissions.addEventListener('click', function() {
        if (submissionsList.style.display === 'block') {
            submissionsList.style.display = 'none';
            toggleSubmissions.innerHTML = '<i class="fas fa-eye"></i> View Submissions';
        } else {
            displaySubmissions();
            submissionsList.style.display = 'block';
            toggleSubmissions.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Submissions';
        }
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        resetErrors();
        
        // Name validation
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            showError('name', 'Please enter your name');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email').value.trim();
        if (email === '') {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Message validation
        const message = document.getElementById('message').value.trim();
        if (message === '') {
            showError('message', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message should be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Add error class to input
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function resetErrors() {
        // Remove all error classes and messages
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }
    
    function showSuccessMessage() {
        // Create success message if it doesn't exist
        let successMsg = contactForm.querySelector('.success-message');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Thank you!</strong> Your message has been submitted successfully.
            `;
            contactForm.insertBefore(successMsg, contactForm.firstChild);
        }
        
        // Show message
        successMsg.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }
    
    function updateSubmissionCount() {
        submissionCount.textContent = `(${submissions.length})`;
    }
    
    function displaySubmissions() {
        submissionsList.innerHTML = '';
        
        if (submissions.length === 0) {
            submissionsList.innerHTML = '<p>No submissions yet</p>';
            return;
        }
        
        submissions.forEach(sub => {
            const submissionItem = document.createElement('div');
            submissionItem.className = 'submission-item';
            submissionItem.innerHTML = `
                <h4>${sub.name} <small>${new Date(sub.date).toLocaleString()}</small></h4>
                <p><strong>Email:</strong> ${sub.email}</p>
                ${sub.phone ? `<p><strong>Phone:</strong> ${sub.phone}</p>` : ''}
                ${sub.department ? `<p><strong>Department:</strong> ${sub.department}</p>` : ''}
                <p><strong>Message:</strong> ${sub.message}</p>
                <p><strong>Subscribed:</strong> ${sub.subscribe ? 'Yes' : 'No'}</p>
            `;
            submissionsList.appendChild(submissionItem);
        });
    }
});