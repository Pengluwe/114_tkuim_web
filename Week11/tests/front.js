/**
 * 前端 API 自動測試腳本
 * 用法：
 * 1. 在 index.html 中引入此檔案：<script src="frontend_test.js"></script>
 * 2. 或直接將內容貼到瀏覽器 F12 Console 執行
 */

const TEST_CONFIG = {
    BASE_URL: 'http://localhost:3002',
    ENDPOINTS: {
        HEALTH: '/health',
        SIGNUP: '/api/signup'
    }
};

const runSuite = async () => {
    console.log("%c 🚀 開始執行 API 連線測試...", "color: #fff; background: #2196f3; padding: 5px; border-radius: 3px;");

    // --- 測試 1: 健康檢查 ---
    try {
        console.group("測試 1: 後端健康檢查 (GET /health)");
        const res = await fetch(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ENDPOINTS.HEALTH}`);
        const data = await res.json();
        if (res.ok) {
            console.log("✅ 後端在線！回應：", data);
        } else {
            throw new Error(`伺服器回應錯誤: ${res.status}`);
        }
        console.groupEnd();
    } catch (err) {
        console.error("❌ 測試 1 失敗:", err.message);
        console.groupEnd();
        return; // 若健康檢查失敗，後續測試通常也會失敗
    }

    // --- 測試 2: 模擬註冊 (POST /api/signup) ---
    try {
        console.group("測試 2: 模擬新使用者註冊 (POST)");
        const mockUser = {
            name: "測試機器人",
            email: `test_${Date.now()}@example.com`, // 確保 Email 不重複
            password: "TestPassword123",
            phone: "0912345678",
            interests: ["躺平", "滑手機"],
            terms: true
        };

        const res = await fetch(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ENDPOINTS.SIGNUP}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockUser)
        });

        const data = await res.json();
        if (res.status === 201) {
            console.log("✅ 註冊測試成功！", data);
        } else {
            console.warn("⚠️ 註冊測試未如預期成功:", data.message);
        }
        console.groupEnd();
    } catch (err) {
        console.error("❌ 測試 2 發生錯誤:", err);
        console.groupEnd();
    }

    // --- 測試 3: 獲取報名清單 (GET /api/signup) ---
    try {
        console.group("測試 3: 獲取報名清單 (GET)");
        const res = await fetch(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ENDPOINTS.SIGNUP}`);
        const data = await res.json();
        console.log(`✅ 成功獲取清單！目前總人數: ${data.totalCount}`);
        console.table(data.list); // 使用 table 顯示清單更清楚
        console.groupEnd();
    } catch (err) {
        console.error("❌ 測試 3 失敗:", err);
        console.groupEnd();
    }

    console.log("%c 🏁 測試流程執行完畢 ", "color: #fff; background: #4caf50; padding: 5px; border-radius: 3px;");
};

// 暴露到全域，方便在 Console 呼叫
window.runApiTest = runSuite;

// 預設執行一次 (可視需求註解掉)
// runSuite();