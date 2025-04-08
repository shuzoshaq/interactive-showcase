'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveFeatures = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'forms' | 'gestures' | 'animations'>('cards');
  const [isDragging, setIsDragging] = useState(false);
  // Position state is used for internal component logic
  const constraintsRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false,
    preference: 'design'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Animation state
  const [animationVariant, setAnimationVariant] = useState<'fade' | 'slide' | 'scale' | 'rotate'>('fade');
  
  // Cards state
  const [cards, setCards] = useState([
    { id: 1, title: 'Drag Me', color: 'bg-primary' },
    { id: 2, title: 'Flip Me', color: 'bg-secondary' },
    { id: 3, title: 'Hover Me', color: 'bg-accent' },
  ]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        message: '',
        subscribe: false,
        preference: 'design'
      });
    }, 3000);
  };
  
  // Animation variants
  const animationVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slide: {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    scale: {
      hidden: { scale: 0, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    },
    rotate: {
      hidden: { rotate: -180, opacity: 0 },
      visible: { rotate: 0, opacity: 1 }
    }
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'cards' 
              ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('cards')}
        >
          Interactive Cards
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'forms' 
              ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('forms')}
        >
          Dynamic Forms
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'gestures' 
              ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('gestures')}
        >
          Gesture Controls
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full ${
            activeTab === 'animations' 
              ? 'bg-primary text-white font-bold shadow-lg border-2 border-primary' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('animations')}
        >
          Advanced Animations
        </motion.button>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner p-6 min-h-[400px]">
        {/* Interactive Cards */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="perspective-1000">
                <motion.div 
                  className={`relative w-full h-64 rounded-xl ${
                    flippedCard === card.id ? 'rotate-y-180' : ''
                  } transition-transform duration-500`}
                  whileHover={card.id === 3 ? { scale: 1.05, rotate: 5 } : {}}
                  drag={card.id === 1}
                  dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                  dragElastic={0.2}
                  onClick={() => card.id === 2 && setFlippedCard(flippedCard === card.id ? null : card.id)}
                >
                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 flex flex-col items-center justify-center ${card.color} text-white rounded-xl p-6 ${
                      flippedCard === card.id ? 'backface-hidden' : ''
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                    {card.id === 1 && (
                      <p className="text-center">Try dragging this card around</p>
                    )}
                    {card.id === 2 && (
                      <p className="text-center">Click to flip this card</p>
                    )}
                    {card.id === 3 && (
                      <p className="text-center">Hover over this card</p>
                    )}
                  </div>
                  
                  {/* Card Back (only for flip card) */}
                  {card.id === 2 && (
                    <div 
                      className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white rounded-xl p-6 rotate-y-180 ${
                        flippedCard === card.id ? '' : 'backface-hidden'
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4">Card Back</h3>
                      <p className="text-center">This is the back of the card. Click again to flip back.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        )}
        
        {/* Dynamic Forms */}
        {activeTab === 'forms' && (
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-success/10 border border-success text-success p-4 rounded-lg text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Form Submitted!</h3>
                  <p>Thank you, {formData.name}. We've received your message.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <motion.input 
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <motion.input 
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <motion.textarea 
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="preference" className="block text-sm font-medium mb-1">Preference</label>
                    <motion.select 
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      id="preference" 
                      name="preference" 
                      value={formData.preference}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    >
                      <option value="design">Design</option>
                      <option value="development">Development</option>
                      <option value="marketing">Marketing</option>
                    </motion.select>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="subscribe" 
                      name="subscribe" 
                      checked={formData.subscribe}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="subscribe" className="ml-2 block text-sm">
                      Subscribe to newsletter
                    </label>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg border-2 border-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Gesture Controls */}
        {activeTab === 'gestures' && (
          <div className="flex flex-col items-center">
            <div 
              ref={constraintsRef} 
              className="relative bg-gray-200 dark:bg-gray-700 rounded-xl w-full max-w-md h-64 mb-8 overflow-hidden"
            >
              <motion.div
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={true}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute w-20 h-20 rounded-full ${isDragging ? 'bg-accent' : 'bg-primary'} flex items-center justify-center text-white font-bold cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{ left: `calc(50% - 40px)`, top: `calc(50% - 40px)` }}
              >
                {isDragging ? 'Dragging!' : 'Drag Me!'}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold mb-4">Pinch & Zoom</h3>
                <motion.div
                  className="bg-primary text-white w-32 h-32 mx-auto rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Pinch/Zoom
                </motion.div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold mb-4">Swipe Gesture</h3>
                <motion.div
                  className="bg-accent text-white w-32 h-32 mx-auto rounded-xl flex items-center justify-center"
                  drag="x"
                  dragConstraints={{ left: -50, right: 50 }}
                  dragElastic={0.5}
                >
                  Swipe Me
                </motion.div>
              </div>
            </div>
          </div>
        )}
        
        {/* Advanced Animations */}
        {activeTab === 'animations' && (
          <div className="flex flex-col items-center">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm ${
                  animationVariant === 'fade' 
                    ? 'bg-accent text-white font-bold shadow-lg border-2 border-accent' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnimationVariant('fade')}
              >
                Fade
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm ${
                  animationVariant === 'slide' 
                    ? 'bg-accent text-white font-bold shadow-lg border-2 border-accent' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnimationVariant('slide')}
              >
                Slide
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm ${
                  animationVariant === 'scale' 
                    ? 'bg-accent text-white font-bold shadow-lg border-2 border-accent' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnimationVariant('scale')}
              >
                Scale
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm ${
                  animationVariant === 'rotate' 
                    ? 'bg-accent text-white font-bold shadow-lg border-2 border-accent' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnimationVariant('rotate')}
              >
                Rotate
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={animationVariant}
                  className="col-span-3 bg-gray-200 dark:bg-gray-700 rounded-xl p-8 flex flex-col items-center"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={animationVariants[animationVariant]}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-center">{animationVariant.charAt(0).toUpperCase() + animationVariant.slice(1)} Animation</h3>
                  <p className="text-center mb-6">Click the buttons above to change the animation type</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {[1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        className="bg-primary text-white rounded-lg p-4 flex items-center justify-center"
                        variants={animationVariants[animationVariant]}
                        transition={{ duration: 0.5, delay: item * 0.1 }}
                      >
                        Item {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Interact with the elements to see various animations and effects.
      </div>
    </div>
  );
};

export default InteractiveFeatures;

// This is just to show the styles, they should be added to your CSS
