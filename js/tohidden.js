$(document).ready(function() {
    const $carrierText = $('#carrierText');
    const $hiddenText = $('#hiddenText');
    const $outputText = $('#outputText');
    const $decodedText = $('#decodedText');
    
    // 自定义加密密钥
    const SECRET_KEY = 'hZyrD#F#wJ%2stURs*%z';

    // 添加标记符号
    const MARK_START = '『'; // 开始标记
    const MARK_END = '』';   // 结束标记

    // 自定义加密函数
    function customEncrypt(text) {
        // 先进行Base64编码
        const base64 = btoa(unescape(encodeURIComponent(text)));
        // 使用密钥进行简单加密
        let encrypted = '';
        for(let i = 0; i < base64.length; i++) {
            const charCode = base64.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
            encrypted += String.fromCharCode(charCode);
        }
        // 再次进行Base64编码，确保输出是可见字符
        return btoa(encrypted);
    }

    // 将加密内容转换为看似正常的文本
    function convertToNormalText(encrypted) {
        // 将加密内容转换为二进制字符串
        const binary = Array.from(atob(encrypted))
            .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
            .join('');
        
        // 使用零宽字符来隐藏信息
        // 使用零宽空格(&#8203;)表示0，零宽连字符(&#8204;)表示1
        return binary.split('').map(bit => 
            bit === '0' ? '\u200b' : '\u200c'
        ).join('');
    }

    // 从零宽字符还原加密内容
    function extractFromNormalText(text) {
        try {
            // 提取零宽字符并转换回二进制
            const binary = Array.from(text)
                .filter(char => char === '\u200b' || char === '\u200c')
                .map(char => char === '\u200b' ? '0' : '1')
                .join('');

            // 将二进制转换回字符串
            const bytes = new Array(binary.length / 8);
            for (let i = 0; i < binary.length / 8; i++) {
                bytes[i] = parseInt(binary.substr(i * 8, 8), 2);
            }
            return btoa(String.fromCharCode(...bytes));
        } catch (e) {
            return null;
        }
    }

    // 自定义解密函数
    function customDecrypt(text) {
        try {
            // 先进行Base64解码
            const decoded = atob(text);
            // 使用密钥进行解密
            let decrypted = '';
            for(let i = 0; i < decoded.length; i++) {
                const charCode = decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
                decrypted += String.fromCharCode(charCode);
            }
            // 最后解码Base64得到原文
            return decodeURIComponent(escape(atob(decrypted)));
        } catch (e) {
            return null;
        }
    }

    // 生成隐藏信息文本
    $('#generateBtn').click(function() {
        const carrier = $carrierText.val().trim();
        const hidden = $hiddenText.val().trim();
        if (!carrier || !hidden) {
            $decodedText.val('请确保载体文本和隐藏信息都已输入。');
            return;
        }

        // 使用自定义加密函数加密隐藏信息
        const encrypted = customEncrypt(hidden);
        // 将加密内容转换为零宽字符
        const hiddenText = convertToNormalText(encrypted);
        // 在载体文本的末尾添加标记和零宽字符
        const result = carrier + MARK_START + MARK_END + hiddenText;
        $outputText.val(result);
        $decodedText.val('');
    });

    // 解析隐藏信息
    $('#extractBtn').click(function() {
        let text = $outputText.val().trim();
        if (!text) {
            text = $carrierText.val().trim();
        }
        if (!text) {
            $decodedText.val('请在载体文本框或结果框中粘贴包含隐藏信息的文本。');
            return;
        }

        // 检查是否包含标记符号
        if (!text.includes(MARK_START) || !text.includes(MARK_END)) {
            $decodedText.val('未找到隐藏信息标记，请确保文本包含正确格式的隐藏内容。');
            return;
        }

        // 从文本中提取加密内容
        const encrypted = extractFromNormalText(text);
        if (encrypted) {
            const decrypted = customDecrypt(encrypted);
            if (decrypted) {
                $decodedText.val(decrypted);
                // 清空其他输入框，将解析的文本放入载体文本框
                $hiddenText.val('');
                $outputText.val('');
                $carrierText.val(text);
            } else {
                $decodedText.val('解析失败：文本格式不正确或非本工具加密的内容。');
            }
        } else {
            $decodedText.val('未找到隐藏信息，请确保文本包含正确格式的隐藏内容。');
        }
    });

    // 清空所有文本框
    $('#clearBtn').click(function() {
        $carrierText.val('');
        $hiddenText.val('');
        $outputText.val('');
        $decodedText.val('');
    });

    // 添加复制功能
    $outputText.on('click', function() {
        if (this.value) {
            this.select();
            try {
                document.execCommand('copy');
                alert('文本已复制到剪贴板');
            } catch (err) {
                alert('复制失败，请手动复制');
            }
        }
    });
}); 