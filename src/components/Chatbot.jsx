import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to our store! I'm your professional shopping consultant. I can assist you with product recommendations, order inquiries, and provide detailed information about our current inventory. How may I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      showQuickActions: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch real products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Chatbot: Fetching products from API...');
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success && data.items) {
          setProducts(data.items);
          setProductsLoaded(true);
          console.log('Chatbot: Successfully loaded', data.items.length, 'real products');
          console.log('Sample product:', data.items[0]); // Debug log
        } else {
          console.error('Chatbot: Failed to load products - Invalid response');
          setProductsLoaded(false);
        }
      } catch (error) {
        console.error('Chatbot: Error fetching products:', error);
        setProductsLoaded(false);
      }
    };

    fetchProducts();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Product recommendation helpers
  const getRandomProducts = (count = 3) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getProductsByCategory = (category, count = 3) => {
    return products
      .filter(product => product.category && product.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, count);
  };

  const getProductsByKeywords = (keywords, count = 3) => {
    const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];
    console.log('Chatbot: Searching for keywords:', keywordsArray, 'in', products.length, 'products');
    
    const matchedProducts = products
      .filter(product => {
        const searchText = `${product.name} ${product.description || ''} ${product.category || ''} ${product.brand || ''}`.toLowerCase();
        const isMatch = keywordsArray.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
        if (isMatch) {
          console.log('Chatbot: Matched product:', product.name, 'for keywords:', keywordsArray);
        }
        return isMatch;
      })
      .slice(0, count);
      
    console.log('Chatbot: Final matched products:', matchedProducts.map(p => p.name));
    return matchedProducts;
  };

  const getProductsBySpecificType = (userQuery, count = 5) => {
    const query = userQuery.toLowerCase();
    console.log('Chatbot: User query:', query, 'Products available:', products.length);
    
    // HANDLE PRODUCTS WE DON'T SELL - Be honest about what's not available
    if (query.includes('jewelry') || query.includes('jewellery') || query.includes('ring') || 
        query.includes('necklace') || query.includes('bracelet') || query.includes('earrings')) {
      return []; // Return empty array to trigger "not available" message
    }
    
    if (query.includes('iphone') || query.includes('samsung') || query.includes('phone') || 
        query.includes('mobile') || query.includes('smartphone')) {
      return []; // We don't sell phones
    }
    
    if (query.includes('car') || query.includes('vehicle') || query.includes('automobile')) {
      return []; // We don't sell cars
    }
    
    if (query.includes('food') || query.includes('snacks') || query.includes('drinks')) {
      return []; // We don't sell food
    }
    
    // EXACT MATCHING FOR YOUR REAL PRODUCTS ONLY
    
    // Electronics (12 products) - Based on your actual inventory
    if (query.includes('electronics') || query.includes('tech') || query.includes('gadget') ||
        query.includes('smartwatch') || query.includes('watch') || query.includes('elegant smartwatch')) {
      return getProductsByCategory('Electronics', count);
    }
    
    if (query.includes('laptop') || query.includes('computer') || query.includes('high-performance')) {
      return getProductsByKeywords(['High-Performance Laptop'], count);
    }
    
    if (query.includes('headphones') || query.includes('wireless noise') || query.includes('audio') || query.includes('music')) {
      return getProductsByKeywords(['Wireless Noise'], count);
    }
    
    if (query.includes('speaker') || query.includes('bluetooth') || query.includes('portable bluetooth')) {
      return getProductsByKeywords(['Portable Bluetooth', 'Bluetooth Speaker'], count);
    }
    
    if (query.includes('earbuds') || query.includes('noise cancelling')) {
      return getProductsByKeywords(['Noise Cancelling Earbuds'], count);
    }
    
    if (query.includes('gaming') || query.includes('mouse') || query.includes('gaming mouse')) {
      return getProductsByKeywords(['Gaming Mouse'], count);
    }
    
    if (query.includes('camera') || query.includes('dslr') || query.includes('professional') || query.includes('photo')) {
      return getProductsByKeywords(['Professional DSLR Camera'], count);
    }
    
    if (query.includes('keyboard') || query.includes('wireless keyboard')) {
      return getProductsByKeywords(['Wireless Keyboard'], count);
    }
    
    if (query.includes('fitness tracker') || query.includes('band') || query.includes('tracker')) {
      return getProductsByKeywords(['Fitness Tracker Band'], count);
    }
    
    if (query.includes('e-reader') || query.includes('tablet') || query.includes('reading')) {
      return getProductsByKeywords(['E-Reader Tablet'], count);
    }
    
    if (query.includes('smart home') || query.includes('sensor') || query.includes('home sensor')) {
      return getProductsByKeywords(['Smart Home Sensor'], count);
    }
    
    // Sports (2 products) - "Running Shoes" and "Yoga Mat"
    if (query.includes('shoes') || query.includes('sneakers') || query.includes('footwear') || 
        query.includes('running') || query.includes('running shoes')) {
      return getProductsByKeywords(['Running Shoes'], count);
    }
    
    if (query.includes('yoga') || query.includes('mat') || query.includes('yoga mat') || query.includes('exercise mat')) {
      return getProductsByKeywords(['Yoga Mat'], count);
    }
    
    // Fitness Equipment (1 product) - "Adjustable Dumbbells"
    if (query.includes('dumbbells') || query.includes('weights') || query.includes('adjustable') || 
        query.includes('fitness equipment') || query.includes('workout equipment')) {
      return getProductsByKeywords(['Adjustable Dumbbells'], count);
    }
    
    // Home Goods (5 products)
    if (query.includes('office chair') || query.includes('chair') || query.includes('ergonomic')) {
      return getProductsByKeywords(['Ergonomic Office Chair'], count);
    }
    
    if (query.includes('coffee') || query.includes('coffee maker') || query.includes('gourmet')) {
      return getProductsByKeywords(['Gourmet Coffee Maker'], count);
    }
    
    if (query.includes('lamp') || query.includes('desk lamp') || query.includes('led')) {
      return getProductsByKeywords(['LED Desk Lamp'], count);
    }
    
    if (query.includes('cookware') || query.includes('stainless steel') || query.includes('cooking') || query.includes('kitchen')) {
      return getProductsByKeywords(['Stainless Steel Cookware Set'], count);
    }
    
    if (query.includes('candle') || query.includes('scented') || query.includes('candle set')) {
      return getProductsByKeywords(['Scented Candle Set'], count);
    }
    
    // Apparel (4 products)
    if (query.includes('bag') || query.includes('leather bag') || query.includes('designer')) {
      return getProductsByKeywords(['Designer Leather Bag'], count);
    }
    
    if (query.includes('jacket') || query.includes('denim') || query.includes('casual')) {
      return getProductsByKeywords(['Casual Denim Jacket'], count);
    }
    
    if (query.includes('scarf') || query.includes('silk') || query.includes('silk scarf')) {
      return getProductsByKeywords(['Silk Scarf'], count);
    }
    
    if (query.includes('wallet') || query.includes('leather wallet')) {
      return getProductsByKeywords(['Leather Wallet'], count);
    }
    
    // Beauty products
    if (query.includes('perfume') || query.includes('luxury') || query.includes('fragrance')) {
      return getProductsByKeywords(['Luxury Perfume'], count);
    }
    
    if (query.includes('shampoo') || query.includes('conditioner') || query.includes('hair care')) {
      return getProductsByKeywords(['Shampoo & Conditioner Set'], count);
    }
    
    // Other specific items
    if (query.includes('desk') || query.includes('office desk')) {
      return getProductsByKeywords(['Office Desk'], count);
    }
    
    if (query.includes('tent') || query.includes('camping')) {
      return getProductsByKeywords(['Camping Tent'], count);
    }
    
    if (query.includes('game') || query.includes('board game')) {
      return getProductsByKeywords(['Board Game'], count);
    }
    
    if (query.includes('cookbook') || query.includes('recipes') || query.includes('italian')) {
      return getProductsByKeywords(['Cookbook: Italian Recipes'], count);
    }
    
    // General category searches
    if (query.includes('sports') || query.includes('fitness') || query.includes('exercise')) {
      const sportsProducts = [...getProductsByCategory('Sports'), ...getProductsByCategory('Fitness Equipment')];
      return sportsProducts.slice(0, count);
    }
    
    if (query.includes('home') || query.includes('furniture') || query.includes('office')) { 
      const homeProducts = [...getProductsByCategory('Home Goods'), ...getProductsByCategory('Furniture')];
      return homeProducts.slice(0, count);
    }
    
    if (query.includes('fashion') || query.includes('clothing') || query.includes('apparel')) {
      return getProductsByCategory('Apparel', count);
    }
    
    if (query.includes('beauty') || query.includes('personal care')) {
      const beautyProducts = [...getProductsByCategory('Beauty'), ...getProductsByCategory('Beauty & Personal Care')];
      return beautyProducts.slice(0, count);
    }
    
    // If no specific match found, try general keyword search
    const words = query.split(' ').filter(word => word.length > 2);
    if (words.length > 0) {
      return getProductsByKeywords(words, count);
    }
    
    return [];
  };

  const getProductsByPriceRange = (minPrice, maxPrice, count = 3) => {
    return products
      .filter(product => product.price >= minPrice && product.price <= maxPrice)
      .slice(0, count);
  };

  const formatProductRecommendations = (recommendedProducts, intro = "✅ Based on our current inventory, here are the products that match your request:") => {
    if (recommendedProducts.length === 0) {
      return "❌ **Sorry, no items are available right now for that category.**\n\n💡 Please try browsing our other available products or contact our customer service team for assistance! 😊";
    }

    let response = intro + "\n\n";
    recommendedProducts.forEach((product, index) => {
      response += `${index + 1}. 🛍️ **${product.name}**\n`;
      response += `   💰 **Price:** $${product.price}\n`;
      response += `   📝 **Description:** ${product.description || 'Quality product from our collection'}\n`;
      response += `   🏷️ **Category:** ${product.category || 'General'}\n`;
      response += `   🏢 **Brand:** ${product.brand || 'Quality Brand'}\n`;
      response += `${'━'.repeat(35)}\n\n`;
    });
    
    response += "💬 Would you like more details about any of these products or help with your purchase? I'm here to assist! 😊\n\n";
    response += "💡 **Quick Actions:** You can ask me about pricing, availability, shipping, or similar products!";
    
    return response;
  };

  // Predefined responses for common ecommerce queries
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check if products are loaded yet
    if (!productsLoaded || products.length === 0) {
      if (message.includes('product') || message.includes('recommend') || message.includes('suggest') || 
          message.includes('show') || message.includes('find') || message.includes('shop') ||
          message.includes('footwear') || message.includes('shoes') || message.includes('electronics')) {
        return "⏳ I'm currently loading our real product inventory from our database. Please wait a moment for me to access our latest product catalog...";
      }
    }
    
    // Product-related queries with specific recommendations
    if (message.includes('recommend') || message.includes('suggest') || message.includes('best') || 
        message.includes('show') || message.includes('find') || message.includes('looking for')) {
      
      // Check for unavailable product types FIRST and give honest responses
      if (message.includes('jewelry') || message.includes('jewellery') || message.includes('ring') || 
          message.includes('necklace') || message.includes('bracelet') || message.includes('earrings')) {
        return "I apologize, but we currently don't carry any jewelry items in our store. 💍❌\n\nOur available product categories are:\n🔌 Electronics (12 items)\n🏋️ Sports & Fitness Equipment (2 items)\n🏠 Home Goods (5 items)\n👗 Apparel (4 items)\n💄 Beauty Products (1 item)\n\nWould you like me to show you products from any of these categories instead?";
      }
      
      if (message.includes('phone') || message.includes('mobile') || message.includes('smartphone') || 
          message.includes('iphone') || message.includes('samsung')) {
        return "We don't currently have smartphones or mobile phones available. 📱❌\n\nBut we do have great Electronics like smartwatches, laptops, and headphones! Would you like to see those instead?";
      }
      
      // Now try specific product type matching from inventory
      const specificProducts = getProductsBySpecificType(message, 3);
      if (specificProducts.length > 0) {
        return formatProductRecommendations(specificProducts, "✅ Found these exact products in our store:");
      }
      
      // Category-based recommendations from available inventory  
      if (message.includes('electronics') || message.includes('tech') || message.includes('gadget')) {
        return formatProductRecommendations(getProductsByCategory('Electronics'), "🔌 Our Electronics Collection (12 products):");
      }
      if (message.includes('sports') || message.includes('fitness') || message.includes('exercise')) {
        const sportsProducts = [...getProductsByCategory('Sports'), ...getProductsByCategory('Fitness Equipment')];
        return formatProductRecommendations(sportsProducts.slice(0, 5), "🏃‍♂️ Our Sports & Fitness Collection:");
      }
      if (message.includes('home') || message.includes('furniture') || message.includes('office')) {
        const homeProducts = [...getProductsByCategory('Home Goods'), ...getProductsByCategory('Furniture')];
        return formatProductRecommendations(homeProducts.slice(0, 5), "🏠 Our Home & Office Collection:");
      }
      if (message.includes('apparel') || message.includes('fashion') || message.includes('clothing')) {
        return formatProductRecommendations(getProductsByCategory('Apparel'), "👗 Our Fashion Collection (4 products):");
      }
      if (message.includes('beauty') || message.includes('personal care')) {
        const beautyProducts = [...getProductsByCategory('Beauty'), ...getProductsByCategory('Beauty & Personal Care')];
        return formatProductRecommendations(beautyProducts, "💄 Our Beauty & Personal Care Collection:");
      }
      if (message.includes('budget') || message.includes('affordable') || message.includes('cheap')) {
        return formatProductRecommendations(getProductsByPriceRange(0, 100), "💰 Our Budget-Friendly Options (Under $100):");
      }
      if (message.includes('premium') || message.includes('expensive') || message.includes('luxury')) {
        return formatProductRecommendations(getProductsByPriceRange(200, 2000), "✨ Our Premium Collection:");
      }
      
      // Default recommendations if no specific match
      return formatProductRecommendations(getRandomProducts(3), "🌟 Here are some popular products from our store:");
    }
    
    // General product queries with specific matching
    if (message.includes('product') || message.includes('item') || message.includes('buy') || message.includes('shop') || message.includes('purchase')) {
      
      // Check for unavailable product types and give honest responses
      if (message.includes('jewelry') || message.includes('jewellery') || message.includes('ring') || 
          message.includes('necklace') || message.includes('bracelet') || message.includes('earrings')) {
        return "I apologize, but we currently don't have any jewelry items available in our store. 💍❌\n\nOur available products include Electronics, Sports Equipment, Home Goods, Apparel, and Beauty items. Would you like to browse any of these categories instead?";
      }
      
      // Try specific product matching first from inventory
      const specificProducts = getProductsBySpecificType(message, 4);
      if (specificProducts.length > 0) {
        return formatProductRecommendations(specificProducts, "🛍️ Here are the products from our store that match your search:");
      }
      
      // Category fallbacks from available inventory
      if (message.includes('electronics') || message.includes('laptop') || message.includes('smartwatch') || message.includes('headphones')) {
        return formatProductRecommendations(getProductsByCategory('Electronics'), "🔌 Browse our Electronics Department (12 items):");
      }
      if (message.includes('fitness') || message.includes('sports') || message.includes('exercise')) {
        const sportsProducts = [...getProductsByCategory('Sports'), ...getProductsByCategory('Fitness Equipment')];
        return formatProductRecommendations(sportsProducts.slice(0, 5), "🏋️ Check out our Sports & Fitness Section:");
      }
      if (message.includes('home') || message.includes('office') || message.includes('furniture')) {
        const homeProducts = [...getProductsByCategory('Home Goods'), ...getProductsByCategory('Furniture')];
        return formatProductRecommendations(homeProducts.slice(0, 5), "🏠 Explore our Home & Office Collection:");
      }
      if (message.includes('apparel') || message.includes('fashion') || message.includes('clothing')) {
        return formatProductRecommendations(getProductsByCategory('Apparel'), "👗 Browse our Fashion Collection:");
      }
      
      return formatProductRecommendations(getRandomProducts(4), "🌟 Browse our featured products:");
    }

    // Direct product search - when user mentions specific product types
    // Check for unavailable product types first
    if (message.includes('jewelry') || message.includes('jewellery') || message.includes('ring') || 
        message.includes('necklace') || message.includes('bracelet') || message.includes('earrings')) {
      return "Sorry, we don't currently carry jewelry items. 💍❌ We specialize in Electronics, Sports Equipment, Home Goods, Apparel, and Beauty products. What type of product would you like to see from these categories?";
    }
    
    const specificProducts = getProductsBySpecificType(message, 3);
    if (specificProducts.length > 0) {
      return formatProductRecommendations(specificProducts, "🔍 I found these specific products for you:");
    }
    
    // Shipping queries
    if (message.includes('ship') || message.includes('delivery') || message.includes('tracking')) {
      return "We provide professional shipping services with multiple delivery options. Standard delivery takes 3-5 business days, while express delivery is available in 1-2 business days. Once your order ships, you'll receive tracking information to monitor your package status through your customer dashboard.";
    }
    
    // Returns/refunds
    if (message.includes('return') || message.includes('refund') || message.includes('exchange')) {
      return "We maintain a customer-friendly 30-day return policy for items in original condition. For detailed return procedures and to initiate a return, please visit our Returns & Refunds page or contact our customer service team for personalized assistance.";
    }
    
    // Payment queries
    if (message.includes('payment') || message.includes('pay') || message.includes('card') || message.includes('checkout')) {
      return "We accept all major credit cards, PayPal, and other secure payment methods. Our checkout process uses industry-standard encryption to ensure your payment information remains completely secure and protected.";
    }
    
    // Account/login help
    if (message.includes('account') || message.includes('login') || message.includes('sign') || message.includes('register')) {
      return "To access your account features, please use the login option in the upper right corner of our website. Creating an account provides benefits including order tracking, purchase history, and personalized recommendations. May I assist you with any specific account-related questions?";
    }
    
    // Size/fit queries
    if (message.includes('size') || message.includes('fit') || message.includes('measurement')) {
      return "For accurate sizing information, please refer to the detailed 'Size Guide' available on each product page. Our sizing charts are designed to help you select the perfect fit. If you're between sizes, our general recommendation is to choose the larger size for optimal comfort.";
    }
    
    // Contact/support
    if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone') || message.includes('email')) {
      return "Our customer service team is available to assist you through multiple channels. You can reach us via our Contact page, email, or phone. We're committed to providing prompt, professional assistance for all your inquiries.";
    }
    
    // Orders
    if (message.includes('order') || message.includes('purchase') || message.includes('bought')) {
      return "To review your order status and history, please log into your account and visit your Dashboard. There you can access detailed order information, tracking details, and download invoices. Is there a specific order you need assistance with?";
    }
    
    // Deals/discounts
    if (message.includes('deal') || message.includes('discount') || message.includes('sale') || message.includes('offer')) {
      return "Please visit our Seasonal Deals page to view current promotions and special offers. We regularly update our discounts and run promotional campaigns throughout the year. Subscribe to our newsletter to receive notifications about exclusive deals.";
    }
    
    // Business/wholesale
    if (message.includes('business') || message.includes('wholesale') || message.includes('bulk')) {
      return "For business orders and wholesale pricing, please visit our Business Orders page. We offer competitive wholesale rates and dealer registration programs for qualified business customers. Our team can provide customized solutions for your business needs.";
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello and welcome to our store! I'm your professional shopping consultant, ready to assist you with product information, order inquiries, shipping details, and any other questions you may have. How may I help you today?";
    }
    
    // Thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! It's my pleasure to assist you. Is there anything else I can help you with today? I'm here to ensure you have an excellent shopping experience.";
    }
    
    // Default response
    return "Thank you for your inquiry. I'm here to provide professional assistance with product information from our current inventory, order support, shipping policies, account services, and general inquiries. Please feel free to ask about any of our available products or services. How may I best assist you today?";
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

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (actionText) => {
    const userMessage = {
      id: messages.length + 1,
      text: actionText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(actionText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={20} />
              <div>
                <h4>Shopping Assistant</h4>
                <span className="online-status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>
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
                  {message.showQuickActions && (
                    <div className="quick-actions">
                      <button className="quick-action-btn" onClick={() => handleQuickAction("Show me jewelry")}>
                        💍 Jewelry
                      </button>
                      <button className="quick-action-btn" onClick={() => handleQuickAction("Electronics products")}>
                        📱 Electronics
                      </button>
                      <button className="quick-action-btn" onClick={() => handleQuickAction("Nike shoes")}>
                        👟 Footwear
                      </button>
                      <button className="quick-action-btn" onClick={() => handleQuickAction("MacBook laptop")}>
                        💻 MacBook
                      </button>
                      <button className="quick-action-btn" onClick={() => handleQuickAction("AirPods earbuds")}>
                        🎧 AirPods
                      </button>
                    </div>
                  )}
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

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              onClick={() => setInputMessage("How can I track my order?")}
              className="quick-action-btn"
            >
              Track Order
            </button>
            <button 
              onClick={() => setInputMessage("What's your return policy?")}
              className="quick-action-btn"
            >
              Returns
            </button>
            <button 
              onClick={() => setInputMessage("Do you have any deals?")}
              className="quick-action-btn"
            >
              Deals
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;