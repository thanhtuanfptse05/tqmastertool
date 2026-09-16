const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

function loadEnv() {
  const envText = fs.readFileSync(".env.local", "utf8");
  const env = {};
  for (const line of envText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const envConfig = loadEnv();
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function testSql() {
  console.log("Testing if RPC exec_sql exists...");
  const { data, error } = await supabase.rpc("exec_sql", {
    query: "ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check; ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending_payment', 'pending_approval', 'completed', 'rejected', 'cancelled', 'blocked'));"
  });

  if (error) {
    console.log("RPC exec_sql error:", error.message);
  } else {
    console.log("Success updating constraint via RPC!", data);
  }
}

testSql();
