
"use client";

import { Flag } from "lucide-react";
import { useState } from "react";
import { reportIdea } from "@/lib/data";
import { createClient } from "@/utils/supabase/client";
import { LocalizedText } from "../common/LocalizedText";

interface ReportButtonProps {
    ideaId: string;
}

export function ReportButton({ ideaId }: ReportButtonProps) {
    const [isReported, setIsReported] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    const handleReport = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Please login to report content.");
            return;
        }

        if (!confirm("Are you sure you want to report this content?")) return;

        setIsSubmitting(true);
        const res = await reportIdea(ideaId);
        if (res.success) {
            setIsReported(true);
            alert("This content has been reported and will be reviewed by administrators.");
        }
        setIsSubmitting(false);
    };

    if (isReported) {
        return (
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm bg-red-400/10 px-4 py-2 rounded-full border border-red-400/20">
                <Flag className="w-4 h-4 fill-current" />
                <LocalizedText en="Reported" ko="신고됨" />
            </div>
        );
    }

    return (
        <button
            onClick={handleReport}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 font-bold text-sm hover:bg-red-400/10 px-4 py-2 rounded-full hover:border-red-400/20 border border-transparent transition-all"
        >
            <Flag className="w-4 h-4" />
            <LocalizedText en="Report" ko="신고하기" />
        </button>
    );
}
