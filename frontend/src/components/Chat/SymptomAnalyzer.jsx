import { useState } from 'react';
import { Send, Plus, Paperclip } from 'lucide-react';

export default function SymptomAnalyzer({ onSendMessage }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage(inputText);
    setInputText('');
  };

  const quickSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea"
  ];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Quick Select Symptoms */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
        {quickSymptoms.map(symptom => (
          <button
            key={symptom}
            onClick={() => onSendMessage(`I'm experiencing a ${symptom.toLowerCase()}.`)}
            className="flex-shrink-0 px-4 py-1.5 bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-700 text-sm font-medium rounded-full transition-colors whitespace-nowrap border border-transparent hover:border-teal-200"
          >
            + {symptom}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <button 
          type="button" 
          className="p-3 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your symptoms in detail..."
            className="w-full bg-slate-50 border border-gray-200 text-gray-800 rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none overflow-hidden min-h-[50px] max-h-[150px]"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!inputText.trim()}
          className={`p-3 rounded-full flex-shrink-0 transition-colors ${
            inputText.trim() 
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>
      <div className="text-center mt-2">
         <span className="text-xs text-gray-400">AI analysis is for informational purposes only and not a substitute for professional medical advice.</span>
      </div>
    </div>
  );
}
