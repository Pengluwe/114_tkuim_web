// ============================================
// API 配置
// ============================================
const BASE_API_URL = 'http://localhost:3002'; 

// ============================================
// 表單元素與狀態
// ============================================

const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const successMessage = document.getElementById('successMessage');
const interestTags = document.getElementById('interestTags');
const interestCount = document.getElementById('interestCount');
const viewListBtn = document.getElementById('viewListBtn'); // 新增查看清單按鈕
const listDisplay = document.getElementById('listDisplay'); // 新增清單顯示區

// 服務條款視窗元素
const termsModal = document.getElementById('termsModal');
const openTermsModal = document.getElementById('openTermsModal');
const closeModal = document.getElementById('closeModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const agreeTermsBtn = document.getElementById('agreeTermsBtn');
const termsCheckbox = document.getElementById('terms');

let isSubmitting = false;
let hasBlurred = {}; // 記錄欄位是否已失焦過

// ============================================
// 自訂驗證規則
// ============================================

const validators = {
    name: (input) => {
        if (!input.value.trim()) {
            input.setCustomValidity('這是必填欄位');
            return false;
        }
        input.setCustomValidity('');
        return true;
    },
    
    email: (input) => {
        if (!input.value.trim()) {
            input.setCustomValidity('這是必填欄位');
            return false;
        }
        if (!input.checkValidity()) {
            input.setCustomValidity('必須輸入有效的Email格式');
            return false;
        }
        input.setCustomValidity('');
        return true;
    },
    
    phone: (input) => {
        if (!input.value.trim()) {
            input.setCustomValidity('這是必填欄位');
            return false;
        }
        // 後端要求 09 開頭 10 碼，前端也應該符合
        if (!/^09[0-9]{8}$/.test(input.value)) { 
            input.setCustomValidity('手機需為 09 開頭 10 碼');
            return false;
        }
        input.setCustomValidity('');
        return true;
    },
    
    password: (input) => {
        if (!input.value) {
            input.setCustomValidity('這是必填欄位');
            return false;
        }
        if (input.value.length < 8) {
            input.setCustomValidity('密碼至少需要8碼');
            return false;
        }
        const hasLetter = /[a-zA-Z]/.test(input.value);
        const hasNumber = /[0-9]/.test(input.value);
        if (!hasLetter || !hasNumber) {
            input.setCustomValidity('密碼需包含英文與數字');
            return false;
        }
        input.setCustomValidity('');
        return true;
    },
    
    confirmPassword: (input) => {
        const password = document.getElementById('password').value;
        if (!input.value) {
            input.setCustomValidity('這是必填欄位');
            return false;
        }
        if (input.value !== password) {
            input.setCustomValidity('兩次輸入的密碼不一致');
            return false;
        }
        input.setCustomValidity('');
        return true;
    },
    
    terms: (input) => {
        if (!input.checked) {
            input.setCustomValidity('請勾選服務條款');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }
};

// ============================================
// 錯誤處理與表單狀態更新函數
// ============================================

function validateField(input) {
    const validator = validators[input.name];
    if (validator) {
        validator(input);
    }
    
    const isValid = input.checkValidity();
    const errorElement = document.getElementById(`${input.id}-error`);
    
    if (!isValid) {
        showError(input, errorElement, input.validationMessage);
    } else {
        clearError(input, errorElement);
    }
    
    return isValid;
}


function showError(input, errorElement, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    input.setAttribute('aria-invalid', 'true');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(input, errorElement) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    input.setAttribute('aria-invalid', 'false');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function validateInterests() {
    const checkboxes = interestTags.querySelectorAll('input[name="interests"]');
    const checked = Array.from(checkboxes).some(cb => cb.checked);
    const errorElement = document.getElementById('interests-error');
    
    if (!checked) {
        errorElement.textContent = '請至少選擇一個興趣';
        errorElement.style.display = 'block';
        interestTags.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        interestTags.setAttribute('aria-invalid', 'false');
        return true;
    }
}

function updateInterestCount() {
    const checkboxes = interestTags.querySelectorAll('input[name="interests"]:checked');
    const count = checkboxes.length;
    interestCount.textContent = count;
    
    // 更新標籤樣式
    const allLabels = interestTags.querySelectorAll('.tag');
    allLabels.forEach(label => {
        const checkbox = label.querySelector('input');
        if (checkbox.checked) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

function resetFormState(inputs) {
    updateInterestCount();
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        input.removeAttribute('aria-invalid');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    });
    
    const interestsError = document.getElementById('interests-error');
    interestsError.textContent = '';
    interestsError.style.display = 'none';
    
    hasBlurred = {};
}

// ============================================
// 事件監聽 (Event Listeners)
// ============================================

// 興趣標籤變更事件
interestTags.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && e.target.name === 'interests') {
        updateInterestCount();
        
        if (hasBlurred['interests']) {
            validateInterests();
        }
    }
});


// 輸入事件 (即時驗證)
form.addEventListener('input', (e) => {
    const input = e.target;
    
    
    if (hasBlurred[input.name] && validators[input.name]) {
        validateField(input);
    }
    
    // 當密碼欄位變更時，觸發確認密碼欄位的驗證
    if (input.name === 'password') {
        const confirmPassword = document.getElementById('confirmPassword');
        if (hasBlurred['confirmPassword'] && confirmPassword.value) {
            validateField(confirmPassword);
        }
    }
});

// 失焦事件 (初次驗證)
form.addEventListener('blur', (e) => {
    const input = e.target;
    
    if (input.tagName === 'INPUT' && validators[input.name]) {
        hasBlurred[input.name] = true;
        validateField(input);
    }
}, true); 

interestTags.addEventListener('blur', (e) => {
    if (e.target.type === 'checkbox') {
        hasBlurred['interests'] = true;
        validateInterests();
    }
}, true);


// 表單送出事件 (使用 fetch 呼叫 API)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
        return;
    }
    
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    // 執行所有欄位驗證
    inputs.forEach(input => {
        hasBlurred[input.name] = true; 
        if (!validateField(input)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        }
    });
    
    if (!validateInterests()) {
        isValid = false;
        if (!firstInvalidField) {
            firstInvalidField = interestTags.querySelector('input');
        }
    }
    
    // 驗證失敗處理
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // 鎖定按鈕並顯示載入中狀態
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '處理中...';
    submitBtn.querySelector('.loading').style.display = 'inline-block';
    
    // 收集表單資料
    const formData = new FormData(form);
    const data = {};
    
    // 1. 處理所有標準欄位
    formData.forEach((value, key) => {
        // 關鍵修正：不再排除 'confirmPassword'。
        // 只排除 interests 和 terms (因為需要特殊處理)
        if (key !== 'interests' && key !== 'terms') { 
            data[key] = value;
        }
    });
    
    // 2. 處理 interests 陣列
    const interests = [];
    form.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
        interests.push(cb.value);
    });
    data.interests = interests;
    
    // 3. 關鍵修正：明確設置 terms 的布林值 (true/false)
    data.terms = termsCheckbox.checked; 
    
    try {
        // 第 345 行：POST 請求已修正為使用 BASE_API_URL
        const response = await fetch(`${BASE_API_URL}/api/signup`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // 檢查回應是否為 JSON 類型
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (response.ok) { // 狀態碼 200-299 視為成功
            // 成功處理
            successMessage.textContent = result.message || '註冊成功！';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            form.reset();
            resetFormState(inputs);
            
        } else {
            // 錯誤處理 (API 回傳的錯誤訊息)
            const errorMessage = result.error || result.message || '註冊失敗，請檢查資料或稍後再試。';
            // 使用自定義的 modal/div 顯示錯誤，這裡暫時用 alert (注意：alert 應替換為自定義 UI)
            alert(errorMessage); 
        }
        
    } catch (error) {
        console.error('Fetch 錯誤:', error);
        // 顯示通用錯誤訊息
        alert('網路連線或伺服器錯誤，請稍後再試。');
    } finally {
        // 恢復按鈕狀態
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = '註冊';
        submitBtn.querySelector('.loading').style.display = 'none';
        
        // 延遲後隱藏成功訊息
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
});


// 重設按鈕事件
resetBtn.addEventListener('click', () => {
    const inputs = form.querySelectorAll('input');
    resetFormState(inputs);
    
    // 額外處理 reset 按鈕邏輯
    successMessage.style.display = 'none';
});

// ============================================
// 清單查看功能實作 (GET /api/signup)
// ============================================

viewListBtn.addEventListener('click', async () => {
    viewListBtn.disabled = true;
    viewListBtn.textContent = '載入中...';
    listDisplay.textContent = '正在從伺服器取得資料...';

    try {
        // 第 408 行：GET 請求已修正為使用 BASE_API_URL
        const response = await fetch(`${BASE_API_URL}/api/signup`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.ok) {
            // 成功取得清單
            const formattedList = result.data.map(p => ({
                姓名: p.name,
                Email: p.email,
                興趣: p.interests.join(', ')
            }));

            listDisplay.innerHTML = `
                <h3>目前報名人數：${result.total}</h3>
                <pre>${JSON.stringify(formattedList, null, 2)}</pre>
            `;
            listDisplay.style.backgroundColor = '#e6ffed';
            listDisplay.style.padding = '1rem';

        } else {
            // 處理 GET 請求錯誤 (例如 500)
            const errorMessage = result.error || result.message || '無法取得清單資料。';
            listDisplay.textContent = `取得清單失敗：${errorMessage}`;
            listDisplay.style.backgroundColor = '#ffe6e6';
        }

    } catch (error) {
        console.error('Fetch 清單錯誤:', error);
        listDisplay.textContent = '連線錯誤，請檢查伺服器是否運行。';
        listDisplay.style.backgroundColor = '#ffe6e6';
    } finally {
        viewListBtn.disabled = false;
        viewListBtn.textContent = '查看報名清單';
    }
});


// ============================================
// 服務條款彈出視窗 (Modal) 邏輯
// ============================================

function closeTermsModal() {
    termsModal.style.display = 'none';
    document.body.style.overflow = '';
    openTermsModal.focus(); 
}

openTermsModal.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    closeModal.focus(); 
});

closeModal.addEventListener('click', closeTermsModal);

closeModalBtn.addEventListener('click', closeTermsModal);

modalOverlay.addEventListener('click', closeTermsModal);

agreeTermsBtn.addEventListener('click', () => {
    termsCheckbox.checked = true;
    // 如果使用者已經失焦過 terms 欄位，則立即驗證
    if (hasBlurred['terms']) {
        validateField(termsCheckbox);
    }
    closeTermsModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal.style.display === 'flex') {
        closeTermsModal();
    }
});

// 初始化時更新興趣計數
updateInterestCount();