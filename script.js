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