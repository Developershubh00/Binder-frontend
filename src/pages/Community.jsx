// src/pages/Community.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaQuestionCircle,
  FaTags,
  FaFilter,
  FaArrowLeft,
  FaRobot,
  FaUser
} from 'react-icons/fa';
import Chatbot from '../components/Chatbot'; // Import the Chatbot component
import './Community.css';

const Community = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: 'all', label: 'All Questions', icon: FaQuestionCircle },
    { id: 'general', label: 'General', icon: FaTags },
    { id: 'technical', label: 'Technical', icon: FaRobot },
    { id: 'account', label: 'Account', icon: FaUser },
    { id: 'billing', label: 'Billing', icon: FaFilter },
    { id: 'support', label: 'Support', icon: FaQuestionCircle }
  ];

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: "What is the purpose of this community platform?",
      answer: "Our community platform is designed to connect users, share knowledge, and provide support for various topics related to our services and products."
    },
    {
      id: 2,
      category: 'account',
      question: "How do I create a new account?",
      answer: "To create a new account, click on the 'Sign Up' button on the login page and fill in the required information including your name, email, and password."
    },
    {
      id: 3,
      category: 'technical',
      question: "What browsers are supported?",
      answer: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
    },
    {
      id: 4,
      category: 'billing',
      question: "How can I update my billing information?",
      answer: "You can update your billing information by going to Settings > Billing and updating your payment method and billing address."
    },
    {
      id: 5,
      category: 'support',
      question: "How do I contact customer support?",
      answer: "You can contact our customer support through the chat widget, email us at support@company.com, or call our support line during business hours."
    },
    {
      id: 6,
      category: 'general',
      question: "Is my data secure on this platform?",
      answer: "Yes, we take data security very seriously. We use encryption, secure servers, and follow industry best practices to protect your information."
    },
    {
      id: 7,
      category: 'account',
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
    },
    {
      id: 8,
      category: 'technical',
      question: "Why am I experiencing slow loading times?",
      answer: "Slow loading times can be caused by internet connection, browser cache, or high server traffic. Try clearing your browser cache or using a different network."
    },
    {
      id: 9,
      category: 'billing',
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for premium subscriptions."
    },
    {
      id: 10,
      category: 'support',
      question: "What are your support hours?",
      answer: "Our support team is available Monday through Friday, 9 AM to 6 PM EST. We also provide 24/7 chat support for urgent issues."
    },
    {
      id: 11,
      category: 'general',
      question: "Can I customize my profile?",
      answer: "Yes, you can customize your profile by uploading a profile picture, adding a bio, and setting your preferences in the Profile section."
    },
    {
      id: 12,
      category: 'technical',
      question: "How do I enable notifications?",
      answer: "To enable notifications, go to Settings > Notifications and choose which types of notifications you'd like to receive via email or push notifications."
    },
    {
      id: 13,
      category: 'account',
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account by going to Settings > Account > Delete Account. Please note that this action is irreversible."
    },
    {
      id: 14,
      category: 'billing',
      question: "How do I cancel my subscription?",
      answer: "To cancel your subscription, go to Settings > Billing > Subscription and click 'Cancel Subscription'. Your access will continue until the end of your billing period."
    },
    {
      id: 15,
      category: 'support',
      question: "Do you offer phone support?",
      answer: "Yes, we offer phone support for premium users. You can find the support phone number in your account dashboard under the Support section."
    },
    {
      id: 16,
      category: 'general',
      question: "What features are available in the free tier?",
      answer: "The free tier includes basic community access, limited messaging, profile creation, and access to public forums and discussions."
    },
    {
      id: 17,
      category: 'technical',
      question: "How do I upload files?",
      answer: "You can upload files by clicking the attachment icon in the message composer or dragging and dropping files directly into the chat or post area."
    },
    {
      id: 18,
      category: 'account',
      question: "How do I change my username?",
      answer: "Username changes can be made once every 30 days. Go to Settings > Profile > Username to make changes. Some usernames may not be available."
    },
    {
      id: 19,
      category: 'billing',
      question: "Do you offer refunds?",
      answer: "We offer refunds within 30 days of purchase for annual subscriptions and within 7 days for monthly subscriptions, subject to our refund policy."
    },
    {
      id: 20,
      category: 'support',
      question: "How do I report a bug?",
      answer: "To report a bug, use the 'Report Bug' feature in the Help menu, or email us at bugs@company.com with detailed information about the issue."
    },
    {
      id: 21,
      category: 'general',
      question: "How do I join community discussions?",
      answer: "You can join community discussions by browsing the forums, commenting on posts, or starting your own discussion thread."
    },
    {
      id: 22,
      category: 'technical',
      question: "What file formats are supported for uploads?",
      answer: "We support common file formats including PDF, DOC, DOCX, JPG, PNG, GIF, and TXT files up to 10MB in size."
    },
    {
      id: 23,
      category: 'account',
      question: "How do I enable two-factor authentication?",
      answer: "Go to Settings > Security > Two-Factor Authentication and follow the setup instructions using an authenticator app."
    },
    {
      id: 24,
      category: 'billing',
      question: "Can I switch between subscription plans?",
      answer: "Yes, you can upgrade or downgrade your subscription plan at any time through Settings > Billing > Change Plan."
    },
    {
      id: 25,
      category: 'support',
      question: "How do I submit a feature request?",
      answer: "You can submit feature requests through our feedback form in the Help menu or by contacting our support team directly."
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-page-header">
        <div className="header-content">
          <h1 className="community-page-title">Community Help Center</h1>
          <p className="community-page-subtitle">Find answers to frequently asked questions and get support from our community</p>
        </div>
      </div>

      {/* Main content */}
      <div className="community-main-content">
        <div className="search-and-filter">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="category-icon" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="faq-section">
          <div className="faq-list">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="faq-item">
                <div 
                  className="faq-question" 
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span>{faq.question}</span>
                  {expandedFAQ === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {expandedFAQ === faq.id && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

export default Community;