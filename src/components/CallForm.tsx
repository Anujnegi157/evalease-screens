
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PhoneCall, Check, Loader2, ListChecks, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PdfUploader from './PdfUploader';
import { 
  generateContentFromJobDescription, 
  addSkill, 
  removeSkill, 
  updateQuestionnaire 
} from '@/services/aiService';
import { Badge } from '@/components/ui/badge';

const CallForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState<'mandatory' | 'goodToHave'>('mandatory');
  
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
      setIsProcessing(true);
      const generatedContent = await generateContentFromJobDescription(content);
      
      setMandatorySkills(generatedContent.mandatorySkills);
      setGoodToHave(generatedContent.goodToHave);
      setFormData(prev => ({ ...prev, questionnaire: generatedContent.questionnaire }));
      
      toast.success('Job requirements and questionnaire generated');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate job requirements and questionnaire');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      toast.error('Please enter a skill');
      return;
    }
    
    if (skillType === 'mandatory') {
      setMandatorySkills(addSkill(mandatorySkills, newSkill));
    } else {
      setGoodToHave(addSkill(goodToHave, newSkill));
    }
    
    setNewSkill('');
    toast.success(`Added ${newSkill} to ${skillType === 'mandatory' ? 'mandatory skills' : 'good to have skills'}`);
  };

  const handleRemoveSkill = (skill: string, type: 'mandatory' | 'goodToHave') => {
    if (type === 'mandatory') {
      setMandatorySkills(removeSkill(mandatorySkills, skill));
    } else {
      setGoodToHave(removeSkill(goodToHave, skill));
    }
    
    toast.success(`Removed ${skill}`);
  };

  const handleGenerateFromDescription = async () => {
    if (!formData.jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    
    try {
      setIsProcessing(true);
      const generatedContent = await generateContentFromJobDescription(formData.jobDescription);
      
      setMandatorySkills(generatedContent.mandatorySkills);
      setGoodToHave(generatedContent.goodToHave);
      setFormData(prev => ({ ...prev, questionnaire: generatedContent.questionnaire }));
      
      toast.success('Job requirements and questionnaire generated');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate job requirements and questionnaire');
    } finally {
      setIsProcessing(false);
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
          "assistant": {
            "model": {
              "provider": "openai",
              "model": "chatgpt-4o-latest",
            
            }
          },
        "customer": {
                "name": formData.candidateName,
                "number": formData.candidatePhone
              }
      }),
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
            <div className="flex gap-2">
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={handleGenerateFromDescription}
                disabled={isProcessing || !formData.jobDescription.trim()}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Generate with AI</>
                )}
              </Button>
              <PdfUploader 
                onPdfContent={handlePdfContent} 
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Mandatory Skills
              </h3>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={() => setSkillType('mandatory')}
                className={skillType === 'mandatory' ? 'bg-primary text-primary-foreground' : ''}
              >
                Add to mandatory
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mandatorySkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 flex items-center gap-1">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill, 'mandatory')}
                    className="hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {mandatorySkills.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No mandatory skills added yet</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Good to Have
              </h3>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={() => setSkillType('goodToHave')}
                className={skillType === 'goodToHave' ? 'bg-primary text-primary-foreground' : ''}
              >
                Add to good-to-have
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {goodToHave.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-secondary/10 flex items-center gap-1">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill, 'goodToHave')}
                    className="hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {goodToHave.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No good-to-have skills added yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <Button type="button" onClick={handleAddSkill} size="sm">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
        
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
