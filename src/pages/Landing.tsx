import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, FileText, PenTool, CheckSquare, Calendar, Mic, Menu, Star, Sparkles, Github, Twitter, Linkedin, PlayCircle } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Reveal } from "@/components/Reveal"; // Import the new component
// import heroBg from "@/assets/hero-bg.jpg"; // (Optional: Use if needed)

// Enhanced Feature Data
const features = [
  { icon: MessageSquare, title: "AI Chat Tutor", description: "Instant answers 24/7 with our intelligent tutor." },
  { icon: FileText, title: "PDF Q/A", description: "Extract and explain content from uploaded documents instantly." },
  { icon: PenTool, title: "Notes Generator", description: "Transform raw lectures into comprehensive study notes." },
  { icon: CheckSquare, title: "MCQ Maker", description: "Auto-generate quizzes to test your knowledge." },
  { icon: Calendar, title: "Study Planner", description: "Smart scheduling adapting to your pace." },
  { icon: Mic, title: "Voice Tutor", description: "Natural conversation practice with AI." }
];

const testimonials = [
  { name: "Sarah Chen", role: "Medical Student", content: "The MCQ generator is a game-changer for my exams!", rating: 5 },
  { name: "Marcus Johnson", role: "Engineering Student", content: "Saved countless hours with the PDF Q/A feature.", rating: 5 },
  { name: "Emily Rodriguez", role: "Law Student", content: "Explains complex topics clearly. Best study companion.", rating: 5 }
];

const Landing = () => {
  // Parallax Setup
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">
      <AnimatedBackground />

      {/* Premium Navbar */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.6, ease: "circOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-background/50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-display font-bold gradient-text group-hover:opacity-80 transition-opacity">
              StudyMate AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Home", "Tools", "Pricing", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all">Login</Button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(var(--primary), 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden"><Menu /></Button>
        </div>
      </motion.nav>

      {/* Parallax Hero Section */}
      <section ref={targetRef} id="home" className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ opacity, y: yText }}>
            <Reveal>
              <h1 className="text-6xl md:text-8xl font-sans font-extrabold tracking-tight mb-8 leading-[1.1]">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-600 animate-gradient-x">
                  AI Study Partner
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Experience the future of learning. Upload notes, generate quizzes, and master any subject with our premium AI suite.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(var(--primary),0.6)] hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.8)] transition-all">
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 group">
                    <PlayCircle className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </Reveal>
          </motion.div>

          {/* Hero Image/Video Container */}
          <motion.div style={{ scale }} className="relative z-10">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 backdrop-blur-xl group">
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
              
              {/* Replace src with a real video or keep the premium image */}
              <img 
                alt="AI Platform Interface" 
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105" 
                src="/lovable-uploads/f24a8784-0a32-43b0-bd11-0c9dee92c0de.png" 
              />
              
              {/* Floating UI Elements (Parallax decorations) */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 blur-3xl rounded-full" 
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Staggered Cards */}
      <section id="tools" className="py-32 px-6 relative z-20 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful AI Tools</h2>
              <p className="text-xl text-muted-foreground">Everything you need to supercharge your learning workflow.</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative h-full p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:border-primary/30 transition-colors overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Reveal width="100%">
            <div className="rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-white/10 p-12 backdrop-blur-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "50K+", label: "Active Students" },
                  { value: "1M+", label: "Questions Solved" },
                  { value: "95%", label: "Success Rate" },
                  { value: "24/7", label: "AI Support" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <h4 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                      {stat.value}
                    </h4>
                    <p className="text-primary/80 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Scrolling Testimonials */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="container mx-auto mb-16 text-center">
          <Reveal width="100%">
            <h2 className="text-4xl font-bold mb-4">Loved by Students</h2>
          </Reveal>
        </div>
        
        {/* Horizontal Scroll Effect container */}
        <div className="flex gap-6 relative left-1/2 -translate-x-1/2 w-max px-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div 
              key={i}
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[350px] md:w-[450px]"
            >
              <Card className="h-full bg-white/5 border-white/10 hover:border-primary/30 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground/90 mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Reveal width="100%">
            <div className="relative overflow-hidden rounded-[3rem] bg-primary p-16 md:p-24">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full"></div>
              
              <h2 className="relative z-10 text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to transform your grades?
              </h2>
              <p className="relative z-10 text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                Join thousands of students learning smarter, not harder.
              </p>
              <Link to="/login" className="relative z-10">
                <Button size="lg" variant="secondary" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                  Start Learning Now
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">StudyMate AI</span>
              </Link>
              <p className="text-muted-foreground max-w-xs">
                Empowering students with AI-driven tools for a smarter, more efficient learning journey.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Socials</h4>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 StudyMate AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;