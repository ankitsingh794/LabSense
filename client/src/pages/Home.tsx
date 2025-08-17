import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Shield, ArrowRight, Upload, Brain, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-lab.jpg";

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: "Plain-English Explanations",
      description: "Transform complex lab results into clear, understandable language that anyone can comprehend."
    },
    {
      icon: MessageSquare,
      title: "Intelligent Triage",
      description: "Get smart recommendations on whether your results need immediate attention or routine follow-up."
    },
    {
      icon: Shield,
      title: "Safe Guidance",
      description: "Receive medically sound advice while being directed to appropriate healthcare professionals when needed."
    }
  ];

  // 🔥 Handle scroll-to-section from navbar
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("scroll");
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-subtle scroll-smooth">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in [animation-delay:200ms]">
                  Understand Your
                  <span className="bg-gradient-hero bg-clip-text text-transparent animate-glow"> Lab Results </span>
                  Instantly
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg animate-fade-in [animation-delay:400ms]">
                  LabSense transforms complex medical test results into clear, actionable insights. 
                  Get instant explanations, smart triage, and safe guidance for your health data.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:600ms]">
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-medium transition-all hover:scale-105 duration-300">
                  <Link to="/chat">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                {/* Learn More button goes to About */}
                <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all duration-300">
                  <a href="#about">Learn More</a>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground animate-fade-in [animation-delay:800ms]">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-accent mr-2" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-accent mr-2" />
                  Medically Reviewed
                </div>
              </div>
            </div>

            <div className="lg:order-last animate-fade-in [animation-delay:300ms]">
              <div className="relative animate-float">
                <img 
                  src={heroImage} 
                  alt="Modern laboratory with digital health technology"
                  className="rounded-2xl shadow-medium w-full transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-yellow-400 " >
              Why Choose LabSense?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto ">
              Our AI-powered platform makes medical testing accessible, understandable, and actionable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-soft hover:shadow-medium transition-all duration-500 hover:scale-105 animate-fade-in group bg-blue-950"
                style={{ animationDelay: `${index * 200 + 1000}ms` }}
              >
                <CardHeader className="text-center text-yellow-400">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float ">
                    <feature.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base ">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 animate-fade-in">
            About LabSense
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground animate-fade-in [animation-delay:200ms]">
            <p>
              LabSense was created to bridge the gap between complex medical testing and patient understanding. 
              Our mission is to empower individuals with clear, actionable insights about their health data.
            </p>
            <p>
              Built by a team of medical professionals and AI specialists, LabSense combines cutting-edge 
              technology with clinical expertise to provide safe, reliable health guidance that complements 
              professional medical care.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center animate-fade-in [animation-delay:400ms]">
            <Button asChild size="lg" variant="outline" className="hover:scale-105 transition-all duration-300">
              <Link to="/chat">
                Try LabSense Today <Upload className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">LabSense</span>
              </div>
              <p className="text-muted-foreground">
                Making lab results understandable for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/chat" className="block text-muted-foreground hover:text-primary transition-colors">
                  Chat Assistant
                </Link>
                <Link to="/login" className="block text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Medical Disclaimer
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 LabSense. All rights reserved. This platform provides educational information and should not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
