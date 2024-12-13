$(document).ready(function() {
    const $inputText = $('#inputText');
    const $outputText = $('#outputText');
    const $encryptBtn = $('#encryptBtn');
    const $clearBtn = $('#clearBtn');
    const $copyBtn = $('#copyBtn');

    // MD5加密
    function encryptMD5(text) {
        try {
            return md5(text);
        } catch (e) {
            showError('加密失败：' + e.message);
            return '';
        }
    }

    // 显示错误信息
    function showError(message) {
        $outputText.html(`<span class="error-text">${message}</span>`);
    }

    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            $copyBtn.text('已复制').addClass('copied');
            setTimeout(() => {
                $copyBtn.text('复制').removeClass('copied');
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        }
    }

    // 加密按钮点击事件
    $encryptBtn.click(function() {
        const input = $inputText.val().trim();
        if (!input) {
            showError('请输入需要加密的文本');
            return;
        }
        const encrypted = encryptMD5(input);
        $outputText.text(encrypted);
    });

    // 清空按钮点击事件
    $clearBtn.click(function() {
        $inputText.val('');
        $outputText.text('');
    });

    // 复制按钮点击事件
    $copyBtn.click(function() {
        const output = $outputText.text();
        if (!output) {
            showError('没有可复制的内容');
            return;
        }
        copyToClipboard(output);
    });

    // 输入框快捷键支持
    $inputText.on('keydown', function(e) {
        // Ctrl/Cmd + Enter 触发加密
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
            $encryptBtn.click();
        }
    });

}); 