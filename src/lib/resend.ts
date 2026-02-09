import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.warn('Warning: RESEND_API_KEY is not set in environment variables.');
}

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail({
    to,
    subject,
    html,
    from = 'LayerFilm <onboarding@resend.dev>', // 도메인 인증 전 기본 주소
}: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}) {
    if (!resend) {
        console.error('Resend is not initialized. Missing RESEND_API_KEY.');
        return { success: false, error: 'Missing API Key' };
    }
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Unexpected Resend Error:', err);
        return { success: false, error: err };
    }
}
