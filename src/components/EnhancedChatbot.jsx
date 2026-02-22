// Enhanced Chatbot with Backend Integration (Optional)
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ShoppingBag, Package, CreditCard } from 'lucide-react';
import axios from 'axios';
import '../styles/Chatbot.css';

const EnhancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI shopping assistant. I can help you find products, check orders, and answer questions about our store!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userSession, setUserSession] = useState({
    isLoggedIn: false,
    userId: null,
    userName: null
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check user authentication status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // You can decode the JWT token to get user info
      setUserSession({
        isLoggedIn: true,
        userId: 'user123', // This should come from your auth system
        userName: 'Customer' // This should come from your auth system
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced bot responses with backend integration potential
  const getEnhancedBotResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Product search with potential API integration
    if (message.includes('find') || message.includes('search') || message.includes('looking for')) {
      try {
        // This would integrate with your product search API
        // const searchResults = await axios.get(`/api/products/search?q=${userMessage}`);
        return "I can help you find products! Try visiting our Shop page or tell me specifically what you're looking for (electronics, clothing, home goods, etc.).";
      } catch (error) {
        return "I can help you find products! What type of item are you looking for?";
      }
    }
    
    // Order status - would integrate with your orders API
    if (message.includes('order') && (message.includes('status') || message.includes('track'))) {
      if (userSession.isLoggedIn) {
        return `Hi ${userSession.userName}! To check your order status, please visit your Dashboard where you can see all your recent orders and tracking information.`;
      } else {
        return "To check your order status, please log in to your account first. You can do this from the login button at the top of the page.";
      }
    }
    
    // Personalized greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      if (userSession.isLoggedIn) {
        return `Hello ${userSession.userName}! Welcome back to our store. How can I help you today?`;
      } else {
        return "Hello! Welcome to our store. I'm here to help you with products, orders, shipping, and any other questions!";
      }
    }
    
    // Cart assistance
    if (message.includes('cart') || message.includes('checkout')) {
      return "Need help with your cart? You can view and modify your cart items, apply discount codes, and proceed to secure checkout. Any specific issues?";
    }
    
    // Account help
    if (message.includes('account') || message.includes('profile')) {
      if (userSession.isLoggedIn) {
        return "You can manage your account, update your profile, view order history, and manage payment methods from your Dashboard.";
      } else {
        return "Create an account to track orders, save favorites, and get personalized recommendations! You can sign up from the top right corner.";
      }
    }
    
    // Fallback to basic responses
    return getBotResponse(userMessage);
  };

  // Basic responses (same as original)
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('product') || message.includes('item') || message.includes('buy')) {
      return "I can help you find products! You can browse our shop page or search for specific items. What are you looking for today?";
    }
    
    if (message.includes('ship') || message.includes('delivery') || message.includes('tracking')) {
      return "We offer fast shipping! Standard delivery takes 3-5 business days, and express delivery takes 1-2 days. You can track your order from your dashboard once it's shipped.";
    }
    
    if (message.includes('return') || message.includes('refund') || message.includes('exchange')) {
      return "We have a 30-day return policy! You can return items in original condition. Visit our Returns & Refunds page for detailed information.";
    }
    
    if (message.includes('payment') || message.includes('pay') || message.includes('card')) {
      return "We accept all major credit cards, PayPal, and other secure payment methods. All transactions are encrypted and secure!";
    }
    
    if (message.includes('size') || message.includes('fit')) {
      return "For sizing information, check the 'Size Guide' on each product page. If you're between sizes, I recommend going up one size for comfort!";
    }
    
    if (message.includes('deal') || message.includes('discount') || message.includes('sale')) {
      return "Check out our Seasonal Deals page for current offers! We regularly update discounts and special promotions.";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    }
    
    return "I'm here to help! You can ask me about products, shipping, returns, payments, account help, or anything else. What would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use enhanced response with potential backend integration
      const botResponseText = await getEnhancedBotResponse(inputMessage);
      
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Chatbot error:', error);
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I'm sorry, I'm experiencing some technical difficulties. Please try again or contact our support team.",
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    // Auto-send the quick action
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <div className="notification-badge">
            <span>New</span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={20} />
              <div>
                <h4>AI Shopping Assistant</h4>
                <span className="online-status">🟢 Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-btn">
              <Send size={18} />
            </button>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="quick-actions">
            <button 
              onClick={() => handleQuickAction("Track my order")}
              className="quick-action-btn"
            >
              <Package size={14} />
              Track Order
            </button>
            <button 
              onClick={() => handleQuickAction("What's your return policy?")}
              className="quick-action-btn"
            >
              Returns
            </button>
            <button 
              onClick={() => handleQuickAction("Show me deals")}
              className="quick-action-btn"
            >
              <ShoppingBag size={14} />
              Deals
            </button>
            <button 
              onClick={() => handleQuickAction("Payment methods")}
              className="quick-action-btn"
            >
              <CreditCard size={14} />
              Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedChatbot;