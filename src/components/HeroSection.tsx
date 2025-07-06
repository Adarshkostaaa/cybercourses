import React, { useState, useEffect } from 'react';
import { Shield, Users, Award, BookOpen, Zap, Code, Lock, Play, ChevronRight, Star, Globe, Terminal } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');

  const heroTexts = [
    "Master Cybersecurity",
    "Learn Ethical Hacking", 
    "Build Digital Skills",
    "Code Like a Pro"
  ];

  const subTexts = [
    "& Digital Skills",
    "& Penetration Testing",
    "& Creative Arts", 
    "& Secure Systems"
  ];

  const terminalCommands = [
    "sudo apt install cybersecurity",
    "python3 hack_the_planet.py",
    "npm start digital-mastery",
    "gcc -o success learning.c"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typing effect for terminal
  useEffect(() => {
    const command = terminalCommands[currentText];
    let i = 0;
    setTypedText('');
    
    const typeInterval = setInterval(() => {
      if (i < command.length) {
        setTypedText(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentText]);

  return (
    <div className="relative bg-black text-white overflow-hidden min-h-screen flex items-center">
      {/* Clean Background - No Shadows */}
      <div className="absolute inset-0">
        {/* Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-pink-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/15 via-transparent to-green-900/15"></div>
        
        {/* Clean Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-400 font-mono animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${0.6 + Math.random() * 0.6}rem`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {['</>','{}','[]','()','&&','||','==','!=','++','--'][Math.floor(Math.random() * 10)]}
            </div>
          ))}
        </div>
        
        {/* Clean Glowing Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        {/* Mobile-First Hero Content */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Mobile-Optimized Title */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative mb-6 sm:mb-8">
              {/* Main Title - Mobile First */}
              <h1 className="relative text-3xl sm:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 font-mono leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  {heroTexts[currentText]}
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {subTexts[currentText]}
                </span>
              </h1>
            </div>
          </div>

          {/* Mobile-Optimized Subtitle */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto font-mono leading-relaxed px-2">
              Learn from industry experts with hands-on courses in 
              <span className="text-purple-400 font-bold"> ethical hacking</span>, 
              <span className="text-pink-400 font-bold"> video editing</span>, 
              <span className="text-cyan-400 font-bold"> programming</span>, and more
            </p>
            
            {/* Mobile Terminal */}
            <div className="bg-black/60 border border-cyan-400/40 rounded-lg p-3 sm:p-4 max-w-full sm:max-w-2xl mx-auto mb-6 sm:mb-8 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-gray-400 text-xs sm:text-sm font-mono ml-2 sm:ml-4">terminal</span>
              </div>
              <div className="text-left font-mono text-xs sm:text-sm overflow-x-auto">
                <span className="text-green-400">user@cybercourse:~$</span> 
                <span className="text-white ml-2">{typedText}</span>
                <span className="animate-ping text-green-400 ml-1">|</span>
              </div>
            </div>
          </div>

          {/* Mobile-First CTA Buttons */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
              <button className="group relative bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 font-mono border-2 border-cyan-400/50 hover:border-cyan-400 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                  <span>EXPLORE COURSES</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group relative border-2 border-cyan-400 text-cyan-400 px-6 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-cyan-400/10 hover:text-cyan-300 transition-all duration-300 font-mono overflow-hidden">
                <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>WATCH DEMO</span>
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Trust Indicators */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-8 sm:mb-12 text-gray-400 px-2">
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-full border border-yellow-400/30">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current animate-pulse" />
                <span className="font-mono text-yellow-400 text-xs sm:text-sm">4.9/5</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-full border border-green-400/30">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 animate-pulse" />
                <span className="font-mono text-green-400 text-xs sm:text-sm">Certified</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-full border border-blue-400/30">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
                <span className="font-mono text-blue-400 text-xs sm:text-sm">Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-2">
          {[
            { 
              icon: Lock, 
              title: 'ETHICAL HACKING', 
              desc: 'Master penetration testing and cybersecurity',
              color: 'cyan',
              delay: '0ms',
              accent: '🔒'
            },
            { 
              icon: Code, 
              title: 'PROGRAMMING', 
              desc: 'Code like a cyber warrior with modern languages',
              color: 'purple',
              delay: '200ms',
              accent: '⚡'
            },
            { 
              icon: Play, 
              title: 'VIDEO EDITING', 
              desc: 'Create digital masterpieces and viral content',
              color: 'pink',
              delay: '400ms',
              accent: '🎬'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`group bg-black/70 backdrop-blur-sm border-2 border-${feature.color}-400/40 rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-${feature.color}-400 transition-all duration-500 hover:scale-105 transform hover:-translate-y-2 hover:bg-black/80`}
              style={{ 
                animationDelay: feature.delay,
                animation: isVisible ? 'fade-in-up 0.8s ease-out forwards' : 'none'
              }}
            >
              <div className="relative mb-4 sm:mb-6">
                <div className="relative flex items-center justify-center">
                  <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-${feature.color}-400 group-hover:scale-125 transition-transform duration-300 animate-pulse`} />
                  <span className="absolute -top-1 -right-1 text-lg sm:text-xl lg:text-2xl">{feature.accent}</span>
                </div>
              </div>
              
              <h3 className={`text-${feature.color}-400 font-mono text-base sm:text-lg lg:text-xl font-bold text-center mb-3 sm:mb-4 group-hover:text-${feature.color}-300 transition-colors duration-300`}>
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-center font-mono text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile-First Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-2">
          {[
            { icon: Users, value: '25,000+', label: 'Students', color: 'cyan', emoji: '👥' },
            { icon: BookOpen, value: '120+', label: 'Courses', color: 'purple', emoji: '📚' },
            { icon: Award, value: '98%', label: 'Success', color: 'pink', emoji: '🏆' },
            { icon: Shield, value: '24/7', label: 'Support', color: 'green', emoji: '🛡️' }
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center group hover:scale-105 transition-all duration-300 bg-black/50 backdrop-blur-sm border border-${stat.color}-400/30 rounded-xl p-4 sm:p-6 hover:border-${stat.color}-400 hover:bg-black/70 ${isVisible ? 'animate-fade-in-up' : ''}`}
              style={{ animationDelay: `${800 + i * 100}ms` }}
            >
              <div className="relative mb-3 sm:mb-4">
                <div className="relative flex items-center justify-center">
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-${stat.color}-400 animate-pulse group-hover:scale-125 transition-transform duration-300`} />
                  <span className="absolute -top-1 -right-1 text-sm sm:text-base lg:text-lg">{stat.emoji}</span>
                </div>
              </div>
              
              <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 font-mono text-${stat.color}-400 group-hover:text-${stat.color}-300 transition-colors duration-300`}>
                {stat.value}
              </div>
              
              <div className="text-gray-300 font-mono text-xs sm:text-sm group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-1 sm:space-y-2">
            <div className="w-6 h-10 sm:w-8 sm:h-12 border-2 border-cyan-400 rounded-full flex justify-center relative overflow-hidden">
              <div className="w-1 h-3 sm:h-4 bg-cyan-400 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
            </div>
            <span className="text-cyan-400 text-xs font-mono animate-pulse">SCROLL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;