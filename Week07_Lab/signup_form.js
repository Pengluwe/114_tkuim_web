// ============================================
// 表單驗證與事件委派處理
// ============================================

const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const successMessage = document.getElementById('successMessage');
const interestTags = document.getElementById('interestTags');
const interestCount = document.getElementById('interestCount');

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
        if (!/^[0-9]{10}$/.test(input.value)) {
            input.setCustomValidity('電話號碼須為10碼');
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
// 驗證單個欄位
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

// ============================================
// 顯示/清除錯誤訊息
// ============================================

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

// ============================================
// 驗證興趣標籤（至少選一個）
// ============================================

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

// ============================================
// 更新興趣標籤計數（事件委派）
// ============================================

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

// ============================================
// 事件委派：興趣標籤區塊
// ============================================

interestTags.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && e.target.name === 'interests') {
        updateInterestCount();
        
        // 如果已經有互動過，即時驗證
        if (hasBlurred['interests']) {
            validateInterests();
        }
    }
});

// ============================================
// 表單輸入事件：即時更新
// ============================================

form.addEventListener('input', (e) => {
    const input = e.target;
    
    // 只對已經 blur 過的欄位進行即時驗證
    if (hasBlurred[input.name] && validators[input.name]) {
        validateField(input);
    }
    
    // 密碼變更時，重新驗證確認密碼
    if (input.name === 'password') {
        const confirmPassword = document.getElementById('confirmPassword');
        if (hasBlurred['confirmPassword'] && confirmPassword.value) {
            validateField(confirmPassword);
        }
    }
});

// ============================================
// 失焦事件：啟用驗證
// ============================================

form.addEventListener('blur', (e) => {
    const input = e.target;
    
    if (input.tagName === 'INPUT' && validators[input.name]) {
        hasBlurred[input.name] = true;
        validateField(input);
    }
}, true); // 使用捕獲階段

// 興趣標籤的失焦處理
interestTags.addEventListener('blur', (e) => {
    if (e.target.type === 'checkbox') {
        hasBlurred['interests'] = true;
        validateInterests();
    }
}, true);

// ============================================
// 表單送出處理（防重送 + 聚焦錯誤）
// ============================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 防止重複送出
    if (isSubmitting) {
        return;
    }
    
    // 驗證所有欄位
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    inputs.forEach(input => {
        hasBlurred[input.name] = true; // 標記為已驗證過
        if (!validateField(input)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        }
    });
    
    // 驗證興趣標籤
    if (!validateInterests()) {
        isValid = false;
        if (!firstInvalidField) {
            firstInvalidField = interestTags.querySelector('input');
        }
    }
    
    // 如果有錯誤，聚焦到第一個錯誤欄位
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // 開始送出流程
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '處理中...';
    submitBtn.querySelector('.loading').style.display = 'inline-block';
    
    try {
        // 模擬 API 請求（1 秒）
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 顯示成功訊息
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 重置表單
        form.reset();
        updateInterestCount();
        
        // 清除所有驗證狀態
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.removeAttribute('aria-invalid');
            const errorElement = document.getElementById(`${input.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
        
        // 清除興趣標籤錯誤
        const interestsError = document.getElementById('interests-error');
        interestsError.textContent = '';
        interestsError.style.display = 'none';
        
        // 重置失焦記錄
        hasBlurred = {};
        
        // 3 秒後隱藏成功訊息
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        alert('送出失敗，請稍後再試');
    } finally {
        // 重置按鈕狀態
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = '註冊';
        submitBtn.querySelector('.loading').style.display = 'none';
    }
});

// ============================================
// 重設按鈕處理
// ============================================

resetBtn.addEventListener('click', () => {
    // 清除所有驗證狀態
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        input.removeAttribute('aria-invalid');
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    });
    
    // 清除興趣標籤錯誤和樣式
    const interestsError = document.getElementById('interests-error');
    interestsError.textContent = '';
    interestsError.style.display = 'none';
    interestTags.removeAttribute('aria-invalid');
    
    // 更新興趣計數
    updateInterestCount();
    
    // 重置失焦記錄
    hasBlurred = {};
    
    // 隱藏成功訊息
    successMessage.style.display = 'none';
});

// ============================================
// 服務條款視窗處理
// ============================================

// 開啟視窗
openTermsModal.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 防止背景滾動
    closeModal.focus(); // 聚焦到關閉按鈕
});

// 關閉視窗函式
function closeTermsModal() {
    termsModal.style.display = 'none';
    document.body.style.overflow = ''; // 恢復滾動
    openTermsModal.focus(); // 返回焦點
}

// 關閉按鈕 (X)
closeModal.addEventListener('click', closeTermsModal);

// 關閉按鈕
closeModalBtn.addEventListener('click', closeTermsModal);

// 點擊遮罩關閉
modalOverlay.addEventListener('click', closeTermsModal);

// 同意並關閉按鈕
agreeTermsBtn.addEventListener('click', () => {
    termsCheckbox.checked = true;
    // 觸發驗證
    if (hasBlurred['terms']) {
        validateField(termsCheckbox);
    }
    closeTermsModal();
});

// ESC 鍵關閉
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal.style.display === 'flex') {
        closeTermsModal();
    }
});

// ============================================
// 初始化
// ============================================

// 初始化興趣計數
updateInterestCount();