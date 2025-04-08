'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThree, Canvas, useFrame } from '@react-three/fiber';
import { Text, Center, Float, Environment, MeshDistortMaterial, GradientTexture, Sphere, RoundedBox, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// Animated text component with distortion effect
const AnimatedText = ({ text, position, scale, color, delay = 0 }: {
  text: string;
  position: [number, number, number];
  scale?: number;
  color?: string;
  delay?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame((state) => {
    if (textRef.current) {
      // Subtle pulse effect
      textRef.current.scale.x = THREE.MathUtils.lerp(
        textRef.current.scale.x,
        hovered ? 1.1 * (scale || 1) : 1 * (scale || 1),
        0.1
      );
      textRef.current.scale.y = THREE.MathUtils.lerp(
        textRef.current.scale.y,
        hovered ? 1.1 * (scale || 1) : 1 * (scale || 1),
        0.1
      );
    }
  });
  
  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.3}
      position={position}
    >
      <Trail
        width={1.5}
        color={color || "#3b82f6"}
        length={8}
        decay={1}
        attenuation={(width) => width}
      >
        <group
          ref={textRef}
          // @ts-ignore - framer-motion with three.js integration
          initial={{ opacity: 0, scale: 0 }}
          animate={visible ? { opacity: 1, scale: scale || 1 } : {}}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <Center>
            <Text
              fontSize={0.6}
              font="/fonts/Inter-Bold.woff"
              anchorX="center"
              anchorY="middle"
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              {text}
              <MeshDistortMaterial
                color={color || "#3b82f6"}
                envMapIntensity={1}
                clearcoat={1}
                clearcoatRoughness={0}
                metalness={0.9}
                distort={hovered ? 0.2 : 0.1}
                speed={5}
              />
            </Text>
          </Center>
        </group>
      </Trail>
    </Float>
  );
};

// Advanced particle system for background effect
const ParticleSystem = () => {
  const { viewport } = useThree();
  const count = 2000; // More particles
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const colors = useRef<Float32Array>(new Float32Array(count * 3));
  const sizes = useRef<Float32Array>(new Float32Array(count));
  const speeds = useRef<Float32Array>(new Float32Array(count));
  const pointsRef = useRef<THREE.Points>(null);
  
  // Color palette for particles
  const colorPalette = [
    new THREE.Color("#3b82f6").toArray(), // Primary blue
    new THREE.Color("#8b5cf6").toArray(), // Purple
    new THREE.Color("#10b981").toArray(), // Green
    new THREE.Color("#f59e0b").toArray(), // Amber
    new THREE.Color("#ef4444").toArray()  // Red
  ];
  
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute particles in a more interesting pattern
      const radius = Math.random() * 10 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions.current[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions.current[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions.current[i3 + 2] = radius * Math.cos(phi);
      
      // Random size with more variation
      sizes.current[i] = Math.random() * 0.2 + 0.05;
      speeds.current[i] = Math.random() * 0.02 + 0.005;
      
      // Assign colors from palette
      const colorArray = colorPalette[Math.floor(Math.random() * colorPalette.length)] as number[];
      colors.current[i3] = colorArray[0];
      colors.current[i3 + 1] = colorArray[1];
      colors.current[i3 + 2] = colorArray[2];
    }
  }, [count]);
  
  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions.current, 3));
      pointsRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors.current, 3));
      pointsRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes.current, 1));
    }
  }, []);
  
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // More complex motion patterns
      positions.current[i3] += speeds.current[i] * Math.sin(time * 0.2 + i * 0.02);
      positions.current[i3 + 1] += speeds.current[i] * Math.cos(time * 0.3 + i * 0.01);
      positions.current[i3 + 2] += speeds.current[i] * Math.sin(time * 0.1 + i * 0.03);
      
      // Create a boundary sphere and keep particles within it
      const x = positions.current[i3];
      const y = positions.current[i3 + 1];
      const z = positions.current[i3 + 2];
      const distance = Math.sqrt(x*x + y*y + z*z);
      
      if (distance > 15) {
        positions.current[i3] *= 0.95;
        positions.current[i3 + 1] *= 0.95;
        positions.current[i3 + 2] *= 0.95;
      }
      
      // Pulse the particle sizes
      sizes.current[i] = (Math.sin(time * 2 + i) * 0.1 + 0.5) * (Math.random() * 0.2 + 0.05);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
          args={[positions.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors.current}
          itemSize={3}
          args={[colors.current, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes.current}
          itemSize={1}
          args={[sizes.current, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Animated logo reveal
const LogoReveal = () => {
  const [animationStep, setAnimationStep] = useState(0);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 2000);
    const timer2 = setTimeout(() => setAnimationStep(2), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  return (
    <group>
      {animationStep >= 0 && (
        <AnimatedText 
          text="Interactive" 
          position={[0, 1, 0]} 
          color="#3b82f6"
          delay={500}
        />
      )}
      
      {animationStep >= 1 && (
        <AnimatedText 
          text="Programming" 
          position={[0, 0, 0]} 
          color="#8b5cf6"
          delay={0}
        />
      )}
      
      {animationStep >= 2 && (
        <AnimatedText 
          text="Showcase" 
          position={[0, -1, 0]} 
          color="#10b981"
          delay={0}
        />
      )}
    </group>
  );
};

// Advanced scene setup with camera, lighting, and post-processing
const Scene = () => {
  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  
  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
  }, [camera, cameraPosition]);
  
  // Subtle camera movement
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.1) * 0.5;
    camera.position.y = Math.cos(time * 0.1) * 0.5;
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <>
      <color attach="background" args={['#050505']} />
      
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.7} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#8b5cf6" />
      
      {/* Background elements */}
      <group position={[0, 0, -5]}>
        <Sphere args={[3, 32, 32]} position={[5, -2, -10]}>
          <MeshDistortMaterial
            color="#3b82f6"
            distort={0.4}
            speed={2}
            transparent
            opacity={0.2}
          />
        </Sphere>
        
        <Sphere args={[2, 32, 32]} position={[-5, 3, -5]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            distort={0.4}
            speed={3}
            transparent
            opacity={0.2}
          />
        </Sphere>
      </group>
      
      {/* Grid for tech feel */}
      <group position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[40, 40, 20, 20]} />
          <meshStandardMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
      
      <ParticleSystem />
      <LogoReveal />
      
      <Environment preset="night" />
      
      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
      </EffectComposer>
    </>
  );
};

// Fallback for font loading
const FontFallback = () => {
  useEffect(() => {
    // Create font directory if it doesn't exist
    const createFont = async () => {
      // In a real app, we would download the font here
      console.log('Font would be downloaded here in a real app');
    };
    
    createFont();
  }, []);
  
  return null;
};

// High-tech welcome animation component
const WelcomeAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(1);
  const [loadingText, setLoadingText] = useState('Initializing systems...');
  
  useEffect(() => {
    // Simplified loading simulation with guaranteed completion
    const loadingPhrases = [
      'Initializing systems...',
      'Loading assets...',
      'Preparing 3D environment...',
      'Configuring interactive elements...',
      'Optimizing performance...',
      'Finalizing setup...'
    ];
    
    let timeoutId: NodeJS.Timeout;
    
    const simulateLoading = () => {
      const phaseLength = 100 / loadingPhrases.length;
      const currentPhase = Math.min(Math.floor(progress / phaseLength) + 1, loadingPhrases.length);
      
      if (currentPhase !== loadingPhase) {
        setLoadingPhase(currentPhase);
        setLoadingText(loadingPhrases[currentPhase - 1]);
      }
      
      setProgress(prev => {
        // Ensure consistent progress with a fixed increment
        const increment = 1 + Math.random() * 2;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          setTimeout(() => setShowEnterButton(true), 1000);
          return 100;
        }
        
        timeoutId = setTimeout(simulateLoading, 100);
        return newProgress;
      });
    };
    
    // Start the loading simulation
    timeoutId = setTimeout(simulateLoading, 500);
    
    // Failsafe to ensure loading completes after 10 seconds
    const failsafeId = setTimeout(() => {
      setProgress(100);
      setLoadingPhase(loadingPhrases.length);
      setLoadingText(loadingPhrases[loadingPhrases.length - 1]);
      setTimeout(() => setShowEnterButton(true), 1000);
    }, 10000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(failsafeId);
    };
  }, [progress]);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Futuristic UI elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-70" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary via-accent to-secondary opacity-70" />
      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-primary via-accent to-secondary opacity-70" />
      <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-primary via-accent to-secondary opacity-70" />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary opacity-70" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent opacity-70" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-secondary opacity-70" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary opacity-70" />
      
      <div className="w-full h-full absolute">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
      
      {/* Futuristic loading interface */}
      <div className="absolute bottom-24 w-full max-w-md px-8">
        <motion.div 
          className="mb-2 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-xs text-primary font-mono">SYS.INIT.{loadingPhase}/6</div>
          <div className="text-xs text-white font-mono">{Math.floor(progress)}%</div>
        </motion.div>
        
        <motion.div 
          className="h-1.5 bg-gray-800 rounded-sm overflow-hidden backdrop-blur-sm glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary relative"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          >
            {/* Animated highlight effect */}
            <motion.div 
              className="absolute top-0 right-0 h-full w-5 bg-white opacity-30"
              animate={{ 
                x: [-5, 5, -5],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="text-center text-white mt-3 text-xs font-mono tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {loadingText}
        </motion.div>
        
        {/* Tech details */}
        <motion.div 
          className="mt-6 grid grid-cols-3 gap-2 text-[8px] text-gray-500 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
        >
          <div>REACT 19.0.0</div>
          <div>NEXT.JS 15.2.4</div>
          <div>THREE.JS 0.158.0</div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showEnterButton && (
          <motion.button
            className="absolute bottom-40 px-10 py-3 bg-transparent border border-primary hover:bg-primary/20 text-white rounded-sm font-bold text-base tracking-widest backdrop-blur-sm glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
          >
            INITIALIZE EXPERIENCE
          </motion.button>
        )}
      </AnimatePresence>
      
      <FontFallback />
    </motion.div>
  );
};

export default WelcomeAnimation;
