document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const originalPreview = document.getElementById('originalPreview');
    const pixelSize = document.getElementById('pixelSize');
    const pixelSizeValue = document.getElementById('pixelSizeValue');
    const generateBtn = document.getElementById('generateBtn');
    const resultPreview = document.getElementById('resultPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const resetBtn = document.getElementById('resetBtn');
    const colorMode = document.getElementById('colorMode');
    const borderSwitch = document.getElementById('border');
    const shareModal = document.getElementById('shareModal');
    const shareLink = document.getElementById('shareLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const closeBtn = document.querySelector('.close-btn');
    const loader = document.getElementById('loader');
    
    // 全局变量
    let originalImage = null;
    let pixelArtImage = null;
    
    // 事件监听器
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖放功能
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    // 像素大小滑块
    pixelSize.addEventListener('input', function() {
        pixelSizeValue.textContent = this.value;
    });
    
    // 生成按钮
    generateBtn.addEventListener('click', generatePixelArt);
    
    // 下载按钮
    downloadBtn.addEventListener('click', downloadImage);
    
    // 分享按钮
    shareBtn.addEventListener('click', showShareModal);
    
    // 重置按钮
    resetBtn.addEventListener('click', resetApp);
    
    // 复制链接按钮
    copyLinkBtn.addEventListener('click', copyShareLink);
    
    // 关闭模态框
    closeBtn.addEventListener('click', closeShareModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === shareModal) {
            closeShareModal();
        }
    });
    
    // 阻止默认行为
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 高亮拖放区域
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    // 取消高亮拖放区域
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    // 处理拖放文件
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFiles(files[0]);
        }
    }
    
    // 处理文件选择
    function handleFileSelect(e) {
        const file = e.target.files[0];
        handleFiles(file);
    }
    
    // 处理文件
    function handleFiles(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件！');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.src = e.target.result;
            
            originalImage.onload = function() {
                // 显示预览
                originalPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                originalPreview.appendChild(img);
                
                // 启用生成按钮
                generateBtn.disabled = false;
            };
        };
        
        reader.readAsDataURL(file);
    }
    
    // 生成像素艺术
    function generatePixelArt() {
        if (!originalImage) {
            alert('请先上传图片！');
            return;
        }
        
        // 显示加载器
        loader.style.display = 'flex';
        
        // 使用setTimeout让UI有机会更新
        setTimeout(() => {
            try {
                const pixelSizeValue = parseInt(pixelSize.value);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 设置画布尺寸
                const maxSize = 800;
                let width = originalImage.width;
                let height = originalImage.height;
                
                // 限制最大尺寸
                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // 绘制原始图像
                ctx.drawImage(originalImage, 0, 0, width, height);
                
                // 获取图像数据
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;
                
                // 计算缩小后的尺寸
                const smallWidth = Math.floor(width / pixelSizeValue);
                const smallHeight = Math.floor(height / pixelSizeValue);
                
                // 创建临时画布用于缩小图像
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = smallWidth;
                tempCanvas.height = smallHeight;
                
                // 绘制缩小图像（使用imageSmoothingEnabled禁用平滑）
                tempCtx.imageSmoothingEnabled = false;
                tempCtx.drawImage(canvas, 0, 0, smallWidth, smallHeight);
                
                // 获取缩小后的图像数据
                const smallImageData = tempCtx.getImageData(0, 0, smallWidth, smallHeight);
                const smallData = smallImageData.data;
                
                // 应用颜色模式
                applyColorMode(smallData, smallWidth, smallHeight);
                
                // 将处理后的数据放回临时画布
                tempCtx.putImageData(smallImageData, 0, 0);
                
                // 放大图像回原始尺寸
                ctx.imageSmoothingEnabled = false;
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(tempCanvas, 0, 0, width, height);
                
                // 添加边框
                if (borderSwitch.checked) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(0, 0, width, height);
                }
                
                // 获取像素艺术数据URL
                pixelArtImage = canvas.toDataURL('image/png');
                
                // 显示结果
                resultPreview.innerHTML = '';
                const resultImg = document.createElement('img');
                resultImg.src = pixelArtImage;
                resultPreview.appendChild(resultImg);
                
                // 启用下载和分享按钮
                downloadBtn.disabled = false;
                shareBtn.disabled = false;
                
                // 隐藏加载器
                loader.style.display = 'none';
                
            } catch (error) {
                console.error('生成像素艺术时出错:', error);
                alert('处理图片时出错，请重试！');
                loader.style.display = 'none';
            }
        }, 100);
    }
    
    // 应用颜色模式
    function applyColorMode(data, width, height) {
        const mode = colorMode.value;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (mode === 'grayscale') {
                // 灰度模式
                const avg = (r + g + b) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            } else if (mode === 'retro') {
                // 复古8-bit模式 - 减少颜色数量
                data[i] = Math.floor(r / 32) * 32;
                data[i + 1] = Math.floor(g / 32) * 32;
                data[i + 2] = Math.floor(b / 32) * 32;
            }
            // 全彩模式不做处理
        }
    }
    
    // 下载图片
    function downloadImage() {
        if (!pixelArtImage) return;
        
        const link = document.createElement('a');
        link.href = pixelArtImage;
        link.download = 'pixel-art-avatar.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // 显示分享模态框
    function showShareModal() {
        if (!pixelArtImage) return;
        
        // 创建可分享链接（实际应用中应上传到服务器）
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const fakeUrl = `https://pixel-art-generator.app/share/${uniqueId}`;
        shareLink.value = fakeUrl;
        
        shareModal.style.display = 'flex';
    }
    
    // 关闭分享模态框
    function closeShareModal() {
        shareModal.style.display = 'none';
    }
    
    // 复制分享链接
    function copyShareLink() {
        shareLink.select();
        document.execCommand('copy');
        
        // 显示复制成功反馈
        const originalText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalText;
        }, 2000);
    }
    
    // 重置应用
    function resetApp() {
        originalImage = null;
        pixelArtImage = null;
        
        fileInput.value = '';
        originalPreview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-user"></i>
                <p>原始图片预览</p>
            </div>
        `;
        
        resultPreview.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-camera"></i>
                <p>生成结果将显示在这里</p>
            </div>
        `;
        
        pixelSize.value = 10;
        pixelSizeValue.textContent = '10';
        colorMode.value = 'full';
        borderSwitch.checked = false;
        
        generateBtn.disabled = true;
        downloadBtn.disabled = true;
        shareBtn.disabled = true;
    }
    
    // 初始化应用状态
    resetApp();
});
