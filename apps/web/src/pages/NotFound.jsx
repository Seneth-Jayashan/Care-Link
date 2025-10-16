import React, { useRef, Suspense } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Scene Components ---

// A "camera rig" with a spotlight that follows the mouse
const SpotlightRig = () => {
  const light = useRef();
  useFrame((state) => {
    // Make the spotlight target follow the mouse
    light.current.target.position.lerp(
      new THREE.Vector3(state.mouse.x * 10, state.mouse.y * 10, 0),
      0.1
    );
    // Make the spotlight's own position follow the mouse, but from a distance
    light.current.position.lerp(
      new THREE.Vector3(state.mouse.x * 10, state.mouse.y * 10, 8),
      0.1
    );
  });
  return (
    <spotLight
      ref={light}
      castShadow
      penumbra={1}
      distance={20}
      angle={0.35}
      attenuation={5}
      anglePower={4}
      intensity={5}
      color="#d6e4f0"
    />
  );
};

// A single floating 3D number, now more reflective
const Number3D = ({ text, ...props }) => (
  <Text
    fontSize={4}
    color="#1E56A0"
    anchorX="center"
    anchorY="middle"
    font="/Inter-Bold.ttf" // Make sure you have a font file in your /public folder
    {...props}
  >
    {text}
    <meshPhysicalMaterial
      metalness={0.9}
      roughness={0.1}
      clearcoat={1}
      clearcoatRoughness={0.1}
      color="#163172"
    />
  </Text>
);

// --- Main NotFound Component ---
const NotFound = () => {
  // Hooks for the 2D UI parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0 bg-care-dark">
        <Canvas camera={{ position: [0, 0, 12], fov: 35 }}>
          {/* Fog creates the sense of a dark, infinite void */}
          <fog attach="fog" args={['#163172', 10, 25]} />
          <ambientLight intensity={0.1} />
          <SpotlightRig />
          <Suspense fallback={null}>
            {/* Scatter numbers in 3D space to be "discovered" */}
            <Number3D text="4" position={[-6, 0, -2]} rotation-y={0.5} />
            <Number3D text="0" position={[0, -1, 2]} />
            <Number3D text="4" position={[6, 1, -1]} rotation-y={-0.5} />
            <Number3D text="?" position={[8, -4, -5]} rotation-y={-0.8} />
            <Number3D text="!" position={[-8, 4, -3]} rotation-y={0.8} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2D UI Overlay with Parallax and Lighting Effect */}
      <motion.div
        className="relative z-10 text-center"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 relative overflow-hidden"
          style={{ transform: 'translateZ(50px)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          {/* This div creates the moving light effect on the card */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(circle at ${x + 200}px ${y + 200}px, rgba(214, 228, 240, 0.2), transparent 40%)`
              )
            }}
          />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Lost in the Void
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
              It seems you've found a glitch in the matrix. The page you're looking for has ventured beyond our known universe.
            </p>
            <div className="mt-8">
              <Link to="/">
                <motion.button
                  className="bg-white text-care-primary font-bold py-3 px-8 rounded-full shadow-lg text-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 20px rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Return to Safety
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;