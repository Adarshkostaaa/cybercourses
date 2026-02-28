import React from 'react';
import { CheckCircle, BookOpen, Award, Clock, Smartphone, Download, Headphones } from 'lucide-react';

const WhatYouLearnSection: React.FC = () => {
  const learningPoints = [
    'Build real-world projects from scratch',
    'Learn step-by-step with expert guidance',
    'Go from beginner to advanced level',
    'Get lifetime access to all materials',
    'Earn a certificate of completion',
    'Access hands-on labs & exercises',
    'Join a community of 25,000+ learners',
    'Get 24/7 doubt resolution support'
  ];

  const features = [
    { icon: BookOpen, title: 'Self-Paced Learning', desc: 'Learn at your own pace with lifetime access to all course materials' },
    { icon: Award, title: 'Certificate Included', desc: 'Get an industry-recognized certificate upon completing each course' },
    { icon: Clock, title: 'Lifetime Access', desc: 'Access your courses anytime, anywhere — they never expire' },
    { icon: Smartphone, title: 'Mobile Friendly', desc: 'Learn on the go with fully responsive mobile & tablet support' },
    { icon: Download, title: 'Downloadable Resources', desc: 'Download code files, notes, cheat sheets & project templates' },
    { icon: Headphones, title: '24/7 Support', desc: 'Get help whenever you need it — our support team is always available' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - What You'll Learn */}
          <div>
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              ✅ What You'll Learn
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
              Everything You Need to <span className="text-primary-600">Succeed</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              Our courses are designed to take you from zero to hero with practical, project-based learning.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {learningPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all duration-200"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Features */}
          <div>
            <span className="inline-block bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              🎯 Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
              Learn With <span className="text-purple-600">Confidence</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              We provide everything you need for a world-class learning experience.
            </p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all duration-200"
                >
                  <div className="bg-primary-50 rounded-lg p-2.5 flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouLearnSection;
