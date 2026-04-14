import { useEffect, useRef, useState } from 'react';
import { SCHOLARLY_MESSAGES } from './owlMessages';

export default function AtheneumOwl() {
    const owlRef = useRef<HTMLDivElement>(null);
    const leftWingRef = useRef<SVGGElement>(null);
    const rightWingRef = useRef<SVGGElement>(null);
    const speechBubbleContainerRef = useRef<HTMLDivElement>(null);
    
    // Physics State
    const mouse = useRef({ x: -1000, y: -1000 });
    const pos = useRef({ x: -1000, y: -1000 });
    const vel = useRef({ x: 0, y: 0 });
    const targetRect = useRef<DOMRect | null>(null);
    
    const [isVisible, setIsVisible] = useState(false);
    const [speechText, setSpeechText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        let showTimeout: NodeJS.Timeout;
        let hideTimeout: NodeJS.Timeout;

        const scheduleNextSpeech = () => {
            // Random delay between 5s and 20s
            const delay = Math.random() * 15000 + 5000;
            showTimeout = setTimeout(() => {
                setSpeechText(SCHOLARLY_MESSAGES[Math.floor(Math.random() * SCHOLARLY_MESSAGES.length)]);
                setIsSpeaking(true);
                
                // Hide after 6 seconds so user has time to read
                hideTimeout = setTimeout(() => {
                    setIsSpeaking(false);
                    scheduleNextSpeech();
                }, 6000);
            }, delay);
        };

        scheduleNextSpeech();

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
        };
    }, []);

    useEffect(() => {
        let hasMoved = false;
        let lastScrollY = window.scrollY;
        let scrollVel = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            updateInitialPosition(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouse.current.x = touch.clientX;
                mouse.current.y = touch.clientY;
                updateInitialPosition(touch.clientX, touch.clientY);
            }
        };

        const updateInitialPosition = (x: number, y: number) => {
            if (!hasMoved) {
                hasMoved = true;
                pos.current.x = x;
                pos.current.y = y;
                setIsVisible(true);
            }
        };

        const handleMouseOver = (e: MouseEvent | TouchEvent) => {
            const target = (e instanceof MouseEvent ? e.target : e.touches[0].target) as HTMLElement;
            const clickable = target.closest('button, a, [role="button"]');
            if (clickable) {
                targetRect.current = clickable.getBoundingClientRect();
            } else {
                targetRect.current = null;
            }
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            scrollVel = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('scroll', handleScroll, { passive: true });

        let animationId: number;
        let flapTime = 0;
        let flapAngle = 0;
        let currentScaleX = 1;

        const loop = () => {
            // Goal: Follow slightly to the top-right of the cursor/finger
            // Also factor in "scroll wind" - owl dives slightly when scrolling fast
            let targetX = mouse.current.x + 45; 
            let targetY = mouse.current.y - 45 + (Math.min(30, Math.max(-30, scrollVel * 0.5))); 
            let isPerching = false;

            // Decay scroll velocity over time
            scrollVel *= 0.9;

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
                flapAngle += (15 - flapAngle) * 0.15;
            } else {
                const currentFlapSpeed = Math.max(0.12, speed * 0.08);
                flapTime += currentFlapSpeed;
                const targetFlap = Math.sin(flapTime) * Math.min(65, speed * 3 + 15);
                flapAngle += (targetFlap - flapAngle) * 0.5;
            }

            // Owl tilt & flip logic
            if (!isPerching && Math.abs(dx) > 10) {
                const targetScaleX = dx < 0 ? -1 : 1;
                currentScaleX += (targetScaleX - currentScaleX) * 0.2;
            }

            const targetTilt = isPerching ? 0 : Math.min(30, Math.max(-30, vel.current.x * 2 + (scrollVel * 0.2)));
            
            if (owlRef.current) {
                owlRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${targetTilt}deg) scaleX(${currentScaleX})`;
            }

            if (speechBubbleContainerRef.current) {
                speechBubbleContainerRef.current.style.transform = `translate(${pos.current.x + 25}px, calc(${pos.current.y - 30}px - 100%))`;
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
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
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

            {/* Speech Bubble Container */}
            <div 
                ref={speechBubbleContainerRef}
                className="fixed top-0 left-0 pointer-events-none z-[110]"
            >
                <div 
                    className={`transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-left max-w-[220px] bg-base-100/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-primary/20 break-words ${isSpeaking && isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-12'}`}
                    dir="rtl"
                >
                    <p className="text-sm font-medium text-base-content leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {speechText}
                    </p>
                    {/* Pointer Arrow */}
                    <div className="absolute -bottom-[8px] left-5 w-4 h-4 bg-base-100 border-b border-l border-primary/20 transform -rotate-45" />
                </div>
            </div>
        </>
    );
}
