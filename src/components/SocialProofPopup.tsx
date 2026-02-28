import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

const names = [
  'Rahul M.', 'Priya S.', 'Amit K.', 'Sneha P.', 'Vikram T.', 'Neha G.',
  'Arjun R.', 'Kavya D.', 'Ravi L.', 'Anjali V.', 'Karthik N.', 'Deepa B.',
  'Sanjay W.', 'Pooja H.', 'Rohan J.', 'Meera C.', 'Aditya F.', 'Divya O.'
];

const courses = [
  'Ethical Hacking Masterclass', 'Python Programming', 'Digital Marketing',
  'Web Development with React', 'Data Science & ML', 'Cybersecurity Fundamentals',
  'Adobe After Effects', 'JavaScript Mastery', 'Cloud Computing AWS',
  'Flutter App Development'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune',
  'Kolkata', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Indore', 'Kochi'
];

const timeAgos = ['2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '23 min ago', '1 hour ago'];

const SocialProofPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', course: '', city: '', time: '' });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const time = timeAgos[Math.floor(Math.random() * timeAgos.length)];
      setNotification({ name, course, city, time });
      setIsVisible(true);

      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    };

    // First notification after 8 seconds
    const initialTimer = setTimeout(showNotification, 8000);

    // Then every 15-25 seconds
    const interval = setInterval(showNotification, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-auto z-40 animate-fade-in-up">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-3 sm:p-3.5 sm:max-w-xs flex items-start gap-3 group">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">{notification.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 leading-snug">
            <span className="font-semibold">{notification.name}</span> from {notification.city} just enrolled in
          </p>
          <p className="text-xs font-semibold text-primary-600 truncate mt-0.5">{notification.course}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{notification.time}</span>
            <ShieldCheck className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Verified</span>
          </div>
        </div>

        <button 
          onClick={() => setDismissed(true)} 
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <X className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default SocialProofPopup;
