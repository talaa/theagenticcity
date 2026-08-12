import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface AgentDroneProps {
  variant?: 'blue' | 'red';
  label?: string;
  delayOffset?: number;
}

export function AgentDrone({ variant = 'blue', label = 'DROID // 01', delayOffset = 0 }: AgentDroneProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    // Initial center position
    setPosition({ 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 3 
    });

    const moveAgent = () => {
      const paddingX = 150;
      const paddingY = 150;
      
      setPosition(prev => {
        // Calculate random position within bounds
        const randomX = paddingX + Math.random() * (window.innerWidth - paddingX * 2);
        const randomY = paddingY + Math.random() * (window.innerHeight - paddingY * 2);
        
        // Face the direction of movement
        if (randomX > prev.x) setDirection(1);
        else setDirection(-1);

        return { x: randomX, y: randomY };
      });
    };

    // Move every 4.5 seconds (staggered slightly by delayOffset)
    const interval = setInterval(moveAgent, 4500 + delayOffset);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const isRed = variant === 'red';
  const bodyColor = isRed ? '#C83232' : '#42A1D3'; // Darker red vs Blue
  const thrusterClass = isRed ? 'bg-red-500' : 'bg-cyan-400';
  const antennaColor = isRed ? '#42A1D3' : '#F2C143'; // Blue antenna for red droid, yellow for blue

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none flex flex-col items-center justify-center"
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: "tween", 
        ease: "easeInOut", 
        duration: 4
      }}
    >
      {/* Bobbing animation for the droid itself */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{ scaleX: direction }} // Flip horizontally based on movement
        className="relative scale-125 mb-4"
      >
        {/* Droid Construction (Inspired by the floating blue droid from the book cover) */}
        <div className="relative w-12 h-12">
          {/* Antenna Ball */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-[1.5px] border-[#1F2B37] z-10" style={{ backgroundColor: antennaColor }} />
          
          {/* Antenna Stick */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-[#1F2B37]" />
          
          {/* Main Body */}
          <div className="absolute inset-0 rounded-[18px] border-2 border-[#1F2B37] overflow-hidden z-20 shadow-inner" style={{ backgroundColor: bodyColor }}>
            {/* Light reflection highlight on body */}
            <div className="absolute top-1 right-1 w-3 h-8 bg-white/30 rounded-full blur-[1px] rotate-12" />
          </div>

          {/* Black Visor (Eyes) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-4 bg-[#0F1722] rounded-full z-30 overflow-hidden shadow-inner">
             {/* Visor glass reflection */}
             <div className="absolute -top-1 right-1 w-4 h-2 bg-white/20 rounded-full rotate-12" />
          </div>

          {/* Left Leg */}
          <div className="absolute -bottom-3 left-2 w-1.5 h-4 bg-[#1F2B37] rounded-full -rotate-12 z-10">
            {/* Left Foot */}
            <div className="absolute bottom-0 -left-1 w-3.5 h-2.5 rounded-full border-[1.5px] border-[#1F2B37]" style={{ backgroundColor: bodyColor }} />
          </div>

          {/* Right Leg */}
          <div className="absolute -bottom-4 right-3 w-1.5 h-5 bg-[#1F2B37] rounded-full rotate-[15deg] z-10">
            {/* Right Foot */}
            <div className="absolute bottom-0 -left-1 w-3.5 h-2.5 rounded-full border-[1.5px] border-[#1F2B37]" style={{ backgroundColor: bodyColor }} />
          </div>

          {/* Thruster Glow underneath */}
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 blur-[8px] rounded-full z-0 ${thrusterClass}`}
          />
        </div>
      </motion.div>

      {/* Floating Status Label */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className={`mt-8 px-3 py-1 bg-surface-container/80 backdrop-blur-md border border-glass-border rounded-full text-[10px] font-mono uppercase tracking-widest whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${isRed ? 'text-red-400' : 'text-primary'}`}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
