import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

// Removed the splash screen — go directly to main site
const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  React.useEffect(() => {
    onEnter();
  }, [onEnter]);

  return null;
};

export default LandingPage;
