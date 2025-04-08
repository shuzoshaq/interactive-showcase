'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Box with different materials
const Box = ({ position, size = [1, 1, 1], color = 'white', metalness = 0.5, roughness = 0.5 }: {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.01;
  });
  
  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
};

// Animated sphere
const AnimatedSphere = ({ position, radius = 0.7, color = '#ff7700' }: {
  position: [number, number, number];
  radius?: number;
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01;
    
    if (hovered) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.2, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.2, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.2, 0.1);
    } else {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1);
    }
  });
  
  return (
    <mesh 
      position={position} 
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={hovered ? '#ff0000' : color} 
        metalness={0.2} 
        roughness={0.3}
        wireframe={hovered}
      />
    </mesh>
  );
};

// Torus knot
const TorusKnot = ({ position, color = '#6366f1' }: {
  position: [number, number, number];
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });
  
  return (
    <mesh position={position} ref={meshRef}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshNormalMaterial />
    </mesh>
  );
};

// Earth with texture
const Earth = ({ position = [0, 0, 0] as [number, number, number] }: {
  position?: [number, number, number];
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [textures, setTextures] = useState<{
    earthTexture?: THREE.Texture;
    earthNormalMap?: THREE.Texture;
    earthSpecularMap?: THREE.Texture;
    cloudsTexture?: THREE.Texture;
  }>({});
  
  // Handle texture loading with error fallback
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const loadTexture = (url: string) => {
      return new Promise<THREE.Texture>((resolve) => {
        textureLoader.load(
          url,
          (texture) => resolve(texture),
          undefined,
          () => {
            // On error, create a colored texture as fallback
            const canvas = document.createElement('canvas');
            canvas.width = 2;
            canvas.height = 2;
            const context = canvas.getContext('2d');
            if (context) {
              context.fillStyle = url.includes('clouds') ? '#ffffff' : '#3b82f6';
              context.fillRect(0, 0, 2, 2);
            }
            const fallbackTexture = new THREE.CanvasTexture(canvas);
            resolve(fallbackTexture);
          }
        );
      });
    };
    
    const loadAllTextures = async () => {
      try {
        const [earthTex, normalMap, specularMap, cloudsTex] = await Promise.all([
          loadTexture('/earth_daymap.jpg'),
          loadTexture('/earth_normal_map.jpg'),
          loadTexture('/earth_specular_map.jpg'),
          loadTexture('/earth_clouds.png')
        ]);
        
        setTextures({
          earthTexture: earthTex,
          earthNormalMap: normalMap,
          earthSpecularMap: specularMap,
          cloudsTexture: cloudsTex
        });
        setTexturesLoaded(true);
      } catch (error) {
        console.error('Error loading textures:', error);
        // Still set as loaded but with empty textures
        setTexturesLoaded(true);
      }
    };
    
    loadAllTextures();
    
    return () => {
      // Cleanup textures to prevent memory leaks
      Object.values(textures).forEach(texture => texture?.dispose());
    };
  }, []);
  
  useFrame(({ clock }) => {
    if (earthRef.current && cloudsRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });
  
  if (!texturesLoaded) {
    return (
      <mesh position={[position[0], position[1], position[2]]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    );
  }
  
  return (
    <group position={position}>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          map={textures.earthTexture}
          normalMap={textures.earthNormalMap}
          specularMap={textures.earthSpecularMap}
          color="#3b82f6"
          shininess={5}
        />
      </mesh>
      
      {/* Clouds */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          map={textures.cloudsTexture}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// Scene wrapper with lights and controls
const Scene = ({ scene }: { scene: string }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} castShadow />
      
      <OrbitControls enableZoom={true} enablePan={true} />
      
      {scene === 'primitives' && (
        <>
          <Box position={[-2, 0, 0]} color="#3b82f6" />
          <AnimatedSphere position={[0, 0, 0]} />
          <TorusKnot position={[2, 0, 0]} />
          <Stars radius={100} depth={50} count={1000} factor={4} />
        </>
      )}
      
      {scene === 'earth' && (
        <>
          <Earth />
          <Stars radius={100} depth={50} count={1000} factor={4} />
        </>
      )}
      
      {scene === 'text' && (
        <>
          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#3b82f6"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            Interactive 3D Text
          </Text>
          <Stars radius={100} depth={50} count={1000} factor={4} />
        </>
      )}
    </>
  );
};

// Fallback for texture loading
const TextureFallback = () => {
  useEffect(() => {
    // Create texture directory if it doesn't exist
    const createTextures = async () => {
      // In a real app, we would download textures here
      console.log('Earth textures would be downloaded here in a real app');
    };
    
    createTextures();
  }, []);
  
  return null;
};

// Main component
const ThreeJsShowcase = () => {
  const [activeScene, setActiveScene] = useState<'primitives' | 'earth' | 'text'>('primitives');
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeScene === 'primitives' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-foreground'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveScene('primitives')}
        >
          3D Primitives
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeScene === 'earth' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-foreground'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveScene('earth')}
        >
          Earth Model
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeScene === 'text' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-foreground'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveScene('text')}
        >
          3D Text
        </motion.button>
      </div>
      
      <div className="bg-black rounded-lg shadow-inner h-[400px]">
        <Canvas shadows>
          <Scene scene={activeScene} />
        </Canvas>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Click and drag to rotate. Scroll to zoom.
      </div>
      
      <TextureFallback />
    </div>
  );
};

export default ThreeJsShowcase;
