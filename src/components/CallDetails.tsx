
import React, { useState } from 'react';
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
import { getScoreFromTranscript } from '@/services/aiService';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);


  const getScore = async () => {
    setLoading(true);
    try {
      const data = await getScoreFromTranscript(call.transcript);
      setScores(data); // Expected format: { communication: 85, technical: 90, other: 80 }
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

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

              </div>
            </Card>
            
            {call.status === 'completed' && call.evaluation && (
              <Card className="p-4 md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Evaluation Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Overall Fit</p>
                      {scores && scores.overAllFit && <div className={cn(
                        "text-xs px-2 py-1 rounded-full inline-flex items-center",
                        scores.overAllFit === 'high' ? "bg-green-100 text-green-800" :
                        scores.overAllFit === 'medium' ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {scores.overAllFit === 'high' ? <ThumbsUp size={12} className="mr-1" /> :
                         scores.overAllFit === 'medium' ? <ThumbsUp size={12} className="mr-1" /> :
                         <ThumbsDown size={12} className="mr-1" />}
                        {call.evaluation.fit.charAt(0).toUpperCase() + call.evaluation.fit.slice(1)} Fit
                      </div>}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-primary/10 px-3 py-2 rounded-lg flex items-center">
                        <Star size={16} className="text-primary mr-1" />
                        {scores && scores.totalScore && 
                          <span className="font-medium text-sm">{scores.totalScore}/10</span>
                        }
                      </div>
                    </div> 
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <ThumbsUp size={14} className="text-green-500 mr-1" />
                        Strengths
                      </p>
                      {scores && scores.strengths && <ul className="space-y-1">
                        {scores.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <ThumbsDown size={14} className="text-amber-500 mr-1" />
                        Areas for Improvement
                      </p>
                      {scores && scores.weaknesses && <ul className="space-y-1">
                        {scores.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-green-500 mr-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>}
                    </div>
                  </div>
                  
                  <div>
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <div>
                      <p className="text-sm font-medium mb-2">Recommendation</p>
                            {/* Button to trigger evaluation */}
      <button
        onClick={getScore}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Get Score"}
      </button>

      {/* Display scores in a table if available */}
      {scores && (
        <table className="mt-4 w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Skill</th>
              <th className="border p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Communication</td>
              <td className="border p-2">{scores.communicationSkill}</td>
            </tr>
            <tr>
              <td className="border p-2">Technical</td>
              <td className="border p-2">{scores.technicalSkill}</td>
            </tr>
            <tr>
              <td className="border p-2">leadership Skills</td>
              <td className="border p-2">{scores.leadershipSkill}</td>
            </tr>
          </tbody>
        </table>
      )}
                    </div>
                  </div>
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
                {call.transcript && (
                  <div>
                    <div>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium mb-2 text-blue-500 hover:underline"
                      >
                        {isExpanded ? "Hide Transcript" : "Show Transcript"}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-2">
                          <p className="font-medium">{call.transcript} minutes</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </h3>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallDetails;
