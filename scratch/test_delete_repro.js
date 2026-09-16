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

async function testDelete() {
  console.log("1. Finding an existing order in database...");
  const { data: orders } = await supabaseAdmin.from("orders").select("id, order_code, status").limit(1);
  if (!orders || orders.length === 0) {
    console.log("No orders found.");
    return;
  }
  const order = orders[0];
  console.log("Found order:", order.id, order.order_code);

  console.log("\n2. Attempting to delete using ANON client (like the frontend does)...");
  const { data: delAnonData, error: delAnonErr } = await supabaseAnon
    .from("orders")
    .delete()
    .eq("id", order.id)
    .select();

  console.log("Anon delete result - data:", delAnonData, "error:", delAnonErr);

  console.log("\n3. Checking if order still exists in Supabase...");
  const { data: check } = await supabaseAdmin.from("orders").select("id").eq("id", order.id);
  console.log("Order still exists:", check && check.length > 0);
}

testDelete();
