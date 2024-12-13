$(document).ready(function() {
    const $inputText = $('#inputText');
    const $outputText = $('#outputText');

    // 自动转换函数
    function convertText() {
        const input = $inputText.val().trim();
        if (!input) {
            $outputText.text('');
            return;
        }
        const pinyinType = $('input[name="pinyinType"]:checked').val();
        const result = pinyinPro.pinyin(input, { toneType: pinyinType === 'initial' ? 'none' : pinyinType, type: pinyinType });
        $outputText.text(result);
    }

    // 输入框事件监听
    $inputText.on('input', convertText);

    // 切换拼音类型时重新转换
    $('input[name="pinyinType"]').change(convertText);

    // 清空按钮点击事件
    $('#clearBtn').click(function() {
        $inputText.val('');
        $outputText.text('');
    });
}); 