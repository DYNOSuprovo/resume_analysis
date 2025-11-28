import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

        // Update or create task progress using Supabase
        const { data: progress, error } = await supabase
            .from('TaskProgress')
            .upsert({
                userId,
                taskId,
                status: status || "todo",
                timeSpent: timeSpent || 0,
                notes,
                updatedAt: new Date().toISOString(),
            }, {
                onConflict: 'userId,taskId'
            })
            .select()
            .single();

        if (error) {
            console.error("Progress update error:", error);
            throw new Error(error.message);
        }

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
