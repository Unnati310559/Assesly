
import { GoogleGenAI, Type } from "@google/genai";

export interface AlignmentAnalysis {
  strengths: string[];
  gaps: string[];
}

export interface GenerationResult {
  tailoredResume: string;
  coverLetter: string;
  keywordAnalysis: string[];
  alignmentAnalysis: AlignmentAnalysis;
}

const promptTemplate = `
You are an expert career assistant and professional resume writer. Your task is to help a user tailor their resume, write a cover letter, and analyze their fit for a specific job application.

Analyze the provided resume/profile and the target job description. Based on your analysis, generate a JSON object with four parts: a tailored resume, a personalized cover letter, a keyword analysis, and an alignment analysis.

**USER's RESUME/PROFILE:**
---
{resume}
---

**TARGET JOB DESCRIPTION:**
---
{jobDescription}
---

**TONE & STYLE PREFERENCES:**
- Cover Letter Tone: {tone}
- Target Role Level: {roleLevel}

**ADDITIONAL CUSTOMIZATION INSTRUCTIONS FROM USER:**
---
{customInstructions}
---

**RULES:**
0.  **PRIORITY:** Strictly follow all instructions provided in the "ADDITIONAL CUSTOMIZATION INSTRUCTIONS FROM USER" section when generating the resume and cover letter.
1.  **TAILORED RESUME:**
    *   Extract the most relevant skills, experiences, and achievements from the original resume that align with the job description.
    *   Rewrite bullet points to use action verbs and quantify achievements where possible, reflecting the language and priorities of the job description.
    *   Incorporate keywords from the job description naturally.
    *   Maintain the user's authentic experience; do not invent skills or experiences.
    *   Structure the output clearly, using standard resume sections (e.g., Summary, Experience, Skills, Education).
    *   The output must be a single block of text, formatted with markdown for readability.

2.  **PERSONALIZED COVER LETTER:**
    *   Create a professional and compelling cover letter, adhering to the specified **Tone** and **Role Level**.
    *   Start with a strong opening that grabs the reader's attention.
    *   Highlight 2-3 key strengths that directly address the core requirements of the job.
    *   Express genuine enthusiasm for the role and the company.
    *   End with a professional closing and a clear call to action.
    *   The output must be a single block of text.

3.  **KEYWORD ANALYSIS:**
    *   Identify and list the most important keywords and skills from the job description (e.g., "Project Management", "React", "Data Analysis", "SaaS").
    *   Return this as an array of strings.

4.  **ALIGNMENT ANALYSIS:**
    *   Briefly analyze the user's resume against the job description.
    *   Identify key **strengths** (areas of strong alignment).
    *   Identify potential **gaps** (areas where experience may be lacking or not explicitly mentioned).
    *   Return this as an object with two arrays of strings: 'strengths' and 'gaps'.

Generate the response in the specified JSON format.
`;

export const generateContent = async (
  resume: string,
  jobDescription: string,
  tone: string,
  roleLevel: string,
  customInstructions: string
): Promise<GenerationResult> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY environment variable not set");
    throw new Error("API_KEY environment variable not set. Please configure it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = promptTemplate
    .replace('{resume}', resume)
    .replace('{jobDescription}', jobDescription)
    .replace('{tone}', tone === 'Default' ? 'professional' : tone)
    .replace('{roleLevel}', roleLevel === 'Default' ? 'unspecified' : roleLevel)
    .replace('{customInstructions}', customInstructions.trim() ? customInstructions : 'None provided.');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tailoredResume: {
              type: Type.STRING,
              description: "The full text of the tailored resume, formatted with markdown.",
            },
            coverLetter: {
              type: Type.STRING,
              description: "The full text of the personalized cover letter.",
            },
            keywordAnalysis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of important keywords from the job description.",
            },
            alignmentAnalysis: {
              type: Type.OBJECT,
              properties: {
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Areas of strong alignment between the resume and job description.",
                },
                gaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Potential gaps or areas to emphasize.",
                },
              },
              required: ["strengths", "gaps"],
            },
          },
          required: ["tailoredResume", "coverLetter", "keywordAnalysis", "alignmentAnalysis"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (
      typeof result.tailoredResume === 'string' &&
      typeof result.coverLetter === 'string' &&
      Array.isArray(result.keywordAnalysis) &&
      typeof result.alignmentAnalysis === 'object' &&
      Array.isArray(result.alignmentAnalysis.strengths) &&
      Array.isArray(result.alignmentAnalysis.gaps)
    ) {
        return result as GenerationResult;
    } else {
        throw new Error("Invalid response format from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content. Please check your inputs or API key.");
  }
};