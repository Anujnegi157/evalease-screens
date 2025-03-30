
import React from 'react';
import { Call } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import Card from './Card';

interface CallDetailsProps {
  call: Call;
  onClose: () => void;
}

const CallDetails: React.FC<CallDetailsProps> = ({ call, onClose }) => {
  const statusIcons = {
    completed: <CheckCircle size={18} className="text-green-500" />,
    scheduled: <Clock size={18} className="text-amber-500" />,
    missed: <XCircle size={18} className="text-red-500" />
  };

  const statusText = {
    completed: "Completed",
    scheduled: "Scheduled",
    missed: "Missed"
  };

  // Format date
  let formattedDate = '';
  try {
    formattedDate = format(new Date(call.dateTime), 'MMMM dd, yyyy');
  } catch (e) {
    formattedDate = call.dateTime || 'N/A';
  }
  
  // Format time
  let formattedTime = '';
  try {
    formattedTime = format(new Date(call.dateTime), 'h:mm a');
  } catch (e) {
    formattedTime = '';
  }
  console.log(call.toString())
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto animate-scale-in">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-full",
              call.status === 'completed' ? "bg-green-100" :
              call.status === 'scheduled' ? "bg-amber-100" :
              "bg-red-100"
            )}>
              {statusIcons[call.status]}
            </div>
            <div>
              <h2 className="text-lg font-medium">{call.candidateName}</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                {statusText[call.status]} call
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Call Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 md:col-span-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Call Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Candidate</p>
                  <p className="font-medium">{call.candidateName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{call.candidatePhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">{formattedTime}</p>
                </div>
                {call.duration && (
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{call.duration} minutes</p>
                  </div>
                )}
                {call.transcript && (
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{call.transcript} minutes</p>
                  </div>
                )}
              </div>
            </Card>
            
            {call.status === 'completed' && call.evaluation && (
              <Card className="p-4 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Evaluation Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Overall Fit</p>
                      <div className={cn(
                        "text-xs px-2 py-1 rounded-full inline-flex items-center",
                        call.evaluation.fit === 'high' ? "bg-green-100 text-green-800" :
                        call.evaluation.fit === 'medium' ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {call.evaluation.fit === 'high' ? <ThumbsUp size={12} className="mr-1" /> :
                         call.evaluation.fit === 'medium' ? <ThumbsUp size={12} className="mr-1" /> :
                         <ThumbsDown size={12} className="mr-1" />}
                        {call.evaluation.fit.charAt(0).toUpperCase() + call.evaluation.fit.slice(1)} Fit
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-primary/10 px-3 py-2 rounded-lg flex items-center">
                        <Star size={16} className="text-primary mr-1" />
                        <span className="font-medium text-sm">{call.evaluation.score}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <ThumbsUp size={14} className="text-green-500 mr-1" />
                        Strengths
                      </p>
                      <ul className="space-y-1">
                        {call.evaluation.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <ThumbsDown size={14} className="text-amber-500 mr-1" />
                        Areas for Improvement
                      </p>
                      <ul className="space-y-1">
                        {call.evaluation.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-amber-500 mr-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Recommendation</p>
                    <p className="text-sm">{call.evaluation.recommendation}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Transcript */}
          {call.status === 'completed' && call.transcript && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <MessageSquare size={16} className="mr-1" />
                Call Transcript
              </h3>
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Neha (AI Interviewer)</p>
                      <p className="text-sm">Hello, this is Neha calling from ScreenSage. Am I speaking with {call.candidateName}?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{call.candidateName}</p>
                      <p className="text-sm">Yes, this is {call.candidateName}.</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="text-primary text-sm hover:underline">View Full Transcript</button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
