import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, ThumbsUp, Heart, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThankYou from './ThankYou';

type SectionChoice = 'completed' | 'notRelevant' | 'willDoLater';
type FeedbackChoice = 'like' | 'heart' | null;

interface Section {
  title: string;
  completed: boolean;
  notRelevant: boolean;
}

interface Tab {
  title: string;
  color: string;
  hoverColor: string;
  progressColor: string;
  sections: Section[];
}

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="#3459B1" strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="#3459B1"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
);

const FullPageWithTabs = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [isDurationOpen, setIsDurationOpen] = useState<boolean>(false);
  const [feedbackChoice, setFeedbackChoice] = useState<FeedbackChoice>(null);
  const [isFeelingOpen, setIsFeelingOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string | { title: string; explanation: string; missingSections: string[] }>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [sectionChoices, setSectionChoices] = useState<Record<string, SectionChoice>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);

  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setActiveTab(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    if (activeTab !== null) {
      const tabElement = document.getElementById(`tab-${activeTab}`);
      if (tabElement) {
        const stickyHeaderHeight = 120;
        const extraOffset = 16;
        const tabPosition = tabElement.offsetTop - stickyHeaderHeight - extraOffset;
        window.scrollTo({
          top: tabPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  const handleNext = () => {
    if (activeTab !== null && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
      const nextTabElement = document.getElementById(`tab-${activeTab + 1}`);
      if (nextTabElement) {
        const stickyHeaderHeight = 120;
        const tabPosition = nextTabElement.offsetTop - stickyHeaderHeight;
        window.scrollTo({
          top: tabPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handlePrev = () => {
    if (activeTab !== null && activeTab > 0) {
      setActiveTab(activeTab - 1);
      const prevTabElement = document.getElementById(`tab-${activeTab - 1}`);
      if (prevTabElement) {
        const stickyHeaderHeight = 120;
        const tabPosition = prevTabElement.offsetTop - stickyHeaderHeight;
        window.scrollTo({
          top: tabPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const tabs = [
    {
      title: 'ארנונה',
      color: '#FF8201',
      hoverColor: '#E67401',
      progressColor: '#FF8201',
      sections: [
        {
          title: 'העברת תשלומי ארנונה על שמי',
          completed: false,
          notRelevant: true
        },
        {
          title: 'קבלת שוברים לתשלום במייל',
          completed: true,
          notRelevant: false
        }
      ]
    },
    {
      title: 'אישור טאבו',
      color: '#FF9C33',
      hoverColor: '#E68A2B',
      progressColor: '#FF9C33',
      sections: [
        {
          title: 'אישור העדר חובות לעירייה',
          completed: false,
          notRelevant: true
        }
      ]
    },
    {
      title: 'תו חניה נהרייני',
      color: '#65D0FA',
      hoverColor: '#4DC4F7',
      progressColor: '#65D0FA',
      sections: [
        {
          title: 'קבלת תו חניה נהרייני',
          completed: false,
          notRelevant: true
        }
      ]
    },
    {
      title: 'מסגרות חינוך',
      color: '#3459B1',
      hoverColor: '#2B4A95',
      progressColor: '#3459B1',
      sections: [
        {
          title: 'רישום למסגרות חינוך',
          completed: false,
          notRelevant: true
        },
        {
          title: 'טפסים ושירותים בתחום החינוך',
          completed: false,
          notRelevant: false
        }
      ]
    },
    {
      title: 'בילוי ופנאי',
      color: '#04B46B',
      hoverColor: '#03A05F',
      progressColor: '#04B46B',
      sections: [
        {
          title: 'הצטרפות לקבוצת וואטסאפ',
          completed: false,
          notRelevant: true
        },
        {
          title: 'בילוי ופנאי לותיקים',
          completed: true,
          notRelevant: false
        },
        {
          title: 'בילוי ופנאי לצעירים ומשפחות',
          completed: false,
          notRelevant: false
        },
        {
          title: 'הספרייה העירונית מידעטק',
          completed: false,
          notRelevant: false
        }
      ]
    },
    {
      title: 'עסק חדש',
      color: '#FFCF01',
      hoverColor: '#E6BA01',
      progressColor: '#FFCF01',
      sections: [
        {
          title: 'התעניינות / רישום עסק חדש בעיר',
          completed: false,
          notRelevant: true
        },
        {
          title: 'למידע על סיוע לעסקים מקומיים',
          completed: true,
          notRelevant: false
        }
      ]
    }
  ];

  const durationOptions = [
    'עדיין לא עברתי',
    '0-3 חודשים',
    '3-6 חודשים',
    '6-12 חודשים',
    '12+ חודשים'
  ];

  const feelingOptions = [
    'מרגיש.ה כמו בבית',
    'די בנוח פה',
    'עדיין מסתגל.ת',
    'קשה לי להסתגל'
  ];

  const handleSectionChoice = (sectionIndex: string | number, choice: SectionChoice) => {
    setSectionChoices(prev => ({
      ...prev,
      [sectionIndex]: choice
    }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async () => {
    // איפוס הודעות קודמות
    setSubmissionError('');
    setSubmissionMessage('');
    
    // בדיקת שדות חובה
    let errors: string[] = [];
    if (!selectedDuration) {
      errors.push('אנא בחר.י כמה זמן את.ה מתגורר.ת בנהריה');
    }
    if (!selectedFeeling) {
      errors.push('אנא בחר.י עד כמה את.ה מרגיש.ה בבית בנהריה');
    }

    if (errors.length > 0) {
      setSubmissionError(errors.join(' | '));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    // איסוף כל הנתונים מהטופס
    const data = {
      duration: selectedDuration,
      feeling: selectedFeeling,
      feedback: feedbackChoice,
      sections: sectionChoices,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language || 'he'
    };

    try {
      // שליחה ל-webhook
      const response = await fetch('https://hook.us1.make.com/17lut1ue2378y5nnwgfqlk9wih04hadk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setSubmissionMessage('הטופס נשלח בהצלחה! תודה על המשוב.');
        setIsSubmitted(true);
        
        // איפוס הטופס אחרי 3 שניות
        setTimeout(() => {
          setSelectedDuration(null);
          setSelectedFeeling(null);
          setFeedbackChoice(null);
          setSectionChoices({});
          setActiveTab(null);
          setSubmissionMessage('');
          setSubmissionError('');
          setIsSubmitted(false);
        }, 3000);
        navigate('/thankyou');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError('אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.');
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNumberColor = (index: number) => {
    if (index === 0) return 'bg-[#FF8201]';
    if (index === 1) return 'bg-[#FF9C33]';
    if (index === 2) return 'bg-[#65D0FA]';
    if (index === 3) return 'bg-[#3459B1]';
    if (index === 4) return 'bg-[#04B46B]';
    if (index === 5) return 'bg-[#FFCF01]';
    return 'bg-gray-400';
  };

  // חישוב אחוז ההתקדמות לפס
  const getProgressPercentage = () => {
    if (activeTab === null) return 0;
    if (activeTab >= tabs.length - 1) return 100;
    
    // חישוב האחוז בהתאם למיקום הטאב הנוכחי
    const progressPerTab = 100 / (tabs.length - 1);
    return progressPerTab * activeTab;
  };

  // מניעת גלילה של הרקע כשהפופאפ פתוח
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const handleOpenModal = (url: string, title: string) => {
    setModalUrl(url);
    setModalTitle(title);
    setIframeLoading(true);
    setShowModal(true);
  };

  if (isSubmitted) {
    return <ThankYou />;
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl" style={{fontFamily: 'Assistant, sans-serif'}}>
      {/* Hero Image Section */}
      <div className="w-full h-[35vh]">
        <img src="https://i.postimg.cc/43pSchyh/Project-Nahariya.png" alt="Nahariya Beach" className="w-full h-full object-cover" />
      </div>

      {/* אזור הודעות שגיאה */}
      {submissionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              {typeof submissionError === 'string' ? (
                <>
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    יש לתקן את השגיאות הבאות:
                  </h3>
                  <div className="text-sm text-red-700 whitespace-pre-line">
                    {submissionError}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-red-800 mb-1">{submissionError.title}</h3>
                  {submissionError.explanation && (
                    <div className="text-sm text-red-700 mb-2">{submissionError.explanation}</div>
                  )}
                  {submissionError.missingSections && submissionError.missingSections.length > 0 && (
                    <ul className="list-disc pr-5 text-sm text-red-700">
                      {submissionError.missingSections.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            <div className="mr-auto pr-3">
              <button
                onClick={() => setSubmissionError('')}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* הודעת הצלחה */}
      {submissionMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-green-700">
                {submissionMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full">
        {/* Welcome Section */}
        <div className="bg-white mb-0">
          <div className="max-w-4xl mx-auto px-4 pt-4 pb-0 text-right">
            <h1 className="font-extrabold mb-3" style={{ fontSize: '22px', lineHeight: '28px', color: '#3459B1' }}>
              חדש בנהריה? חדשה בעיר?<br />איזה כיף שהגעת!
            </h1>
            <p className="font-bold text-black" style={{ fontSize: '16px', lineHeight: '22px' }}>
              עיריית נהריה מברכת אותך עם כניסתך לביתך החדש
             
              ומזמינה אותך להנות מכל מה שיש לעיר להציע.
            </p>
            <p className="font-normal text-black mt-3" style={{ fontSize: '16px', lineHeight: '22px' }}>
              בימים אלו אנו משיקים שירות חדש המרכז במקום אחד, את כלל השירותים העירוניים והפעולות שיש לבצע בשנה הראשונה בעיר.
            </p>
          
            <p className="font-bold text-black" style={{ fontSize: '16px', lineHeight: '22px' }}>לפני הכל, נשמח להכיר אותך!</p>
          </div>
        </div>

        {/* טאבים עם דרופ דאון */}
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative">
              <div 
                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer flex justify-between items-center ${
                  !selectedDuration && submissionError ? 'border-2 border-red-400' : ''
                }`}
                onClick={() => setIsDurationOpen(!isDurationOpen)}
              >
                <span className={`${!selectedDuration ? 'text-gray-500' : 'text-gray-700'}`}>
                  {selectedDuration || 'כמה זמן את.ה מתגורר.ת בנהריה? *'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDurationOpen ? 'transform rotate-180' : ''}`} />
              </div>
              {isDurationOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg" style={{ height: '200px', overflowY: 'auto' }}>
                  {['עדיין לא עברתי', '0-3 חודשים', '3-6 חודשים', '6-12 חודשים', '12+ חודשים'].map((duration) => (
                    <div
                      key={duration}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedDuration(duration);
                        setIsDurationOpen(false);
                        // הסתר שגיאה אם היא הייתה מוצגת
                        if (submissionError && selectedFeeling) {
                          setSubmissionError('');
                        }
                      }}
                    >
                      {duration}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div 
                className={`bg-white p-4 rounded-lg shadow-md cursor-pointer flex justify-between items-center ${
                  !selectedFeeling && submissionError ? 'border-2 border-red-400' : ''
                }`}
                onClick={() => setIsFeelingOpen(!isFeelingOpen)}
              >
                <span className={`${!selectedFeeling ? 'text-gray-500' : 'text-gray-700'}`}>
                  {selectedFeeling || 'עד כמה את.ה מרגיש.ה בבית בנהריה? *'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isFeelingOpen ? 'transform rotate-180' : ''}`} />
              </div>
              {isFeelingOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg" style={{ height: '200px', overflowY: 'auto' }}>
                  {['עדיין לא התחברתי', 'מתרגל.ת לעיר', 'התמקמתי פה', 'בנהריה אני בבית'].map((feeling) => (
                    <div
                      key={feeling}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedFeeling(feeling);
                        setIsFeelingOpen(false);
                        // הסתר שגיאה אם היא הייתה מוצגת
                        if (submissionError && selectedDuration) {
                          setSubmissionError('');
                        }
                      }}
                    >
                      {feeling}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* הנחיה חדשה לאחר 2 השאלות הראשונות */}
        <div className="max-w-4xl mx-auto px-4 pb-0 text-right">
          <div className="relative bg-white rounded-2xl shadow-lg p-5 mb-6 flex items-start gap-3">
            {/* אייקון מידע */}
            <div className="flex-shrink-0 mt-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#3459B1"/>
                <text x="16" y="22" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="Arial">i</text>
              </svg>
            </div>
            <div>
              <p className="text-base text-black font-semibold leading-relaxed mb-1">
                לפניך ריכוז המידע והפעולות הנחוצים לתושבים.ות חדשים.ות בעיר.
              </p>
              <ul className="list-disc pr-5 text-sm text-black font-normal space-y-1 mb-2">
                <li>עברו על המידע וסמנו את הפעולות שכבר בוצעו / לא בוצעו / לא רלוונטיות.</li>
                <li>לחיצה על הקישור בכל נושא תפתח חלון חדש באתר העירייה, שם תוכלו לבצע את הפעולה ישירות ולחזור לעמוד זה בכל רגע.</li>
              </ul>
              <div className="text-sm mt-2 text-black">
                <span className="font-bold text-red-600">שימו לב:</span> אל תשכחו ללחוץ על כפתור השליחה בתחתית שאלון זה, כדי שנוכל להמשיך ולשפר את השירות.
              </div>
            </div>
          </div>
        </div>

        {/* כותרת לטאבים עם פס התקדמות צמוד */}
        <div className="sticky top-0 bg-white z-20 shadow-lg">
          <div className="px-4 py-5">
            <h3 className="text-xl font-bold text-blue-600 mb-5 text-center">
              ריכוז הפעולות לקליטה בעיר
            </h3>
            
            {/* פס התקדמות */}
            <div className="max-w-4xl mx-auto">
              <div className="relative py-6">
                {/* הפס עצמו */}
                <div className="relative h-1.5 bg-gray-100 rounded-full mx-8">
                  <div 
                    className="absolute top-0 right-0 h-full transition-all duration-700 ease-out rounded-full"
                    style={{
                      width: `${(activeTab === null ? 0 : activeTab / (tabs.length - 1)) * 100}%`,
                      backgroundColor: tabs[activeTab === null ? 0 : activeTab].progressColor,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>
                
                {/* הנקודות */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => handleTabClick(index)}
                      className="relative w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
                    >
                      <svg width="32.877" height="32.877" viewBox="0 0 32.877 32.877" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M221,80.145a23.017,23.017,0,0,0,1.023,6.809,23.156,23.156,0,0,0-9.629,9.63,23.165,23.165,0,0,0-13.618,0,23.169,23.169,0,0,0-9.63-9.63,23.165,23.165,0,0,0,0-13.618,23.171,23.171,0,0,0,9.63-9.629,23.164,23.164,0,0,0,13.618,0,23.162,23.162,0,0,0,9.629,9.629A23.025,23.025,0,0,0,221,80.145"
                          transform="translate(-189.148 -63.707)"
                          fill={index <= (activeTab === null ? 0 : activeTab) ? tabs[index].progressColor : '#d1d5db'}
                        />
                        <text
                          x="50%"
                          y="50%"
                          fill="#fff"
                          fontSize="16"
                          fontFamily="Assistant, sans-serif"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {String((index + 1).toString().padStart(2, '0'))}
                        </text>
                      </svg>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {tab.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* מידע נוכחי */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-600">שלב {(activeTab === null ? 0 : activeTab) + 1} מתוך {tabs.length}:</span>
                  <span 
                    className="font-semibold"
                    style={{ color: tabs[activeTab === null ? 0 : activeTab].progressColor }}
                  >
                    {tabs[activeTab === null ? 0 : activeTab].title}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* אזור הטאבים עם מספרים */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="flex max-w-4xl mx-auto">
            <div className="flex-1 space-y-4">
              {tabs.map((tab, tabIndex) => (
                <div key={tabIndex} className="relative flex items-start gap-4" id={`tab-${tabIndex}`}>
                  <div className="flex-1 order-2">
                    <div 
                      className={`text-white px-6 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        tabIndex === activeTab ? 'rounded-t-2xl' : 'rounded-2xl'
                      }`}
                      style={{ 
                        backgroundColor: tab.color,
                        height: '51px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tab.hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = tab.color}
                      onClick={() => handleTabClick(tabIndex)}
                    >
                      <div className="flex items-center justify-between h-full">
                        <div className="flex items-center">
                          <span className="text-lg font-semibold">{tab.title}</span>
                        </div>
                        <div className="flex items-center">
                          {activeTab !== null && tabIndex < activeTab && (
                            <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center ml-2">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${tabIndex === activeTab ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>
                    
                    {activeTab === tabIndex && (
                      <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm p-3 space-y-2 -mt-1">
                        
                        {/* תוכן הטאב */}
                        {tab.sections ? (
                          /* טאבים עם סעיפים */
                          <div className="space-y-2">
                            {tab.sections.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <div className="bg-white p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-bold text-gray-800 mb-1">{section.title}</h4>
                                      <div className="flex flex-col space-y-1 mb-1">
                                        <label className="flex items-center cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`tab${tabIndex}-section-${sectionIndex}`}
                                            checked={sectionChoices[`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`] === 'completed'}
                                            onChange={() => handleSectionChoice(`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`, 'completed')}
                                            className="appearance-none w-[11px] h-[11px] rounded-full border border-gray-400 checked:bg-black checked:border-black ml-1"
                                          />
                                          <span className="text-sm text-gray-700">ביצעתי</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`tab${tabIndex}-section-${sectionIndex}`}
                                            checked={sectionChoices[`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`] === 'notRelevant'}
                                            onChange={() => handleSectionChoice(`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`, 'notRelevant')}
                                            className="appearance-none w-[11px] h-[11px] rounded-full border border-gray-400 checked:bg-black checked:border-black ml-1"
                                          />
                                          <span className="text-sm text-gray-700">לא רלוונטי עבורי</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                          <input
                                            type="radio"
                                            name={`tab${tabIndex}-section-${sectionIndex}`}
                                            checked={sectionChoices[`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`] === 'willDoLater'}
                                            onChange={() => handleSectionChoice(`tab${tabIndex === 0 ? '' : tabIndex}-${sectionIndex}`, 'willDoLater')}
                                            className="appearance-none w-[11px] h-[11px] rounded-full border border-gray-400 checked:bg-black checked:border-black ml-1"
                                          />
                                          <span className="text-sm text-gray-700">אבצע בהמשך</span>
                                        </label>
                                      </div>
                                      <div className="text-sm">
                                        <span className="text-gray-600">לביצוע הפעולה לחץ</span>
                                        {(() => {
                                          let url = '';
                                          if (section.title === 'העברת תשלומי ארנונה על שמי') url = 'https://forms.milgam.co.il/nahariya/forms/230/';
                                          else if (section.title === 'קבלת שוברים לתשלום במייל') url = 'https://forms.milgam.co.il/nahariya/forms/204/';
                                          else if (section.title === 'אישור העדר חובות לעירייה') url = 'https://forms.milgam.co.il/nahariya/forms/200/';
                                          else if (section.title === 'הפקת נסח טאבו') url = 'https://forms.milgam.co.il/nahariya/forms/200/';
                                          else if (section.title === 'תשלומי ארנונה') url = 'https://forms.milgam.co.il/nahariya/forms/204/';
                                          else if (section.title === 'קבלת תו חניה נהרייני') url = 'https://nahariyani.co.il/#home';
                                          else if (section.title === 'רישום למסגרות חינוך') url = 'https://www.edu-reg.co.il/closed?cid=2527878&sys=0&sub=1';
                                          else if (section.title === 'טפסים ושירותים בתחום החינוך') url = 'https://www.nahariya.muni.il/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D-%D7%9E%D7%A7%D7%95%D7%95%D7%A0%D7%99%D7%9D-%D7%97%D7%99%D7%A0%D7%95%D7%9A/';
                                          else if (section.title === 'הצטרפות לקבוצת וואטסאפ') url = 'https://www.nahariya.muni.il/740/';
                                          else if (section.title === 'בילוי ופנאי לותיקים') url = 'https://www.mkn.org.il/page.php?type=matClass&id=2386&bc=AC6&m=305&bc=AC5';
                                          else if (section.title === 'הספרייה העירונית מידעטק') url = 'https://nahariya.library.org.il/';
                                          else if (section.title === 'התעניינות / רישום עסק חדש בעיר') url = 'https://www.nahariya.muni.il/%D7%A2%D7%A1%D7%A7%D7%99%D7%9D-%D7%94%D7%A2/';
                                          else if (section.title === 'למידע על סיוע לעסקים מקומיים') url = 'https://www.nahariya.muni.il/%D7%A2%D7%A1%D7%A7-%D7%97%D7%93%D7%A9/';
                                          else if (section.title === 'טופס פניה למוקד 106') url = 'https://forms.milgam.co.il/nahariya/forms/232/';
                                          else if (section.title === 'שאלון מועמדים להגרלת הדירות של עמידר') url = 'https://www.amidar.co.il/%D7%A9%D7%90%D7%9C%D7%95%D7%9F-%D7%9E%D7%A2%D7%95%D7%9E%D7%93%D7%99%D7%9D-%D7%9C%D7%94%D7%92%D7%A8%D7%9C%D7%AA-%D7%94%D7%93%D7%99%D7%A8%D7%95%D7%AA-%D7%A9%D7%9C-%D7%A2%D7%9E%D7%99%D7%93%D7%A8/';
                                          else if (section.title === 'ערעור על דוח חניה') url = 'https://www.nahariya.muni.il/%D7%A2%D7%A8%D7%A2%D7%95%D7%A8-%D7%A2%D7%9C-%D7%93%D7%95%D7%97%D7%95%D7%AA-%D7%97%D7%A0%D7%99%D7%94/';
                                          else if (section.title === 'בילוי ופנאי לצעירים ומשפחות') url = 'https://www.nahariya.muni.il/318/';
                                          if (url) {
                                            return (
                                              <button
                                                type="button"
                                                onClick={() => handleOpenModal(url, section.title)}
                                                className="font-bold text-blue-600 hover:text-blue-800 underline"
                                              >
                                                כאן
                                              </button>
                                            );
                                          } else {
                                            return (
                                              <span className="text-gray-400">אין קישור</span>
                                            );
                                          }
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {sectionIndex < tab.sections.length - 1 && (
                                  <hr className="my-2 border-gray-300 border-dashed" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* סקשן חירום */}
        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-lg p-5 mb-6 flex items-start gap-3">
              <div>
                <h4 className="text-lg font-bold text-black mb-3 text-right">מידע לשעת חירום</h4>
                <ul className="space-y-2 pr-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleOpenModal('https://vivir.pw/Landing%20Page%20Map.pdf', 'מפת העיר: חלוקת העיר בזמן חירום')}
                      className="text-base font-semibold text-black hover:underline focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                    >
                      מפת העיר: חלוקת העיר בזמן חירום (PDF)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleOpenModal('https://online.anyflip.com/vrqsv/oxgj/mobile/index.html', 'מידע והנחיות לשעת חירום')}
                      className="text-base font-semibold text-black hover:underline focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                    >
                      מידע והנחיות לשעת חירום (חוברת דיגיטלית)
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* סקשן "?המידע עזר לי" */}
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <h4 className="text-lg font-bold text-gray-800 mb-6 text-center">
              המידע עזר לי?
              </h4>
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => setFeedbackChoice('like')}
                  className={`flex items-center justify-center w-16 h-16 md:w-14 md:h-14 border-0 bg-transparent outline-none rounded-full transition-all duration-150 ${feedbackChoice === 'like' ? 'shadow-lg opacity-100' : 'opacity-50'}`}
                  style={{ WebkitTapHighlightColor: 'transparent', padding: 0, margin: 0 }}
                >
                  {/* SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 38.452 38.453">
                    <path d="M0,19.226A19.226,19.226,0,1,0,19.226,0,19.226,19.226,0,0,0,0,19.226" transform="translate(0)" fill="#4080ff"/>
                    <path d="M27.057,12.388h3.157a.882.882,0,0,1,.882.882V24.221a.882.882,0,0,1-.882.881H27.057a.882.882,0,0,1-.882-.881V13.27a.882.882,0,0,1,.882-.882m-13.7,2.954a4.086,4.086,0,0,0-1.481,1.316,3.348,3.348,0,0,0-.164,2.139A2.643,2.643,0,0,0,10.4,21.1a2.6,2.6,0,0,0,.823,2.468c-1.152,2.632.658,3.454.658,3.454h5.758s-1.316,6.251,1.81,6.416c1.618.085,1.974-1.481,1.974-3.949S24.738,25.2,24.738,25.2V15.25l-1.722-.725a4.662,4.662,0,0,0-1.81-.365H15.991a4.332,4.332,0,0,0-2.632,1.182" transform="translate(-2.672 -3.19)" fill="#fff"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setFeedbackChoice('heart')}
                  className={`flex items-center justify-center w-16 h-16 md:w-14 md:h-14 border-0 bg-transparent outline-none rounded-full transition-all duration-150 ${feedbackChoice === 'heart' ? 'shadow-lg opacity-100' : 'opacity-50'}`}
                  style={{ WebkitTapHighlightColor: 'transparent', padding: 0, margin: 0 }}
                >
                  {/* SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 38.452 38.453">
                    <path d="M110.691,19.226A19.226,19.226,0,1,0,91.465,38.453a19.227,19.227,0,0,0,19.226-19.226" transform="translate(-72.239)" fill="#f25268"/>
                    <path d="M105.86,19.124c0-4.078-3.311-7.384-6.581-7.384a5.917,5.917,0,0,0-5.25,3.973A5.915,5.915,0,0,0,88.78,11.74c-3.27,0-6.581,3.306-6.581,7.384,0,4.2,2.951,6.349,5.5,8.6,1.9,1.679,4.466,3.358,6.369,5.037,2.528-2.228,5.714-4.457,8.241-6.685,2.012-1.773,3.552-3.769,3.552-6.949" transform="translate(-75 -3.023)" fill="#fff"/>
                  </svg>
                </button>
            </div>

            {/* כפתור שליחה */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
                className={`w-full text-white font-semibold flex items-center justify-center transition-all shadow-lg mt-6 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ 
                backgroundColor: '#3459b1',
                fontSize: '17px',
                fontWeight: '600',
                height: '46px',
                borderRadius: '23px'
              }}
            >
              {isSubmitting ? (
                <Loader />
              ) : (
                <>
                  <span>שליחה</span>
                  <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.669 16.67">
                    <path d="M.049,1.206A.915.915,0,0,1,1.206.048l15.2,5.067a.915.915,0,0,1-.038,1.748L8.977,8.976,6.865,16.37a.915.915,0,0,1-1.748.038Zm1.192.681L5.984,16.118,8.093,8.739Zm.647-.647L8.74,8.092l7.379-2.108Z" fill="#fafafa" fillRule="evenodd"/>
                  </svg>
                </>
              )}
            </button>
            
            {/* הודעה על שדות חובה */}
            <p className="text-xs text-gray-500 text-center mt-3">
              * שדות חובה למילוי
            </p>
            </div>
          </div>
        </div>

        {/* מודל עם iframe */}
        {showModal && modalUrl && modalTitle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowModal(false)}
            style={{ animation: 'fadeIn 0.3s' }}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-md h-[80vh] relative flex flex-col animate-slideUp"
              onClick={e => e.stopPropagation()}
              style={{ animation: 'slideUp 0.3s' }}
            >
              <div className="flex flex-col px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-[#3459B1]">{modalTitle}</span>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-700 text-2xl font-bold hover:text-red-500 focus:outline-none"
                    aria-label="סגור"
                  >
                    ✖️
                  </button>
                </div>
                <div className="mt-2 text-sm text-blue-700 bg-blue-50 rounded px-2 py-1 text-center font-semibold">
                  בסיום המילוי, חזור לאפליקציה להמשך התהליך
                </div>
              </div>
              {/* Loader Spinner */}
              {iframeLoading && (
                <div className="flex items-center justify-center h-full absolute inset-0 bg-white bg-opacity-80 z-20">
                  <div className="loader" />
                </div>
              )}
              <iframe
                src={modalUrl}
                title={modalTitle}
                className="w-full h-full rounded-b-lg border-0 flex-1"
                onLoad={() => setIframeLoading(false)}
                style={iframeLoading ? { visibility: 'hidden' } : { visibility: 'visible' }}
              />
            </div>
            <style>{`
              .loader {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3459B1;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullPageWithTabs;