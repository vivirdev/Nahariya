import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullPageWithTabs from './naharita';
import ThankYou from './ThankYou';

// רכיב לבדיקת מובייל
const MobileOnlyCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = () => {
      // בדיקה אם רוחב המסך קטן מ-768px או אם זה מכשיר מובייל
      const isMobileDevice = window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Assistant, sans-serif',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            📱
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#333'
          }}>
            האפליקציה זמינה רק במובייל
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: '1.5',
            marginBottom: '20px'
          }}>
            אנא פתח את האפליקציה במכשיר נייד או הקטן את חלון הדפדפן
          </p>
          <div style={{
            fontSize: '14px',
            color: '#999'
          }}>
            רוחב מינימלי נדרש: 768px
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <MobileOnlyCheck>
      <Router>
        <Routes>
          <Route path="/" element={<FullPageWithTabs />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
      </Router>
    </MobileOnlyCheck>
  );
}

export default App; 