import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface SwipeFeaturesProps {
  features: Feature[];
}

const SwipeFeatures = ({ features }: SwipeFeaturesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [glowIntensity, setGlowIntensity] = useState(0.3);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  // Cursor tracking with delay
  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      const delay = 0.15; // 150ms delay
      currentX += (targetX - currentX) * delay;
      currentY += (targetY - currentY) * delay;
      
      setCursorPosition({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Check if cursor is near a card to adjust glow intensity
  useEffect(() => {
    const checkCardProximity = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const distanceX = Math.abs(cursorPosition.x - (containerRect.left + containerRect.width / 2));
      const distanceY = Math.abs(cursorPosition.y - (containerRect.top + containerRect.height / 2));
      const maxDistance = 300;

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const proximity = Math.max(0, 1 - distance / maxDistance);
      
      setGlowIntensity(0.3 + proximity * 0.4);
    };

    const interval = setInterval(checkCardProximity, 16);
    return () => clearInterval(interval);
  }, [cursorPosition]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_: any, info: { offset: { x: number } }) => {
    dragX.set(info.offset.x);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    setIsDragging(false);
    
    const threshold = 100;
    const velocityThreshold = 500;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = currentIndex;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > velocityThreshold) {
      if (offset > 0 || velocity > velocityThreshold) {
        // Swipe right - previous card
        newIndex = currentIndex > 0 ? currentIndex - 1 : features.length - 1;
      } else if (offset < 0 || velocity < -velocityThreshold) {
        // Swipe left - next card
        newIndex = currentIndex < features.length - 1 ? currentIndex + 1 : 0;
      }
    }

    setCurrentIndex(newIndex);
    dragX.set(0);
    
    // Reset spring animation
    setTimeout(() => {
      dragX.set(0);
    }, 100);
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < features.length - 1 ? prev + 1 : 0));
  }, [features.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : features.length - 1));
  }, [features.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious]);


  return (
    <div className="relative w-full">
      {/* Cursor Glow Layer */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(circle 400px at ${cursorPosition.x}px ${cursorPosition.y}px, 
            hsl(var(--primary) / ${glowIntensity * 0.3}), 
            hsl(var(--primary) / ${glowIntensity * 0.1}), 
            transparent 70%)`,
        }}
        animate={{
          opacity: isHoveringCard ? 1 : 0.6,
        }}
        transition={{
          duration: 0.3,
        }}
      />

      {/* Main Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl mx-auto px-4 py-12"
        onMouseEnter={() => setIsHoveringCard(true)}
        onMouseLeave={() => setIsHoveringCard(false)}
      >
        {/* Feature Cards Container */}
        <motion.div 
          className="relative h-[400px] md:h-[500px] perspective-1000 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            x: springX,
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === currentIndex;
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);
            
            // Only render visible cards (current and adjacent)
            if (absOffset > 1) return null;
            
            return (
              <motion.div
                key={`${feature.title}-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : absOffset === 1 ? 0.4 : 0,
                  scale: isActive ? 1 : 0.9,
                  zIndex: features.length - absOffset,
                  rotateY: offset * 8,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                <motion.div
                  className="w-full max-w-md pointer-events-auto"
                  animate={{
                    y: isActive ? 0 : 20,
                    x: offset * 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <Card
                    className={`
                      glass-strong border-primary/30 
                      backdrop-blur-2xl
                      shadow-2xl
                      h-full
                      transition-all duration-300
                      ${isActive ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.3)]" : "border-primary/20"}
                    `}
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.7))"
                        : "linear-gradient(135deg, hsl(var(--card) / 0.5), hsl(var(--card) / 0.3))",
                    }}
                  >
                    <CardContent className="p-8 md:p-12 flex flex-col items-center text-center h-full justify-center">
                      <motion.div
                        animate={{
                          scale: isActive ? 1 : 0.85,
                          rotate: isActive ? 0 : offset * 3,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <Icon className="w-16 h-16 md:w-20 md:h-20 text-primary mb-6" />
                      </motion.div>
                      
                      <motion.h3
                        className="text-2xl md:text-3xl font-display font-semibold mb-4 gradient-text"
                        animate={{
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p
                        className="text-muted-foreground text-lg md:text-xl leading-relaxed"
                        animate={{
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        {feature.description}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all"
            onClick={goToPrevious}
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? "bg-primary w-8" 
                    : "bg-primary/30 hover:bg-primary/50"
                  }
                `}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all"
            onClick={goToNext}
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Swipe Hint */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Drag or use arrow keys to navigate
        </motion.p>
      </div>
    </div>
  );
};

export default SwipeFeatures;

