import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function extractResumeData(resumeText: string) {
  const prompt = `You are an expert resume parser. Analyze the following resume text and extract structured information.

Resume Text:
${resumeText}

Please extract and return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "summary": "A brief 2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2020 - Dec 2022",
      "description": "Brief description of responsibilities"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University/College",
      "year": "2020",
      "field": "Field of Study"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

Return ONLY the JSON object, nothing else.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Fast and accurate model
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    // Clean up response - remove markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Groq API failed:", error);
    throw error; // Don't use fallback - let it fail visibly
  }
}
