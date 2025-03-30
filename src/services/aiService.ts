
// Service to generate content using Azure OpenAI
const AZURE_OPENAI_ENDPOINT = "https://personal-job-application.openai.azure.com/";
const AZURE_OPENAI_API_KEY = "6Y6gLak1ld4teJNNi7QhStZUI1HXrvKCnwGY9mSiH0T0jfHYNcIpJQQJ99BCACYeBjFXJ3w3AAABACOGUilw";
const AZURE_OPENAI_API_VERSION = "2025-01-01-preview"; // Updated API version

export const generateContentFromJobDescription = async (jobDescription: string): Promise<{
  mandatorySkills: string[];
  goodToHave: string[];
  questionnaire: string;
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
            content: "You are an HR assistant that analyzes job descriptions to extract key information."
          },
          {
            role: "user",
            content: `Please analyze this job description and provide the following: 
            1. A list of 5 mandatory skills required for this position
            2. A list of 3-4 good to have skills 
            3. A short questionnaire with 5 relevant questions to ask candidates
            
            Format your response as JSON with the following structure:
            {
              "mandatorySkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
              "goodToHave": ["skill1", "skill2", "skill3", "skill4"],
              "questionnaire": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
            }
            
            Job Description:
            ${jobDescription}`
          }
        ],
        // temperature: 0.7,
        max_completion_tokens: 800  // Changed from max_tokens to max_completion_tokens
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
        questionnaire: jsonData.questionnaire || ""
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

export const updateQuestionnaire = (currentQuestionnaire: string, newQuestionnaire: string): string => {
  return newQuestionnaire.trim();
};
