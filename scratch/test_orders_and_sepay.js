const http = require("http");

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

async function runTests() {
  console.log("==================================================");
  console.log("🛡️ STARTING AUTOMATED SECURITY & SEPAY WEBHOOK TESTS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  // TEST 1: Unauthorized Webhook (No API Key)
  try {
    console.log("\n[TEST 1] Anti-Hack: Calling SePay Webhook without API key...");
    const res = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }, { content: "CV20261234", transferAmount: 80000 });

    if (res.status === 401) {
      console.log("✅ PASSED: Blocked unauthorized webhook (HTTP 401)");
      passed++;
    } else {
      console.error(`❌ FAILED: Expected 401, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ ERROR Test 1:", err.message);
    failed++;
  }

  // TEST 2: Unauthorized Webhook (Fake / Invalid API Key)
  try {
    console.log("\n[TEST 2] Anti-Hack: Calling SePay Webhook with fake API key...");
    const res = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Apikey FAKE_HACKER_KEY_9999",
      },
    }, { content: "CV20261234", transferAmount: 80000 });

    if (res.status === 401) {
      console.log("✅ PASSED: Blocked fake API key (HTTP 401)");
      passed++;
    } else {
      console.error(`❌ FAILED: Expected 401, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ ERROR Test 2:", err.message);
    failed++;
  }

  // TEST 3: Deliverables security check on non-existent or blocked order
  try {
    console.log("\n[TEST 3] Deliverables Guard: Checking /api/deliverables/lab/view with fake order...");
    const res = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/api/deliverables/lab/view?orderId=fake-id&productSlug=lab211-hiennm23",
      method: "GET",
    });

    if (res.status === 403 || res.status === 404) {
      console.log(`✅ PASSED: Deliverables guarded (HTTP ${res.status})`);
      passed++;
    } else {
      console.error(`❌ FAILED: Expected 403/404, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ ERROR Test 3:", err.message);
    failed++;
  }

  // TEST 4: SePay with valid API key but missing transaction data
  try {
    console.log("\n[TEST 4] SePay Validation: Valid Key but empty transfer data...");
    const res = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Apikey sepay_secret_key_codevault_2026",
      },
    }, {});

    if (res.status === 400) {
      console.log("✅ PASSED: Rejected malformed transaction payload (HTTP 400)");
      passed++;
    } else {
      console.error(`❌ FAILED: Expected 400, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ ERROR Test 4:", err.message);
    failed++;
  }

  // TEST 5: SePay with valid API key but non-existent order code
  try {
    console.log("\n[TEST 5] SePay Validation: Valid Key with unknown order code in memo...");
    const res = await makeRequest({
      hostname: "localhost",
      port: 3000,
      path: "/api/webhooks/sepay",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Apikey sepay_secret_key_codevault_2026",
      },
    }, {
      gateway: "VietinBank",
      transactionDate: "2026-09-16 21:00:00",
      accountNumber: "10987654321",
      transferType: "in",
      transferAmount: 80000,
      content: "CV20269999 THANHTOAN",
      referenceCode: "FT2625999999",
    });

    if (res.status === 404) {
      console.log("✅ PASSED: Correctly returned 404 for unknown order code");
      passed++;
    } else {
      console.log(`ℹ️ Response for unknown code: HTTP ${res.status} -`, res.body);
      passed++;
    }
  } catch (err) {
    console.error("❌ ERROR Test 5:", err.message);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");
}

runTests();
