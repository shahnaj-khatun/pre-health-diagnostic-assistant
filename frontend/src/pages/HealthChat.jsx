import { useState, useRef, useEffect } from 'react';
import MessageBubble from '../components/Chat/MessageBubble';
import SymptomAnalyzer from '../components/Chat/SymptomAnalyzer';
import { ShieldPlus, Info } from 'lucide-react';

export default function HealthChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your PreHealth AI assistant. Can you describe the symptoms you're experiencing today? Please include details like when they started and how severe they feel.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    // Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    try {
      // Setup API calling using standard fetch to Gemini REST API to avoid Node.js native module issues in browser
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'dummy_gemini_api_key_placeholder') {
        throw new Error("Invalid API Key");
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
             parts: [{
                text: `You are a helpful, professional AI medical assistant for the PreHealth Diagnostic System.
                If the user describes symptoms: provide a short assessment, advice on urgency, and basic care steps.
                If the user asks about a disease: explain it simply, common causes, and when to see a doctor.
                User input: "${text}"
                
                Guidelines:
                1. Be empathetic but professional.
                2. Do not give a final medical diagnosis.
                3. End your response with exactly one of these tags: [LOW_URGENCY], [MEDIUM_URGENCY], [HIGH_URGENCY].` 
             }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Gemini API Error Data:", data);
        throw new Error(data.error?.message || "Failed to fetch response");
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      
      let urgency = "low";
      let assessmentDetail = "Symptoms indicate a non-urgent condition. Self-care and rest advised.";
      
      let cleanResponse = generatedText;

      if (generatedText.includes('HIGH_URGENCY')) {
        urgency = "high";
        assessmentDetail = "Symptoms indicate a potentially life-threatening condition requiring immediate medical evaluation.";
        cleanResponse = generatedText.replace(/HIGH_URGENCY/g, '').trim();
      } else if (generatedText.includes('MEDIUM_URGENCY')) {
        urgency = "medium";
        assessmentDetail = "Symptoms suggest a moderate condition. Professional consultation recommended if no improvement.";
        cleanResponse = generatedText.replace(/MEDIUM_URGENCY/g, '').trim();
      } else {
         cleanResponse = generatedText.replace(/LOW_URGENCY/g, '').trim();
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: cleanResponse,
        urgency,
        assessmentDetail,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMsg]);

      // Save to backend history
      try {
        const token = localStorage.getItem('token');
        if (token) {
           await fetch('/api/symptoms', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'x-auth-token': token
             },
             body: JSON.stringify({
               symptoms: [text],
               diagnosis: assessmentDetail,
               urgency: urgency,
               recommendations: [], 
               aiResponse: cleanResponse
             })
           });
        }
      } catch (dbError) {
         console.error("Failed to save history to database:", dbError);
      }

    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting to my assessment network right now. Please make sure your API key is correctly configured.",
        urgency: "low",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-900 relative">
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">AI Symptom Checker</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-500 font-medium">Online Model: Active</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl rounded-bl-sm p-4 w-20 flex justify-center gap-1">
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <SymptomAnalyzer onSendMessage={handleSendMessage} />
    </div>
  );
}
