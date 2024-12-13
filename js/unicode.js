$(document).ready(function() {
    const $inputText = $('#inputText');
    const $outputText = $('#outputText');
    const $copyBtn = $('#copyBtn');

    // ASCII转Unicode
    function asciiToUnicode(text) {
        try {
            return text.split('').map(char => {
                const code = char.charCodeAt(0);
                return '\\u' + ('0000' + code.toString(16)).slice(-4);
            }).join('');
        } catch (e) {
            return '转换失败：' + e.message;
        }
    }

    // Unicode转ASCII
    function unicodeToAscii(text) {
        try {
            return text.replace(/\\u[\dA-F]{4}/gi, match => {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } catch (e) {
            return '转换失败：' + e.message;
        }
    }

    // 中文转Unicode
    function chineseToUnicode(text) {
        try {
            return text.split('').map(char => {
                const code = char.charCodeAt(0);
                return '\\u' + ('0000' + code.toString(16)).slice(-4);
            }).join('');
        } catch (e) {
            return '转换失败：' + e.message;
        }
    }

    // Unicode转中文
    function unicodeToChinese(text) {
        try {
            return text.replace(/\\u[\dA-F]{4}/gi, match => {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } catch (e) {
            return '转换失败：' + e.message;
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

    // ASCII转Unicode按钮点击事件
    $('#asciiToUnicode').click(function() {
        const input = $inputText.val();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        const result = asciiToUnicode(input);
        $outputText.text(result);
    });

    // Unicode转ASCII���钮点击事件
    $('#unicodeToAscii').click(function() {
        const input = $inputText.val();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        const result = unicodeToAscii(input);
        $outputText.text(result);
    });

    // 中文转Unicode按钮点击事件
    $('#chineseToUnicode').click(function() {
        const input = $inputText.val();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        const result = chineseToUnicode(input);
        $outputText.text(result);
    });

    // Unicode转中文按钮点击事件
    $('#unicodeToChinese').click(function() {
        const input = $inputText.val();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        const result = unicodeToChinese(input);
        $outputText.text(result);
    });

    // 清空按钮点击事件
    $('#clearBtn').click(function() {
        $inputText.val('');
        $outputText.text('');
    });

    // 复制按钮点击事件
    $('#copyBtn').click(function() {
        const output = $outputText.text();
        if (!output) {
            showError('没有可复制的内容');
            return;
        }
        copyToClipboard(output);
    });

    // 输入框快捷键支持
    $inputText.on('keydown', function(e) {
        // Ctrl/Cmd + Enter 触发中文转Unicode
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
            $('#chineseToUnicode').click();
        }
    });
}); 