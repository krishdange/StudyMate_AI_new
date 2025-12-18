import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, Lock, Chrome } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
      } else {
        await register(email, password, firstName, lastName);
        toast({
          title: "Account created!",
          description: "Welcome to StudyMate AI",
        });
      }
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isLogin ? "Sign in failed" : "Sign up failed",
        description: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <AnimatedBackground />

      <motion.div initial={{
      opacity: 0,
      y: 50
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Sparkles className="w-10 h-10 text-primary" />
          <span className="text-3xl font-display font-bold gradient-text">StudyMate AI</span>
        </Link>

        {/* Auth Card */}
        <Card className="glass-strong border-primary/30 glow-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display gradient-text">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? "Sign in to continue your learning journey" : "Join thousands of students learning smarter"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all" size="lg">
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground/90">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground/90">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                      placeholder="Doe"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/90">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50"
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/90">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              {isLogin && <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                    <input type="checkbox" className="rounded border-primary/30" />
                    Remember me
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-hover"
                size="lg"
              >
                {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>;
};
export default Login;