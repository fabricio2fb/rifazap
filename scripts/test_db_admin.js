const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// We must use the admin service role to query auth.users
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function check() {
    const email = 'carvalho.fabiola@gmail.com';

    // Auth Users search
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching auth users:", error);
        return;
    }

    const matchedUser = users.find(u => u.email === email);
    console.log("Matched User from Auth:", matchedUser ? matchedUser.id : "Not found");

    if (matchedUser) {
        // Find their pending raffles
        const { data: pendingRaffles, error: rafflesError } = await supabaseAdmin
            .from('raffles')
            .select('id, title, status, created_at')
            .eq('organizer_id', matchedUser.id)
            .eq('status', 'pending_payment')
            .order('created_at', { ascending: false });

        if (rafflesError) console.error("Raffles Error:", rafflesError);
        console.log("Pending raffles for this user:", pendingRaffles);
    }
}
check();
