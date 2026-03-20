import React, { useRef, useEffect } from 'react';

const ParticleBackground = ({ mouseX, mouseY }) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    // Sync MotionValues to local ref for standard loop
    const unsubscribeX = mouseX.on("change", (latest) => {
      mousePos.current.x = latest;
    });
    const unsubscribeY = mouseY.on("change", (latest) => {
      mousePos.current.y = latest;
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      const density = 0.0001; // Particles per pixel area
      const count = Math.floor(width * height * density) + 150; // Dense field
      
      particles.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, // Idle float speed
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.15 + 0.05,
        parallax: Math.random() * 0.02 + 0.01, // Parallax depth factor
        repelFactor: Math.random() * 0.5 + 0.5
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      particles.current.forEach(p => {
        // 1. Idle float
        p.x += p.vx;
        p.y += p.vy;

        // 2. Parallax (center-relative)
        const px = (mx - width / 2) * p.parallax;
        const py = (my - height / 2) * p.parallax;

        // 3. Mouse Repel Logic
        const dx = p.x + px - mx;
        const dy = p.y + py - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        
        let shiftX = 0;
        let shiftY = 0;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          shiftX = (dx / dist) * force * 20 * p.repelFactor;
          shiftY = (dy / dist) * force * 20 * p.repelFactor;
        }

        // 4. Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // 5. Draw
        ctx.beginPath();
        ctx.arc(p.x + px + shiftX, p.y + py + shiftY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ParticleBackground;
