document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const passwordList = document.getElementById('passwordList');
    const passwordLength = document.getElementById('passwordLength');
    
    const numbers = '0123456789';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const symbols = '!@#$%^&*';

    function generatePassword(length) {
        let chars = '';
        if (document.getElementById('includeNumbers').checked) chars += numbers;
        if (document.getElementById('includeLowercase').checked) chars += lowercase;
        if (document.getElementById('includeUppercase').checked) chars += uppercase;
        if (document.getElementById('includeSymbols').checked) chars += symbols;

        if (chars === '') chars = numbers + lowercase; // 默认至少使用数字和小写字母

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    function generatePasswords() {
        const length = parseInt(passwordLength.value) || 8;
        passwordList.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const password = generatePassword(length);
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            passwordItem.innerHTML = `
                <span class="password-text">${password}</span>
                <button class="copy-btn" data-password="${password}">复制</button>
            `;
            passwordList.appendChild(passwordItem);
        }
    }

    async function copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            button.textContent = '已复制';
            button.classList.add('copied');
            setTimeout(() => {
                button.textContent = '复制';
                button.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    }

    generateBtn.addEventListener('click', generatePasswords);

    passwordList.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            const password = e.target.dataset.password;
            copyToClipboard(password, e.target);
        }
    });

    // 初始生成密码
    generatePasswords();
}); 