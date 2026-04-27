// 大屏自适应缩放脚本
(function() {
    const DESIGN_WIDTH = 1920;
    const DESIGN_HEIGHT = 1080;

    function updateScale() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 计算缩放比例
        const scaleX = windowWidth / DESIGN_WIDTH;
        const scaleY = windowHeight / DESIGN_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        // 计算居中偏移
        const offsetX = (windowWidth - DESIGN_WIDTH * scale) / 2;
        const offsetY = (windowHeight - DESIGN_HEIGHT * scale) / 2;

        // 应用缩放
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = 'top left';
        document.body.style.position = 'absolute';
        document.body.style.left = `${offsetX}px`;
        document.body.style.top = `${offsetY}px`;
    }

    // 设置html背景色
    document.documentElement.style.background = '#1a1a2e';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';

    // 初始化和监听窗口变化
    window.addEventListener('load', updateScale);
    window.addEventListener('resize', updateScale);
})();
