
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { PhoneCall, CheckCircle, Sparkles, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/30 -z-10"></div>
        
        {/* Background Circles */}
        <div className="absolute top-24 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-in">
            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 text-sm font-medium animate-fade-in">
              Revolutionizing Recruitment Screening
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              AI Screening Calls for
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"> Effortless Recruitment</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl animate-fade-in">
              ScreenSage helps you streamline your hiring process with intelligent AI-powered screening calls, delivering comprehensive candidate evaluations without the manual effort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link
                to="/dashboard"
                className="bg-primary text-white hover:bg-primary/90 hover:shadow-lg transition-all px-6 py-3 rounded-lg font-medium"
              >
                Go to Dashboard
              </Link>
              
              <Link
                to="/dashboard/call-logs"
                className="bg-white border border-input hover:bg-gray-50 transition-all px-6 py-3 rounded-lg font-medium"
              >
                View Call Logs
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ScreenSage Enhances Your Hiring</h2>
            <p className="text-muted-foreground max-w-2xl">Our AI assistant Neha conducts professional screening calls based on your criteria, saving you time while ensuring quality candidates move forward.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 border transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <PhoneCall className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Screening</h3>
              <p className="text-muted-foreground">Schedule AI-powered calls with candidates that adapt in real-time based on their responses.</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Insights</h3>
              <p className="text-muted-foreground">Receive comprehensive evaluations with strengths, weaknesses, and fit scores for each candidate.</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Efficiency</h3>
              <p className="text-muted-foreground">Save hours of screening time while maintaining a consistent and unbiased evaluation process.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 -z-10"></div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Recruitment Process?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join forward-thinking companies that are saving time and improving their hiring decisions with ScreenSage.
            </p>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-primary text-white hover:bg-primary/90 transition-all px-8 py-4 rounded-lg font-medium text-lg"
            >
              <CheckCircle className="mr-2" size={20} />
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <PhoneCall className="text-primary mr-2" size={20} />
                <span className="font-semibold text-lg">ScreenSage</span>
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ScreenSage. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
