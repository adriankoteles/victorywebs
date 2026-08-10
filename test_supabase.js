require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('leads').select('*').limit(5);
  console.log("Error:", error);
  console.log("Data length:", data?.length);
  if (data?.length > 0) console.log("First item status:", data[0].status);
}
run();
