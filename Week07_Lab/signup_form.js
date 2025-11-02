

const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const interestTags = document.getElementById('interestTags');
const interestCount = document.getElementById('interestCount');
const privacyCheckbox = document.getElementById('privacy'); 

let isSubmitting = false;
let hasBlurred = {}; 

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


interestTags.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox' && e.target.name === 'interests') {
        updateInterestCount();
        
        
        if (hasBlurred['interests']) {
            validateInterests();
        }
    }
});


form.addEventListener('input', (e) => {
    const input = e.target;
   
    if (hasBlurred[input.name] && validators[input.name]) {
        validateField(input);
    }
    
    if (input.name === 'password') {
        const confirmPassword = document.getElementById('confirmPassword');
        if (hasBlurred['confirmPassword'] && confirmPassword.value) {
            validateField(confirmPassword);
        }
    }
});


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


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
        return;
    }
    
 
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalidField = null;
    
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
    
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '處理中...';
    submitBtn.querySelector('.loading').style.display = 'inline-block';
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        form.reset();
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
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        alert('送出失敗，請稍後再試');
    } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = '註冊';
        submitBtn.querySelector('.loading').style.display = 'none';
    }
});

updateInterestCount();