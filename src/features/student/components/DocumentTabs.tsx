import React from "react";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveTab, closeTab } from "../store/theatreSlice";
import type { TheatreTab } from "../store/theatreSlice";
import { X, FileText, Video, Info } from "lucide-react";
import { cn } from "../../../lib/utils";

const DocumentTabs: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tabs, activeTabId } = useAppSelector((state) => state.theatre);

    if (tabs.length === 0) return (
        <div className="h-12 flex items-center px-6 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/20">
            No documents mounted
        </div>
    );

    return (
        <div className="flex items-center overflow-x-auto bg-white/5 backdrop-blur-3xl border-b border-white/5 scrollbar-hide shrink-0 h-12">
            {tabs.map((tab: TheatreTab) => (
                <div
                    key={tab.id}
                    className={cn(
                        "group flex items-center gap-3 px-6 h-full min-w-[160px] max-w-[240px] border-r border-white/5 cursor-pointer transition-all duration-300 relative",
                        activeTabId === tab.id
                            ? "bg-base-100 text-base-content"
                            : "text-base-content/30 hover:bg-base-100/5 hover:text-base-content/60"
                    )}
                    onClick={() => dispatch(setActiveTab(tab.id))}
                >
                    {/* Active Highlight */}
                    {activeTabId === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute top-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                        />
                    )}

                    {tab.type === "video" && <Video className="w-3.5 h-3.5" />}
                    {tab.type === "doc" && <FileText className="w-3.5 h-3.5" />}
                    {tab.type === "instructions" && <Info className="w-3.5 h-3.5" />}

                    <span className="text-[10px] font-bold uppercase tracking-wider truncate flex-1">{tab.title}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(closeTab(tab.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DocumentTabs;
