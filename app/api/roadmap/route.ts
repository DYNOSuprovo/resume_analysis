import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
        const { data: userSkills } = await supabase
            .from('UserSkill')
            .select('*, skill:Skill(*)')
            .eq('userId', userId);

        const currentSkills = userSkills?.map((us: any) => us.skill.name) || [];

        // Get user profile
        const { data: profile } = await supabase
            .from('Profile')
            .select('*')
            .eq('userId', userId)
            .single();

        // Generate roadmap using Groq AI
        const roadmapData = await generateRoadmap({
            currentSkills,
            targetRole,
            yearsExperience: profile?.yearsExperience || 0,
            weeklyHours: weeklyHours || profile?.weeklyHours || 10,
            targetDeadline: targetDeadline ? new Date(targetDeadline) : undefined,
            learningStyle: learningStyle || profile?.learningStyle || "balanced",
        });

        // Create roadmap
        const { data: roadmap, error: roadmapError } = await supabase
            .from('Roadmap')
            .insert({
                userId,
                goalRole: targetRole,
                status: "active",
            })
            .select()
            .single();

        if (roadmapError) throw new Error(roadmapError.message);

        // Create sections
        for (const section of roadmapData.sections) {
            const { data: createdSection, error: sectionError } = await supabase
                .from('Section')
                .insert({
                    roadmapId: roadmap.id,
                    title: section.title,
                    description: section.description,
                    order: section.order,
                })
                .select()
                .single();

            if (sectionError) {
                console.error("Section error:", sectionError);
                continue;
            }

            // Create milestones for this section
            for (const milestone of section.milestones) {
                const { data: createdMilestone, error: milestoneError } = await supabase
                    .from('Milestone')
                    .insert({
                        sectionId: createdSection.id,
                        title: milestone.title,
                        description: milestone.description,
                        order: milestone.order,
                    })
                    .select()
                    .single();

                if (milestoneError) {
                    console.error("Milestone error:", milestoneError);
                    continue;
                }

                // Create tasks for this milestone
                const tasks = milestone.tasks.map((task: any) => ({
                    milestoneId: createdMilestone.id,
                    title: task.title,
                    description: task.description,
                    type: task.type,
                    estimatedHours: task.estimatedHours,
                    order: task.order,
                    aiTips: task.aiTips,
                }));

                await supabase.from('Task').insert(tasks);
            }
        }

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

        // Get user's active roadmap
        const { data: roadmap, error } = await supabase
            .from('Roadmap')
            .select(`
                *,
                sections:Section(
                    *,
                    milestones:Milestone(
                        *,
                        tasks:Task(
                            *,
                            progress:TaskProgress(*)
                        )
                    )
                )
            `)
            .eq('userId', userId)
            .eq('status', 'active')
            .order('createdAt', { ascending: false })
            .limit(1)
            .single();

        if (error || !roadmap) {
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
