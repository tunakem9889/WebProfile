const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');
container.appendChild(canvas);

let width, height;
let stars = [];

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(1, '#02010a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
        }
        
        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;
    });

    // Add some nebula-like glows
    drawNebula(width * 0.2, height * 0.3, 300, 'rgba(93, 42, 142, 0.05)');
    drawNebula(width * 0.8, height * 0.7, 400, 'rgba(0, 210, 255, 0.05)');

    requestAnimationFrame(draw);
}

function drawNebula(x, y, radius, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

window.addEventListener('resize', init);
init();
draw();
