import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateRoadmap } from "@/lib/gemini/roadmap-generator";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, targetRole, weeklyHours, targetDeadline, learningStyle } = body;

        if (!userId || !targetRole) {
            return NextResponse.json(
                { error: "User ID and target role are required" },
                { status: 400 }
            );
        }

        // Get user's current skills
        const userSkills = await prisma.userSkill.findMany({
            where: { userId },
            include: { skill: true },
        });

        const currentSkills = userSkills.map((us: { skill: { name: string } }) => us.skill.name);

        // Get user profile for experience level
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        // Generate roadmap using Gemini
        const roadmapData = await generateRoadmap({
            currentSkills,
            targetRole,
            yearsExperience: profile?.yearsExperience || 0,
            weeklyHours: weeklyHours || profile?.weeklyHours || 10,
            targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
            learningStyle: learningStyle || profile?.learningStyle || "balanced",
        });

        // Create roadmap in database
        const roadmap = await prisma.roadmap.create({
            data: {
                userId,
                goalRole: targetRole,
                status: "active",
                sections: {
                    create: roadmapData.sections.map((section: any) => ({
                        title: section.title,
                        description: section.description,
                        order: section.order,
                        milestones: {
                            create: section.milestones.map((milestone: any) => ({
                                title: milestone.title,
                                description: milestone.description,
                                order: milestone.order,
                                tasks: {
                                    create: milestone.tasks.map((task: any) => ({
                                        title: task.title,
                                        description: task.description,
                                        type: task.type,
                                        estimatedHours: task.estimatedHours,
                                        order: task.order,
                                        aiTips: task.aiTips,
                                    })),
                                },
                            })),
                        },
                    })),
                },
            },
            include: {
                sections: {
                    include: {
                        milestones: {
                            include: {
                                tasks: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            roadmapId: roadmap.id,
            roadmap,
        });
    } catch (error: any) {
        console.error("Roadmap generation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate roadmap" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 401 }
            );
        }

        // Get user's active roadmap (most recent one)
        const roadmap = await prisma.roadmap.findFirst({
            where: {
                userId,
                status: "active",
            },
            orderBy: {
                createdAt: "desc", // Get the LATEST roadmap
            },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                    include: {
                        milestones: {
                            orderBy: { order: "asc" },
                            include: {
                                tasks: {
                                    orderBy: { order: "asc" },
                                    include: {
                                        progress: {
                                            where: { userId },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!roadmap) {
            return NextResponse.json(
                { error: "No active roadmap found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ roadmap });
    } catch (error: any) {
        console.error("Roadmap fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch roadmap" },
            { status: 500 }
        );
    }
}
