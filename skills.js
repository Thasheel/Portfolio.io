// 3D Skills Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Create a skills section if it doesn't exist
    let skillsSection = document.getElementById('skills-container');
    if (!skillsSection) {
        skillsSection = document.createElement('div');
        skillsSection.id = 'skills-container';
        document.querySelector('.about-content').appendChild(skillsSection);
    }
    
    // Array of skills to display
    const skills = [
        { name: 'HTML', level: 90 },
        { name: 'CSS', level: 85 },
        { name: 'Java', level: 80 },
        { name: 'Bootstrap', level: 75 },
        { name: 'MongoDB', level: 70 },
        { name: 'Python', level: 65 },
        { name: 'Django', level: 60 },
        { name: 'AWS', level: 55 },
        { name: 'Azure', level: 50 },
        { name: 'UI', level: 60 },
        { name: 'UX', level: 45 },
        { name: 'GITHUB', level: 75 },
        { name: 'JENKINS', level: 55 },
        // { name: 'SASS', level: 80 },
        // { name: 'Firebase', level: 70 },
        // { name: 'Godot', level: 40 },
        // { name: 'Flutter', level: 50 },
        // { name: 'Ionic', level: 45 }
    ];

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

    // Create a sphere of skills
    function createSkillsSphere() {
        const items = [];
        skills.forEach((skill, index) => {
            // Create skill element
            const item = document.createElement('div');
            item.className = 'skill-item';
            item.textContent = skill.name;
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
                color: var(--primary-color);
                text-shadow: 0 0 10px rgba(10, 224, 160, 0.3);
                cursor: default;
                user-select: none;
                font-weight: bold;
                transition: all 0.2s ease;
                letter-spacing: 1px;
                font-family: 'Courier New', monospace;
                white-space: nowrap;
            }
            
            .skill-item:hover {
                color: #ffffff;
                text-shadow: 0 0 15px rgba(10, 224, 160, 0.8);
                transform: translate(-50%, -50%) scale(1.2);
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