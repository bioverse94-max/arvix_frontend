import React, { useRef, useEffect } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  isHub?: boolean;
}

export const HeroAmbientNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Create ambient nodes
    const nodeCount = Math.min(60, Math.floor((width * height) / 18000));
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: i % 7 === 0 ? 3.5 : i % 3 === 0 ? 2.5 : 1.5,
      alpha: 0.3 + Math.random() * 0.5,
      isHub: i % 7 === 0,
    }));

    // Data pulses traveling along lines
    interface Pulse {
      from: Node;
      to: Node;
      progress: number;
      speed: number;
    }
    const pulses: Pulse[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Navy Radial Gradient Background
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, "#0B2D4F");
      grad.addColorStop(0.5, "#08213B");
      grad.addColorStop(1, "#041424");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric grid
      ctx.strokeStyle = "rgba(0, 114, 188, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 170;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 163, 255, ${lineAlpha})`;
            ctx.lineWidth = n1.isHub || n2.isHub ? 1.2 : 0.75;
            ctx.stroke();

            // Occasionally spawn a pulse
            if (Math.random() < 0.0006 && pulses.length < 15) {
              pulses.push({
                from: n1,
                to: n2,
                progress: 0,
                speed: 0.008 + Math.random() * 0.012,
              });
            }
          }
        }
      }

      // Draw Pulses (glowing packet flow)
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
        const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(186, 230, 253, 0.9)";
        ctx.shadowColor = "#0072BC";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      nodes.forEach((node) => {
        // Outer subtle halo for hubs
        if (node.isHub) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 114, 188, 0.12)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isHub
          ? "rgba(186, 230, 253, 0.95)"
          : `rgba(0, 163, 255, ${node.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none block"
    />
  );
};
export default HeroAmbientNetwork;
