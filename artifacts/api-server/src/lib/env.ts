const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
] as const;

export type ServerEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_ANON_KEY?: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
};

export function getServerEnv(): ServerEnv {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(`${key} environment variable is required but was not provided.`);
    }
  }

  return {
    SUPABASE_URL: process.env["SUPABASE_URL"]!,
    SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    SUPABASE_ANON_KEY: process.env["SUPABASE_ANON_KEY"],
    OPENAI_API_KEY: process.env["OPENAI_API_KEY"]!,
    OPENAI_MODEL: process.env["OPENAI_MODEL"] || "gpt-4.1-mini",
  };
}
