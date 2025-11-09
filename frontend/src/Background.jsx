import React, { useRef, useEffect } from 'react';

const SnowBackground = ({ divWidth = 400, divHeight = 300, snowCount = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Central div exclusion zone
    const DIV_X = width / 2 - divWidth / 2;
    const DIV_Y = height / 2 - divHeight / 2;

    // Snowflake particles
    const snowflakes = [];
    for (let i = 0; i < snowCount; i++) {
      let x, y;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
      } while (x > DIV_X && x < DIV_X + divWidth && y > DIV_Y && y < DIV_Y + divHeight);

      snowflakes.push({
        x,
        y,
        vy: 0.3 + Math.random() * 0.7, // vertical speed
        vx: (Math.random() - 0.5) * 0.2, // slight horizontal drift
        radius: 1 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.8
      });
    }

    let frameId;

    const animate = () => {
      ctx.fillStyle = 'black'; // dark night sky
      ctx.fillRect(0, 0, width, height);

      snowflakes.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around horizontally
        if (s.x < 0) s.x += width;
        if (s.x > width) s.x -= width;

        // Wrap from bottom to top
        if (s.y > height) {
          s.y = -s.radius;
          s.x = Math.random() * width;
        }

        // Avoid central div
        if (s.x > DIV_X && s.x < DIV_X + divWidth &&
            s.y > DIV_Y && s.y < DIV_Y + divHeight) {
          s.y -= s.vy * 2;
          s.x += (s.x < width / 2 ? -divWidth/4 : divWidth/4);
        }

        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [divWidth, divHeight, snowCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        display: 'block',
      }}
    />
  );
};

export default SnowBackground;