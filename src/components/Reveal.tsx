import { motion, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const Reveal = ({ 
  children, 
  width = "fit-content", 
  delay = 0, 
  duration = 0.5,
  yOffset = 50, // Distance the element slides up
  className = ""
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} className={className} style={{ position: "relative", width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset, filter: "blur(10px)" },
          visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: {
              duration: duration,
              delay: delay,
              ease: [0.25, 0.25, 0, 1], // Cubic bezier for smooth "premium" ease
            }
          },
        }}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
};