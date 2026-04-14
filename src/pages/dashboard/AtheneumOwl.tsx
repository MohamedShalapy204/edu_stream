import { useEffect, useRef, useState } from 'react';

export default function AtheneumOwl() {
    const owlRef = useRef<HTMLDivElement>(null);
    const leftWingRef = useRef<SVGGElement>(null);
    const rightWingRef = useRef<SVGGElement>(null);
    
    // Physics State
    const mouse = useRef({ x: -1000, y: -1000 });
    const pos = useRef({ x: -1000, y: -1000 });
    const vel = useRef({ x: 0, y: 0 });
    const targetRect = useRef<DOMRect | null>(null);
    
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let hasMoved = false;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            
            if (!hasMoved) {
                hasMoved = true;
                pos.current.x = e.clientX;
                pos.current.y = e.clientY;
                setIsVisible(true);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Find closest clickable element
            const clickable = target.closest('button, a, [role="button"]');
            if (clickable) {
                targetRect.current = clickable.getBoundingClientRect();
            } else {
                targetRect.current = null;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        let animationId: number;
        let flapTime = 0;
        let flapAngle = 0;
        let currentScaleX = 1;

        const loop = () => {
            // Goal: Follow slightly to the top-right of the cursor
            let targetX = mouse.current.x + 45; 
            let targetY = mouse.current.y - 45; 
            let isPerching = false;

            // If hovering over a button, perch on top of it instead
            if (targetRect.current) {
                targetX = targetRect.current.left + targetRect.current.width / 2;
                targetY = targetRect.current.top - 18; 
                isPerching = true;
            }

            // Physics tuning parameters
            const currentSpring = isPerching ? 0.08 : 0.025;
            const currentFriction = isPerching ? 0.70 : 0.88;

            const dx = targetX - pos.current.x;
            const dy = targetY - pos.current.y;

            vel.current.x += dx * currentSpring;
            vel.current.y += dy * currentSpring;

            vel.current.x *= currentFriction;
            vel.current.y *= currentFriction;

            // Apply velocity
            pos.current.x += vel.current.x;
            pos.current.y += vel.current.y;

            const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
            
            // Wing flapping logic
            if (isPerching && speed < 3) {
                // Tuck wings away when perched and resting
                flapAngle += (15 - flapAngle) * 0.15; // 15 degrees tucks them securely
            } else {
                // Adaptive flap speed based on movement speed
                const currentFlapSpeed = Math.max(0.12, speed * 0.08);
                flapTime += currentFlapSpeed;
                
                // Adaptive flap amplitude (wider strokes when moving fast)
                const targetFlap = Math.sin(flapTime) * Math.min(65, speed * 3 + 15);
                flapAngle += (targetFlap - flapAngle) * 0.5;
            }

            // Owl tilt & flip logic
            // Only aggressively flip if we're moving fast horizontally and not perched
            if (!isPerching && Math.abs(dx) > 10) {
                const targetScaleX = dx < 0 ? -1 : 1;
                // Softly interpolate scale to avoid jarring 1-frame flips
                currentScaleX += (targetScaleX - currentScaleX) * 0.2;
            }

            // Tilt in the direction of flight
            const targetTilt = isPerching ? 0 : Math.min(30, Math.max(-30, vel.current.x * 2));
            
            if (owlRef.current) {
                owlRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${targetTilt}deg) scaleX(${currentScaleX})`;
            }

            if (leftWingRef.current && rightWingRef.current) {
                leftWingRef.current.style.transform = `rotate(${-flapAngle}deg)`;
                rightWingRef.current.style.transform = `rotate(${flapAngle}deg)`;
            }

            animationId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div 
            ref={owlRef}
            className={`fixed top-0 left-0 pointer-events-none z-[100] w-14 h-14 origin-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
                marginLeft: '-28px', 
                marginTop: '-28px',
                filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.5))'
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary overflow-visible">
                {/* Left Wing */}
                <g ref={leftWingRef} style={{ transformOrigin: '25px 45px' }}>
                    <path d="M 25 45 C 5 35 -20 65 -15 90 C 5 75 15 65 25 60 Z" fill="currentColor" opacity="0.9" />
                </g>

                {/* Right Wing */}
                <g ref={rightWingRef} style={{ transformOrigin: '75px 45px' }}>
                    <path d="M 75 45 C 95 35 120 65 115 90 C 95 75 85 65 75 60 Z" fill="currentColor" opacity="0.9" />
                </g>

                {/* Body Shape (Soft curves for a scholarly owl) */}
                <path d="M 50 15 C 30 15 20 40 25 70 C 30 95 70 95 75 70 C 80 40 70 15 50 15 Z" fill="currentColor" />
                
                {/* Ear Tufts */}
                <path d="M 22 40 L 15 10 L 40 25 Z" fill="currentColor" />
                <path d="M 78 40 L 85 10 L 60 25 Z" fill="currentColor" />

                {/* Glowing Eyes */}
                {/* Note: In dark mode, base-100 is almost black, so we let the white background pop the eye out. */}
                <circle cx="38" cy="42" r="8" fill="#fff" />
                <circle cx="62" cy="42" r="8" fill="#fff" />
                <circle cx="38" cy="42" r="3" fill="var(--color-base-content)" />
                <circle cx="62" cy="42" r="3" fill="var(--color-base-content)" />
                
                {/* Minimalist Beak */}
                <path d="M 46 52 L 54 52 L 50 63 Z" fill="var(--color-accent-content, #fbbf24)" />
                
                {/* Subtle Chest Feathers / Graduation Gown fold */}
                <path d="M 40 70 Q 50 85 60 70" fill="none" stroke="var(--color-base-100)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <path d="M 45 80 Q 50 90 55 80" fill="none" stroke="var(--color-base-100)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
        </div>
    );
}
