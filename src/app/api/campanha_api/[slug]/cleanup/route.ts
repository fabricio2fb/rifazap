import { NextResponse } from 'next/server';
import { cleanupExpiredReservations } from '@/lib/utils/cleanup';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const { slug } = params;
        const supabase = await createAdminClient();

        // Find the raffle ID from the slug
        const { data: raffleData } = await supabase
            .from('raffles')
            .select('id')
            .eq('slug', slug)
            .single();

        if (raffleData) {
            await cleanupExpiredReservations(raffleData.id);
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("[Cleanup API Error]", e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
