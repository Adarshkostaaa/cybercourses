import React from 'react';
import { Clock, Star, Users, Shield, Eye, ShoppingCart } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onViewDetails: (course: Course) => void;
  onAddToCart?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onViewDetails, onAddToCart }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'Expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnrollClick = () => {
    onEnroll(course);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(course);
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl overflow-hidden group hover:scale-105 hover:border-cyan-400 transition-all duration-300">
      <div className="relative">
        <img 
          src={course.image_url} 
          alt={course.title}
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        {course.category === 'Cybersecurity' && (
          <div className="absolute top-3 left-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onViewDetails(course)}
            className="bg-cyan-600/80 hover:bg-cyan-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 font-mono text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 rounded font-mono">
            {course.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current animate-pulse" />
            <span className="text-xs sm:text-sm text-gray-400 font-mono">4.8</span>
          </div>
        </div>
        
        <h3 className="text-base sm:text-xl font-bold text-white mb-2 line-clamp-2 font-mono leading-tight">{course.title}</h3>
        <p className="text-gray-400 mb-4 text-xs sm:text-sm line-clamp-3 font-mono">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-400 font-mono">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              <span>{Math.floor(Math.random() * 1000) + 500}+</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono">₹{course.price}</span>
            <span className="text-xs sm:text-sm text-gray-500 line-through font-mono">₹{Math.floor(course.price * 1.5)}</span>
          </div>
        </div>

        {/* Mobile-First Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleEnrollClick}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-mono border border-cyan-400/30 hover:border-cyan-400"
          >
            Buy Now
          </button>
          
          {onAddToCart && (
            <button
              onClick={handleAddToCartClick}
              className="sm:w-auto bg-black/50 border border-purple-400/30 text-purple-400 px-3 py-2 rounded-lg font-medium hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-200 text-xs sm:text-sm font-mono flex items-center justify-center space-x-1"
              title="Add to Cart"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sm:hidden">Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;