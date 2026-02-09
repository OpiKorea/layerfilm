'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/resend'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const nickname = formData.get('nickname') as string
        const legal = formData.get('legal')

        console.log('Signup Attempt:', { email, nickname });

        // 0. Legal Check
        if (!legal) {
            return redirect(`/signup?error=${encodeURIComponent('You must agree to the Terms and Privacy Policy.')}`)
        }

        // 1. AI Blocking Logic
        const forbiddenKeywords = ['ai', 'bot', 'agent', 'robot', 'gpt'];
        const isAI = forbiddenKeywords.some(keyword =>
            nickname.toLowerCase().includes(keyword) ||
            email.toLowerCase().split('@')[0].includes(keyword)
        );

        if (isAI) {
            console.log('Signup Blocked: AI Keyword detected');
            return redirect(`/signup?error=${encodeURIComponent('AI Agents are strictly prohibited from registering on LayerFilm.')}`)
        }

        // 2. Password Complexity Check (Dual Validation)
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(password)) {
            return redirect(`/signup?error=${encodeURIComponent('Password requirement not met.')}`)
        }

        console.log('Calling supabase.auth.signUp...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nickname: nickname,
                },
                // IMPORTANT: For OTP, we might want to disable link if we can, 
                // but usually Supabase sends link by default. 
                // To Use OTP, code must be sent. 
                // If "Email Confirmation" is on, this usually sends a link.
                // To force OTP only, one needs to change email template in Supabase Dashboard 
                // to use {{ .Token }} instead of {{ .ConfirmationURL }}
            },
        })

        if (error) {
            console.error('Supabase Signup Error:', error.message);
            return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            return { error: 'User already exists.' };
        }

        console.log('Signup Successful. User ID:', data.user?.id);

        // 3. Create Profile
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user!.id,
                username: nickname,
                email: email.toLowerCase(),
                role: 'user',
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (profileError) {
            console.error("Profile creation failed:", profileError);
        }

        // 4. Send Welcome Email
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to LayerFilm!',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111; color: #fff; border-radius: 10px; border: 1px solid #333;">
                        <h1 style="color: #7c3aed;">Welcome to LayerFilm, ${nickname}!</h1>
                        <p>Your account has been successfully created.</p>
                        <p>Now you can explore exclusive film ideas and series.</p>
                        <br />
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Welcome email failed:", emailError);
        }

        revalidatePath('/', 'layout');
        return { success: true, email };


    } catch (e: unknown) {
        console.error('CRITICAL SIGNUP FAILURE:', e);
        return { error: 'A critical error occurred. Please try again.' };
    }
}

export async function verifyEmailOtp(email: string, token: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
    })

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function resendOtp(email: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
        email,
        type: 'signup'
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function sendSignupOtp(email: string, nickname?: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            data: nickname ? { nickname } : undefined
        }
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function completeSignupWithOtp(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const token = formData.get('otp') as string;
    const password = formData.get('password') as string;
    const nickname = formData.get('nickname') as string;
    const legal = formData.get('legal');

    // 0. Legal Check
    if (!legal) {
        return { error: 'You must agree to the Terms and Privacy Policy.' };
    }

    // 1. AI Blocking Logic
    const forbiddenKeywords = ['ai', 'bot', 'agent', 'robot', 'gpt'];
    const isAI = forbiddenKeywords.some(keyword =>
        nickname.toLowerCase().includes(keyword) ||
        email.toLowerCase().split('@')[0].includes(keyword)
    );

    if (isAI) {
        return { error: 'AI Agents are strictly prohibited from registering on LayerFilm.' };
    }

    // 2. Password Complexity Check
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
        return { error: 'Password requirement not met.' };
    }

    // 3. Verify OTP
    const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    });

    if (verifyError) {
        return { error: verifyError.message };
    }

    if (!session || !session.user) {
        return { error: 'Verification failed. Please try again.' };
    }

    // 4. Update User (Password & Metadata)
    const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: {
            nickname: nickname
        }
    });

    if (updateError) {
        return { error: updateError.message };
    }

    // 5. Ensure Profile Exists/Updated (Trigger handles insertion for new users)
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: session.user.id,
            username: nickname,
            role: 'user',
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (profileError) {
        console.error("Profile upsert failed:", profileError);
    }

    // If update failed (e.g. row didn't exist because trigger failed), try insert
    if (profileError) {
        console.error("Profile update failed, trying insert...", profileError);
        // Fallback insert if needed (usually not needed if trigger works)
    }


    // 6. Send Welcome Email via Resend
    try {
        await sendEmail({
            to: email,
            subject: 'Welcome to LayerFilm!',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111; color: #fff; border-radius: 10px; border: 1px solid #333;">
                    <h1 style="color: #7c3aed;">Welcome to LayerFilm, ${nickname}!</h1>
                    <p>Your account has been successfully created.</p>
                    <p>Now you can explore exclusive film ideas and series.</p>
                    <br />
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
                    <p style="font-size: 12px; color: #666; margin-top: 30px;">
                        If you didn't create this account, please ignore this email.
                    </p>
                </div>
            `
        });
    } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function testResend(to: string) {
    return await sendEmail({
        to,
        subject: 'Resend Test - LayerFilm',
        html: '<p>Resend API가 성공적으로 연결되었습니다! 🎉</p>'
    });
}
export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
        return redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`);
    }

    return redirect(`/auth/forgot-password?message=${encodeURIComponent('Password reset link sent to your email.')}`);
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`);
    }

    return redirect(`/login?message=${encodeURIComponent('Password updated successfully. Please login with your new password.')}`);
}

export async function changePassword(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Delete profile (Cascade will handle some things if set up, or we do manually)
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
    if (profileError) return { success: false, error: profileError.message };

    // Sign out
    await supabase.auth.signOut();
    return redirect("/?message=Account deleted successfully");
}
