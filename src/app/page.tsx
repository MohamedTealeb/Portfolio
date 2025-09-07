'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { useForm, ValidationError } from '@formspree/react';
import Image from 'next/image';
import Link from "next/link";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const typewriterMernRef = useRef<HTMLSpanElement>(null);
  const typewriterStackRef = useRef<HTMLSpanElement>(null);
  const [starsData, setStarsData] = useState<Array<{
    type: 'star' | 'twinkle' | 'dot' | 'planet';
    size: number;
    left: number;
    top: number;
    opacity: number;
    id: string;
    color?: string;
    rings?: boolean;
    depth?: number;
    orbitRadius?: number;
    orbitSpeed?: number;
    orbitCenter?: { x: number; y: number };
    initialAngle?: number;
  }>>([]);

  // Load dark mode from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    // Generate 3D space objects data once on client side
    const generateStarsData = () => {
      const objects = [];
      const planetColors = [
        '#FF6B6B', // Mars-like red
        '#4ECDC4', // Neptune-like blue
        '#45B7D1', // Uranus-like cyan
        '#FFA07A', // Venus-like orange
        '#98D8C8', // Earth-like green-blue
        '#F7DC6F', // Jupiter-like yellow
        '#BB8FCE', // Purple planet
        '#85C1E9', // Ice planet blue
      ];
      
      // Define orbital centers (gravitational centers)
      const orbitCenters = [
        { x: 20, y: 30 }, // Top-left system
        { x: 75, y: 25 }, // Top-right system
        { x: 50, y: 70 }, // Bottom-center system
      ];

      // Planets with orbital system
      for (let i = 0; i < 6; i++) {
        const centerIndex = Math.floor(i / 2); // 2 planets per system
        const isMainPlanet = i % 2 === 0; // Every first planet is larger (like a sun)
        const orbitRadius = isMainPlanet ? 0 : Math.random() * 150 + 80; // Main planets don't orbit
        const size = isMainPlanet ? Math.random() * 40 + 60 : Math.random() * 30 + 20;
        
        objects.push({
          type: 'planet' as const,
          size: size,
          left: orbitCenters[centerIndex].x,
          top: orbitCenters[centerIndex].y,
          opacity: isDarkMode ? Math.random() * 0.8 + 0.6 : Math.random() * 0.7 + 0.5,
          id: `planet-${i}`,
          color: planetColors[i % planetColors.length],
          rings: Math.random() > 0.7, // 30% chance of rings
          depth: Math.random() * 0.8 + 0.2,
          orbitRadius: orbitRadius,
          orbitSpeed: isMainPlanet ? 0 : Math.random() * 0.5 + 0.2, // Main planets don't move
          orbitCenter: orbitCenters[centerIndex],
          initialAngle: Math.random() * 360, // Random starting position
        });
      }
      
      // Regular stars - reduced count
      for (let i = 0; i < 30; i++) {
        objects.push({
          type: 'star' as const,
          size: Math.random() * 15 + 5,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.4 + 0.3 : Math.random() * 0.3 + 0.2,
          id: `star-${i}`,
          depth: Math.random() * 1 + 0.5,
        });
      }
      
      // Twinkling stars
      for (let i = 0; i < 20; i++) {
        objects.push({
          type: 'twinkle' as const,
          size: Math.random() * 12 + 4,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.5 + 0.2 : Math.random() * 0.4 + 0.1,
          id: `twinkle-${i}`,
          depth: Math.random() * 0.8 + 0.3,
        });
      }
      
      // Dot stars - distant stars
      for (let i = 0; i < 25; i++) {
        objects.push({
          type: 'dot' as const,
          size: Math.random() * 3 + 1,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.7 + 0.3 : Math.random() * 0.5 + 0.2,
          id: `dot-star-${i}`,
          depth: Math.random() * 0.5 + 0.1,
        });
      }
      
      return objects;
    };

    setStarsData(generateStarsData());
    setIsVisible(true);

    // Typewriter effect for MERN and Stack separately
    const mernText = "MERN";
    const stackText = "Stack";
    
    console.log('Typewriter texts:', { mernText, stackText });
    
    if (typewriterMernRef.current && typewriterStackRef.current) {
      typewriterMernRef.current.textContent = "";
      typewriterStackRef.current.textContent = "";
      
      // Create typewriter animation
      const tl = gsap.timeline();
      
      // First show the hero title container
      tl.from('.hero-title', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
      });

      // Animate MERN first
      mernText.split('').forEach((char, index) => {
        const typingDelay = 0.08; // Fixed delay for consistency
        tl.to(typewriterMernRef.current, {
          duration: 0.02,
          ease: 'none',
          onComplete: () => {
            if (typewriterMernRef.current) {
              typewriterMernRef.current.textContent += char;
            }
          }
        }, index * typingDelay + 0.8);
      });

      // Animate Stack after MERN with a small pause
      stackText.split('').forEach((char, index) => {
        const typingDelay = 0.08; // Fixed delay for consistency
        tl.to(typewriterStackRef.current, {
          duration: 0.02,
          ease: 'none',
          onComplete: () => {
            if (typewriterStackRef.current) {
              typewriterStackRef.current.textContent += char;
            }
          }
        }, index * typingDelay + 1.2); // Start Stack after MERN
      });

      // Add cursor blinking effect - start after MERN is complete
      const blinkingTween = gsap.to('.typewriter-cursor', {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
      
      // Start blinking after MERN is complete
      tl.add(() => {
        blinkingTween.play();
      }, 1.1);

      // Stop blinking and hide cursor after typing is complete
      // Stack has 5 characters, so it finishes at 1.2 + (5 * 0.08) = 1.64s
      tl.add(() => {
        blinkingTween.kill();
        gsap.set('.typewriter-cursor', {
          opacity: 0,
          display: 'none'
        });
      }, 1.7); // Hide cursor 0.1s after Stack is complete

      // Animate other elements
      tl.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
      }, '-=0.5')
      .from('.hero-buttons', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
      }, '-=0.3');
    }

    // About section scroll animation
    gsap.fromTo(aboutRef.current, 
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Professional skills animation with subtle effects
    gsap.fromTo('.skill-card',
      { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Subtle floating animation for skills
    gsap.to('.skill-card', {
      y: -3,
      duration: 2.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.15,
        repeat: -1,
      }
    });

    // Gentle progress bar animation on scroll
    gsap.set('.skill-card .transform', { scaleX: 0 });
    
    gsap.to('.skill-card .transform', {
      scaleX: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: skillsRef.current,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    });

    // Projects animation
    gsap.fromTo('.project-card',
      { opacity: 0, y: 80, rotationX: 45 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Contact section animation
    gsap.fromTo(contactRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );


    // Add bounce class to interactive elements
    document.querySelectorAll('.interactive-card').forEach(card => {
      card.classList.add('bounce-element');
    });

    // Floating animation for hero emoji
    gsap.to('.floating-emoji', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1
    });

    // Add subtle bounce animation to floating elements
    gsap.to('.bounce-element', {
      y: -5,
      duration: 1.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });

    // Enhanced 3D space objects with orbital systems
    if (backgroundRef.current) {
      const spaceObjects = backgroundRef.current.querySelectorAll('.bg-shape');
      const orbitContainers = backgroundRef.current.querySelectorAll('.orbit-container');
      
      // Animate central planets (suns)
      const centralPlanets = backgroundRef.current.querySelectorAll('.central-planet');
      centralPlanets.forEach((planet, index) => {
        // Self rotation
        gsap.to(planet, {
          rotationY: 360,
          duration: `random(12, 18)`,
          ease: 'none',
          repeat: -1,
        });
        
        // Subtle floating movement for central planets
        gsap.to(planet, {
          x: `random(-10, 10)`,
          y: `random(-8, 8)`,
          duration: `random(40, 60)`,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 1,
        });
        
        // Pulsing glow effect
        gsap.to(planet, {
          scale: `random(0.95, 1.05)`,
          duration: `random(6, 10)`,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.5,
        });
      });
      
      // Animate orbiting planets
      const orbitingPlanets = backgroundRef.current.querySelectorAll('.orbiting-planet');
      orbitingPlanets.forEach((planet, index) => {
        // Self rotation (different from orbital rotation)
        gsap.to(planet, {
          rotationY: 360,
          duration: `random(8, 15)`,
          ease: 'none',
          repeat: -1,
        });
        
        // Slight wobble for realism
        gsap.to(planet, {
          rotationX: `random(-5, 5)`,
          duration: `random(3, 6)`,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      });
      
      // Animate orbit containers for slight variations
      orbitContainers.forEach((container, index) => {
        // Very subtle orbital plane tilting
        gsap.to(container, {
          rotationX: `random(-2, 2)`,
          rotationZ: `random(-1, 1)`,
          duration: `random(50, 80)`,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 2,
        });
      });
      
      // Star animations (unchanged but enhanced)
      const stars = backgroundRef.current.querySelectorAll('.bg-shape:not(.planet-3d)');
      stars.forEach((star, index) => {
        gsap.to(star, {
          x: `random(-15, 15)`,
          y: `random(-12, 12)`,
          duration: `random(30, 50)`,
          ease: 'none',
          repeat: -1,
          yoyo: true,
          delay: index * 0.1,
        });
        
        // Enhanced twinkling for stars
        gsap.to(star, {
          opacity: `random(0.3, 1)`,
          duration: `random(1, 3)`,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.05,
        });

        // Scale pulsing with 3D effect
        if (index % 5 === 0) {
          gsap.to(star, {
            scale: `random(0.8, 1.2)`,
            rotationZ: `random(-90, 90)`,
            duration: `random(5, 12)`,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.2,
          });
        }
      });
    }

    // Mouse interaction with 3D space objects
    const handleMouseMove = (e: MouseEvent) => {
      if (heroSectionRef.current && backgroundRef.current) {
        const heroRect = heroSectionRef.current.getBoundingClientRect();
        const mouseX = e.clientX - heroRect.left;
        const mouseY = e.clientY - heroRect.top;
        const centerX = heroRect.width / 2;
        const centerY = heroRect.height / 2;
        
        // Calculate mouse position relative to center (-1 to 1)
        const normalizedX = (mouseX - centerX) / centerX;
        const normalizedY = (mouseY - centerY) / centerY;
        
        const spaceObjects = backgroundRef.current.querySelectorAll('.bg-shape');
        spaceObjects.forEach((object: Element, index) => {
          const htmlObject = object as HTMLElement;
          const isPlanet = htmlObject.classList.contains('planet-3d');
          const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
          const influence = Math.max(0, 1 - distance * 0.5);
          
          if (isPlanet) {
            // Planets have stronger, more 3D movement
            const moveX = normalizedX * (30 + index % 15) * influence;
            const moveY = normalizedY * (25 + index % 12) * influence;
            const moveZ = normalizedX * normalizedY * 50 * influence;
            
            gsap.to(htmlObject, {
              x: moveX,
              y: moveY,
              z: moveZ,
              rotationY: normalizedX * 45 * influence,
              rotationX: normalizedY * 30 * influence,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          } else {
            // Stars have lighter movement
            const moveX = normalizedX * (15 + index % 8) * influence;
            const moveY = normalizedY * (12 + index % 6) * influence;
            
            gsap.to(htmlObject, {
              x: moveX,
              y: moveY,
              rotationZ: normalizedX * 20 * influence,
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      }
    };

    // Add mouse move listener to hero section
    if (heroSectionRef.current) {
      heroSectionRef.current.addEventListener('mousemove', handleMouseMove);
      
      // Reset space objects position when mouse leaves
      heroSectionRef.current.addEventListener('mouseleave', () => {
        if (backgroundRef.current) {
          const spaceObjects = backgroundRef.current.querySelectorAll('.bg-shape');
          spaceObjects.forEach((object: Element) => {
            const htmlObject = object as HTMLElement;
            const isPlanet = htmlObject.classList.contains('planet-3d');
            
            if (isPlanet) {
              gsap.to(object, {
                x: 0,
                y: 0,
                z: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 1.5,
                ease: 'power2.out'
              });
            } else {
              gsap.to(object, {
                x: 0,
                y: 0,
                rotationZ: 0,
                duration: 1,
                ease: 'power2.out'
              });
            }
          });
        }
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Remove mouse event listeners
      const currentHeroRef = heroSectionRef.current;
      if (currentHeroRef) {
        currentHeroRef.removeEventListener('mousemove', handleMouseMove);
        currentHeroRef.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  // Update space objects opacity when dark mode changes
  useEffect(() => {
    if (starsData.length > 0) {
      setStarsData(prevObjects => 
        prevObjects.map(object => ({
          ...object,
          opacity: object.type === 'planet'
            ? (isDarkMode ? Math.random() * 0.8 + 0.6 : Math.random() * 0.7 + 0.5)
            : object.type === 'star' 
            ? (isDarkMode ? Math.random() * 0.4 + 0.3 : Math.random() * 0.3 + 0.2)
            : object.type === 'twinkle'
            ? (isDarkMode ? Math.random() * 0.5 + 0.2 : Math.random() * 0.4 + 0.1)
            : (isDarkMode ? Math.random() * 0.7 + 0.3 : Math.random() * 0.5 + 0.2)
        }))
      );
    }
  }, [isDarkMode]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: element,
          offsetY: 80 // Account for fixed navbar height
        },
        ease: "power2.inOut"
      });
    }
  };

  const skills = [
    { name: 'MongoDB', icon: 'M', category: 'Database', color: 'from-green-500 to-green-600' },
    { name: 'Express.js', icon: 'E', category: 'Backend', color: 'from-gray-600 to-gray-700' },
    { name: 'React', icon: 'R', category: 'Frontend', color: 'from-blue-500 to-blue-600' },
    { name: 'Node.js', icon: 'N', category: 'Backend', color: 'from-green-600 to-green-700' },
    { name: 'TypeScript', icon: 'TS', category: 'Language', color: 'from-blue-600 to-blue-700' },
    { name: 'JavaScript', icon: 'JS', category: 'Language', color: 'from-yellow-500 to-yellow-600' },
    { name: 'SQL', icon: 'SQL', category: 'Database', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Next.js', icon: 'N', category: 'Framework', color: 'from-gray-800 to-black' },
    { name: 'Tailwind', icon: 'TW', category: 'Styling', color: 'from-cyan-500 to-cyan-600' },
    { name: 'Material-UI', icon: 'MUI', category: 'UI Library', color: 'from-blue-600 to-purple-600' },
    { name: 'Shadcn/UI', icon: 'SH', category: 'UI Library', color: 'from-purple-500 to-purple-600' },
    { name: 'Git', icon: 'Git', category: 'Version Control', color: 'from-orange-500 to-orange-600' },
    { name: 'Docker', icon: 'D', category: 'DevOps', color: 'from-blue-500 to-blue-600' },
    { name: 'AWS', icon: 'AWS', category: 'Cloud', color: 'from-orange-400 to-orange-500' },
    { name: 'React Query', icon: 'RQ', category: 'Data Fetching', color: 'from-red-500 to-pink-600' },
    { name: 'Redux', icon: 'RX', category: 'State Mgmt', color: 'from-purple-600 to-purple-700' }
  ];

  const projects = [
    {
      title: 'Online Coaching Platform',
      description: 'Developed a front-end web application using React.js and Tailwind CSS with static data. Created a public landing page showcasing offers, contact details, and social media links.',
      tech: ['React.js', 'Tailwind CSS', 'JavaScript'],
      features: ['Login Simulation', 'Diet Plans Display', 'Workout Routines', 'Responsive UI'],
      demo: 'https://online-coach-sigma.vercel.app/',
      image: '/projects/Screenshot 2025-09-07 110553.png'
    },
    {
      title: 'IPEK E-commerce Website',
      description: 'Freelance E-commerce Website - Implemented state management using React Context API for efficient data flow. Built a user-friendly product catalog for mattresses and accessories.',
      tech: ['React.js', 'Context API', 'CSS'],
      features: ['Product Catalog', 'Admin Dashboard', 'Order Management', 'Clean Design'],
      demo: 'https://ipck.vercel.app/',
      image: '/projects/Screenshot 2025-09-07 110720.png'
    },
    {
      title: 'RYO T-shirt Store',
      description: 'Freelance E-commerce Website - Developed a responsive e-commerce website for selling T-shirts using React.js and Material-UI.',
      tech: ['React.js', 'Material-UI', 'JavaScript'],
      features: ['Product Inventory', 'Size Management', 'Order Tracking', 'Admin Dashboard'],
      demo: 'https://ve-client.vercel.app/',
        image: '/projects/Screenshot 2025-09-07 110916.png'
    },
    {
      title: 'E-MO Multilingual Website',
      description: 'Freelance Project – Multilingual Website Development. Developed a responsive web application using Next.js with translations in Dutch and French.',
      tech: ['Next.js', 'JavaScript', 'CSS'],
      features: ['Multilingual Support', 'SEO Optimization', 'Responsive Design', 'Performance Optimization'],
      demo: 'https://e-mo-two.vercel.app/',
      image: '/projects/Screenshot 2025-09-07 110954.png'
    },
    {
      title: 'Fajr Al-Khair Charity Platform',
      description: 'Freelance Project - Developed a charity donation platform using Next.js and Next Router. Built a user-friendly interface to facilitate donation collection.',
      tech: ['Next.js', 'Next Router', 'CSS'],
      features: ['Donation System', 'Multi-page Routing', 'Accessibility', 'Responsive Design'],
     
      demo: 'https://fajr-alkhayr.vercel.app/',
      image: '/projects/Screenshot 2025-09-07 111024.png'
    }
  ];
  const [state, handleSubmit] = useForm("xandaqbk");
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      {/* Navigation */}
      <nav className={`navbar fixed top-0 w-full backdrop-blur-sm shadow-lg z-50 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16 relative">
            {/* Desktop Menu - Centered */}
            <div className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8">
              <button onClick={() => scrollToSection('home')} className={`transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Home</button>
              <button onClick={() => scrollToSection('about')} className={`transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>About</button>
              <button onClick={() => scrollToSection('skills')} className={`transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Skills</button>
              <button onClick={() => scrollToSection('projects')} className={`transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Projects</button>
              <button onClick={() => scrollToSection('contact')} className={`transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Contact</button>
            </div>
            
            {/* Dark Mode Toggle - Positioned absolutely to the right */}
            <div className="absolute right-0">
              <ThemeToggleButton 
                isDarkMode={isDarkMode} 
                onToggle={() => setIsDarkMode(!isDarkMode)}
              />
            </div>
            
            {/* Mobile Menu Button - Positioned absolutely to the left on mobile */}
            <div className="md:hidden absolute left-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden absolute top-16 left-0 right-0 backdrop-blur-sm shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
              <div className="px-4 py-3 space-y-3 text-center">
                <button onClick={() => {scrollToSection('home'); setIsMobileMenuOpen(false);}} className={`block w-full text-center px-3 py-2 rounded-md transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Home</button>
                <button onClick={() => {scrollToSection('about'); setIsMobileMenuOpen(false);}} className={`block w-full text-center px-3 py-2 rounded-md transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>About</button>
                <button onClick={() => {scrollToSection('skills'); setIsMobileMenuOpen(false);}} className={`block w-full text-center px-3 py-2 rounded-md transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Skills</button>
                <button onClick={() => {scrollToSection('projects'); setIsMobileMenuOpen(false);}} className={`block w-full text-center px-3 py-2 rounded-md transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Projects</button>
                <button onClick={() => {scrollToSection('contact'); setIsMobileMenuOpen(false);}} className={`block w-full text-center px-3 py-2 rounded-md transition-colors font-medium ${isDarkMode ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>Contact</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroSectionRef} className={`relative overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        {/* 3D Space Background with Orbital Systems - Only in Hero Section */}
        <div ref={backgroundRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: '1000px' }}>
          {isVisible && starsData.map((object) => {
            if (object.type === 'planet') {
              const isCentralPlanet = object.orbitRadius === 0;
              const orbitSpeed = object.orbitSpeed || 0;
              const orbitAnimationName = orbitSpeed > 0.4 ? 'orbitFast' : orbitSpeed > 0.3 ? 'orbitMedium' : 'orbitSlow';
              const orbitDuration = orbitSpeed > 0 ? `${30 / orbitSpeed}s` : '0s';
              
              if (isCentralPlanet) {
                // Central planet (sun-like)
                return (
                  <div
                    key={object.id}
                    className={`bg-shape absolute central-planet planet-3d transform-gpu transition-all duration-1000`}
                    style={{
                      left: `${object.left}%`,
                      top: `${object.top}%`,
                      width: `${object.size}px`,
                      height: `${object.size}px`,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 30%, ${object.color}ff, ${object.color}aa, ${object.color}44)`,
                      opacity: object.opacity,
                      boxShadow: `
                        0 0 ${object.size * 0.8}px ${object.color}66,
                        0 0 ${object.size * 1.2}px ${object.color}33,
                        inset -${object.size * 0.1}px -${object.size * 0.1}px ${object.size * 0.2}px rgba(0,0,0,0.3),
                        inset ${object.size * 0.05}px ${object.size * 0.05}px ${object.size * 0.1}px rgba(255,255,255,0.4)
                      `,
                      transform: `translateZ(${(object.depth || 0.5) * 100}px)`,
                      animation: `planetRotate ${15}s infinite linear, centralGlow 6s ease-in-out infinite`,
                      '--planet-color': object.color,
                    } as React.CSSProperties}
                  >
                    {object.rings && (
                      <div 
                        className="absolute inset-0 rounded-full border-2 opacity-60"
                        style={{
                          borderColor: `${object.color}aa`,
                          transform: 'rotateX(75deg) scale(1.6)',
                          borderStyle: 'solid',
                          borderWidth: '2px',
                          animation: `ringRotate ${20}s infinite linear`,
                        }}
                      />
                    )}
                  </div>
                );
              } else {
                // Orbiting planet
                return (
                  <div
                    key={`orbit-${object.id}`}
                    className="orbit-container"
                    style={{
                      left: `${object.orbitCenter?.x}%`,
                      top: `${object.orbitCenter?.y}%`,
                      width: `${(object.orbitRadius || 0) * 2}px`,
                      height: `${(object.orbitRadius || 0) * 2}px`,
                      '--orbit-radius': `${object.orbitRadius}px`,
                      animation: `${orbitAnimationName} ${orbitDuration} infinite linear`,
                      transform: `translate(-50%, -50%) rotate(${object.initialAngle}deg)`,
                    } as React.CSSProperties}
                  >
                    <div
                      className={`bg-shape orbiting-planet planet-3d transform-gpu`}
                      style={{
                        width: `${object.size}px`,
                        height: `${object.size}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 30% 30%, ${object.color}dd, ${object.color}66, ${object.color}22)`,
                        opacity: object.opacity,
                        boxShadow: `
                          0 0 ${object.size * 0.5}px ${object.color}44,
                          inset -${object.size * 0.1}px -${object.size * 0.1}px ${object.size * 0.2}px rgba(0,0,0,0.3),
                          inset ${object.size * 0.05}px ${object.size * 0.05}px ${object.size * 0.1}px rgba(255,255,255,0.2)
                        `,
                        transform: `translateZ(${(object.depth || 0.5) * 50}px)`,
                        animation: `planetRotate ${10 + Math.random() * 10}s infinite linear`,
                      }}
                    >
                      {object.rings && (
                        <div 
                          className="absolute inset-0 rounded-full border opacity-50"
                          style={{
                            borderColor: `${object.color}66`,
                            transform: 'rotateX(75deg) scale(1.3)',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            animation: `ringRotate ${12}s infinite linear`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              }
            } else {
              // Stars and other objects (unchanged)
              return (
                <div
                  key={object.id}
                  className={`bg-shape absolute transform-gpu transition-all duration-1000 ${
                    object.type === 'dot' ? `rounded-full ${isDarkMode ? 'bg-white' : 'bg-white'}` : ''
                  }`}
                  style={{
                    left: `${object.left}%`,
                    top: `${object.top}%`,
                    transform: `translateZ(${(object.depth || 0.5) * 100}px)`,
                    ...(object.type === 'dot' 
                      ? {
                          width: `${object.size}px`,
                          height: `${object.size}px`,
                          opacity: object.opacity,
                          boxShadow: isDarkMode 
                            ? `0 0 ${object.size * 3}px rgba(255,255,255,0.4)` 
                            : `0 0 ${object.size * 2}px rgba(0,0,0,0.3)`,
                          filter: `blur(${(1 - (object.depth || 0.5)) * 1}px)`,
                        }
                      : {
                          fontSize: `${object.size}px`,
                          opacity: object.opacity,
                          color: isDarkMode ? '#ffffff' : '#000000',
                          textShadow: `0 0 ${object.size * 0.5}px currentColor`,
                          filter: `blur(${(1 - (object.depth || 0.5)) * 0.5}px)`,
                        }
                    )
                  }}
                >
                  {object.type === 'star' ? '⭐' : object.type === 'twinkle' ? '✨' : ''}
                </div>
              );
            }
          })}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <span ref={typewriterMernRef}></span>
                <span className="inline-block w-4 sm:w-6"></span>
                <span ref={typewriterStackRef}></span>
                <span className={`typewriter-cursor transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>|</span>
              </span>
              <br />
              <span className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>Developer</span>
            </h1>
            <p className={`hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Full Stack Developer specializing in MongoDB, Express.js, React, and Node.js.
              Building modern, scalable web applications with cutting-edge technologies.
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
      
      <Link href="#projects">
        <button
          className={`cursor-pointer w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 shadow-lg hover:shadow-xl animate-pulse hover:animate-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDarkMode
              ? "bg-white text-black hover:bg-gray-200 hover:text-black focus:ring-white"
              : "bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30 hover:bg-white hover:text-black focus:ring-black"
          }`}
        >
          View My Work
        </button>
      </Link>
      <Link href="#contact">
      <button
        className={`cursor-pointer w-full sm:w-auto border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-200 ease-out transform hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDarkMode
            ? "border-white text-white hover:border-gray-300 hover:text-gray-300 focus:ring-white"
            : "border-black text-black hover:border-black hover:text-black focus:ring-black"
        }`}
      >
        Contact Me
      </button>
      </Link>
    </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`} ref={aboutRef}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Personal Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Left Column */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Name */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">Name</div>
                <div className="text-lg sm:text-xl font-bold">Mohamed Tealeb</div>
              </div>

              {/* Role */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">Role</div>
                <div className="text-lg sm:text-xl font-bold">MERN Stack Developer</div>
              </div>

              {/* Location */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">Location</div>
                <div className="text-lg sm:text-xl font-bold">Egypt </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6 sm:space-y-8">

              {/* Email */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">Email</div>
                <div className="text-lg sm:text-xl font-bold">
                  <a href="mailto: mohamedtealeb088@gmail.com" className="hover:underline">
                 mohamedtealeb088@gmail.com
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">LinkedIn</div>
                <div className="text-lg sm:text-xl font-bold">
                  <a href="https://linkedin.com/in/mohamed-ayman-25ba6326a/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    linkedin.com/in//mohamed-tealeb
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className={`p-4 sm:p-6 rounded-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-black bg-opacity-20 backdrop-blur-md text-white' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30'}`}>
                <div className="text-sm sm:text-base font-medium opacity-80 mb-2">GitHub</div>
                <div className="text-lg sm:text-xl font-bold">
                  <a href="https://github.com/MohamedTealeb" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    github.com/MohamedTealeb
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`} ref={skillsRef}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className={`skill-card group relative p-6 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:-translate-y-2 cursor-pointer border ${isDarkMode ? 'bg-white bg-opacity-5 backdrop-blur-sm border-white border-opacity-20 hover:bg-opacity-10 hover:border-opacity-40' : 'bg-white border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'}`}
              >
                {/* Skill Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${skill.color} text-white shadow-lg`}>
                    {skill.icon}
                  </div>
                </div>
                
                {/* Skill Name */}
                <h3 className={`text-center font-semibold text-base mb-2 transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-gray-800'}`}>
                  {skill.name}
                </h3>
                
                {/* Category Badge */}
                <div className="flex justify-center">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${isDarkMode ?'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                    {skill.category}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className={`mt-4 h-1 rounded-full overflow-hidden ${isDarkMode ? 'bg-white bg-opacity-20' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 group-hover:w-full transform origin-left scale-x-0`}
                    style={{ '--target-width': `${70 + (index % 4) * 10}%` } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`} ref={projectsRef}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Featured Projects
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className={`project-card group rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg flex flex-col ${isDarkMode ? 'bg-black bg-opacity-80 backdrop-blur-sm hover:bg-opacity-90' : 'bg-white border-2 border-gray-200 hover:border-gray-300'}`}
              >
                {/* Project Image */}
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-white bg-opacity-10' : 'bg-gray-100'}`}>
                      <div className={`text-4xl transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-400'}`}>
                        🖥️
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content that can grow */}
                <div className="flex-grow">
                  <h3 className={`text-lg sm:text-xl font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>{project.title}</h3>
                  <p className={`mb-4 text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.description}</p>
                  
                  <div className="mb-4">
                    <h4 className={`text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Technologies:</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-1 text-xs rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-black bg-opacity-60 text-white border border-white border-opacity-30' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h4 className={`text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Key Features:</h4>
                    <ul className={`text-xs space-y-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className={`mr-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>•</span>
                          <span>{feature}</span>
            </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Button always at bottom */}
                <div className="flex justify-center mt-auto">
                  <a
                    href={project.demo}
                    className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`} ref={contactRef}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent'}`}>
            Let&apos;s Work Together
          </h2>
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
       <form 
         onSubmit={handleSubmit}
         className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
           isDarkMode 
             ? 'bg-black' 
             : 'bg-white border border-gray-200 shadow-lg'
         }`}
       >
        {/* Success Message */}
        {state.succeeded && (
          <p className="text-green-500 font-semibold text-center mb-4">
            ✅ Your message has been sent successfully!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
               className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                 isDarkMode 
                   ? 'bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
                   : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
               }`}
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
               className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                 isDarkMode 
                   ? 'bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
                   : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
               }`}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>
        </div>

        {/* Subject Input */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            name="subject"
            placeholder="Project Subject"
               className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                 isDarkMode 
                   ? 'bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
                   : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
               }`}
          />
        </div>

        {/* Message Textarea */}
        <div className="mb-6 sm:mb-8">
          <textarea
            rows={5}
            name="message"
            placeholder="Tell me about your project..."
            required
             className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
               isDarkMode 
                 ? 'bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
                 : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
             }`}
          ></textarea>
          <ValidationError prefix="Message" field="message" errors={state.errors} />
        </div>

        {/* Submit Button */}
        <div className="text-center">
           <button
             type="submit"
             disabled={state.submitting}
             className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
               isDarkMode 
                 ? 'bg-black text-white hover:bg-black-800 shadow-black/25' 
                 : 'bg-black text-white hover:bg-gray-800'
             }`}
           >
            {state.submitting ? "Sending..." : "Send Message →"}
          </button>
        </div>
      </form>
    </div>

         
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto text-center">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-4">
            <a 
              href="https://github.com/MohamedTealeb" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`transition-colors duration-300 hover:scale-110 transform ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            <a 
              href="https://wa.me/+201555157722" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`transition-colors duration-300 hover:scale-110 transform ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'}`}
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
              </svg>
            </a>
            
            <a 
              href="mailto:mohamedtealeb088@gmail.com" 
              className={`transition-colors duration-300 hover:scale-110 transform ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'}`}
              aria-label="Gmail"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
            </a>
          </div>
          
          <p className={`text-sm sm:text-base transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2024 MERN Stack Developer. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}