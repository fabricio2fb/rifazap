import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect payload
    const next = searchParams.get('next') ?? '/admin';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Successful login, redirect to the desired page
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error("Auth callback error:", error);
        }
    }

    // Return the user to an error page or login with error param
    return NextResponse.redirect(`${origin}/login?error=auth-failure`);
}
