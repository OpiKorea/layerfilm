
"use client";

import { useState, useEffect } from "react";
import { Star, Send, User, Trash2 } from "lucide-react";
import { getComments, postComment, deleteComment } from "@/lib/data";
import { CommentItem } from "@/lib/types";
import { LocalizedText } from "@/components/common/LocalizedText";

interface CommentSectionProps {
    ideaId: string;
    currentUser: any;
    ideaAuthorId: string;
}

export function CommentSection({ ideaId, currentUser, ideaAuthorId }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            const data = await getComments(ideaId);
            setComments(data);
        };
        fetchComments();
    }, [ideaId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        setIsSubmitting(true);
        const result = await postComment(ideaId, currentUser.id, newComment, rating);
        if (result) {
            setComments([result, ...comments]);
            setNewComment("");
            setRating(5);
        } else {
            alert("Failed to post comment. Please try again.");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        const res = await deleteComment(commentId, ideaId);
        if (res.success) {
            setComments(comments.filter(c => c.id !== commentId));
        }
    };

    return (
        <div className="space-y-12">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <LocalizedText en="Reviews & Conversations" ko="리뷰 및 대화" />
                <span className="text-sm font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">{comments.length}</span>
            </h3>

            {/* Post Comment */}
            {currentUser ? (
                <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest"><LocalizedText en="Rate this work" ko="이 작품 어때요?" />:</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className={`${rating >= s ? 'text-yellow-400' : 'text-gray-600'} hover:scale-125 transition-transform`}
                                    >
                                        <Star className={`w-5 h-5 ${rating >= s ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts with the creator..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[120px] transition-all"
                        />
                        <button
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute bottom-4 right-4 bg-accent text-black p-3 rounded-full hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-center">
                    <p className="text-gray-400 font-medium mb-4"><LocalizedText en="Sign in to join the conversation" ko="대화에 참여하려면 로그인해 주세요" /></p>
                    <a href="/login" className="text-accent font-bold hover:underline"><LocalizedText en="Log In" ko="로그인" /></a>
                </div>
            )}

            {/* Comment List */}
            <div className="space-y-8">
                {comments.length > 0 ? comments.map((comment) => (
                    <div key={comment.id} className="group animate-fade-in border-b border-white/5 pb-8 last:border-none">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0">
                                {comment.user?.avatar_url ? (
                                    <img src={comment.user.avatar_url} alt={comment.user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-white tracking-tight">{comment.user?.username || 'Anonymous'}</span>
                                        <div className="flex items-center gap-0.5 text-xs text-yellow-500/80">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < comment.rating ? 'fill-current' : 'text-gray-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-mono text-gray-600">
                                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                                        {(currentUser?.id === comment.user_id || currentUser?.role === 'admin') && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Star className="w-8 h-8 text-gray-700" />
                        </div>
                        <p className="text-gray-500 font-medium tracking-tight"><LocalizedText en="Be the first to share your review" ko="첫 번째 리뷰를 남겨주세요" /></p>
                    </div>
                )}
            </div>
        </div>
    );
}
