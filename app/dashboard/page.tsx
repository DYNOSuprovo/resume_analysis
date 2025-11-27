"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateProgress } from "@/lib/utils";
import { CheckSquare, Square, Terminal, Cpu, Activity, Trophy } from "lucide-react";

interface Task {
    id: string;
    title: string;
    description: string;
    type: string;
    estimatedHours: number;
    aiTips: string;
    progress: Array<{
        status: string;
        timeSpent: number;
    }>;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
}

interface Section {
    id: string;
    title: string;
    description: string;
    milestones: Milestone[];
}

interface Roadmap {
    id: string;
    goalRole: string;
    sections: Section[];
}

export default function DashboardPage() {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(3);
    const userId = "cmihm6giw0000citc3hzo9xsh";

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const response = await fetch(`/api/roadmap?userId=${userId}`);
            const data = await response.json();
            if (data.roadmap) {
                setRoadmap(data.roadmap);
                const completed = getAllTasks(data.roadmap).filter(
                    (t: Task) => t.progress && t.progress[0]?.status === "done"
                ).length;
                setXp(completed * 100);
            }
        } catch (error) {
            console.error("Failed to fetch roadmap:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAllTasks = (roadmap: Roadmap) => {
        return roadmap.sections.flatMap((s) =>
            s.milestones.flatMap((m) => m.tasks)
        );
    };

    const handleTaskToggle = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === "done" ? "todo" : "done";
        try {
            await fetch(`/api/tasks/${taskId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, status: newStatus }),
            });
            if (newStatus === "done") setXp(prev => prev + 100);
            else setXp(prev => Math.max(0, prev - 100));
            fetchRoadmap();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-primary font-mono">
                <div className="text-center space-y-4">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p>LOADING_SYSTEM_DATA...</p>
                </div>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-mono">
                <Card className="bg-black/40 border-white/10 max-w-md rounded-none">
                    <CardHeader>
                        <CardTitle className="text-center text-white">NO_DATA_FOUND</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button
                            className="bg-primary text-black hover:bg-primary/90 rounded-none font-mono"
                            onClick={() => (window.location.href = "/onboarding")}
                        >
                            INITIALIZE_ROADMAP
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const allTasks = getAllTasks(roadmap);
    const completedTasks = allTasks.filter((t) => t.progress && t.progress[0]?.status === "done");
    const overallProgress = calculateProgress(completedTasks.length, allTasks.length);
    const level = Math.floor(xp / 500) + 1;

    return (
        <div className="min-h-screen p-6 font-mono selection:bg-primary/30 selection:text-primary">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="col-span-2 bg-black/40 border-primary/20 rounded-none relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader>
                            <div className="text-xs text-primary/60 tracking-widest mb-1">TARGET_PROTOCOL</div>
                            <CardTitle className="text-2xl text-white uppercase tracking-tight">
                                {roadmap.goalRole}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-black/40 border-white/10 rounded-none">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Activity className="w-8 h-8 text-secondary" />
                            <div>
                                <div className="text-2xl font-bold text-white">{streak}</div>
                                <div className="text-xs text-muted-foreground">DAY_STREAK</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-white/10 rounded-none">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Trophy className="w-8 h-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold text-white">LVL {level}</div>
                                <div className="text-xs text-muted-foreground">{xp} XP</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-primary/80">
                        <span>SYSTEM_PROGRESS</span>
                        <span>{overallProgress}%</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full">
                        <div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-1000"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>

                {/* Roadmap Sections */}
                <div className="space-y-8">
                    {roadmap.sections.map((section, idx) => (
                        <div key={section.id} className="space-y-4">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-2">
                                <span className="text-primary text-xl font-bold">0{idx + 1}</span>
                                <h2 className="text-xl text-white uppercase tracking-wider">{section.title}</h2>
                            </div>

                            <div className="grid gap-4">
                                {section.milestones.map((milestone) => (
                                    <Card key={milestone.id} className="bg-black/20 border-white/5 rounded-none hover:border-white/10 transition-colors">
                                        <CardContent className="p-6 space-y-6">
                                            <div className="flex items-start gap-3">
                                                <Terminal className="w-5 h-5 text-secondary mt-1" />
                                                <div>
                                                    <h3 className="text-lg text-white mb-1">{milestone.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pl-8">
                                                {milestone.tasks.map((task) => {
                                                    const isDone = task.progress && task.progress[0]?.status === "done";
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            onClick={() => handleTaskToggle(task.id, task.progress?.[0]?.status || "todo")}
                                                            className={`
                                                                group flex items-center gap-4 p-3 border border-transparent hover:border-primary/20 hover:bg-primary/5 cursor-pointer transition-all
                                                                ${isDone ? "opacity-50" : "opacity-100"}
                                                            `}
                                                        >
                                                            {isDone ? (
                                                                <CheckSquare className="w-5 h-5 text-primary" />
                                                            ) : (
                                                                <Square className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                                            )}

                                                            <div className="flex-1">
                                                                <div className={`text-sm ${isDone ? "text-primary line-through" : "text-white"}`}>
                                                                    {task.title}
                                                                </div>
                                                            </div>

                                                            <div className="text-xs text-muted-foreground font-mono">
                                                                {task.estimatedHours}H
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
