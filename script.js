// Typing effect
const typingText = document.querySelector('.typing-text');
const text = 'a Developer';
let charIndex = 0;

function type() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    }
}

// Start typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    type();
});

// Update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Show more projects functionality
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('show-more-btn');
    
    // This is a placeholder for additional projects that would be shown
    // In a real implementation, these would likely be loaded from a database or JSON file
    const additionalProjects = [
        {
            title: 'Project Five 🎮',
            description: 'A brief description of your fifth project goes here. Explain what it does and why it is interesting.',
            sourceLink: '#',
            demoLink: '#',
            technologies: ['HTML', 'CSS', 'JS']
        },
        {
            title: 'Project Six 📊',
            description: 'A brief description of your sixth project goes here. Explain what it does and why it is interesting.',
            sourceLink: '#',
            demoLink: '#',
            technologies: ['React', 'Node.js', 'MongoDB']
        },
        {
            title: 'Project Seven 🔧',
            description: 'A brief description of your seventh project goes here. Explain what it does and why it is interesting.',
            sourceLink: '#',
            demoLink: '#',
            technologies: ['Python', 'Django', 'PostgreSQL']
        },
        {
            title: 'Project Eight 🚀',
            description: 'A brief description of your eighth project goes here. Explain what it does and why it is interesting.',
            sourceLink: '#',
            demoLink: '#',
            technologies: ['Vue.js', 'Express', 'MySQL']
        }
    ];
    
    let projectsVisible = false;
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            const projectsGrid = document.querySelector('.projects-grid');
            
            if (!projectsVisible) {
                // Add additional projects
                additionalProjects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    
                    projectCard.innerHTML = `
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-links">
                            <a href="${project.sourceLink}" class="project-link">Source</a>
                            <a href="${project.demoLink}" class="project-link">Demo</a>
                        </div>
                        <div class="project-tech">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                        <a href="#" class="arrow-link">→</a>
                    `;
                    
                    projectsGrid.appendChild(projectCard);
                });
                
                showMoreBtn.textContent = 'Show Less';
                projectsVisible = true;
            } else {
                // Remove the additional projects
                const projectCards = document.querySelectorAll('.project-card');
                
                // Remove only the additional cards
                for (let i = projectCards.length - 1; i >= 4; i--) {
                    projectCards[i].remove();
                }
                
                showMoreBtn.textContent = 'Show More';
                projectsVisible = false;
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add fade-in animation for sections when scrolling
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});

// Contact Form Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');
    const sayHelloLinks = document.querySelectorAll('a[href="mailto:mohdthasheelok@gmail.com"]');

    // Function to open modal
    function openModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Open modal when clicking "Say Hello!" links
    sayHelloLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send data to backend
            const response = await fetch('http://localhost:8000/api/contact/submit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <h3>Thank you for your message!</h3>
                    <p>I'll get back to you as soon as possible.</p>
                `;
                
                // Replace form with success message
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    closeModal();
                    // Reset form and restore original form after modal is closed
                    setTimeout(() => {
                        contactForm.innerHTML = `
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">Send Message</button>
                        `;
                    }, 300);
                }, 3000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = error.message || 'Failed to send message. Please try again.';
            
            // Insert error message after the form
            contactForm.insertAdjacentElement('afterend', errorMessage);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        } finally {
            // Reset button state
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        }
    });
}); 