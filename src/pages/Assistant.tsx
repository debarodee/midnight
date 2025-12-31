import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  User, 
  RefreshCw,
  Lightbulb,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { generateChatResponse } from '../lib/gemini';
import type { ChatMessage } from '../types';
import { EXAMPLE_CHAT_MESSAGES } from '../constants/exampleContent';

const suggestedQuestions = [
  "What should I focus on today?",
  "How often should I change my air filter?",
  "Help me set a realistic savings goal",
  "What's a good morning routine?",
  "Tips for staying consistent with habits",
];

const Assistant = () => {
  const { chatHistory, addChatMessage, clearChatHistory, getDashboardStats, goals, tasks, reminders, habits } = useDataStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    addChatMessage({
      role: 'user',
      content: textToSend,
    });
    setInput('');
    setIsLoading(true);

    try {
      // Get context for AI
      const stats = getDashboardStats();
      const context = {
        stats,
        recentGoals: goals.slice(0, 5),
        recentTasks: tasks.slice(0, 5),
        upcomingReminders: reminders.filter(r => !r.isCompleted).slice(0, 5),
        habits: habits.slice(0, 5),
      };

      // Generate response
      const response = await generateChatResponse(textToSend, context);

      // Add assistant message
      addChatMessage({
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        role: 'assistant',
        content: "I had trouble processing that. Could you try asking in a different way?",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-100 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-champagne flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-midnight">Midnight Assistant</h1>
              <p className="text-sm text-midnight-300">AI-powered life coaching</p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="p-2 rounded-lg hover:bg-slate-100 text-midnight-400 hover:text-red-500 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet/10 to-champagne/10 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-violet" />
                </div>
                <h2 className="text-xl font-semibold text-midnight mb-2">How can I help you today?</h2>
                <p className="text-midnight-300 max-w-md mx-auto">
                  I'm your personal life assistant. Ask me anything about productivity, adulting tips, or managing your goals.
                </p>
              </div>

              {/* Example conversation preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-violet/10 rounded-xl text-violet text-sm w-fit mx-auto">
                  <Sparkles className="w-4 h-4" />
                  <span>Here's an example conversation:</span>
                </div>
                
                <div className="space-y-4 opacity-75 pointer-events-none max-w-2xl mx-auto">
                  {EXAMPLE_CHAT_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                        ${message.role === 'user' 
                          ? 'bg-midnight text-white' 
                          : 'bg-gradient-to-br from-violet to-champagne'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 
                          ${message.role === 'user' 
                            ? 'bg-midnight text-white rounded-tr-none' 
                            : 'bg-slate-100 text-midnight rounded-tl-none'
                          }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested questions */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-midnight-400">Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSend(question)}
                      className="px-4 py-2 rounded-full bg-slate-100 text-sm text-midnight hover:bg-slate-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {chatHistory.map((message, index) => (
                <ChatBubble key={message.id || index} message={message} />
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-champagne flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-midnight-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-midnight-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-midnight-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 lg:p-6 border-t border-slate-100 bg-white safe-bottom">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="input-field pr-12 resize-none min-h-[48px] max-h-32"
              style={{ height: 'auto' }}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-midnight hover:bg-midnight-600 
                         disabled:bg-slate-200 disabled:text-slate-400
                         flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <p className="text-xs text-midnight-300 mt-2 text-center">
            Midnight uses AI to provide suggestions. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

// Chat Bubble Component
const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
        ${isUser 
          ? 'bg-midnight text-white' 
          : 'bg-gradient-to-br from-violet to-champagne'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 
          ${isUser 
            ? 'bg-midnight text-white rounded-tr-none' 
            : 'bg-slate-100 text-midnight rounded-tl-none'
          }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
};

export default Assistant;
