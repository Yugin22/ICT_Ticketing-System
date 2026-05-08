import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During the build process, Next.js pre-renders pages on the server.
// If environment variables are not provided to the build worker, createBrowserClient will throw.
// We use placeholders to allow the build to complete. These will be replaced by actual values 
// if they are present in the environment or .env files during build.
export const supabase = createBrowserClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);