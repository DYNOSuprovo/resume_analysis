import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractResumeText } from "@/lib/resume-parser";
import { extractResumeData } from "@/lib/gemini/resume-extractor";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 401 }
            );
        }

        // Extract text from file
        const rawText = await extractResumeText(file);

        // Use Groq AI to parse structured data
        const parsedData = await extractResumeData(rawText);

        // Save to database using Supabase
        const { data: resume, error: resumeError } = await supabase
            .from('Resume')
            .insert({
                userId,
                fileName: file.name,
                rawText,
                parsedData,
            })
            .select()
            .single();

        if (resumeError) {
            console.error("Resume insert error:", resumeError);
            throw new Error(resumeError.message);
        }

        // Update user profile with extracted skills
        if (parsedData.skills && parsedData.skills.length > 0) {
            for (const skillName of parsedData.skills) {
                // Check if skill exists
                const { data: existingSkill } = await supabase
                    .from('Skill')
                    .select('*')
                    .eq('name', skillName)
                    .single();

                let skillId: string;

                if (existingSkill) {
                    skillId = existingSkill.id;
                } else {
                    // Create new skill
                    const { data: newSkill, error: skillError } = await supabase
                        .from('Skill')
                        .insert({ name: skillName, category: "technical" })
                        .select()
                        .single();

                    if (skillError) {
                        console.error("Skill insert error:", skillError);
                        continue; // Skip this skill if error
                    }
                    skillId = newSkill.id;
                }

                // Link skill to user (upsert)
                await supabase
                    .from('UserSkill')
                    .upsert({
                        userId,
                        skillId,
                        level: "intermediate",
                        source: "resume",
                    }, {
                        onConflict: 'userId,skillId'
                    });
            }
        }

        return NextResponse.json({
            success: true,
            resumeId: resume.id,
            parsedData,
        });
    } catch (error: any) {
        console.error("Resume processing error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to process resume" },
            { status: 500 }
        );
    }
}
