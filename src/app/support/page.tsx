import { LocalizedText } from "@/components/common/LocalizedText";

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-black text-white mb-8">
                <LocalizedText en="Support" ko="고객 지원" />
            </h1>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <p className="text-gray-400 text-lg mb-8">
                    <LocalizedText
                        en="If you have any questions or need assistance, please contact us at:"
                        ko="문의 사항이 있으시면 아래 이메일로 연락주시기 바랍니다."
                    />
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 inline-block">
                    <span className="text-xl font-bold text-accent">layerfilm@gmail.com</span>
                </div>
            </div>
        </div>
    );
}
