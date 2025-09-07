'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ThemeToggleButton } from '@/components/theme-toggle';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const typewriterMernRef = useRef<HTMLSpanElement>(null);
  const typewriterStackRef = useRef<HTMLSpanElement>(null);
  const [starsData, setStarsData] = useState<Array<{
    type: 'star' | 'twinkle' | 'dot';
    size: number;
    left: number;
    top: number;
    opacity: number;
    id: string;
  }>>([]);

  useEffect(() => {
    // Generate stars data once on client side
    const generateStarsData = () => {
      const stars = [];
      
      // Regular stars
      for (let i = 0; i < 50; i++) {
        stars.push({
          type: 'star' as const,
          size: Math.random() * 20 + 8,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.3 + 0.2 : Math.random() * 0.2 + 0.1,
          id: `star-${i}`
        });
      }
      
      // Twinkling stars
      for (let i = 0; i < 30; i++) {
        stars.push({
          type: 'twinkle' as const,
          size: Math.random() * 15 + 6,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.4 + 0.1 : Math.random() * 0.3 + 0.05,
          id: `twinkle-${i}`
        });
      }
      
      // Dot stars
      for (let i = 0; i < 40; i++) {
        stars.push({
          type: 'dot' as const,
          size: Math.random() * 4 + 2,
          left: Math.random() * 100,
          top: Math.random() * 100,
          opacity: isDarkMode ? Math.random() * 0.6 + 0.2 : Math.random() * 0.4 + 0.1,
          id: `dot-star-${i}`
        });
      }
      
      return stars;
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

    // Skills animation - floating effect
    gsap.fromTo('.skill-card',
      { opacity: 0, scale: 0, y: 100 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Add floating animation to skills
    gsap.to('.skill-card', {
      y: '+=10',
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.2,
        repeat: -1,
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

    // Toggle dark mode function
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle('dark');
    };

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

    // Animated background stars
    if (backgroundRef.current) {
      const stars = backgroundRef.current.querySelectorAll('.bg-shape');
      stars.forEach((star, index) => {
        // Gentle floating movement
        gsap.to(star, {
          x: `random(-30, 30)`,
          y: `random(-20, 20)`,
          duration: `random(20, 40)`,
          ease: 'none',
          repeat: -1,
          yoyo: true,
          delay: index * 0.3,
        });
        
        // Twinkling effect
        gsap.to(star, {
          opacity: `random(0.1, 0.8)`,
          duration: `random(2, 6)`,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });

        // Scale pulsing for some stars
        if (index % 3 === 0) {
          gsap.to(star, {
            scale: `random(0.8, 1.2)`,
            duration: `random(3, 8)`,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.4,
          });
        }
      });
    }

    // Mouse interaction with stars
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
        
        const stars = backgroundRef.current.querySelectorAll('.bg-shape');
        stars.forEach((star: Element, index) => {
          const htmlStar = star as HTMLElement;
          const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
          const influence = Math.max(0, 1 - distance);
          
          // Move stars based on mouse position with different speeds
          const moveX = normalizedX * (20 + index % 10) * influence;
          const moveY = normalizedY * (15 + index % 8) * influence;
          
          gsap.to(htmlStar, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      }
    };

    // Add mouse move listener to hero section
    if (heroSectionRef.current) {
      heroSectionRef.current.addEventListener('mousemove', handleMouseMove);
      
      // Reset stars position when mouse leaves
      heroSectionRef.current.addEventListener('mouseleave', () => {
        if (backgroundRef.current) {
          const stars = backgroundRef.current.querySelectorAll('.bg-shape');
          stars.forEach((star: Element) => {
            gsap.to(star, {
              x: 0,
              y: 0,
              duration: 1,
              ease: 'power2.out'
            });
          });
        }
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Remove mouse event listeners
      if (heroSectionRef.current) {
        heroSectionRef.current.removeEventListener('mousemove', handleMouseMove);
        heroSectionRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  // Update stars opacity when dark mode changes
  useEffect(() => {
    if (starsData.length > 0) {
      setStarsData(prevStars => 
        prevStars.map(star => ({
          ...star,
          opacity: star.type === 'star' 
            ? (isDarkMode ? Math.random() * 0.3 + 0.2 : Math.random() * 0.2 + 0.1)
            : star.type === 'twinkle'
            ? (isDarkMode ? Math.random() * 0.4 + 0.1 : Math.random() * 0.3 + 0.05)
            : (isDarkMode ? Math.random() * 0.6 + 0.2 : Math.random() * 0.4 + 0.1)
        }))
      );
    }
  }, [isDarkMode]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power2.inOut'
      });
    }
  };

  const skills = [
    { name: 'MongoDB', icon: '🍃', color: 'bg-green-500' },
    { name: 'Express.js', icon: '⚡', color: 'bg-gray-700' },
    { name: 'React', icon: '⚛️', color: 'bg-blue-500' },
    { name: 'Node.js', icon: '🟢', color: 'bg-green-600' },
    { name: 'TypeScript', icon: '📘', color: 'bg-blue-600' },
    { name: 'Next.js', icon: '▲', color: 'bg-white' },
    { name: 'Tailwind CSS', icon: '🎨', color: 'bg-cyan-500' },
    { name: 'Git', icon: '📚', color: 'bg-orange-500' }
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Stripe'],
      features: ['User Authentication', 'Payment Processing', 'Admin Dashboard', 'Real-time Updates'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Social Media App',
      description: 'Real-time social media platform with posts, comments, likes, and user profiles.',
      tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'JWT'],
      features: ['Real-time Chat', 'Image Upload', 'User Profiles', 'Post Interactions'],
      github: '#',
      demo: '#'
    },
    {
      title: 'Task Management System',
      description: 'Collaborative project management tool with team features and real-time updates.',
      tech: ['Next.js', 'TypeScript', 'MongoDB', 'Express.js'],
      features: ['Team Collaboration', 'Task Tracking', 'File Sharing', 'Progress Analytics'],
      github: '#',
      demo: '#'
    }
  ];

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
        {/* Stars Background - Only in Hero Section */}
        <div ref={backgroundRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {isVisible && starsData.map((star) => (
            <div
              key={star.id}
              className={`bg-shape absolute ${
                star.type === 'dot' 
                  ? `rounded-full ${isDarkMode ? 'bg-white' : 'bg-white'}` 
                  : ''
              }`}
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                ...(star.type === 'dot' 
                  ? {
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      opacity: star.opacity,
                      boxShadow: isDarkMode 
                        ? `0 0 ${star.size * 2}px rgba(255,255,255,0.3)` 
                        : `0 0 ${star.size * 1.5}px rgba(0,0,0,0.2)`,
                    }
                  : {
                      fontSize: `${star.size}px`,
                      opacity: star.opacity,
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }
                )
              }}
            >
              {star.type === 'star' ? '⭐' : star.type === 'twinkle' ? '✨' : ''}
            </div>
          ))}
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
              <button 
                onClick={() => scrollToSection('projects')}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl animate-pulse hover:animate-none ${isDarkMode ? 'bg-white text-black hover:bg-gray-200 hover:text-black' : 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30 hover:bg-white hover:text-black'}`}
              >
                View My Work
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`w-full sm:w-auto border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg ${isDarkMode ? 'border-white text-white hover:border-gray-300 hover:text-gray-300' : 'border-black text-black hover:border-black hover:text-black'}`}
              >
                Contact Me
              </button>
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
          <div className="relative min-h-[600px] max-w-4xl mx-auto">
            {skills.map((skill, index) => {
              // Random positioning for each skill
              const positions = [
                { top: '10%', left: '15%' },
                { top: '5%', left: '45%' },
                { top: '15%', left: '75%' },
                { top: '35%', left: '5%' },
                { top: '30%', left: '35%' },
                { top: '25%', left: '65%' },
                { top: '40%', left: '85%' },
                { top: '55%', left: '20%' },
                { top: '50%', left: '50%' },
                { top: '60%', left: '80%' },
                { top: '75%', left: '10%' },
                { top: '70%', left: '40%' },
                { top: '80%', left: '70%' },
                { top: '90%', left: '30%' },
                { top: '85%', left: '60%' }
              ];
              
              const position = positions[index] || { top: '50%', left: '50%' };
              
              return (
                <div
                  key={skill.name}
                  className={`skill-card group absolute p-3 sm:p-4 rounded-full transition-all duration-500 transform hover:scale-110 hover:shadow-xl border-2 shadow-md hover:rotate-3 cursor-pointer ${isDarkMode ? 'bg-black bg-opacity-80 backdrop-blur-sm border-white border-opacity-30 text-white hover:bg-opacity-90 hover:border-opacity-50' : 'bg-white bg-opacity-90 backdrop-blur-sm border-black border-opacity-30 text-black hover:bg-opacity-100 hover:border-opacity-50'}`}
                  style={{ 
                    top: position.top, 
                    left: position.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="text-center whitespace-nowrap">
                    <span className={`font-medium text-xs sm:text-sm transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {skill.name}
                    </span>
                  </div>
                </div>
              );
            })}
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
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`project-card group rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg ${isDarkMode ? 'bg-white hover:bg-white border-black hover:border-black' : 'bg-white hover:bg-white border-black hover:border-black'}`}
              >
                <h3 className={`text-lg sm:text-xl font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-black group-hover:text-black' : 'text-black group-hover:text-black'}`}>{project.title}</h3>
                <p className={`mb-4 text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-black'}`}>{project.description}</p>
                
                <div className="mb-4">
                  <h4 className={`text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-gray-800'}`}>Technologies:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors duration-300 ${isDarkMode ? 'bg-white bg-opacity-20 backdrop-blur-md text-black border border-white border-opacity-30 border-black hover:bg-white hover:text-black' : 'bg-white text-black border-black hover:bg-white hover:text-black'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className={`text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-gray-800'}`}>Key Features:</h4>
                  <ul className={`text-xs space-y-1 transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-black'}`}>
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className={`mr-2 transition-colors duration-300 ${isDarkMode ? 'text-black' : 'text-gray-800'}`}>•</span>
                        <span>{feature}</span>
          </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href={project.github}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border shadow-md hover:shadow-lg ${isDarkMode ? 'bg-white hover:bg-white hover:text-black text-black border-black' : 'bg-white hover:bg-white hover:text-black text-black border-black'}`}
                  >
                    GitHub
          </a>
          <a
                    href={project.demo}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-white hover:bg-gray-300 text-black' : 'bg-white hover:bg-gray-800 text-black'}`}
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
            Let's Work Together
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Ready to bring your ideas to life? Let's discuss your next project!
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="interactive-card p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode ? 'bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30' : 'bg-white border-gray-200 hover:border-gray-800'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">📧</div>
              <h3 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>Email</h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>your.email@example.com</p>
            </div>
            <div className="interactive-card p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode ? 'bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30' : 'bg-white border-gray-200 hover:border-gray-800'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">💼</div>
              <h3 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>LinkedIn</h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>linkedin.com/in/yourprofile</p>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode ? 'bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30' : 'bg-white border-gray-200 hover:border-gray-800'} shadow-lg hover:shadow-xl transition-all duration-300 group sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>GitHub</h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>github.com/yourusername</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <a
              href="mailto:your.email@example.com"
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl animate-pulse hover:animate-none ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-white hover:bg-gray-800 text-black hover:text-white'}`}
            >
              Get In Touch
        </a>
        <a
              href="#"
              className={`border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-md hover:shadow-lg ${isDarkMode ? 'border-white text-white hover:border-gray-300 hover:text-gray-300' : 'border-gray-800 hover:border-black text-gray-800 hover:text-black hover:bg-gray-50'}`}
            >
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-white ">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-300 text-sm sm:text-base">
            © 2024 MERN Stack Developer. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}