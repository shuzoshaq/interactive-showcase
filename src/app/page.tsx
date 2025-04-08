'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Components
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import DataVisualization from '@/components/DataVisualization';
import ThreeJsShowcase from '@/components/ThreeJsShowcase';
import CodeEditor from '@/components/CodeEditor';
import InteractiveFeatures from '@/components/InteractiveFeatures';
import Footer from '@/components/Footer';
import WelcomeAnimation from '@/components/WelcomeAnimation';

export default function Home() {
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Refs for scroll navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const dataVisRef = useRef<HTMLElement>(null);
  const threeJsRef = useRef<HTMLElement>(null);
  const codeEditorRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  
  // Intersection observers for animations
  const [dataVisInViewRef, dataVisInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [threeJsInViewRef, threeJsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [codeEditorInViewRef, codeEditorInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [featuresInViewRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcomeAnimation && (
          <WelcomeAnimation onComplete={() => setShowWelcomeAnimation(false)} />
        )}
      </AnimatePresence>
      
      {/* Loading screen */}
      <AnimatePresence>
        {!isLoaded && !showWelcomeAnimation && (
          <motion.div 
            className="fixed inset-0 bg-background flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fixed navigation */}
      <Navbar 
        sections={[
          { name: 'Home', ref: heroRef as React.RefObject<HTMLElement | HTMLDivElement | null> },
          { name: 'Data Visualization', ref: dataVisRef as React.RefObject<HTMLElement | HTMLDivElement | null> },
          { name: '3D Graphics', ref: threeJsRef as React.RefObject<HTMLElement | HTMLDivElement | null> },
          { name: 'Code Editor', ref: codeEditorRef as React.RefObject<HTMLElement | HTMLDivElement | null> },
          { name: 'Interactive Features', ref: featuresRef as React.RefObject<HTMLElement | HTMLDivElement | null> },
        ]}
      />
      
      {/* Hero section */}
      <motion.div style={{ opacity }} className="relative">
        <div ref={heroRef}>
          <Hero />
        </div>
      </motion.div>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-16">
        {/* Data Visualization Section */}
        <motion.section 
          ref={(el: HTMLElement | null) => {
            if (el) dataVisRef.current = el;
            dataVisInViewRef(el);
          }}
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={dataVisInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Advanced Data Visualization</h2>
          <DataVisualization />
        </motion.section>
        
        {/* 3D Graphics Section */}
        <motion.section 
          ref={(el: HTMLElement | null) => {
            if (el) threeJsRef.current = el;
            threeJsInViewRef(el);
          }}
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={threeJsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">3D Graphics & WebGL</h2>
          <ThreeJsShowcase />
        </motion.section>
        
        {/* Code Editor Section */}
        <motion.section 
          ref={(el: HTMLElement | null) => {
            if (el) codeEditorRef.current = el;
            codeEditorInViewRef(el);
          }}
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={codeEditorInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Interactive Code Editor</h2>
          <CodeEditor />
        </motion.section>
        
        {/* Interactive Features Section */}
        <motion.section 
          ref={(el: HTMLElement | null) => {
            if (el) featuresRef.current = el;
            featuresInViewRef(el);
          }}
          className="mb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Interactive Features</h2>
          <InteractiveFeatures />
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
}
