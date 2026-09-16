const http = require("http");
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
const supabaseAdmin = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTest() {
  console.log("==================================================");
  console.log("🧪 VERIFYING ORDER DELETE & UPDATE PERSISTENCE IN DB");
  console.log("==================================================");

  // 1. Get a valid user_id
  const { data: existingOrders } = await supabaseAdmin.from("orders").select("user_id").limit(1);
  const userId = existingOrders?.[0]?.user_id;

  // 2. Create a test order
  const orderCode = `CV-2026-DEL${Math.floor(1000 + Math.random() * 9000)}`;
  console.log(`\n1. Creating test order: ${orderCode}...`);
  const { data: newOrder, error: createErr } = await supabaseAdmin
    .from("orders")
    .insert([
      {
        order_code: orderCode,
        user_id: userId,
        total_amount: 80000,
        status: "pending_payment",
        payment_method: "vietqr",
        vietqr_content: `${orderCode} THANHTOAN`,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (createErr || !newOrder) {
    console.error("Failed to create test order:", createErr);
    return;
  }
  console.log("Order created in Supabase with ID:", newOrder.id);

  // Insert an item
  await supabaseAdmin.from("order_items").insert([
    {
      order_id: newOrder.id,
      product_id: "prod-test-01",
      unit_price: 80000,
      product_title: "Test Product",
      product_category: "lab211",
    },
  ]);

  // 3. Test PATCH endpoint
  console.log("\n2. Testing PATCH /api/orders (Status update to completed & admin notes)...");
  const patchRes = await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/orders",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    },
    {
      orderId: newOrder.id,
      status: "completed",
      admin_notes: "Admin confirmed payment via PATCH API",
    }
  );
  console.log("PATCH Response status:", patchRes.status, patchRes.body?.message);

  const { data: checkPatch } = await supabaseAdmin
    .from("orders")
    .select("status, admin_notes")
    .eq("id", newOrder.id)
    .single();
  console.log("Supabase order after PATCH - status:", checkPatch.status, "notes:", checkPatch.admin_notes);
  if (checkPatch.status === "completed") {
    console.log("✅ PATCH correctly persisted to Supabase database!");
  } else {
    console.error("❌ PATCH failed to persist!");
  }

  // 4. Test DELETE endpoint
  console.log(`\n3. Testing DELETE /api/orders?orderId=${newOrder.id}...`);
  const delRes = await makeRequest({
    hostname: "localhost",
    port: 3000,
    path: `/api/orders?orderId=${newOrder.id}`,
    method: "DELETE",
  });
  console.log("DELETE Response status:", delRes.status, delRes.body);

  // 5. Check if order is truly deleted in database
  console.log("\n4. Checking Supabase database to verify order is permanently gone...");
  const { data: finalCheck } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("id", newOrder.id);

  if (!finalCheck || finalCheck.length === 0) {
    console.log("✅ SUCCESS: Order is PERMANENTLY DELETED from Supabase! Reloading page will NOT restore it!");
  } else {
    console.error("❌ FAILED: Order is still in database!");
  }

  console.log("\n==================================================");
}

runTest();
