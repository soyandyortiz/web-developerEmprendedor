/**
 * Particle Network Animation
 * Creates a network of connecting particles to simulate software connections/nodes.
 */

class ParticleNetwork {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.config = {
      particleCount: 60, // Reduced count for cleaner look
      connectionDistance: 150,
      speed: 0.5,
      color: "rgba(255, 255, 255, 0.5)", // Subtle white
      lineColor: "rgba(255, 255, 255, 0.15)", // Very subtle lines
    };

    this.init();
  }

  init() {
    // Setup canvas
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "-1";
    this.canvas.style.pointerEvents = "none"; // Allow clicks to pass through
    document.body.prepend(this.canvas);

    this.resize();
    this.createParticles();
    this.animate();

    // Event listeners
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    // Adjust particle count based on screen size
    const count = window.innerWidth < 768 ? 30 : this.config.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        size: Math.random() * 2 + 1, // Varied size 1-3px
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((p, index) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.fillStyle = this.config.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Connections
      for (let j = index + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.config.lineColor;
          this.ctx.lineWidth = 1 - distance / this.config.connectionDistance;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ParticleNetwork();
});
