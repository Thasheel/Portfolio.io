// 3D Network Background
document.addEventListener('DOMContentLoaded', function() {
    // Create a canvas element and append it to the body
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    document.body.appendChild(canvas);
    
    // Apply styles to the canvas to make it fill the entire screen as a background
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '1';
    
    // Get the canvas context for drawing
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Configuration
    const config = {
        particleCount: 70,
        particleColor: 'rgba(255, 255, 255, 0.7)',
        lineColor: 'rgba(10, 224, 160, 0.15)', // Match the primary color with transparency
        particleRadius: 2,
        lineWidth: 1,
        maxDistance: 170,
        animationSpeed: 0.05,
        mouseMoveEnabled: true,
        mouseParticle: { x: null, y: null, vx: 0, vy: 0, radius: 3 },
        depth: true, // Enable 3D depth effect
        depthFactor: 0.3 // How much the depth affects particle size and opacity
    };
    
    // Array to store particles
    let particles = [];
    
    // Function to create a particle
    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 2 - 1, // z-coordinate for depth (-1 to 1)
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            vz: Math.random() * 0.02 - 0.01, // Slower movement in z direction
            radius: config.particleRadius,
            originalRadius: config.particleRadius
        };
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(createParticle());
        }
    }
    
    // Draw a particle
    function drawParticle(particle) {
        // Apply depth effect
        let radius = particle.radius;
        let opacity = 1;
        
        if (config.depth) {
            // Particles with z > 0 are closer (larger and more opaque)
            // Particles with z < 0 are further (smaller and more transparent)
            const depthScale = 1 + (particle.z * config.depthFactor);
            radius = particle.originalRadius * depthScale;
            opacity = 0.5 + (particle.z + 1) * 0.25; // Map z from [-1,1] to [0.5,1]
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = config.particleColor;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // Draw a line between two particles
    function drawLine(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.maxDistance) {
            // Calculate line opacity based on distance and particle depths
            let lineOpacity = 1 - (distance / config.maxDistance);
            
            if (config.depth) {
                // Adjust opacity based on both particles' z positions
                // Lines between particles at similar depths are more visible
                const depthDifference = Math.abs(p1.z - p2.z);
                lineOpacity *= (1 - depthDifference * 0.5);
            }
            
            ctx.globalAlpha = lineOpacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = config.lineWidth;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
    
    // Update particle positions
    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            
            // Bounce off the edges (x and y)
            if (p.x < 0 || p.x > width) p.vx = -p.vx;
            if (p.y < 0 || p.y > height) p.vy = -p.vy;
            
            // Bounce off depth boundaries (z)
            if (p.z < -1 || p.z > 1) p.vz = -p.vz;
        }
        
        // Update mouse particle
        if (config.mouseParticle.x !== null && config.mouseParticle.y !== null) {
            // Add a slight decay to the velocity
            config.mouseParticle.vx *= 0.98;
            config.mouseParticle.vy *= 0.98;
            
            // Update position
            config.mouseParticle.x += config.mouseParticle.vx;
            config.mouseParticle.y += config.mouseParticle.vy;
            
            // Check boundaries
            if (config.mouseParticle.x < 0 || config.mouseParticle.x > width) {
                config.mouseParticle.vx = -config.mouseParticle.vx;
            }
            if (config.mouseParticle.y < 0 || config.mouseParticle.y > height) {
                config.mouseParticle.vy = -config.mouseParticle.vy;
            }
        }
    }
    
    // Draw the entire scene
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Sort particles by z-index for proper depth rendering
        if (config.depth) {
            particles.sort((a, b) => a.z - b.z);
        }
        
        // Draw connections between particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                drawLine(particles[i], particles[j]);
            }
            
            // Draw connections to mouse particle
            if (config.mouseParticle.x !== null && config.mouseParticle.y !== null) {
                drawLine(particles[i], config.mouseParticle);
            }
        }
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            drawParticle(particles[i]);
        }
        
        // Draw mouse particle
        if (config.mouseParticle.x !== null && config.mouseParticle.y !== null) {
            drawParticle(config.mouseParticle);
        }
    }
    
    // Add subtle parallax effect when moving the mouse
    function applyParallax(mouseX, mouseY) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate mouse position relative to center (-1 to 1)
        const relativeX = (mouseX - centerX) / centerX;
        const relativeY = (mouseY - centerY) / centerY;
        
        // Move particles slightly based on their depth and mouse position
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const depthFactor = p.z * 5; // Amplify the effect with depth
            
            // Apply a subtle position shift
            p.x += relativeX * depthFactor * 0.1;
            p.y += relativeY * depthFactor * 0.1;
            
            // Keep particles in bounds
            if (p.x < 0) p.x = 0;
            if (p.x > width) p.x = width;
            if (p.y < 0) p.y = 0;
            if (p.y > height) p.y = height;
        }
    }
    
    // Animation loop
    function animate() {
        updateParticles();
        draw();
        requestAnimationFrame(animate);
    }
    
    // Mouse move event handler
    function handleMouseMove(e) {
        if (config.mouseMoveEnabled) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate velocity based on mouse movement
            if (config.mouseParticle.x !== null && config.mouseParticle.y !== null) {
                config.mouseParticle.vx = (mouseX - config.mouseParticle.x) * 0.1;
                config.mouseParticle.vy = (mouseY - config.mouseParticle.y) * 0.1;
            }
            
            config.mouseParticle.x = mouseX;
            config.mouseParticle.y = mouseY;
            
            // Apply parallax effect
            applyParallax(mouseX, mouseY);
        }
    }
    
    // Window resize event handler
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Re-initialize particles
        initParticles();
    }
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Initialize particles and start animation
    initParticles();
    animate();
}); 