import React from 'react';
import { Clock, Star, Users, ShoppingCart, BadgeCheck } from 'lucide-react';
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
      case 'Beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-50 text-red-700 border-red-200';
      case 'Expert': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const isFree = course.price === 0;
  const originalPrice = isFree ? 1999 : Math.floor(course.price * 2.5);
  const discountPercent = isFree ? 100 : Math.round(((originalPrice - course.price) / originalPrice) * 100);
  // Use deterministic values based on course id
  const seed = parseInt(course.id) * 137;
  const studentCount = 800 + (seed % 2500);
  const ratingBase = 4.5 + ((seed % 5) / 10);
  const rating = ratingBase.toFixed(1);
  const viewCount = 50 + (seed % 200);

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-card-hover transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onViewDetails(course)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isFree && (
            <span className="bg-green-500 text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide shadow-md animate-pulse">
              🎁 FREE
            </span>
          )}
          {course.category === 'Cybersecurity' && (
            <span className="bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
              🔥 Bestseller
            </span>
          )}
          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {isFree ? (
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
              100% FREE
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        {/* Urgency: People viewing */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 text-white px-2 py-0.5 rounded text-xs backdrop-blur-sm">
            👁 {viewCount} people viewing
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {course.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
            <span className="text-xs font-semibold text-gray-900">{rating}</span>
            <span className="text-xs text-gray-400">({studentCount})</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3.5 w-3.5" />
            <span>{studentCount.toLocaleString()}+ students</span>
          </div>
          <div className="flex items-center space-x-1">
            <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-blue-600">Certificate</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=30&h=30"
            alt="Instructor"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-gray-500">Adarsh Kosta</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          {isFree ? (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">FREE</span>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">Save ₹{originalPrice}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">₹{course.price}</span>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
            </div>
          )}
        </div>

        {/* Urgency Text */}
        <p className="text-xs text-red-500 font-medium mb-2">⏰ {isFree ? 'Limited time free offer!' : `Only ${3 + (seed % 5)} spots left at this price`}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); isFree ? onViewDetails(course) : onEnroll(course); }}
            className={`flex-1 py-3 sm:py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-btn ${
              isFree ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isFree ? '🎁 View Free Course' : 'Enroll Now'}
          </button>
          {!isFree && onAddToCart && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(course); }}
              className="p-2.5 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
