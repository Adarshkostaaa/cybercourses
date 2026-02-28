import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Cybersecurity Analyst at TCS',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=60&h=60',
      rating: 5,
      text: 'This course helped me land my first cybersecurity job within 3 months. The hands-on labs are incredible — I felt prepared from day one on the job.',
      result: 'Got hired at TCS within 3 months'
    },
    {
      name: 'Priya Patel',
      role: 'Freelance Video Editor',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60',
      rating: 5,
      text: 'The After Effects course was exactly what I needed. I went from complete beginner to getting my first freelance client in just 2 weeks!',
      result: 'First freelance client in 2 weeks'
    },
    {
      name: 'Arjun Mehta',
      role: 'Software Developer',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60&h=60',
      rating: 5,
      text: 'Best Python course I\'ve ever taken. Clear explanations, real projects, and the community support is outstanding. Totally worth the investment.',
      result: 'Built 5 real projects in 30 days'
    },
    {
      name: 'Sneha Gupta',
      role: 'Digital Marketing Manager',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60',
      rating: 5,
      text: 'The digital marketing course gave me practical strategies I could implement immediately. My company saw a 40% increase in leads within the first month.',
      result: '40% increase in leads'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            ⭐ Student Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
            Join <span className="text-primary-600">25,000+</span> Successful Students
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Don't just take our word for it — hear from students who transformed their careers with our courses.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100">
          {[
            { value: '25,847+', label: 'Students Enrolled' },
            { value: '4.8/5', label: 'Average Rating' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '120+', label: 'Expert Courses' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 font-heading">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative mb-4">
                <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary-100" />
                <p className="text-gray-600 leading-relaxed pl-6">{testimonial.text}</p>
              </div>

              {/* Result badge */}
              <div className="flex items-center space-x-2 mb-4 p-2.5 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-green-700">{testimonial.result}</span>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company logos */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-6">Our students work at top companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-30 grayscale">
            {['Google', 'Microsoft', 'Amazon', 'Infosys', 'Wipro', 'TCS'].map((company) => (
              <span key={company} className="text-lg font-bold text-gray-400 font-heading">{company}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
