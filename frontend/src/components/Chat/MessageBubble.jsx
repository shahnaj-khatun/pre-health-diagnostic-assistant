import { AlertCircle, Activity, ShieldAlert, Bot, User } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isAi = message.sender === 'ai';
  
  return (
    <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'} gap-3 items-end`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isAi ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        
        {/* Message Content */}
        <div className={`flex flex-col space-y-2 ${isAi ? 'items-start' : 'items-end'}`}>
          <div className={`p-4 rounded-2xl ${
            isAi 
              ? 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm' 
              : 'bg-teal-600 text-white shadow-sm rounded-br-sm'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Optional Urgency Assessment or Forms specifically from AI */}
          {isAi && message.urgency && (
             <div className={`mt-2 p-3 rounded-xl border w-full text-sm max-w-sm flex items-start gap-3 ${
               message.urgency === 'high' ? 'bg-rose-50 border-rose-200 text-rose-800' :
               message.urgency === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
               'bg-blue-50 border-blue-200 text-blue-800'
             }`}>
               {message.urgency === 'high' ? <ShieldAlert className="w-5 h-5 flex-shrink-0" /> : 
                message.urgency === 'medium' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : 
                <Activity className="w-5 h-5 flex-shrink-0" />}
               <div>
                 <p className="font-semibold mb-1">
                   {message.urgency === 'high' ? 'High Urgency' : message.urgency === 'medium' ? 'Moderate Urgency' : 'Low Urgency'}
                 </p>
                 <p className="text-xs opacity-90">{message.assessmentDetail}</p>
               </div>
             </div>
          )}

          <span className="text-[10px] text-gray-400 font-medium px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {isAi ? ' • AI Assessment' : ''}
          </span>
        </div>
        
      </div>
    </div>
  );
}
