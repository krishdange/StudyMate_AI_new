import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  FileText,
  CheckSquare,
  PenTool,
  Calendar,
  Sparkles,
  LogOut,
  History,
  Home,
  Mic,
  Image as ImageIcon,
  Paperclip,
  Send,
  MoreHorizontal,
  ChevronRight,
  X,
  Zap,
  Command,
  Headphones
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { PdfQA } from "@/components/PdfQA";
import { ChatTutor } from "@/components/ChatTutor";
import { NotesGenerator } from "@/components/NotesGenerator";
import { MCQGenerator } from "@/components/MCQGenerator";
import { StudyPlanner } from "@/components/StudyPlanner";
import { useToast } from "@/components/ui/use-toast";

// --- Configuration ---
const sidebarGroups = [
  {
    title: "Study Tools",
    items: [
      { id: "chat", label: "AI Tutor", icon: MessageSquare },
      { id: "pdf-qa", label: "Document AI", icon: FileText },
      { id: "notes", label: "Smart Notes", icon: PenTool },
      { id: "mcq", label: "Quiz Master", icon: CheckSquare },
    ]
  },
  {
    title: "Organization",
    items: [
      { id: "planner", label: "Planner", icon: Calendar },
      { id: "history", label: "History", icon: History },
    ]
  }
];

const quickActions = [
  { label: "Summarize", icon: FileText, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { label: "Explain", icon: Sparkles, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { label: "Quiz Me", icon: CheckSquare, color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
];

const Dashboard = () => {
  const [activeView, setActiveView] = useState<string>("home");
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    toast({ title: "Logged out", description: "See you next time!" });
    navigate("/login");
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate listening duration
    setTimeout(() => {
      setIsListening(false);
      setInputValue("Explain quantum entanglement in simple terms...");
      setIsInputFocused(true);
    }, 3000);
  };

  const handlePromptClick = (text: string) => {
    setInputValue(text);
    setIsInputFocused(true);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setActiveView("chat");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0B] text-foreground font-sans overflow-hidden selection:bg-primary/30">
      <AnimatedBackground />

      {/* --- Voice Command Overlay --- */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setIsListening(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-white/10 p-12 rounded-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pulsing Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 bg-primary/20 rounded-full animate-ping opacity-20" />
                 <div className="w-48 h-48 bg-primary/30 rounded-full animate-ping opacity-30 delay-150" />
              </div>

              <div className="relative z-10 bg-gradient-to-tr from-primary to-purple-500 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.5)] mb-8">
                <Mic className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Listening...</h3>
              <p className="text-muted-foreground text-center">Speak naturally. Say "Stop" to cancel.</p>
              
              <div className="flex gap-1 mt-8 h-8 items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 24, 10] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-1.5 bg-primary rounded-full"
                  />
                ))}
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                onClick={() => setIsListening(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Premium Sidebar --- */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-screen w-72 bg-[#0A0A0B]/90 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-md rounded-lg" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white shadow-inner border border-white/20">
                    <Sparkles className="w-5 h-5" />
                </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">StudyMate</h1>
              <p className="text-[10px] font-medium text-primary uppercase tracking-wider">AI Workspace</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            <button
              onClick={() => setActiveView("home")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeView === "home" 
                ? "bg-white/5 text-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] border border-white/5" 
                : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
              {activeView === "home" && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
            </button>

          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 mb-3 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 z-10 transition-colors ${isActive ? "text-primary" : "group-hover:text-white"}`} />
                      <span className="z-10">{item.label}</span>
                      
                      {/* Active Glow */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <Avatar className="h-9 w-9 border border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white font-bold text-xs">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[10px] text-muted-foreground truncate">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-muted-foreground hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* --- Main Content Stage --- */}
      <main className="flex-1 ml-72 flex flex-col h-screen relative overflow-hidden bg-[#0A0A0B]">
        {/* Top Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeView === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-center p-8 relative z-10"
            >
              {/* Central Input Hub */}
              <div className="w-full max-w-2xl relative">
                
                {/* Greeting */}
                <div className="text-center mb-10">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-muted-foreground mb-6"
                  >
                    <Headphones className="w-3 h-3 text-primary" />
                    <span>Voice Commands Active</span>
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
                  >
                    What are we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">mastering</span> today?
                  </motion.h1>
                </div>

                {/* The Input Bar */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`group relative rounded-3xl bg-[#121214] border transition-all duration-500 shadow-2xl ${
                    isInputFocused 
                      ? "border-primary/50 ring-1 ring-primary/20 shadow-[0_0_50px_-10px_rgba(var(--primary),0.15)] scale-[1.01]" 
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="p-4 flex flex-col gap-3">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Ask anything..."
                      className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-muted-foreground/40 resize-none h-[50px] font-medium"
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
                    />
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={startListening}
                            className={`h-9 w-9 rounded-full transition-all ${isListening ? "text-red-400 bg-red-400/10 animate-pulse" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/60">
                           <Command className="w-3 h-3" />
                           <span>+ Enter</span>
                        </div>
                        <Button 
                          size="icon"
                          onClick={handleSubmit}
                          disabled={!inputValue.trim()}
                          className={`h-9 w-9 rounded-xl transition-all duration-300 ${
                            inputValue.trim() 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105" 
                              : "bg-white/5 text-muted-foreground/50"
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-3 gap-3 mt-6"
                >
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(`${action.label} `)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all group ${action.color.split(" ")[2]}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // --- Active Tool View ---
            <motion.div
              key="tool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Tool Header */}
              <header className="h-16 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setActiveView("home")} className="rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white">
                    <Home className="w-4 h-4" />
                  </Button>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <h2 className="font-semibold text-white tracking-tight">
                       {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeView)?.label}
                     </h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-xs gap-2 rounded-lg">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      Pro Mode
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-lg text-muted-foreground">
                       <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
              </header>

              {/* Tool Content Container */}
              <div className="flex-1 overflow-hidden p-6">
                <div className="h-full w-full rounded-3xl border border-white/10 bg-white/[0.02] shadow-2xl overflow-hidden relative">
                   {/* Tool Components Render */}
                  {activeView === "chat" && <ChatTutor />}
                  {activeView === "pdf-qa" && (
                    <div className="h-full overflow-y-auto p-6 scroll-smooth custom-scrollbar"><PdfQA /></div>
                  )}
                  {activeView === "mcq" && (
                    <div className="h-full overflow-y-auto p-6 scroll-smooth custom-scrollbar"><MCQGenerator /></div>
                  )}
                  {activeView === "notes" && (
                    <div className="h-full overflow-y-auto p-6 scroll-smooth custom-scrollbar"><NotesGenerator /></div>
                  )}
                  {activeView === "planner" && (
                    <div className="h-full overflow-y-auto p-6 scroll-smooth custom-scrollbar"><StudyPlanner /></div>
                  )}
                  {activeView === "history" && (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                       <div className="text-center">
                          <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <h3 className="text-lg font-medium text-white mb-2">History is empty</h3>
                          <p className="text-sm">Your recent sessions will appear here.</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;