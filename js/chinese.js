$(document).ready(function() {
    const $inputText = $('#inputText');
    const $outputText = $('#outputText');

    // 简体转繁体
    $('#simplifiedToTraditional').click(async function() {
        const input = $inputText.val().trim();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        try {
            const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
            const result = await converter(input);
            $outputText.text(result);
        } catch (e) {
            showError('转换失败：' + e.message);
        }
    });

    // 繁体转简体
    $('#traditionalToSimplified').click(async function() {
        const input = $inputText.val().trim();
        if (!input) {
            showError('请输入需要转换的文本');
            return;
        }
        try {
            const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
            const result = await converter(input);
            $outputText.text(result);
        } catch (e) {
            showError('转换失败：' + e.message);
        }
    });

    // 清空按钮点击事件
    $('#clearBtn').click(function() {
        $inputText.val('');
        $outputText.text('');
    });

    // 显示错误信息
    function showError(message) {
        $outputText.html(`<span class="error-text">${message}</span>`);
    }
}); 