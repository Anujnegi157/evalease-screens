
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PhoneCall, Check, Loader2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PdfUploader from './PdfUploader';
import { generateContentFromJobDescription } from '@/services/aiService';
import { Badge } from '@/components/ui/badge';

const CallForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    jobDescription: '',
    questionnaire: ''
  });
  const [mandatorySkills, setMandatorySkills] = useState<string[]>([]);
  const [goodToHave, setGoodToHave] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePdfContent = async (content: string) => {
    try {
      setFormData(prev => ({ ...prev, jobDescription: content }));
      
      // Generate skills and questionnaire from the content
      const generatedContent = await generateContentFromJobDescription(content);
      
      setMandatorySkills(generatedContent.mandatorySkills);
      setGoodToHave(generatedContent.goodToHave);
      setFormData(prev => ({ ...prev, questionnaire: generatedContent.questionnaire }));
      
      toast.success('Job requirements and questionnaire generated');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate job requirements and questionnaire');
    }
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
      // Integrate with Vapi API
      const response = await fetch("https://api.vapi.ai/call", {
        method: 'POST',
        headers: {
          "Authorization": "Bearer 335f14fd-894a-44da-b89b-0c425f9dcc78",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "phoneNumberId": "0b3b9e40-1cfe-4eea-be52-a3bd0df178b8",
          "assistantId": "b52a4a9a-a695-4f5a-a5a2-6f5aab253854",
          "customer": {
            "name": formData.candidateName,
            "number": formData.candidatePhone
          }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to schedule call');
      }
      
      console.log('API Response:', result);
      toast.success('AI call successfully scheduled!');
      
      // Reset form
      setFormData({
        candidateName: '',
        candidatePhone: '',
        jobDescription: '',
        questionnaire: ''
      });
      setMandatorySkills([]);
      setGoodToHave([]);
    } catch (error) {
      console.error('API Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to schedule call. Please try again.');
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
            <Input
              id="candidateName"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="candidatePhone" className="text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <Input
              id="candidatePhone"
              name="candidatePhone"
              type="tel"
              value={formData.candidatePhone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="jobDescription" className="text-sm font-medium text-muted-foreground">
              Job Description
            </label>
            <PdfUploader 
              onPdfContent={handlePdfContent} 
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </div>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows={4}
            placeholder="Enter the job description here or upload a PDF..."
            className="resize-none"
          />
        </div>
        
        {mandatorySkills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Mandatory Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {mandatorySkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {goodToHave.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Good to Have
            </h3>
            <div className="flex flex-wrap gap-2">
              {goodToHave.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/10">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="questionnaire" className="text-sm font-medium text-muted-foreground">
            Questionnaire
          </label>
          <Textarea
            id="questionnaire"
            name="questionnaire"
            value={formData.questionnaire}
            onChange={handleChange}
            rows={6}
            placeholder="Enter questions for the AI to ask the candidate..."
            className="resize-none"
          />
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting || isProcessing}
        className="w-full md:w-auto"
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
      </Button>
      
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
