"use client";

import { useState } from "react";
import { purchaseIdea } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Unlock, Loader2 } from "lucide-react";

interface PurchaseButtonProps {
    ideaId: string;
    price: number;
}

export function PurchaseButton({ ideaId, price }: PurchaseButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handlePurchase = async () => {
        setIsPending(true);
        toast.promise(purchaseIdea(ideaId), {
            loading: 'Validating payment with AI system...',
            success: (data) => {
                toast.success("Purchase successful! Content unlocked.");
                router.refresh(); // Refresh to show unlocked content
                setTimeout(() => {
                    router.push("/library");
                }, 1500);
                return "Acquisition Complete";
            },
            error: (err) => {
                setIsPending(false);
                return `Transaction failed: ${err.message}`;
            },
            finally: () => setIsPending(false)
        });
    };

    return (
        <button
            onClick={handlePurchase}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 text-lg font-black rounded-2xl bg-accent hover:bg-accent/80 text-white transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
        >
            {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <>
                    <Unlock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>UNLOCK FOR ${price}</span>
                </>
            )}
        </button>
    );
}
