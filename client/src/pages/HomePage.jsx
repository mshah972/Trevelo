import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Subtitle } from "../components/ui/Subtitle.jsx";
import { PromptTips } from "../components/custom/PromptTips.jsx";
import { ChatContainer } from "../components/custom/ChatContainer.jsx";
import LoadingDotsAnimation from "../components/ui/DotsAnimation.jsx";
import { PromptInputArea } from "../components/custom/PromptInputArea.jsx";
import { ItineraryView } from "../components/ui/ItineraryView.jsx";
import {getAuthToken, logoutUser} from "../services/auth.js";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const containerRef = useRef(null);
    const logoURL = "https://firebasestorage.googleapis.com/v0/b/travel-mate-sm07.firebasestorage.app/o/travel-mate-logo.svg?alt=media&token=43abb583-1320-4935-934d-a51d8f94f179";
    const navigate = useNavigate();

    // State for chat history and loading status
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser(); // Clear Amplify session
            navigate("/login"); // Redirect to Login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Main handler for submitting a prompt
    const handleGenerate = async (userParagraph) => {
        if (!userParagraph.trim()) return;

        const token = await getAuthToken();
        if (!token) {
            alert("You must be logged in to generate a trip.");
            return;
        }

        // 1. Add User Message to UI immediately
        const newUserMessage = {
            id: Date.now().toString(), // Simple ID generation
            role: "user",
            content: userParagraph,
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // 2. Start background job
            const startRes = await fetch("/api/itineraries/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: userParagraph }),
            });

            const startCt = startRes.headers.get("content-type") || "";
            if (!startRes.ok) {
                const msg = startCt.includes("application/json")
                    ? (await startRes.json()).error
                    : await startRes.text();
                throw new Error(`Start failed (HTTP ${startRes.status}): ${msg}`);
            }

            const startJson = await startRes.json();
            if (!startJson?.ok || !startJson?.jobId) {
                throw new Error("Failed to start job (no jobId).");
            }

            const jobId = startJson.jobId;
            console.log("[itinerary] started job:", jobId);

            // 3. Poll until job completes
            const startedAt = Date.now();
            const POLL_INTERVAL_MS = 1500;
            const TIMEOUT_MS = 300000; // 5 minutes

            let result = null;

            for (;;) {
                if (Date.now() - startedAt > TIMEOUT_MS) {
                    throw new Error("Timed out waiting for itinerary.");
                }

                await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

                const statusRes = await fetch(`/api/jobs/${jobId}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!statusRes.ok) throw new Error("Status check failed");

                const { job } = await statusRes.json();

                if (job.status === "completed") {
                    result = job.data;
                    break;
                }
                if (job.status === "failed") {
                    throw new Error(job.error || "Itinerary generation failed.");
                }
                // If queued or running, continue loop
            }

            // 4. Add Assistant Message with Result
            // Note: passing the raw object allows ChatContainer to render complex JSX if needed,
            // or we format a string summary here.
            const newAssistantMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: (
                    <div className="w-full">
                        <ItineraryView plan={result} />
                    </div>
                ),
                data: result
            };
            setMessages((prev) => [...prev, newAssistantMessage]);

        } catch (e) {
            console.error("Generation error:", e);
            const errorMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: `Something went wrong: ${e.message || "Unknown error"}. Please try again.`
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-svh flex flex-col items-center">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="absolute top-5 right-8 z-50"
            >
                <button onClick={handleLogout} className="group rounded-full bg-elevated ring-1 ring-red-500 p-2 hover:bg-white transition duration-300">
                    <LogOut className="w-4 h-4 text-red-500 group-hover:text-black" />
                </button>
            </motion.div>

            <div className="flex flex-col w-full h-full min-h-svh items-center justify-between pb-6 lg:pb-8">

                {/* --- HERO SECTION (Only visible when no messages) --- */}
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex flex-col w-full items-center gap-2 pt-20 lg:pt-32 text-center px-4"
                    >
                        {/* Logo Animation */}
                        <div className="relative rounded-full flex justify-center items-center bg-[conic-gradient(from_var(--border-angle),red,orange,yellow,green,blue,indigo,violet,red)] p-px w-[80px] h-[80px] animate-rotate-border shadow-lg shadow-white/10">
                            <div className="bg-muted rounded-full w-full h-full flex justify-center items-center overflow-hidden p-4 inset-shadow-sm inset-shadow-white/10">
                                <img
                                    src={logoURL}
                                    className="w-full h-full object-contain"
                                    alt="Trevelo Logo"
                                />
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="flex flex-col w-full items-center pt-6 text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="leading-tight font-normal text-3xl lg:text-4xl text-white"
                            >
                                Ready to explore the world?
                            </motion.h1>
                            <Subtitle />
                        </div>
                    </motion.div>
                )}

                {/* --- CHAT CONTAINER (Visible when there are messages) --- */}
                {messages.length > 0 && (
                    <div className="flex-1 w-full flex justify-center overflow-hidden relative mt-4">
                        <div className="w-full h-full overflow-y-auto custom-scrollbar px-4 pb-4" ref={containerRef}>
                            <div className="max-w-[752px] mx-auto min-h-full flex flex-col justify-end">
                                <ChatContainer
                                    messages={messages}
                                    containerRef={containerRef}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- INPUT AREA & FOOTER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className={`w-full flex flex-col justify-center items-center px-4 ${messages.length === 0 ? 'flex-1 justify-center' : 'mt-2'}`}
                >
                    <div className="w-full max-w-[752px] flex flex-col gap-4">

                        {isLoading && (
                            <div className="flex items-center gap-2 mt-4 ml-2">
                                <p className="font-light text-text-secondary text-xs lg:text-sm italic">
                                    Thinking
                                </p>
                                <LoadingDotsAnimation />
                            </div>
                        )}

                        {/* Prompt Input */}
                        <PromptInputArea
                            onSubmit={handleGenerate}
                            className="w-full"
                        />

                        {/* Tips (Only visible in Hero mode) */}
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <PromptTips />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}