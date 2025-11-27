import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface RoadmapInput {
  currentSkills: string[];
  targetRole: string;
  yearsExperience?: number;
  weeklyHours?: number;
  targetDeadline?: Date;
  learningStyle?: string;
}

export async function generateRoadmap(input: RoadmapInput) {
  const prompt = `You are an expert career coach and learning path designer. Create a comprehensive, personalized learning roadmap.

User Profile:
- Target Role: ${input.targetRole}
- Current Skills: ${input.currentSkills.join(", ") || "None specified"}
- Experience Level: ${input.yearsExperience || 0} years
- Weekly Time Commitment: ${input.weeklyHours || 10} hours
- Learning Style: ${input.learningStyle || "balanced"}
${input.targetDeadline ? `- Target Deadline: ${input.targetDeadline.toDateString()}` : ""}

Create a structured learning roadmap that takes the person from their current level to achieving their target role.

Return ONLY a valid JSON object with this structure (no markdown, no extra text):
{
  "sections": [
    {
      "title": "Section Title (e.g., 'Python Fundamentals')",
      "description": "Brief description of this section",
      "order": 1,
      "milestones": [
        {
          "title": "Milestone Title (e.g., 'Master Control Flow')",
          "description": "What will be achieved",
          "order": 1,
          "tasks": [
            {
              "title": "Specific task title",
              "description": "What to do",
              "type": "course|video|project|reading|practice",
              "estimatedHours": 5,
              "order": 1,
              "aiTips": "Helpful tips for completing this task"
            }
          ]
        }
      ]
    }
  ]
}

Guidelines:
- Create 3-5 main sections (beginner → intermediate → advanced if applicable)
- Each section should have 2-4 milestones
- Each milestone should have 3-6 specific, actionable tasks
- Be realistic about time estimates
- Consider the user's available hours per week
- Mix different types of learning (courses, projects, practice)
- Prioritize free resources when possible
- Make it specific to their target role: ${input.targetRole}

Return ONLY the JSON object.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    // Clean up response
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Groq API failed:", error);
    throw error; // Don't use fallback
  }
}
