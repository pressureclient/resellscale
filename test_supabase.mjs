import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jaxashazmjpxirzkyshr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpheGFzaGF6bWpweGlyemt5c2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTQyMzYsImV4cCI6MjA4OTI3MDIzNn0.3C83khDHbMNzLBDVDSxxk_ApUdxzugTvExOWYmdaPP8"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test_auto_agent@resellcapital.com',
      password: 'password123',
    })
    console.log("Data:", data)
    console.log("Error:", error)
  } catch (err) {
    console.error("Exception:", err)
  }
}

test()
