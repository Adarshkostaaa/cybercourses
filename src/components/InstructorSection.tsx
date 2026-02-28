import React from 'react';
import { Users, Star, BookOpen, CheckCircle, Globe } from 'lucide-react';

const InstructorSection: React.FC = () => {
  const achievements = [
    '50+ courses created',
    '25,000+ students taught worldwide',
    '4.9 average instructor rating',
    'Certified Ethical Hacker (CEH)',
    'CISSP & OSCP certified',
    '8+ years industry experience'
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            👨‍🏫 Meet Your Instructor
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
            Learn From an <span className="text-primary-600">Industry Expert</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your courses are taught by a verified professional with years of real-world experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-8 sm:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
                    alt="Adarsh Kosta"
                    className="w-36 h-36 rounded-2xl object-cover ring-4 ring-white shadow-soft"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 font-heading">Adarsh Kosta</h3>
                  <span className="inline-flex items-center bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified Instructor
                  </span>
                </div>
                <p className="text-primary-600 font-medium mb-4">Cybersecurity Expert & Full-Stack Educator</p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  With over 8 years of experience in cybersecurity and software development, Adarsh has helped
                  thousands of students launch successful careers in tech. He holds multiple industry certifications
                  and has worked with leading organizations to secure their digital infrastructure. His teaching style
                  breaks down complex concepts into easy, actionable lessons.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: BookOpen, value: '50+', label: 'Courses' },
                    { icon: Users, value: '25K+', label: 'Students' },
                    { icon: Star, value: '4.9', label: 'Rating' },
                    { icon: Globe, value: '8+', label: 'Years Exp' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 text-center border border-gray-100">
                      <stat.icon className="h-5 w-5 text-primary-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Achievements */}
                <div className="grid sm:grid-cols-2 gap-2">
                  {achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
