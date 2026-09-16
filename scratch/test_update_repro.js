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
const supabaseAnon = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function testUpdate() {
  const { data: orders } = await supabaseAdmin.from("orders").select("id, order_code, status").limit(1);
  const order = orders[0];
  console.log("Found order:", order.id, order.status);

  console.log("\nAttempting to update status using ANON client...");
  const { data, error } = await supabaseAnon
    .from("orders")
    .update({ admin_notes: "Test update note " + Date.now() })
    .eq("id", order.id)
    .select();

  console.log("Anon update result - data:", data, "error:", error);
}

testUpdate();
