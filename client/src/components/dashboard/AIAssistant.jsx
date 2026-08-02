import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  TrendingUp, 
  FileText, 
  AlertCircle 
} from "lucide-react";

export default function AIAssistant({ stats }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am Flowy, your AI Business Assistant. Ask me anything about your clients, projects, invoices, or how to grow your business!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const completionRate =
    stats.totalProjects > 0
      ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
      : 0;

  const computeScore = () => {
    let score = 50;
    if (stats.totalClients > 0) score += 10;
    if (stats.totalProjects > 0) score += 10;
    if (stats.completedProjects > 0) score += 10;
    if (stats.paidRevenue > 0) score += 10;
    score -= stats.overdueInvoices * 5;
    return Math.max(0, Math.min(score, 100));
  };

  const getAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("project") || q.includes("summarize")) {
      if (stats.totalProjects === 0) {
        return "You don't have any projects registered yet. Tap 'Add Project' in the Quick Actions card to launch your first workspace.";
      }
      return `You currently have **${stats.totalProjects} projects** in total. **${stats.completedProjects} are completed**, indicating a **${completionRate}% success rate**. Your active partners include Stark Industries and Wayne Enterprises.`;
    }

    if (q.includes("revenue") || q.includes("stat") || q.includes("money") || q.includes("finance")) {
      return `Here's a breakdown of your finances:\n- **Collected Revenue**: ₹${(stats.paidRevenue || 0).toLocaleString()}\n- **Pending Invoices**: ₹${(stats.pendingRevenue || 0).toLocaleString()}\nStark Industries currently represents your largest contract value.`;
    }

    if (q.includes("invoice") || q.includes("overdue") || q.includes("unpaid")) {
      if (stats.overdueInvoices > 0) {
        return `⚠️ You have **${stats.overdueInvoices} overdue invoice(s)** waiting for follow-up. I recommend heading to the **Invoices** tab to trigger a reminder email.`;
      }
      return "Fantastic! You have zero overdue invoices right now. Your client payment cycle is currently optimal.";
    }

    if (q.includes("health") || q.includes("score")) {
      return `Your Business Health Score is **${computeScore()}/100**. This incorporates active client retention, successful project deliveries, and minimizes penalty points for overdue invoices.`;
    }

    if (q.includes("improve") || q.includes("advice") || q.includes("grow")) {
      if (stats.overdueInvoices > 0) {
        return `💡 **Advice**: Reach out to clients on your **${stats.overdueInvoices} overdue invoices** today. For future contracts, structure a **50% deposit upfront** to secure cash flow.`;
      }
      return `💡 **Advice**: Financials are healthy! Consider raising your baseline service rates by **10-15%** for new incoming projects to optimize revenue per client.`;
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello! Hope your business is scaling nicely today. Ask me to 'summarize projects', show 'revenue stats', or give 'business advice'!";
    }

    if (q.includes("thanks") || q.includes("thank you") || q.includes("cool")) {
      return "You're very welcome! Let me know if you need anything else to optimize your freelance flow.";
    }

    // Fallback
    return "I'm not sure about that query. Feel free to use the shortcut buttons below or ask about: 'projects', 'revenue', 'overdue invoices', 'health score', or 'grow advice'.";
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseText = getAIResponse(text);
      const botMsg = {
        sender: "bot",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white/90 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles size={20} className="text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold">Flowy AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
                  <span className="text-xs text-blue-100 font-medium">Online Helper</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div>
                  <div
                    className={`p-3 rounded-2xl text-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-slate-100 rounded-tl-none"
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 max-w-[80%] mr-auto">
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 rounded-tl-none">
                  <div className="flex gap-1.5 items-center justify-center h-4">
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Triggers */}
          <div className="px-4 py-2 border-t border-slate-50 bg-white flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => handleSend("Show Revenue Stats")}
              className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-1 shrink-0"
            >
              <TrendingUp size={12} />
              ₹ Revenue
            </button>
            <button
              onClick={() => handleSend("Project Summary")}
              className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-1 shrink-0"
            >
              <FileText size={12} />
              📁 Projects
            </button>
            <button
              onClick={() => handleSend("Overdue Invoices")}
              className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-1 shrink-0"
            >
              <AlertCircle size={12} />
              ⚠️ Invoices
            </button>
            <button
              onClick={() => handleSend("Improvement Advice")}
              className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-1 shrink-0"
            >
              <Sparkles size={12} />
              💡 Advice
            </button>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Flowy AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 active:scale-95 transition"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
