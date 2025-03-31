
import React from 'react';
import CallForm from '@/components/CallForm';
import Card from '@/components/Card';
import { User, Phone, MessageCircle } from 'lucide-react';

const MakeCall = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Make a Call</h1>
        <p className="text-muted-foreground">
          Schedule an AI screening call with a candidate using our AI agent Neha
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Available Agent</p>
            <p className="font-medium">Neha</p>
          </div>
        </Card>
        
        <Card className="p-4 md:col-span-2 flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <MessageCircle size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Call flow</p>
            <p className="font-medium">Introduction → Skills & Experience → Notice Period → Wrap-up</p>
          </div>
        </Card>
      </div>
      
      <Card className="p-6 md:p-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Call Details</h2>
        <CallForm />
      </Card>
    </div>
  );
};

export default MakeCall;
