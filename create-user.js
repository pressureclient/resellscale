import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jaxashazmjpxirzkyshr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpheGFzaGF6bWpweGlyemt5c2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTQyMzYsImV4cCI6MjA4OTI3MDIzNn0.3C83khDHbMNzLBDVDSxxk_ApUdxzugTvExOWYmdaPP8'
)

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'truth7824@gmail.com',
    password: 'Password123!',
    options: {
      data: {
        full_name: 'Admin Truth7824',
        username: 'truth7824',
        account_type: 'VIP Package'
      }
    }
  })
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success!', data.user.id)
  }
}
run()
