import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/api') && // Allow API access
        !request.nextUrl.pathname.startsWith('/support') &&
        !request.nextUrl.pathname.startsWith('/privacy') &&
        !request.nextUrl.pathname.startsWith('/terms') &&
        request.nextUrl.pathname !== '/' // Allow Home Page
    ) {
        // Redirect to login if trying to access protected pages (like /idea/purchase etc if we had them)
        // For now, let's say /idea/[id] is public but clicking 'buy' needs auth.
        // Actually, user asked "Login only for buying or uploading". 
        // We can enforce that in the Actions/Components, but basic middleware prevents accessing /upload if it existed.
        // If request.nextUrl.pathname.startsWith('/upload') -> Redirect
        if (request.nextUrl.pathname.startsWith('/upload')) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
