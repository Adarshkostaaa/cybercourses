import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, Zap, Lock, Code, Play } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [glitchText, setGlitchText] = useState('CYBERCOURSE');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Glitch effect for title
    const glitchInterval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const originalText = 'CYBERCOURSE';
      let glitched = '';
      
      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitched += originalText[i];
        }
      }
      
      setGlitchText(glitched);
      
      setTimeout(() => setGlitchText(originalText), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Mobile-First Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Floating Particles - Reduced for mobile */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
        
        {/* Scanning Lines - Mobile Optimized */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-30"></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse opacity-20" style={{ top: '30%', animationDelay: '1s' }}></div>
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-25" style={{ top: '70%', animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Mobile-First Content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Mobile-Optimized Logo */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 border-2 border-cyan-400 rounded-lg animate-ping opacity-20"></div>
            </div>
            <div className="text-4xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider text-center">
              {glitchText}
            </div>
          </div>
          
          {/* Mobile-Optimized Subtitle */}
          <div className="text-center">
            <div className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-mono mb-2">
              <span className="text-cyan-400">&gt;</span> HACK THE FUTURE
            </div>
            <div className="text-xs sm:text-sm lg:text-lg text-gray-500 font-mono">
              <span className="text-pink-400">[</span>CYBERSECURITY • VIDEO EDITING • PROGRAMMING<span className="text-pink-400">]</span>
            </div>
          </div>
        </div>

        {/* Mobile-First Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl w-full">
          {[
            { icon: Lock, title: 'ETHICAL HACKING', desc: 'Master penetration testing' },
            { icon: Code, title: 'PROGRAMMING', desc: 'Code like a cyber warrior' },
            { icon: Play, title: 'VIDEO EDITING', desc: 'Create digital masterpieces' }
          ].map((feature, i) => (
            <div
              key={i}
              className={`bg-black/50 border border-cyan-400/30 rounded-lg p-4 sm:p-6 backdrop-blur-sm hover:border-cyan-400 transition-all duration-500 hover:scale-105 ${isLoaded ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-cyan-400 font-mono text-sm sm:text-lg font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm text-center font-mono">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile-First Enter Button */}
        <div className="relative group mb-8 sm:mb-12">
          <button
            onClick={onEnter}
            className="relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-mono font-bold text-base sm:text-lg lg:text-xl rounded-lg overflow-hidden transition-all duration-300 hover:scale-110"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">ENTER THE MATRIX</span>
              <span className="sm:hidden">ENTER</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
        </div>
      </div>

      {/* Mobile-Optimized Corner Decorations */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-l-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-r-2 border-t-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-l-2 border-b-2 border-cyan-400 opacity-50"></div>
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-r-2 border-b-2 border-cyan-400 opacity-50"></div>
    </div>
  );
};

export default LandingPage;