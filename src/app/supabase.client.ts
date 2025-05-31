import { createClient } from '@supabase/supabase-js'


const supabaseURL = 'https://dtzbdxysjcjwvmnishhs.supabase.co'
const supabasePass = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0emJkeHlzamNqd3ZtbmlzaGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTg5MzMsImV4cCI6MjA2NDAzNDkzM30.oy1oSSLNbG98OdwpxeMloF1YWvydCBlYuin9pqvJpfo'

export const supabase = createClient(supabaseURL, supabasePass)
