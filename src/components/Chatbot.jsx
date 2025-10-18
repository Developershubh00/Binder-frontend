import { useState, useRef, useEffect } from 'react';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaUser,
  FaTimes,
  FaComments
} from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm here to help you with any questions about our software. How can I assist you today?", 
      isBot: true, 
      timestamp: new Date() 
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef(null);

  // Gemini AI API configuration
  const GEMINI_API_KEY = 'AIzaSyCWzOLmozFWKXj25tPXsdeZiMUBabIU6Ss'; // Replace with your actual API key
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  // Software context for AI
  const SOFTWARE_CONTEXT = `You are a helpful assistant for the Binder software system. This is a comprehensive business management platform with the following features:

DEPARTMENTS AND MODULES:
1. CHD CODE CREATION - Generate codes for Buyers, Vendors, and Factories
2. CHD PO ISSUE - Purchase Order generation and management
3. SOURCING - Manage various categories including Yarn, Recycled Yarn, Fabric, DYE, Knitting, Quilting, Embroidery, Cut & Sew, Artworks & Trims, Packaging Material, Factory Supplies, Fiber, Weaving, Braided, Printing, Job Card Service, Tufting, Carpet, and Manpower
4. IMS (Inventory Management System) - Inward and Outward Store Sheets
5. OPERATIONS - Production, Merchandising, and Sampling management
6. TOTAL QUALITY MANAGEMENT - Goods Receipt Notes, Quality Formats, and Production Quality Formats
7. DESIGNING - Product Category management
8. SHIPPING - Shipped Goods and Shipping Master
9. ACCOUNTS - Accounts Tally, SBI-4034, and Cashbook management
10. HR - Leave Applications, Personal Aspirations, Advance Requests, Exit Interviews, and Attendance tracking

KEY FEATURES:
- Role-based access (Master Admin, Manager, Tenant)
- Code generation system for buyers and vendors
- Master sheet management for data tracking
- Community help center with FAQ
- Real-time chatbot support

Always provide clear, concise, and helpful answers about the software's features, navigation, and usage. Format your responses with proper structure but avoid using ** for bold - use actual formatting instead.`;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Convert markdown-style bold to HTML
  const formatMessageText = (text) => {
    // Replace **text** with <strong>text</strong>
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formatted;
  };

  // Call Gemini AI API
  const callGeminiAI = async (userMessage) => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SOFTWARE_CONTEXT}\n\nUser Question: ${userMessage}\n\nProvide a helpful response about the Binder software. Keep responses concise and well-structured.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 
                        "I apologize, but I couldn't process that request. Please try asking in a different way.";
      
      return aiResponse;
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return "I'm having trouble connecting right now. Please try again in a moment or browse our FAQ sections for immediate help.";
    }
  };

  const sendMessage = async () => {
    if (currentMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: currentMessage,
        isBot: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);
      setCurrentMessage('');
      setIsTyping(true);

      try {
        // Get AI response
        const aiResponseText = await callGeminiAI(currentMessage);
        
        // Add slight delay for natural feel
        setTimeout(() => {
          const botResponse = {
            id: Date.now() + 1,
            text: aiResponseText,
            isBot: true,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, 800);
      } catch (error) {
        console.error('Error getting AI response:', error);
        const errorResponse = {
          id: Date.now() + 1,
          text: "I apologize for the inconvenience. Please try again or contact our support team for assistance.",
          isBot: true,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="floating-chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        <FaComments />
      </div>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <FaRobot className="chatbot-icon" />
                <span>Binder AI Assistant</span>
              </div>
              <button className="close-chat" onClick={() => setIsChatOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="chat-messages" ref={chatMessagesRef}>
              {chatMessages.map(message => (
                <div key={message.id} className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}>
                  <div className="message-avatar">
                    {message.isBot ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="message-content">
                    <div 
                      className="message-text"
                      dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                    />
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="message bot-message">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="message-text typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask me anything about Binder..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
                disabled={isTyping}
              />
              <button 
                onClick={sendMessage} 
                className="send-button"
                disabled={isTyping || !currentMessage.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;