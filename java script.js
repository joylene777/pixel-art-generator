{\rtf1\ansi\ansicpg936\cocoartf2757
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener('DOMContentLoaded', function() \{\
    // DOM\uc0\u20803 \u32032 \
    const dropArea = document.getElementById('dropArea');\
    const fileInput = document.getElementById('fileInput');\
    const uploadBtn = document.getElementById('uploadBtn');\
    const originalPreview = document.getElementById('originalPreview');\
    const pixelSize = document.getElementById('pixelSize');\
    const pixelSizeValue = document.getElementById('pixelSizeValue');\
    const generateBtn = document.getElementById('generateBtn');\
    const resultPreview = document.getElementById('resultPreview');\
    const downloadBtn = document.getElementById('downloadBtn');\
    const shareBtn = document.getElementById('shareBtn');\
    const resetBtn = document.getElementById('resetBtn');\
    const colorMode = document.getElementById('colorMode');\
    const borderSwitch = document.getElementById('border');\
    const shareModal = document.getElementById('shareModal');\
    const shareLink = document.getElementById('shareLink');\
    const copyLinkBtn = document.getElementById('copyLinkBtn');\
    const closeBtn = document.querySelector('.close-btn');\
    const loader = document.getElementById('loader');\
    \
    // \uc0\u20840 \u23616 \u21464 \u37327 \
    let originalImage = null;\
    let pixelArtImage = null;\
    \
    // \uc0\u20107 \u20214 \u30417 \u21548 \u22120 \
    uploadBtn.addEventListener('click', () => fileInput.click());\
    fileInput.addEventListener('change', handleFileSelect);\
    \
    // \uc0\u25302 \u25918 \u21151 \u33021 \
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => \{\
        dropArea.addEventListener(eventName, preventDefaults, false);\
    \});\
    \
    ['dragenter', 'dragover'].forEach(eventName => \{\
        dropArea.addEventListener(eventName, highlight, false);\
    \});\
    \
    ['dragleave', 'drop'].forEach(eventName => \{\
        dropArea.addEventListener(eventName, unhighlight, false);\
    \});\
    \
    dropArea.addEventListener('drop', handleDrop, false);\
    \
    // \uc0\u20687 \u32032 \u22823 \u23567 \u28369 \u22359 \
    pixelSize.addEventListener('input', function() \{\
        pixelSizeValue.textContent = this.value;\
    \});\
    \
    // \uc0\u29983 \u25104 \u25353 \u38062 \
    generateBtn.addEventListener('click', generatePixelArt);\
    \
    // \uc0\u19979 \u36733 \u25353 \u38062 \
    downloadBtn.addEventListener('click', downloadImage);\
    \
    // \uc0\u20998 \u20139 \u25353 \u38062 \
    shareBtn.addEventListener('click', showShareModal);\
    \
    // \uc0\u37325 \u32622 \u25353 \u38062 \
    resetBtn.addEventListener('click', resetApp);\
    \
    // \uc0\u22797 \u21046 \u38142 \u25509 \u25353 \u38062 \
    copyLinkBtn.addEventListener('click', copyShareLink);\
    \
    // \uc0\u20851 \u38381 \u27169 \u24577 \u26694 \
    closeBtn.addEventListener('click', closeShareModal);\
    \
    // \uc0\u28857 \u20987 \u27169 \u24577 \u26694 \u22806 \u37096 \u20851 \u38381 \
    window.addEventListener('click', function(event) \{\
        if (event.target === shareModal) \{\
            closeShareModal();\
        \}\
    \});\
    \
    // \uc0\u38459 \u27490 \u40664 \u35748 \u34892 \u20026 \
    function preventDefaults(e) \{\
        e.preventDefault();\
        e.stopPropagation();\
    \}\
    \
    // \uc0\u39640 \u20142 \u25302 \u25918 \u21306 \u22495 \
    function highlight() \{\
        dropArea.classList.add('dragover');\
    \}\
    \
    // \uc0\u21462 \u28040 \u39640 \u20142 \u25302 \u25918 \u21306 \u22495 \
    function unhighlight() \{\
        dropArea.classList.remove('dragover');\
    \}\
    \
    // \uc0\u22788 \u29702 \u25302 \u25918 \u25991 \u20214 \
    function handleDrop(e) \{\
        const dt = e.dataTransfer;\
        const files = dt.files;\
        \
        if (files.length) \{\
            handleFiles(files[0]);\
        \}\
    \}\
    \
    // \uc0\u22788 \u29702 \u25991 \u20214 \u36873 \u25321 \
    function handleFileSelect(e) \{\
        const file = e.target.files[0];\
        handleFiles(file);\
    \}\
    \
    // \uc0\u22788 \u29702 \u25991 \u20214 \
    function handleFiles(file) \{\
        if (!file.type.match('image.*')) \{\
            alert('\uc0\u35831 \u36873 \u25321 \u22270 \u29255 \u25991 \u20214 \u65281 ');\
            return;\
        \}\
        \
        const reader = new FileReader();\
        \
        reader.onload = function(e) \{\
            originalImage = new Image();\
            originalImage.src = e.target.result;\
            \
            originalImage.onload = function() \{\
                // \uc0\u26174 \u31034 \u39044 \u35272 \
                originalPreview.innerHTML = '';\
                const img = document.createElement('img');\
                img.src = e.target.result;\
                originalPreview.appendChild(img);\
                \
                // \uc0\u21551 \u29992 \u29983 \u25104 \u25353 \u38062 \
                generateBtn.disabled = false;\
            \};\
        \};\
        \
        reader.readAsDataURL(file);\
    \}\
    \
    // \uc0\u29983 \u25104 \u20687 \u32032 \u33402 \u26415 \
    function generatePixelArt() \{\
        if (!originalImage) \{\
            alert('\uc0\u35831 \u20808 \u19978 \u20256 \u22270 \u29255 \u65281 ');\
            return;\
        \}\
        \
        // \uc0\u26174 \u31034 \u21152 \u36733 \u22120 \
        loader.style.display = 'flex';\
        \
        // \uc0\u20351 \u29992 setTimeout\u35753 UI\u26377 \u26426 \u20250 \u26356 \u26032 \
        setTimeout(() => \{\
            try \{\
                const pixelSizeValue = parseInt(pixelSize.value);\
                const canvas = document.createElement('canvas');\
                const ctx = canvas.getContext('2d');\
                \
                // \uc0\u35774 \u32622 \u30011 \u24067 \u23610 \u23544 \
                const maxSize = 800;\
                let width = originalImage.width;\
                let height = originalImage.height;\
                \
                // \uc0\u38480 \u21046 \u26368 \u22823 \u23610 \u23544 \
                if (width > maxSize || height > maxSize) \{\
                    const ratio = Math.min(maxSize / width, maxSize / height);\
                    width = Math.floor(width * ratio);\
                    height = Math.floor(height * ratio);\
                \}\
                \
                canvas.width = width;\
                canvas.height = height;\
                \
                // \uc0\u32472 \u21046 \u21407 \u22987 \u22270 \u20687 \
                ctx.drawImage(originalImage, 0, 0, width, height);\
                \
                // \uc0\u33719 \u21462 \u22270 \u20687 \u25968 \u25454 \
                const imageData = ctx.getImageData(0, 0, width, height);\
                const data = imageData.data;\
                \
                // \uc0\u35745 \u31639 \u32553 \u23567 \u21518 \u30340 \u23610 \u23544 \
                const smallWidth = Math.floor(width / pixelSizeValue);\
                const smallHeight = Math.floor(height / pixelSizeValue);\
                \
                // \uc0\u21019 \u24314 \u20020 \u26102 \u30011 \u24067 \u29992 \u20110 \u32553 \u23567 \u22270 \u20687 \
                const tempCanvas = document.createElement('canvas');\
                const tempCtx = tempCanvas.getContext('2d');\
                tempCanvas.width = smallWidth;\
                tempCanvas.height = smallHeight;\
                \
                // \uc0\u32472 \u21046 \u32553 \u23567 \u22270 \u20687 \u65288 \u20351 \u29992 imageSmoothingEnabled\u31105 \u29992 \u24179 \u28369 \u65289 \
                tempCtx.imageSmoothingEnabled = false;\
                tempCtx.drawImage(canvas, 0, 0, smallWidth, smallHeight);\
                \
                // \uc0\u33719 \u21462 \u32553 \u23567 \u21518 \u30340 \u22270 \u20687 \u25968 \u25454 \
                const smallImageData = tempCtx.getImageData(0, 0, smallWidth, smallHeight);\
                const smallData = smallImageData.data;\
                \
                // \uc0\u24212 \u29992 \u39068 \u33394 \u27169 \u24335 \
                applyColorMode(smallData, smallWidth, smallHeight);\
                \
                // \uc0\u23558 \u22788 \u29702 \u21518 \u30340 \u25968 \u25454 \u25918 \u22238 \u20020 \u26102 \u30011 \u24067 \
                tempCtx.putImageData(smallImageData, 0, 0);\
                \
                // \uc0\u25918 \u22823 \u22270 \u20687 \u22238 \u21407 \u22987 \u23610 \u23544 \
                ctx.imageSmoothingEnabled = false;\
                ctx.clearRect(0, 0, width, height);\
                ctx.drawImage(tempCanvas, 0, 0, width, height);\
                \
                // \uc0\u28155 \u21152 \u36793 \u26694 \
                if (borderSwitch.checked) \{\
                    ctx.strokeStyle = '#ffffff';\
                    ctx.lineWidth = 2;\
                    ctx.strokeRect(0, 0, width, height);\
                \}\
                \
                // \uc0\u33719 \u21462 \u20687 \u32032 \u33402 \u26415 \u25968 \u25454 URL\
                pixelArtImage = canvas.toDataURL('image/png');\
                \
                // \uc0\u26174 \u31034 \u32467 \u26524 \
                resultPreview.innerHTML = '';\
                const resultImg = document.createElement('img');\
                resultImg.src = pixelArtImage;\
                resultPreview.appendChild(resultImg);\
                \
                // \uc0\u21551 \u29992 \u19979 \u36733 \u21644 \u20998 \u20139 \u25353 \u38062 \
                downloadBtn.disabled = false;\
                shareBtn.disabled = false;\
                \
                // \uc0\u38544 \u34255 \u21152 \u36733 \u22120 \
                loader.style.display = 'none';\
                \
            \} catch (error) \{\
                console.error('\uc0\u29983 \u25104 \u20687 \u32032 \u33402 \u26415 \u26102 \u20986 \u38169 :', error);\
                alert('\uc0\u22788 \u29702 \u22270 \u29255 \u26102 \u20986 \u38169 \u65292 \u35831 \u37325 \u35797 \u65281 ');\
                loader.style.display = 'none';\
            \}\
        \}, 100);\
    \}\
    \
    // \uc0\u24212 \u29992 \u39068 \u33394 \u27169 \u24335 \
    function applyColorMode(data, width, height) \{\
        const mode = colorMode.value;\
        \
        for (let i = 0; i < data.length; i += 4) \{\
            const r = data[i];\
            const g = data[i + 1];\
            const b = data[i + 2];\
            \
            if (mode === 'grayscale') \{\
                // \uc0\u28784 \u24230 \u27169 \u24335 \
                const avg = (r + g + b) / 3;\
                data[i] = data[i + 1] = data[i + 2] = avg;\
            \} else if (mode === 'retro') \{\
                // \uc0\u22797 \u21476 8-bit\u27169 \u24335  - \u20943 \u23569 \u39068 \u33394 \u25968 \u37327 \
                data[i] = Math.floor(r / 32) * 32;\
                data[i + 1] = Math.floor(g / 32) * 32;\
                data[i + 2] = Math.floor(b / 32) * 32;\
            \}\
            // \uc0\u20840 \u24425 \u27169 \u24335 \u19981 \u20570 \u22788 \u29702 \
        \}\
    \}\
    \
    // \uc0\u19979 \u36733 \u22270 \u29255 \
    function downloadImage() \{\
        if (!pixelArtImage) return;\
        \
        const link = document.createElement('a');\
        link.href = pixelArtImage;\
        link.download = 'pixel-art-avatar.png';\
        document.body.appendChild(link);\
        link.click();\
        document.body.removeChild(link);\
    \}\
    \
    // \uc0\u26174 \u31034 \u20998 \u20139 \u27169 \u24577 \u26694 \
    function showShareModal() \{\
        if (!pixelArtImage) return;\
        \
        // \uc0\u21019 \u24314 \u21487 \u20998 \u20139 \u38142 \u25509 \u65288 \u23454 \u38469 \u24212 \u29992 \u20013 \u24212 \u19978 \u20256 \u21040 \u26381 \u21153 \u22120 \u65289 \
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);\
        const fakeUrl = `https://pixel-art-generator.app/share/$\{uniqueId\}`;\
        shareLink.value = fakeUrl;\
        \
        shareModal.style.display = 'flex';\
    \}\
    \
    // \uc0\u20851 \u38381 \u20998 \u20139 \u27169 \u24577 \u26694 \
    function closeShareModal() \{\
        shareModal.style.display = 'none';\
    \}\
    \
    // \uc0\u22797 \u21046 \u20998 \u20139 \u38142 \u25509 \
    function copyShareLink() \{\
        shareLink.select();\
        document.execCommand('copy');\
        \
        // \uc0\u26174 \u31034 \u22797 \u21046 \u25104 \u21151 \u21453 \u39304 \
        const originalText = copyLinkBtn.innerHTML;\
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> \uc0\u24050 \u22797 \u21046 ';\
        \
        setTimeout(() => \{\
            copyLinkBtn.innerHTML = originalText;\
        \}, 2000);\
    \}\
    \
    // \uc0\u37325 \u32622 \u24212 \u29992 \
    function resetApp() \{\
        originalImage = null;\
        pixelArtImage = null;\
        \
        fileInput.value = '';\
        originalPreview.innerHTML = `\
            <div class="placeholder">\
                <i class="fas fa-user"></i>\
                <p>\uc0\u21407 \u22987 \u22270 \u29255 \u39044 \u35272 </p>\
            </div>\
        `;\
        \
        resultPreview.innerHTML = `\
            <div class="placeholder">\
                <i class="fas fa-camera"></i>\
                <p>\uc0\u29983 \u25104 \u32467 \u26524 \u23558 \u26174 \u31034 \u22312 \u36825 \u37324 </p>\
            </div>\
        `;\
        \
        pixelSize.value = 10;\
        pixelSizeValue.textContent = '10';\
        colorMode.value = 'full';\
        borderSwitch.checked = false;\
        \
        generateBtn.disabled = true;\
        downloadBtn.disabled = true;\
        shareBtn.disabled = true;\
    \}\
    \
    // \uc0\u21021 \u22987 \u21270 \u24212 \u29992 \u29366 \u24577 \
    resetApp();\
\});}