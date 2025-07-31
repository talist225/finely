import { useEffect, useRef } from "react";

function BackgroundAnimation({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let coins = [];
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Coin class
    class Coin {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 4 + 4; // 4-8 pixels
        this.speedX = Math.random() * 1 - 0.5; // Slow movement
        this.speedY = Math.random() * 1 - 0.5;
        this.alpha = Math.random() * 0.2 + 0.2; // 0.2-0.4
        this.color =
          theme === "light"
            ? `rgba(${Math.random() * 50 + 50}, ${
                Math.random() * 50 + 100
              }, 246, ${this.alpha})`
            : `rgba(${Math.random() * 30 + 30}, ${
                Math.random() * 30 + 70
              }, 175, ${this.alpha})`;
        this.life = Math.random() * 200 + 100; // Frames to live
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.alpha = 0.4 * (this.life / 300); // Fade out
        if (this.alpha < 0) this.alpha = 0;
      }

      draw() {
        // Draw coin (circle)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        // Draw ₪ symbol
        ctx.font = `${this.radius * 1.5}px Rubik`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.7;
        ctx.fillText("₪", this.x, this.y);
        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.3;
        ctx.fill();
      }
    }

    // Initialize coins
    const initCoins = () => {
      coins = [];
      const coinCount = Math.floor((canvas.width * canvas.height) / 30000); // Optimized for performance
      for (let i = 0; i < coinCount; i++) {
        coins.push(new Coin());
      }
    };
    initCoins();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      coins = coins.filter((coin) => coin.life > 0); // Remove dead coins
      coins.forEach((coin) => {
        coin.update();
        coin.draw();
      });
      // Add new coins periodically
      if (Math.random() < 0.05) {
        coins.push(new Coin());
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Update on theme change
    const handleThemeChange = () => {
      initCoins();
    };
    handleThemeChange();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -9,
        pointerEvents: "none",
      }}
    />
  );
}

export default BackgroundAnimation;
