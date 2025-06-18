import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullPageWithTabs from './naharita';
import ThankYou from './ThankYou';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FullPageWithTabs />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App; 