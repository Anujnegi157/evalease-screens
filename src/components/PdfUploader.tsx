
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PdfUploaderProps {
  onPdfContent: (content: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onPdfContent, 
  isProcessing,
  setIsProcessing 
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    
    setFileName(file.name);
    
    try {
      // In a real implementation, we would use a PDF parsing library
      // For now, we'll simulate extracting text from a PDF
      
      // Simulate processing time for PDF parsing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock text content from the PDF file name
      const mockPdfContent = `
        Job Position: ${file.name.replace('.pdf', '')}
        
        We are looking for an experienced web developer with strong skills in React, TypeScript, and modern web development practices.
        
        The candidate should be familiar with API integration, state management, and component-based architecture.
        Testing experience is a plus.
        
        Responsibilities:
        - Develop and maintain web applications using React
        - Write clean, maintainable code
        - Collaborate with the team on architecture decisions
        - Implement responsive designs
        
        Requirements:
        - 2+ years of experience with React
        - Strong TypeScript skills
        - Experience with RESTful APIs
        - Knowledge of testing frameworks
        
        Nice to have:
        - GraphQL experience
        - AWS or cloud services knowledge
        - CI/CD pipeline experience
      `.trim();
      
      // Pass the "extracted" content to parent component
      onPdfContent(mockPdfContent);
      
      // Note: We don't call the AI service directly from here anymore
      // The user will need to click the "Generate with AI" button
      
      toast.success('PDF content extracted successfully');
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process PDF file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('pdfUpload')?.click()}
          disabled={isProcessing}
          className="relative"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload JD PDF
            </>
          )}
        </Button>
        <input
          id="pdfUpload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        {fileName && (
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 h-4 w-4" />
            {fileName}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
