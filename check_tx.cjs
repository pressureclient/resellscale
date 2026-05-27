const { createClient } = require('@supabase/supabase-js');
const url = "https://jaxashazmjpxirzkyshr.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpheGFzaGF6bWpweGlyemt5c2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTQyMzYsImV4cCI6MjA4OTI3MDIzNn0.3C83khDHbMNzLBDVDSxxk_ApUdxzugTvExOWYmdaPP8";
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('transactions').select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    console.log(data, error);
  }
}
check();
