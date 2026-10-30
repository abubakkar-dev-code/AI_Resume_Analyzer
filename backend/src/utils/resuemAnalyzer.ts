import ollama from "../config/ollama.js";

interface ResumeAnalysisInput {
  resumeText: string;
  targetRole: string;
}

export const analyzeResumeWithAI = async ({
  resumeText,
  targetRole,
}: ResumeAnalysisInput) => {
  const response = await ollama.post("/chat", {
    model: "qwen2.5:3b",
    stream: false,
    format: "json",
    messages: [
      {
        role: "system",
        content: `
You are an expert technical recruiter and resume analyst.

Analyze resumes carefully and provide evidence-based feedback.

Rules:
- Use only information explicitly present in the resume.
- Never invent skills, experience, qualifications, or achievements.
- If information is missing, mention that it is not specified.
- Evaluate the resume against the target job role.
- Return only valid JSON. Do not include Markdown.
        `,
      },
      {
        role: "user",
        content: `
Analyze this resume for the target role: ${targetRole}

RESUME:
${resumeText}

Return JSON using exactly this structure:

{
  "overallScore": 0,
  "targetRole": "",
  "summary": "",
  "strengths": [],
  "missingSkills": [],
  "weaknesses": [],
  "improvementSuggestions": [],
  "recommendedSkills": []
}
        `,
      },
    ],
  });

  return JSON.parse(response.data.message.content);
};
