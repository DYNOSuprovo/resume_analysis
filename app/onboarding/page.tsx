"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Upload, ArrowRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        targetRole: "",
        weeklyHours: 10,
        learningStyle: "balanced",
        userId: "cmihm6giw0000citc3hzo9xsh",
    });
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadResume = async () => {
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("userId", formData.userId);

        try {
            const response = await fetch("/api/resume/upload", { method: "POST", body: data });
            const result = await response.json();
            if (result.success) setStep(2);
            else alert("Failed to upload resume: " + result.error);
        } catch (error) {
            alert("Error uploading resume");
        } finally {
            setUploading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        setGenerating(true);
        try {
            const response = await fetch("/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) router.push("/dashboard");
            else alert("Failed to generate roadmap: " + result.error);
        } catch (error) {
            alert("Error generating roadmap");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-mono selection:bg-primary/30 selection:text-primary">
            <Card className="w-full max-w-2xl bg-black/40 border-white/10 rounded-none backdrop-blur-md">
                <CardHeader className="border-b border-white/5 pb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-muted-foreground tracking-widest">INITIALIZATION_SEQUENCE</span>
                        <div className="flex gap-1">
                            <div className={`w-2 h-2 ${step >= 1 ? "bg-primary" : "bg-white/10"}`} />
                            <div className={`w-2 h-2 ${step >= 2 ? "bg-primary" : "bg-white/10"}`} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-white font-light tracking-tight">
                        {step === 1 ? "UPLOAD_SOURCE_DATA" : "CONFIGURE_PARAMETERS"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-8">
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="border border-dashed border-white/20 hover:border-primary/50 transition-colors p-12 text-center group cursor-pointer relative bg-white/5 hover:bg-white/10">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer block w-full h-full">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <p className="text-lg text-white mb-2">
                                        {file ? file.name : "DRAG_DROP_RESUME"}
                                    </p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                                        PDF / DOCX / MAX 10MB
                                    </p>
                                </label>
                            </div>

                            <Button
                                onClick={handleUploadResume}
                                disabled={!file || uploading}
                                className="w-full bg-primary text-black hover:bg-primary/90 rounded-none h-14 text-lg font-bold tracking-wider disabled:opacity-50"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" /> PROCESSING...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        CONTINUE <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs text-primary uppercase tracking-widest">Target Role</label>
                                <Input
                                    placeholder="e.g. FULL_STACK_DEVELOPER"
                                    value={formData.targetRole}
                                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                    className="bg-black/20 border-white/10 rounded-none h-12 text-white placeholder:text-white/20 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-primary uppercase tracking-widest">Weekly Hours</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="40"
                                    value={formData.weeklyHours}
                                    onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) })}
                                    className="bg-black/20 border-white/10 rounded-none h-12 text-white focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-primary uppercase tracking-widest">Learning Style</label>
                                <select
                                    className="w-full h-12 bg-black/20 border border-white/10 rounded-none text-white px-3 focus:border-primary outline-none"
                                    value={formData.learningStyle}
                                    onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                                >
                                    <option value="video">VIDEO_HEAVY</option>
                                    <option value="text">READING_FOCUSED</option>
                                    <option value="project">PROJECT_BASED</option>
                                    <option value="balanced">BALANCED_MIX</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none h-14"
                                >
                                    BACK
                                </Button>
                                <Button
                                    onClick={handleGenerateRoadmap}
                                    disabled={!formData.targetRole || generating}
                                    className="flex-1 bg-primary text-black hover:bg-primary/90 rounded-none h-14 font-bold tracking-wider"
                                >
                                    {generating ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" /> GENERATING...
                                        </span>
                                    ) : (
                                        "GENERATE_ROADMAP"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
