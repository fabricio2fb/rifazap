import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRaffles() {
    const { data, error } = await supabase
        .from('raffles')
        .select('id, title, status')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching raffles:', error);
        return;
    }

    console.log('Recent Raffles:');
    console.table(data);
}

checkRaffles();
