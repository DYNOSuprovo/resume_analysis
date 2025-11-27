import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractResumeText } from "@/lib/resume-parser";
import { extractResumeData } from "@/lib/gemini/resume-extractor";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string; // In production, get from auth session

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

        // Use Gemini to parse structured data
        const parsedData = await extractResumeData(rawText);

        // Save to database
        const resume = await prisma.resume.create({
            data: {
                userId,
                fileName: file.name,
                rawText,
                parsedData,
            },
        });

        // Update user profile with extracted skills
        if (parsedData.skills && parsedData.skills.length > 0) {
            // Create skills if they don't exist
            for (const skillName of parsedData.skills) {
                const skill = await prisma.skill.upsert({
                    where: { name: skillName },
                    create: { name: skillName, category: "technical" },
                    update: {},
                });

                // Link skill to user
                await prisma.userSkill.upsert({
                    where: {
                        userId_skillId: {
                            userId,
                            skillId: skill.id,
                        },
                    },
                    create: {
                        userId,
                        skillId: skill.id,
                        level: "intermediate", // Default, can be refined later
                        source: "resume",
                    },
                    update: {},
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
        // Log deep error details from Gemini if available
        if (error.response) {
            console.error("Gemini Error Response:", JSON.stringify(error.response, null, 2));
        }
        return NextResponse.json(
            { success: false, error: error.message || "Failed to process resume" },
            { status: 500 }
        );
    }
}
