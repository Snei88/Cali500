
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CALI } from '@/utils/constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy el asistente inteligente de Visión Cali 500+. ¿En qué puedo ayudarte hoy con respecto al futuro de nuestra ciudad?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Fix: Strictly follow Gemini API guidelines for initialization using named parameter and direct process.env usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Eres el asistente oficial de "Visión Cali 500+". 
        Tu propósito es informar a los ciudadanos sobre el plan de desarrollo estratégico de Santiago de Cali.
        Contexto clave:
        - 4 Ejes: Bienestar Basado en la Interculturalidad, Territorio Adaptativo e Inteligente, Competitividad Sostenible y Transversal.
        - Meta: Cali 2050 (Quinto Centenario).
        - Hay 56 instrumentos de planificación activos (planes maestros, políticas públicas, planes de ordenamiento).
        
        Responde de forma amable, profesional y concisa. Si no sabes algo específico sobre un instrumento, invita al usuario a consultar el "Ecosistema de Instrumentos" en el dashboard.
        
        Pregunta del usuario: ${userMessage}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || "Lo siento, tuve un pequeño problema al procesar tu solicitud. ¿Podrías intentar de nuevo?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Lo siento, mi conexión con el servidor de inteligencia está experimentando latencia. Por favor, intenta en unos momentos." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] no-print">
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageSquare className="relative z-10 h-6 w-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="flex flex-col w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-4 flex items-center justify-between bg-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">Cali-GPT IA</h3>
                <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Asistente Visión 500+</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white border border-slate-200'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-white text-slate-400 text-[10px] font-medium border border-slate-100 rounded-tl-none">
                    Analizando instrumentos...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-all">
              <input
                type="text"
                placeholder="Pregunta sobre el Plan Cali 500+..."
                className="flex-1 bg-transparent border-none outline-none px-2 text-sm text-slate-700 placeholder:text-slate-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all active:scale-90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
