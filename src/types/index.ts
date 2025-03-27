
export interface Candidate {
  id: string;
  name: string;
  phone: string;
  dateTime: string;
  status: 'completed' | 'scheduled' | 'missed';
  score?: number;
}

export interface Call {
  id: string;
  candidateName: string;
  candidatePhone: string;
  jobDescription: string;
  questionnaire: string;
  dateTime: string;
  status: 'completed' | 'scheduled' | 'missed';
  duration?: number;
  transcript?: string;
  evaluation?: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    fit: 'high' | 'medium' | 'low';
  };
}
