
// Service to generate content using Azure OpenAI
const AZURE_OPENAI_ENDPOINT = "https://personal-job-application.openai.azure.com/";
const AZURE_OPENAI_API_KEY = "6Y6gLak1ld4teJNNi7QhStZUI1HXrvKCnwGY9mSiH0T0jfHYNcIpJQQJ99BCACYeBjFXJ3w3AAABACOGUilw";
const AZURE_OPENAI_API_VERSION = "2025-01-01-preview"; // Updated API version

export const generateContentFromJobDescription = async (jobDescription: string): Promise<{
  mandatorySkills: string[];
  goodToHave: string[];
  questionnaire: string[];
}> => {
  try {
    console.log("Generating content from job description using Azure OpenAI:", jobDescription);
    
    // Call Azure OpenAI API with the updated deployment name and API version
    const response = await fetch(`${AZURE_OPENAI_ENDPOINT}openai/deployments/o3-mini/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_API_KEY
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an HR assistant that analyzes job descriptions to extract key information and create relevant interview questions regardless of industry or position type."
          },
          {
            role: "user",
            content: `Please analyze this job description and provide the following: 
            1. A list of 5-6 mandatory skills required for this position
            2. A list of 3-4 good to have skills 
            3. A custom questionnaire with 7-8 tailored questions specific to this role (not just generic software development questions)
            
            Format your response as JSON with the following structure:
            {
              "mandatorySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
              "goodToHave": ["skill1", "skill2", "skill3", "skill4"],
              "questionnaire": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?", "Question 6?", "Question 7?", "Question 8?"]
            }
            
            Job Description:
            ${jobDescription}`
          }
        ],
        temperature: 0.7,
        max_completion_tokens: 1000
      })
    });
    
    if (!response.ok) {
      console.error("Azure OpenAI API Error:", await response.text());
      throw new Error("Failed to generate content from job description");
    }
    
    const data = await response.json();
    console.log("Azure OpenAI API Response:", data);
    
    try {
      // Try to parse the response from the completion
      const content = data.choices[0].message.content;
      console.log("Raw content:", content);
      
      // Extract the JSON part from the content if needed
      let jsonData;
      try {
        jsonData = JSON.parse(content);
      } catch (jsonError) {
        // If parsing fails, try to extract JSON from the text using regex
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse JSON from response");
        }
      }
      
      return {
        mandatorySkills: jsonData.mandatorySkills || [],
        goodToHave: jsonData.goodToHave || [],
        questionnaire: jsonData.questionnaire || []
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Fallback to the old extraction method if parsing fails
      return {
        mandatorySkills: extractMandatorySkills(jobDescription),
        goodToHave: extractGoodToHaveSkills(jobDescription),
        questionnaire: generateQuestionnaire(jobDescription)
      };
    }
  } catch (error) {
    console.error("Error generating content:", error);
    // Fallback to the old extraction method
    return {
      mandatorySkills: extractMandatorySkills(jobDescription),
      goodToHave: extractGoodToHaveSkills(jobDescription),
      questionnaire: generateQuestionnaire(jobDescription)
    };
  }
};

// Keep the helper functions as fallback
function extractMandatorySkills(text: string): string[] {
  const skills = [];
  
  // Simple keyword extraction for demonstration
  if (text.toLowerCase().includes("react")) skills.push("React.js experience");
  if (text.toLowerCase().includes("typescript") || text.toLowerCase().includes("ts")) skills.push("TypeScript proficiency");
  if (text.toLowerCase().includes("api")) skills.push("API integration experience");
  if (text.toLowerCase().includes("test")) skills.push("Testing methodologies");
  
  // Add industry-agnostic skills
  if (text.toLowerCase().includes("manage")) skills.push("Management experience");
  if (text.toLowerCase().includes("customer") || text.toLowerCase().includes("client")) skills.push("Customer service skills");
  if (text.toLowerCase().includes("market")) skills.push("Marketing knowledge");
  if (text.toLowerCase().includes("sales")) skills.push("Sales experience");
  if (text.toLowerCase().includes("data")) skills.push("Data analysis");
  
  // Add some generic skills if we don't have enough
  if (skills.length < 3) {
    const genericSkills = [
      "Communication skills",
      "Problem-solving abilities",
      "Team collaboration",
      "Time management"
    ];
    
    for (const skill of genericSkills) {
      if (skills.length < 5) skills.push(skill);
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
  
  // Add industry-agnostic skills
  if (text.toLowerCase().includes("present")) skills.push("Presentation skills");
  if (text.toLowerCase().includes("lead")) skills.push("Leadership experience");
  if (text.toLowerCase().includes("analytic")) skills.push("Analytical thinking");
  if (text.toLowerCase().includes("research")) skills.push("Research capabilities");
  
  // Add some generic "good to have" skills
  const genericSkills = [
    "Project management experience",
    "Public speaking abilities",
    "Second language proficiency",
    "Industry certifications"
  ];
  
  for (const skill of genericSkills) {
    if (skills.length < 3) skills.push(skill);
    else break;
  }
  
  return skills;
}

function generateQuestionnaire(text: string): string[] {
  // Generate a questionnaire based on the job description
  const questions = [];
  
  // Add some role-specific questions based on keywords
  if (text.toLowerCase().includes("software") || text.toLowerCase().includes("develop")) {
    questions.push("Can you describe your experience with modern development frameworks?");
    questions.push("How do you approach debugging complex issues?");
  }
  
  if (text.toLowerCase().includes("sales") || text.toLowerCase().includes("account")) {
    questions.push("Describe your approach to building client relationships.");
    questions.push("How do you handle objections in the sales process?");
  }
  
  if (text.toLowerCase().includes("market") || text.toLowerCase().includes("brand")) {
    questions.push("What strategies have you used to increase brand awareness?");
    questions.push("How do you measure the success of a marketing campaign?");
  }
  
  if (text.toLowerCase().includes("manage") || text.toLowerCase().includes("lead")) {
    questions.push("How do you motivate team members during challenging projects?");
    questions.push("Describe your approach to performance management.");
  }
  
  if (text.toLowerCase().includes("customer") || text.toLowerCase().includes("support")) {
    questions.push("How do you handle difficult customer interactions?");
    questions.push("What's your approach to ensuring customer satisfaction?");
  }
  
  // Add generic questions if we don't have enough
  const genericQuestions = [
    "How do you approach learning new skills? Please provide an example.",
    "Describe a challenging project you worked on and how you solved the problems you encountered.",
    "How do you prioritize tasks when working on multiple projects?",
    "Tell me about a time when you had to adapt to a significant change at work.",
    "What's your experience with collaborative work and cross-functional teams?",
    "How do you handle constructive criticism?",
    "Where do you see yourself professionally in the next 3-5 years?"
  ];
  
  for (const question of genericQuestions) {
    if (questions.length < 7) questions.push(question);
    else break;
  }
  
  return questions;
}

// Add new functions to allow manual management of skills
export const addSkill = (skillsList: string[], newSkill: string): string[] => {
  if (!newSkill.trim() || skillsList.includes(newSkill.trim())) {
    return skillsList;
  }
  return [...skillsList, newSkill.trim()];
};

export const removeSkill = (skillsList: string[], skillToRemove: string): string[] => {
  return skillsList.filter(skill => skill !== skillToRemove);
};

export const updateQuestionnaire = (currentQuestionnaire: string[], newQuestion: string): string[] => {
  if (!newQuestion.trim()) {
    return currentQuestionnaire;
  }
  return [...currentQuestionnaire, newQuestion.trim()];
};

export const removeQuestion = (questionnaire: string[], questionToRemove: string): string[] => {
  return questionnaire.filter(question => question !== questionToRemove);
};
