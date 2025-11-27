import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ taskId: string }> }
) {
    const params = await props.params;
    const { taskId } = params;
    try {
        const body = await request.json();
        const { userId, status, timeSpent, notes } = body;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID required" },
                { status: 401 }
            );
        }

        // Update or create task progress
        const progress = await prisma.taskProgress.upsert({
            where: {
                userId_taskId: {
                    userId,
                    taskId,
                },
            },
            create: {
                userId,
                taskId,
                status: status || "todo",
                timeSpent: timeSpent || 0,
                notes,
            },
            update: {
                status,
                timeSpent,
                notes,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            progress,
        });
    } catch (error: any) {
        console.error("Progress update error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update progress" },
            { status: 500 }
        );
    }
}
