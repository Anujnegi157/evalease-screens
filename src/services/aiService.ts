
// Simple service to generate content using AI
export const generateContentFromJobDescription = async (jobDescription: string): Promise<{
  mandatorySkills: string[];
  goodToHave: string[];
  questionnaire: string;
}> => {
  try {
    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll use a simple simulation
    console.log("Generating content from job description:", jobDescription);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract skills and generate questionnaire based on the job description
    const mandatorySkills = extractMandatorySkills(jobDescription);
    const goodToHave = extractGoodToHaveSkills(jobDescription);
    const questionnaire = generateQuestionnaire(jobDescription);
    
    return {
      mandatorySkills,
      goodToHave,
      questionnaire
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content from job description");
  }
};

// Helper functions to simulate AI extraction
function extractMandatorySkills(text: string): string[] {
  const skills = [];
  
  // Simple keyword extraction for demonstration
  if (text.toLowerCase().includes("react")) skills.push("React.js experience");
  if (text.toLowerCase().includes("typescript") || text.toLowerCase().includes("ts")) skills.push("TypeScript proficiency");
  if (text.toLowerCase().includes("api")) skills.push("API integration experience");
  if (text.toLowerCase().includes("test")) skills.push("Testing methodologies");
  
  // Add some generic skills if we don't have enough
  if (skills.length < 3) {
    const genericSkills = [
      "JavaScript proficiency",
      "Problem-solving abilities",
      "Team collaboration",
      "Communication skills"
    ];
    
    for (const skill of genericSkills) {
      if (skills.length < 4) skills.push(skill);
      else break;
    }
  }
  
  return skills;
}

function extractGoodToHaveSkills(text: string): string[] {
  const skills = [];
  
  // Simple keyword extraction for demonstration
  if (text.toLowerCase().includes("graphql")) skills.push("GraphQL experience");
  if (text.toLowerCase().includes("aws") || text.toLowerCase().includes("cloud")) skills.push("AWS or cloud services");
  if (text.toLowerCase().includes("ci/cd") || text.toLowerCase().includes("pipeline")) skills.push("CI/CD experience");
  
  // Add some generic "good to have" skills
  const genericSkills = [
    "Open-source contributions",
    "Mobile development experience",
    "UX/UI design knowledge",
    "Project management experience"
  ];
  
  for (const skill of genericSkills) {
    if (skills.length < 3) skills.push(skill);
    else break;
  }
  
  return skills;
}

function generateQuestionnaire(text: string): string {
  // Generate a questionnaire based on the job description
  return `
1. Can you describe your experience with modern web development frameworks?
2. How do you approach learning new technologies? Please provide an example.
3. Describe a challenging project you worked on and how you solved the problems you encountered.
4. How do you ensure code quality in your projects?
5. What's your experience with collaborative development and version control?
`.trim();
}
