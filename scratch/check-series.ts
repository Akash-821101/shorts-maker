const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function check() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: series } = await supabase.from('series').select('id, series_name, status');
  console.log('Series statuses:', JSON.stringify(series, null, 2));
}
check();
