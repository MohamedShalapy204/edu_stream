import { useEffect, useRef } from 'react';

export default function ScholarlyConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        
        // Dynamically scale particles by screen size; 
        // 120 max to maintain solid 60fps even on mid-tier devices
        let pCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);
        pCount = Math.min(Math.max(pCount, 40), 120);

        const particles: { x: number, y: number, vx: number, vy: number, r: number, baseVx: number, baseVy: number }[] = [];
        for (let i = 0; i < pCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.3 + 0.1;
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                baseVx: Math.cos(angle) * speed,
                baseVy: Math.sin(angle) * speed,
                r: Math.random() * 1.5 + 0.5
            });
        }

        const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        };

        const handleMouseOut = () => {
             mouse.targetX = -1000;
             mouse.targetY = -1000;
        };

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial sizing

        // Poll theme color slightly differently since we can't observe easily without heavy mutation observers.
        // Reading it dynamically per frame is bad, so we rely on media query + fallback
        const getIsDark = () => {
            if (typeof document !== 'undefined') {
                return document.documentElement.getAttribute('data-theme') === 'dark' 
                    || window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            return false;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Smooth mouse interpolation for fluid, cinematic tracking
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            const isDark = getIsDark();
            
            // Atheneum nocturnal indigo vs light mode colors
            const particleColor = isDark ? `rgba(160, 150, 255,` : `rgba(80, 60, 200,`;
            const lineColor = isDark ? `rgba(140, 130, 250,` : `rgba(60, 40, 180,`;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Seamless wrap around edges rather than bouncing (feels more celestial)
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Gently return to base velocity over time
                p.vx += (p.baseVx - p.vx) * 0.05;
                p.vy += (p.baseVy - p.vy) * 0.05;

                // Mouse interaction: Gentle vortex/displacement
                 if (dist < 200) {
                    const force = (200 - dist) / 200;
                    const angle = Math.atan2(dy, dx);
                    // Push particles softly away then pull them into a swirl
                    p.vx -= Math.cos(angle) * force * 0.02;
                    p.vy -= Math.sin(angle) * force * 0.02;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `${particleColor} ${Math.min(1, p.r/1.5)})`; 
                ctx.fill();

                // Connect nearby particles to form "synapses"
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    const connectDist = 120;
                    if (dist2 < connectDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        
                        let alpha = 1 - (dist2 / connectDist);
                        
                        const midX = (p.x + p2.x) / 2;
                        const midY = (p.y + p2.y) / 2;
                        const mouseDist = Math.sqrt(Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2));
                        
                        // Increase opacity if near mouse; "lights up" the network
                        if (mouseDist < 250) {
                            alpha += (1 - mouseDist/250) * 0.6; 
                        }

                        ctx.strokeStyle = `${lineColor} ${alpha * 0.25})`;
                        ctx.lineWidth = isDark ? 1.5 : 1;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}
