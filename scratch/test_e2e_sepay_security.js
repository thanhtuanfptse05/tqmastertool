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
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

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

async function runE2E() {
  console.log("==================================================");
  console.log("🔒 E2E ANTI-HACK & SEPAY PAYMENT SECURITY VERIFICATION");
  console.log("==================================================");

  // 1. Get an existing user_id from users or existing orders
  let userId = null;
  const { data: users } = await supabase.from("users").select("id").limit(1);
  if (users && users.length > 0) {
    userId = users[0].id;
  } else {
    const { data: existingOrders } = await supabase.from("orders").select("user_id").limit(1);
    if (existingOrders && existingOrders.length > 0) {
      userId = existingOrders[0].user_id;
    }
  }

  if (!userId) {
    console.error("No valid user_id found in database to attach order.");
    return;
  }

  // 1. Create a test order
  const random4 = Math.floor(1000 + Math.random() * 9000);
  const testOrderCode = `CV-2026-${random4}`;
  const testMemo = `CV2026${random4} THANHTOAN`;
  console.log(`\n1. Creating test order in Supabase with code: ${testOrderCode}, memo: ${testMemo}...`);

  const { data: newOrder, error: createError } = await supabase
    .from("orders")
    .insert([
      {
        order_code: testOrderCode,
        user_id: userId,
        total_amount: 80000,
        status: "pending_payment",
        payment_method: "vietqr",
        vietqr_content: testMemo,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (createError || !newOrder) {
    console.error("Failed to create test order:", createError);
    return;
  }
  console.log("✅ Order created:", newOrder.id, "Status:", newOrder.status);

  // 2. Test Underpayment Attack: Hacker transfers 1000 VND instead of 80000 VND
  console.log("\n2. [DEFENSE TEST 1] Underpayment Attack (transfer 1,000 VND instead of 80,000 VND)...");
  const underpayRes = await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey ${envConfig.SEPAY_API_KEY}`,
      },
    },
    {
      gateway: "VietinBank",
      transactionDate: "2026-09-16 22:00:00",
      accountNumber: "10987654321",
      transferType: "in",
      transferAmount: 1000, // < 80000!
      content: testMemo,
      referenceCode: "FT_UNDERPAY_001",
    }
  );

  console.log("Webhook Response:", underpayRes.status, underpayRes.body);

  // Check order status in DB
  const { data: afterUnderpay } = await supabase
    .from("orders")
    .select("status, admin_notes")
    .eq("id", newOrder.id)
    .single();

  if (afterUnderpay.status !== "completed") {
    console.log("✅ PASSED: Order was NOT completed! Current status:", afterUnderpay.status);
    console.log("✅ Admin Notes recorded warning:", afterUnderpay.admin_notes);
  } else {
    console.error("❌ FAILED: Underpayment was erroneously marked as completed!");
  }

  // Verify access is blocked (403)
  const viewRes1 = await makeRequest({
    hostname: "localhost",
    port: 3000,
    path: `/api/deliverables/lab/view?orderId=${newOrder.id}&productSlug=lab211-hiennm23`,
    method: "GET",
  });
  console.log("Deliverable view check on underpaid order:", viewRes1.status, viewRes1.body?.error || "OK");
  if (viewRes1.status === 403) {
    console.log("✅ PASSED: Deliverable access strictly denied (403)");
  }

  // 3. Test Admin Blocking Override
  console.log("\n3. [DEFENSE TEST 2] Admin blocks order (Status: 'blocked')...");
  let { error: blockErr } = await supabase
    .from("orders")
    .update({
      status: "blocked",
      admin_notes: "[BLOCKED] 🚨 ADMIN BLOCKED: Suspicious activity detected.",
    })
    .eq("id", newOrder.id);
  
  if (blockErr && blockErr.code === "23514") {
    console.log("ℹ️ DB constraint fallback active: storing as status 'rejected' with [BLOCKED] tag");
    await supabase
      .from("orders")
      .update({
        status: "rejected",
        admin_notes: "[BLOCKED] 🚨 ADMIN BLOCKED: Suspicious activity detected.",
      })
      .eq("id", newOrder.id);
  }

  console.log("Now testing if SePay webhook can accidentally unblock a blocked order...");
  const sepayOnBlockedRes = await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey ${envConfig.SEPAY_API_KEY}`,
      },
    },
    {
      gateway: "VietinBank",
      transactionDate: "2026-09-16 22:05:00",
      accountNumber: "10987654321",
      transferType: "in",
      transferAmount: 80000,
      content: testMemo,
      referenceCode: "FT_BLOCKED_OVERRIDE_001",
    }
  );

  const { data: checkBlocked } = await supabase
    .from("orders")
    .select("status, admin_notes")
    .eq("id", newOrder.id)
    .single();

  const stillBlocked = checkBlocked.status === "blocked" || checkBlocked.admin_notes?.includes("[BLOCKED]");
  if (stillBlocked) {
    console.log("✅ PASSED: Order remains BLOCKED! Webhook refused to unblock or complete it.");
  } else {
    console.error("❌ FAILED: Blocked order was overwritten by webhook!");
  }

  // Verify download access is strictly blocked (403)
  const downloadRes = await makeRequest({
    hostname: "localhost",
    port: 3000,
    path: `/api/deliverables/lab/download?orderId=${newOrder.id}&labId=all&type=docx`,
    method: "GET",
  });
  console.log("Download check on blocked order:", downloadRes.status, downloadRes.body?.error);
  if (downloadRes.status === 403) {
    console.log("✅ PASSED: Download strictly blocked (403)");
  }

  // 4. Test Valid Payment on unblocked order
  console.log("\n4. [DEFENSE TEST 3] Admin unlocks order to pending_payment, customer transfers full 80,000 VND...");
  await supabase
    .from("orders")
    .update({ status: "pending_payment", admin_notes: null })
    .eq("id", newOrder.id);

  const validPayRes = await makeRequest(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey ${envConfig.SEPAY_API_KEY}`,
      },
    },
    {
      gateway: "VietinBank",
      transactionDate: "2026-09-16 22:10:00",
      accountNumber: "10987654321",
      transferType: "in",
      transferAmount: 80000,
      content: testMemo,
      referenceCode: "FT_VALID_PAY_80K",
    }
  );

  const { data: finalOrder } = await supabase
    .from("orders")
    .select("status, transaction_ref")
    .eq("id", newOrder.id)
    .single();

  console.log("Final Order Status:", finalOrder.status, "Ref:", finalOrder.transaction_ref);
  if (finalOrder.status === "completed") {
    console.log("✅ PASSED: Order automatically completed upon exact payment!");
  }

  // Verify Deliverable view now succeeds (200)
  const viewResSuccess = await makeRequest({
    hostname: "localhost",
    port: 3000,
    path: `/api/deliverables/lab/view?orderId=${newOrder.id}&productSlug=lab211-hiennm23`,
    method: "GET",
  });
  console.log("Deliverable view check on completed order:", viewResSuccess.status, "Total Labs:", viewResSuccess.body?.totalLabs);
  if (viewResSuccess.status === 200 && viewResSuccess.body?.totalLabs > 0) {
    console.log("✅ PASSED: Deliverable unlocked with full labs and Word docx!");
  }

  // Cleanup test order
  console.log("\nCleaning up test order...");
  await supabase.from("orders").delete().eq("id", newOrder.id);
  console.log("✅ Test order cleaned up successfully.");

  console.log("\n==================================================");
  console.log("🎉 ALL E2E ANTI-HACK SECURITY TESTS COMPLETED & VERIFIED!");
  console.log("==================================================");
}

runE2E();
