
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PhoneCall, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CallForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    jobDescription: '',
    questionnaire: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.candidateName || !formData.candidatePhone || !formData.jobDescription || !formData.questionnaire) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('AI call successfully scheduled!');
      
      // Reset form
      setFormData({
        candidateName: '',
        candidatePhone: '',
        jobDescription: '',
        questionnaire: ''
      });
    } catch (error) {
      toast.error('Failed to schedule call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="candidateName" className="text-sm font-medium text-muted-foreground">
              Candidate Name
            </label>
            <input
              id="candidateName"
              name="candidateName"
              type="text"
              value={formData.candidateName}
              onChange={handleChange}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                "text-sm ring-offset-background focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "transition-colors duration-200"
              )}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="candidatePhone" className="text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <input
              id="candidatePhone"
              name="candidatePhone"
              type="tel"
              value={formData.candidatePhone}
              onChange={handleChange}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
                "text-sm ring-offset-background focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "transition-colors duration-200"
              )}
              placeholder="+1 (123) 456-7890"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="jobDescription" className="text-sm font-medium text-muted-foreground">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2",
              "text-sm ring-offset-background focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors duration-200 resize-none"
            )}
            placeholder="Enter the job description here..."
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="questionnaire" className="text-sm font-medium text-muted-foreground">
            Questionnaire
          </label>
          <textarea
            id="questionnaire"
            name="questionnaire"
            value={formData.questionnaire}
            onChange={handleChange}
            rows={6}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2",
              "text-sm ring-offset-background focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "transition-colors duration-200 resize-none"
            )}
            placeholder="Enter questions for the AI to ask the candidate..."
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md",
          "bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
          "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
          "disabled:opacity-50 transition-all duration-200 w-full md:w-auto",
          isSubmitting ? "bg-primary/80" : ""
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scheduling Call...
          </>
        ) : (
          <>
            <PhoneCall className="mr-2 h-4 w-4" />
            Schedule AI Call
          </>
        )}
      </button>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <Check size={12} className="mr-1 text-green-500" />
          AI agent Neha will conduct the interview based on your requirements
        </p>
        <p className="flex items-center">
          <Check size={12} className="mr-1 text-green-500" />
          Call recording and evaluation will be available after completion
        </p>
      </div>
    </form>
  );
};

export default CallForm;
