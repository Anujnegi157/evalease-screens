import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PhoneCall, Check, Loader2, ListChecks, Plus, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PdfUploader from './PdfUploader';
import { 
  generateContentFromJobDescription, 
  addSkill, 
  removeSkill, 
  updateQuestionnaire,
  removeQuestion
} from '@/services/aiService';
import { Badge } from '@/components/ui/badge';

const CallForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState<'mandatory' | 'goodToHave'>('mandatory');
  const [newQuestion, setNewQuestion] = useState('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    candidateName: '',
    candidatePhone: '',
    jobDescription: '',
  });
  const [mandatorySkills, setMandatorySkills] = useState<string[]>([]);
  const [goodToHave, setGoodToHave] = useState<string[]>([]);
  const [questionnaire, setQuestionnaire] = useState<string[]>([]);
  const [firstMessage, setFirstMessage] = useState("Hi, this is Neha from the recruitment team. I'm calling regarding your job application. This is a brief screening call to understand your experience and skills. Is this a good time to talk?");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Define default questions that should always be present
  const defaultQuestions = [
    "Tell me about yourself and your professional background.",
    "What is your current notice period?"
  ];
  
  // Ensure default questions are added to any generated questionnaire
  const ensureDefaultQuestions = (questions: string[]) => {
    const result = [...questions];
    
    // Add default questions if they don't exist (or similar ones)
    defaultQuestions.forEach(defaultQ => {
      const lowerDefaultQ = defaultQ.toLowerCase();
      const exists = result.some(q => 
        q.toLowerCase().includes("tell me about yourself") || 
        q.toLowerCase().includes("notice period")
      );
      
      if (!exists) {
        result.push(defaultQ);
      }
    });
    
    return result;
  };

  const handlePdfContent = async (content: string) => {
    try {
      setFormData(prev => ({ ...prev, jobDescription: content }));
      
      // PDF uploader now just extracts content without calling AI
      // User will need to click "Generate with AI" button explicitly
      
    } catch (error) {
      console.error('Error processing PDF content:', error);
      toast.error('Failed to process PDF content');
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

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questionnaire];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setQuestionnaire(updatedQuestions);
      toast.success('Question updated successfully');
    } else {
      // Add new question
      setQuestionnaire(updateQuestionnaire(questionnaire, newQuestion));
      toast.success('Question added successfully');
    }
    
    setNewQuestion('');
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setNewQuestion(questionnaire[index]);
    setEditingQuestionIndex(index);
  };

  const handleRemoveQuestion = (question: string) => {
    setQuestionnaire(removeQuestion(questionnaire, question));
    toast.success('Question removed successfully');
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
      
      // Ensure default questions are included
      const enhancedQuestionnaire = ensureDefaultQuestions(generatedContent.questionnaire);
      setQuestionnaire(enhancedQuestionnaire);
      
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
    if (!formData.candidateName || !formData.candidatePhone || !formData.jobDescription || questionnaire.length === 0) {
      toast.error('Please fill in all fields and add at least one question');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format skills for the API
      const formattedMandatorySkills = mandatorySkills.join(", ");
      const formattedGoodToHave = goodToHave.join(", ");
      
      // Create the closing message
      const closingMessage = `Thank you, ${formData.candidateName}! We will review your responses and get back to you soon regarding next steps. Have a great day!`;
      
      // Make sure introduction and notice period questions are included
      const introQuestion = "Tell me about yourself and your professional background.";
      const noticePeriodQuestion = "What is your current notice period?";
      
      let finalQuestionnaire = [...questionnaire];
      
      // Ensure intro question exists
      if (!finalQuestionnaire.some(q => q.toLowerCase().includes("tell me about yourself"))) {
        finalQuestionnaire = [introQuestion, ...finalQuestionnaire];
      }
      
      // Ensure notice period question exists
      if (!finalQuestionnaire.some(q => q.toLowerCase().includes("notice period"))) {
        finalQuestionnaire.push(noticePeriodQuestion);
      }
      
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
            "voice": {
              "provider": "vapi",
              "voiceId": "Neha"
            },
            "firstMessage": firstMessage,
            "model": {
              "provider": "openai",
              "model": "chatgpt-4o-latest",
              "messages": [
                {
                  "role": "system",
                  "content": `You are Neha, an AI representative conducting initial screening calls for a job position. Use a clear, professional, and friendly tone.
                  
                  Job Description:
                  ${formData.jobDescription}
                  
                  Required Skills:
                  ${formattedMandatorySkills}
                  
                  Good to Have Skills:
                  ${formattedGoodToHave}
                  
                  Instructions:
                  - Keep your responses concise and conversational
                  - Ask follow-up questions when needed to get more specific information
                  - Don't use technical jargon unless relevant to the position
                  - Be polite and patient, allowing the candidate to fully explain their answers
                  - Make natural transitions between questions
                  - Conclude the call gracefully when all questions have been asked`
                },
                ...finalQuestionnaire.map(question => ({
                  "role": "assistant", 
                  "content": question
                })),
                {
                  "role": "assistant",
                  "content": closingMessage
                }
              ]
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
      });
      setMandatorySkills([]);
      setGoodToHave([]);
      setQuestionnaire([]);
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
            <label htmlFor="firstMessage" className="text-sm font-medium text-muted-foreground">
              Introduction Message
            </label>
          </div>
          <Textarea
            id="firstMessage"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            rows={2}
            placeholder="Enter the introduction message..."
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">This is the first message the AI will use to introduce itself to the candidate.</p>
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Interview Questions
            </h3>
            <div className="text-xs text-muted-foreground">
              {questionnaire.length} question{questionnaire.length !== 1 ? 's' : ''} added
            </div>
          </div>
          
          <div className="space-y-3">
            {questionnaire.map((question, index) => (
              <div key={index} className="flex items-start gap-2 bg-muted/20 p-3 rounded-md">
                <div className="flex-1">
                  <p className="text-sm">{question}</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7"
                    onClick={() => handleEditQuestion(index)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                    onClick={() => handleRemoveQuestion(question)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            
            {questionnaire.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No questions added yet</p>
            )}
            
            <div className="space-y-2 pt-2">
              <Textarea
                placeholder={editingQuestionIndex !== null ? "Edit question..." : "Add a new interview question..."}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="resize-none"
                rows={2}
              />
              <div className="flex justify-between">
                {editingQuestionIndex !== null && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setNewQuestion('');
                      setEditingQuestionIndex(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="button" 
                  onClick={handleAddQuestion} 
                  size="sm"
                  className="ml-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
                </Button>
              </div>
            </div>
          </div>
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
