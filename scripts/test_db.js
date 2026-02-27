const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    // 1 - Look for any raffle awaiting payment (just to see if we can easily match)
    const { data: raffles, error } = await supabase
        .from('raffles')
        .select('id, title, status, organizer_id, created_at')
        .eq('status', 'pending_payment')
        .order('created_at', { ascending: false });

    console.log("Raffles awaiting payment:", raffles);

    // 2 - Try to find user by email to see if they match the organizer of these raffles
    const email = 'carvalho.fabiola@gmail.com';
    const { data: user, error: userError } = await supabase
        .from('users') // Not 'customers', admin users are usually in 'users' or 'profiles' schema, but Supabase auth handles it. We can try 'profiles' if it exists.
        .select('*')
        .eq('email', email)
        .single();
    if (userError) console.log("User by email:", userError.message);
    else console.log("User by email:", user);
}
check();
