$(document).ready(function() {
    const $inputText = $('#inputText');
    const $outputText = $('#outputText');
    const $encodeBtn = $('#encodeBtn');
    const $decodeBtn = $('#decodeBtn');
    const $clearBtn = $('#clearBtn');
    const $copyBtn = $('#copyBtn');

    // URL编码
    function encodeURL(text) {
        try {
            // 使用encodeURIComponent可以编码更多的字符
            return encodeURIComponent(text);
        } catch (e) {
            showError('编码失败：' + e.message);
            return '';
        }
    }

    // URL解码
    function decodeURL(text) {
        try {
            return decodeURIComponent(text);
        } catch (e) {
            showError('解码失败：' + e.message);
            return '';
        }
    }

    // 显示错误信息
    function showError(message) {
        $outputText.html(`<span style="color: #dc3545;">${message}</span>`);
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

    // 编码按钮点击事件
    $encodeBtn.click(function() {
        const input = $inputText.val().trim();
        if (!input) {
            showError('请输入需要编码的URL');
            return;
        }
        const encoded = encodeURL(input);
        $outputText.text(encoded);
    });

    // 解码按钮点击事件
    $decodeBtn.click(function() {
        const input = $inputText.val().trim();
        if (!input) {
            showError('请输入需要解码的URL');
            return;
        }
        const decoded = decodeURL(input);
        $outputText.text(decoded);
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
        // Ctrl/Cmd + Enter 触发编码
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
            $encodeBtn.click();
        }
        // Ctrl/Cmd + Shift + Enter 触发解码
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 13) {
            $decodeBtn.click();
        }
    });
}); 