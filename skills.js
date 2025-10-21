// 3D Skills Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Create a skills section if it doesn't exist
    let skillsSection = document.getElementById('skills-container');
    if (!skillsSection) {
        skillsSection = document.createElement('div');
        skillsSection.id = 'skills-container';
        document.querySelector('.about-content').appendChild(skillsSection);
    }
    
    // Array of skills to display with Font Awesome icon classes
    const skills = [
        { name: 'HTML', icon: 'fab fa-html5', level: 90 },
        { name: 'CSS', icon: 'fab fa-css3-alt', level: 85 },
        { name: 'Java', icon: 'fab fa-java', level: 80 },
        { name: 'Bootstrap', icon: 'fab fa-bootstrap', level: 75 },
        { name: 'MongoDB', icon: 'fas fa-database', level: 70 },
        { name: 'Python', icon: 'fab fa-python', level: 65 },
        { name: 'Django', icon: 'fas fa-leaf', level: 60 }, // No official FA icon, using leaf
        { name: 'AWS', icon: 'fab fa-aws', level: 55 },
        { name: 'Azure', icon: 'fab fa-microsoft', level: 50 },
        { name: 'UI', icon: 'fas fa-paint-brush', level: 60 },
        { name: 'UX', icon: 'fas fa-user-astronaut', level: 45 },
        { name: 'GITHUB', icon: 'fab fa-github', level: 75 },
        { name: 'JENKINS', icon: 'fas fa-cogs', level: 55 },
          { name: 'Svelte', icon: 'fas fa-code', level: 70 },
    ];

    // Mapping of icon names to brand colors
    const skillColors = {
        'html5': '#e34f26',
        'css3-alt': '#1572b6',
        'java': '#007396',
        'bootstrap': '#7952b3',
        'database': '#47A248',
        'python': '#3776ab',
        'leaf': '#092e20',
        'aws': '#ff9900',
        'microsoft': '#0078d4',
        'paint-brush': '#e67e22',
        'user-astronaut': '#6e5494',
        'github': '#181717',
        'cogs': '#d24939'
    };

    // Responsive configuration
    function getConfig() {
        // Adjust radius and depth based on container width
        const containerWidth = skillsSection.clientWidth;
        const containerHeight = skillsSection.clientHeight;
        const isSmallScreen = window.innerWidth <= 768;
        
        return {
            container: skillsSection,
            radius: isSmallScreen ? 150 : Math.min(containerWidth, containerHeight) * 0.35,
            speed: 0.2, // Slower rotation speed
            depth: isSmallScreen ? 200 : Math.min(containerWidth, containerHeight) * 0.5,
            maxFontSize: isSmallScreen ? 24 : 28, // Font size
            minFontSize: isSmallScreen ? 12 : 14
        };
    }

    // Get initial config
    let config = getConfig();

    function getRandomColor() {
        // Generate a random hex color
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    // Create a sphere of skills
    function createSkillsSphere() {
        const items = [];
        skills.forEach((skill, index) => {
            // Create skill element
            const item = document.createElement('div');
            item.className = 'skill-item';
            // Add icon
            const icon = document.createElement('i');
            icon.className = skill.icon + ' skill-icon skill-' + skill.icon.split(' ').pop();
            icon.title = skill.name;
            // Apply professional colors directly as inline styles
            const iconClass = skill.icon.split(' ').pop();
            if (skillColors[iconClass]) {
                icon.style.color = skillColors[iconClass];
            }
            item.appendChild(icon);
            // Optionally add label below icon
            // const label = document.createElement('div');
            // label.className = 'skill-label';
            // label.textContent = skill.name;
            // item.appendChild(label);
            config.container.appendChild(item);
            // Set initial position with better distribution
            const phi = Math.acos(-1 + (2 * index) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            // Store position data
            items.push({
                element: item,
                phi: phi,
                theta: theta,
                x: config.radius * Math.cos(theta) * Math.sin(phi),
                y: config.radius * Math.sin(theta) * Math.sin(phi),
                z: config.radius * Math.cos(phi),
                level: skill.level
            });
        });
        return items;
    }

    // Create and append stylesheet
    function createStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            .skill-item {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                cursor: default;
                user-select: none;
                font-weight: bold;
                transition: all 0.2s ease;
                letter-spacing: 1px;
                font-family: 'Courier New', monospace;
                white-space: nowrap;
            }
            .skill-icon {
                font-size: 2.2em;
                transition: transform 0.2s, filter 0.2s, color 0.2s;
                display: block;
                margin: 0 auto;
            }
            .skill-html5 { color: #e34f26 !important; }         /* HTML5 orange */
            .skill-css3-alt { color: #1572b6 !important; }      /* CSS3 blue */
            .skill-java { color: #007396 !important; }          /* Java blue */
            .skill-bootstrap { color: #7952b3 !important; }     /* Bootstrap purple */
            .skill-database { color: #47A248 !important; }      /* MongoDB green */
            .skill-python { color: #3776ab !important; }        /* Python blue */
            .skill-leaf { color: #092e20 !important; }          /* Django green-black */
            .skill-aws { color: #ff9900 !important; }           /* AWS orange */
            .skill-microsoft { color: #0078d4 !important; }     /* Azure blue */
            .skill-paint-brush { color: #e67e22 !important; }   /* UI orange */
            .skill-user-astronaut { color: #6e5494 !important; }/* UX purple (using GitHub purple) */
            .skill-github { color: #181717 !important; }        /* GitHub black */
            .skill-cogs { color: #d24939 !important; }          /* Jenkins red */
            .skill-item:hover .skill-icon {
                filter: drop-shadow(0 0 12px currentColor);
                transform: scale(1.25) rotate(-8deg);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize the skill items
    createStylesheet();
    let items = createSkillsSphere();
    
    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let autoRotate = true; // Auto-rotate even without mouse movement
    let autoRotateSpeed = 0.0015; // Speed of auto rotation
    
    // Update positions based on animation frame
    function updatePositions() {
        // Smooth mouse movement
        targetMouseX = targetMouseX * 0.9 + mouseX * 0.1;
        targetMouseY = targetMouseY * 0.9 + mouseY * 0.1;
        
        // Auto rotate if no mouse movement
        if (autoRotate) {
            targetMouseX += autoRotateSpeed;
        }
        
        items.forEach(item => {
            // Rotate based on mouse position
            item.theta += config.speed / 100;
            
            // Calculate new 3D position
            item.x = config.radius * Math.cos(item.theta + targetMouseX / 20) * Math.sin(item.phi + targetMouseY / 20);
            item.y = config.radius * Math.sin(item.theta + targetMouseX / 20) * Math.sin(item.phi + targetMouseY / 20);
            item.z = config.radius * Math.cos(item.phi + targetMouseY / 20) + config.depth;
            
            // Apply perspective and scale based on z position
            const perspective = config.depth / (config.depth + item.z);
            const scale = perspective * (item.level / 40); // Adjusted scale based on skill level
            
            // Calculate font size based on perspective and skill level
            const fontSize = Math.max(config.minFontSize, 
                                    Math.min(config.maxFontSize, 
                                           config.minFontSize + (config.maxFontSize - config.minFontSize) * perspective * (item.level / 100)));
            
            // Apply styles
            const transformStyle = `translate(-50%, -50%) translate3d(${item.x}px, ${item.y}px, 0) scale(${scale})`;
            const opacityValue = perspective;
            
            item.element.style.transform = transformStyle;
            item.element.style.opacity = opacityValue;
            item.element.style.zIndex = Math.floor(item.z);
            item.element.style.fontSize = `${fontSize}px`;
        });
        
        requestAnimationFrame(updatePositions);
    }
    
    // Mouse move event handler
    function handleMouseMove(e) {
        // Check if mouse is over the container
        const container = config.container.getBoundingClientRect();
        
        if (
            e.clientX >= container.left &&
            e.clientX <= container.right &&
            e.clientY >= container.top &&
            e.clientY <= container.bottom
        ) {
            const centerX = container.width / 2;
            const centerY = container.height / 2;
            
            // Calculate mouse position relative to center of container
            mouseX = ((e.clientX - container.left) - centerX) / centerX;
            mouseY = ((e.clientY - container.top) - centerY) / centerY;
            
            // Disable auto-rotate when user interacts
            if (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01) {
                autoRotate = false;
                // Re-enable auto-rotate after 3 seconds of inactivity
                clearTimeout(window.autoRotateTimeout);
                window.autoRotateTimeout = setTimeout(() => {
                    autoRotate = true;
                }, 3000);
            }
        }
    }
    
    // Handle window resize
    function handleResize() {
        // Clear all existing skill items
        while (skillsSection.firstChild) {
            skillsSection.removeChild(skillsSection.firstChild);
        }
        
        // Update configuration
        config = getConfig();
        
        // Recreate skill items
        items = createSkillsSphere();
    }
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start animation
    updatePositions();
}); 