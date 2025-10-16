import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Interactive 3D Connected Network Component ---
const ConnectedNetwork = ({ pointCount = 500, lineColor = "#d6e4f0" }) => {
  const pointsRef = useRef();
  const linesRef = useRef();
  
  const vertices = useMemo(() => {
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15; // Spread points in a cube
    }
    return positions;
  }, [pointCount]);

  useFrame((state) => {
    const { clock, mouse } = state;
    // Animate points gently
    for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        const x = vertices[i3];
        const y = vertices[i3 + 1];
        pointsRef.current.geometry.attributes.position.array[i3] = x + Math.sin(clock.elapsedTime + i) * 0.01;
        pointsRef.current.geometry.attributes.position.array[i3+1] = y + Math.cos(clock.elapsedTime + i) * 0.01;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Make the whole network follow the mouse slightly
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.02);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, (mouse.y * Math.PI) / 10, 0.02);
  });
  
  return (
    <group>
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={pointCount} array={vertices} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#1E56A0" />
        </points>
        {/* You can add lines here if desired, but points alone are often cleaner */}
    </group>
  );
};

const HeroSection = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-window.innerHeight / 2, window.innerHeight / 2], [5, -5]);
  const rotateY = useTransform(x, [-window.innerWidth / 2, window.innerWidth / 2], [-5, 5]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.width / 2);
    y.set(event.clientY - rect.height / 2);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const headlineText = "Intelligent Healthcare, Genuinely Personal";
  const headlineVariants = {
    visible: { transition: { staggerChildren: 0.03 } },
    hidden: {},
  };
  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section 
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Network Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={1.5} />
          <ConnectedNetwork />
        </Canvas>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto p-4"
        style={{ rotateX, rotateY, transformStyle: 'preserve-d' }}
      >
        <div 
          className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-white/20"
          style={{ transform: 'translateZ(50px)' }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-care-dark leading-tight mb-4 tracking-tight"
            variants={headlineVariants}
            initial="hidden"
            animate="visible"
          >
            {headlineText.split("").map((char, index) => (
              <motion.span key={index} variants={charVariants} className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-care-dark/80 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            A seamless digital experience connecting you to the best doctors and services in Sri Lanka. Your wellness, simplified.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 2.2 }}
          >
            <Link to="/register">
              <motion.button 
                className="bg-care-primary text-white font-bold py-4 px-10 rounded-full shadow-lg text-lg transition-all duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(30, 86, 160, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span className="absolute top-0 left-0 w-full h-full bg-white/20" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.5, ease: "easeInOut" }}/>
                <span className="relative z-10 flex items-center">
                  Join Care Link <FiArrowRight className="ml-2" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;