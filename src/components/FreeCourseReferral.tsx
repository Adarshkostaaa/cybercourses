import React, { useState, useEffect, useCallback } from 'react';
import { Share2, Copy, CheckCircle, Users, Gift, Sparkles, Link2, MessageCircle, Send, Trophy, Star, Heart, Zap, Target } from 'lucide-react';

interface ReferralData {
  referralCode: string;
  userEmail: string;
  courseId: string;
  referredUsers: { email: string; name: string; signedUpAt: string }[];
  unlocked: boolean;
  createdAt: string;
}

interface FreeCourseReferralProps {
  courseId: string;
  courseTitle: string;
  driveUrl: string;
  userEmail: string;
  isSignedIn: boolean;
  onSignInRequired: () => void;
}

const FreeCourseReferral: React.FC<FreeCourseReferralProps> = ({
  courseId, courseTitle, driveUrl, userEmail, isSignedIn, onSignInRequired
}) => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pulseProgress, setPulseProgress] = useState(false);
  const REQUIRED_REFERRALS = 5;

  const generateReferralCode = useCallback((email: string, cId: string): string => {
    const str = `${email}_${cId}_ref`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `REF${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
  }, []);

  useEffect(() => {
    if (!isSignedIn || !userEmail) return;
    const key = `referral_${courseId}_${userEmail.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setReferralData(JSON.parse(stored));
    } else {
      const newData: ReferralData = {
        referralCode: generateReferralCode(userEmail, courseId),
        userEmail: userEmail.toLowerCase(),
        courseId,
        referredUsers: [],
        unlocked: false,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(newData));
      setReferralData(newData);
    }
  }, [isSignedIn, userEmail, courseId, generateReferralCode]);

  // Poll for referral updates
  useEffect(() => {
    if (!referralData) return;
    const interval = setInterval(() => {
      const key = `referral_${courseId}_${userEmail.toLowerCase()}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.referredUsers.length !== referralData.referredUsers.length) {
          setReferralData(data);
          setPulseProgress(true);
          setTimeout(() => setPulseProgress(false), 2000);
          if (data.referredUsers.length >= REQUIRED_REFERRALS && !data.unlocked) {
            data.unlocked = true;
            localStorage.setItem(key, JSON.stringify(data));
            setReferralData(data);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [referralData, courseId, userEmail]);

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralData?.referralCode || ''}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = `🎓 I found an amazing FREE course: "${courseTitle}"!\n\nSign up using my link and we both benefit:\n${getReferralLink()}\n\n🔥 Limited time offer - Don't miss out!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `🎓 Free Course: "${courseTitle}" - Sign up here: ${getReferralLink()}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getReferralLink())}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `I just found an amazing FREE course: "${courseTitle}"! Check it out 🔥`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getReferralLink())}`, '_blank');
  };

  const progress = referralData ? (referralData.referredUsers.length / REQUIRED_REFERRALS) * 100 : 0;
  const referralsLeft = referralData ? Math.max(0, REQUIRED_REFERRALS - referralData.referredUsers.length) : REQUIRED_REFERRALS;
  const isUnlocked = referralData?.unlocked || false;

  if (!isSignedIn) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mx-auto mb-5 flex items-center justify-center animate-float">
          <Gift className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 font-heading mb-3">Unlock This Free Course</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          Sign in to get your personal referral link. Share it with 5 friends who sign up, and this course is yours — completely free!
        </p>
        <button onClick={onSignInRequired}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto">
          <Sparkles className="h-5 w-5" /> Sign In to Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute animate-confetti" style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}>
              <div className="w-3 h-3 rounded-sm" style={{
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][i % 6],
                transform: `rotate(${Math.random() * 360}deg)`
              }} />
            </div>
          ))}
        </div>
      )}

      <div className={`bg-gradient-to-br ${isUnlocked ? 'from-emerald-50 via-green-50 to-teal-50' : 'from-slate-50 via-blue-50 to-indigo-50'} rounded-2xl border ${isUnlocked ? 'border-emerald-200' : 'border-blue-100'} p-6 sm:p-8 transition-all duration-700`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-gradient-to-br from-emerald-400 to-green-500 animate-pulse' : 'bg-gradient-to-br from-blue-100 to-indigo-100'} transition-all duration-700`}>
            {isUnlocked ? (
              <Trophy className="h-10 w-10 text-white" />
            ) : (
              <Target className="h-10 w-10 text-indigo-600 animate-float" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-heading mb-2">
            {isUnlocked ? '🎉 Course Unlocked!' : '🎁 Unlock This Free Course'}
          </h3>
          <p className="text-gray-500 max-w-lg mx-auto">
            {isUnlocked 
              ? 'Congratulations! You\'ve successfully referred 5 friends. Enjoy your course!' 
              : `Share your referral link with friends. When ${REQUIRED_REFERRALS} people sign up, you get instant access!`}
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center mb-8">
          <div className={`relative w-40 h-40 ${pulseProgress ? 'animate-countdown-pulse' : ''}`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={isUnlocked ? '#10b981' : '#6366f1'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${isUnlocked ? 'text-emerald-600' : 'text-indigo-600'}`}>
                {referralData?.referredUsers.length || 0}/{REQUIRED_REFERRALS}
              </span>
              <span className="text-xs text-gray-500 font-medium">Referrals</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-8">
          {[...Array(REQUIRED_REFERRALS)].map((_, i) => (
            <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ${
              i < (referralData?.referredUsers.length || 0)
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110'
                : 'bg-white border-2 border-gray-200 text-gray-400'
            }`}>
              {i < (referralData?.referredUsers.length || 0) ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                i + 1
              )}
            </div>
          ))}
        </div>

        {isUnlocked ? (
          /* Unlocked - Access Button */
          <div className="text-center">
            <button onClick={() => window.open(driveUrl, '_blank')}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto animate-fade-in-up">
              <Zap className="h-6 w-6" />
              Access Your Free Course
              <Sparkles className="h-5 w-5" />
            </button>
            <p className="text-emerald-600 text-sm mt-3 font-medium">
              ✨ Lifetime access granted. Happy learning!
            </p>
          </div>
        ) : (
          /* Share Section */
          <div className="space-y-6">
            {/* Referral Link */}
            <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-indigo-500" /> Your Referral Link
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" readOnly value={getReferralLink()}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-mono truncate min-w-0" />
                <button onClick={handleCopyLink}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {copied ? <><CheckCircle className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-indigo-500" /> Share via
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={handleShareWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <MessageCircle className="h-5 w-5" /> <span>WhatsApp</span>
                </button>
                <button onClick={handleShareTelegram}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Send className="h-5 w-5" /> <span>Telegram</span>
                </button>
                <button onClick={handleShareTwitter}
                  className="bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Share2 className="h-5 w-5" /> <span>Twitter</span>
                </button>
              </div>
            </div>

            {/* Referred Users */}
            {referralData && referralData.referredUsers.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" /> Friends Who Signed Up
                </h4>
                <div className="space-y-2">
                  {referralData.referredUsers.map((user, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-100 animate-fade-in-up"
                      style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{new Date(user.signedUpAt).toLocaleDateString()}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {referralsLeft === REQUIRED_REFERRALS 
                    ? 'Start sharing to unlock!' 
                    : referralsLeft === 1 
                      ? 'Almost there! Just 1 more friend!' 
                      : `${referralsLeft} more friends needed!`}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Each friend who signs up brings you closer to free access
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-white/60 rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">How It Works</h4>
              <div className="space-y-3">
                {[
                  { icon: Link2, text: 'Copy your unique referral link', color: 'text-blue-500' },
                  { icon: Share2, text: 'Share it with friends via any platform', color: 'text-purple-500' },
                  { icon: Users, text: '5 friends sign up using your link', color: 'text-indigo-500' },
                  { icon: Gift, text: 'You get instant free access!', color: 'text-emerald-500' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center ${step.color}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-600">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calming footer message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            Take your time. Good things come to those who share knowledge.
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeCourseReferral;
