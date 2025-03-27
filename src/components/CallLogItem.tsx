
import React from 'react';
import { Call } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface CallLogItemProps {
  call: Call;
  onClick: (call: Call) => void;
}

const CallLogItem: React.FC<CallLogItemProps> = ({ call, onClick }) => {
  const statusIcons = {
    completed: <CheckCircle size={16} className="text-green-500" />,
    scheduled: <Clock size={16} className="text-amber-500" />,
    missed: <XCircle size={16} className="text-red-500" />
  };

  const statusText = {
    completed: "Completed",
    scheduled: "Scheduled",
    missed: "Missed"
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    scheduled: "bg-amber-100 text-amber-800",
    missed: "bg-red-100 text-red-800"
  };

  // Format date and time
  let formattedDate = '';
  try {
    formattedDate = format(new Date(call.dateTime), 'MMM dd, yyyy • h:mm a');
  } catch (e) {
    formattedDate = call.dateTime || 'N/A';
  }

  return (
    <div 
      className="bg-white rounded-lg border p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
      onClick={() => onClick(call)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{call.candidateName}</h3>
          <p className="text-sm text-muted-foreground">{call.candidatePhone}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>

        <div className="flex flex-col items-end">
          <div className={cn(
            "text-xs px-2 py-1 rounded-full flex items-center gap-1",
            statusColors[call.status]
          )}>
            {statusIcons[call.status]}
            <span>{statusText[call.status]}</span>
          </div>
          
          {call.status === 'completed' && call.evaluation && (
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium mr-1">Fit:</span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                call.evaluation.fit === 'high' ? "bg-green-100 text-green-800" :
                call.evaluation.fit === 'medium' ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {call.evaluation.fit.charAt(0).toUpperCase() + call.evaluation.fit.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {call.status === 'completed' && (
            <>{call.duration ? `${call.duration} min call` : ''}</>
          )}
        </div>
        
        <button className="text-primary hover:text-primary/80 flex items-center text-sm">
          Details
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CallLogItem;
