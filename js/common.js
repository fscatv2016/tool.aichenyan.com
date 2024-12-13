$(document).ready(function() {
    // 处理移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    // 汉堡菜单点击事件
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // 移动端下拉菜单处理
    function setupMobileMenu() {
        if (window.innerWidth <= 768) {
            // 移除hover事件，改为点击事件
            dropdowns.forEach(dropdown => {
                const dropdownToggle = dropdown.querySelector('.nav-item');
                
                // 移除现有的点击事件（如果有）
                dropdownToggle.removeEventListener('click', handleDropdownClick);
                // 添加新的点击事件
                dropdownToggle.addEventListener('click', handleDropdownClick);
            });
        }
    }

    // 处理下拉菜单点击
    function handleDropdownClick(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;
            
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });

            dropdown.classList.toggle('active');
        }
    }

    // 点击下拉菜单项时关闭菜单
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            navMenu.classList.remove('active');
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    setupMobileMenu();
    window.addEventListener('resize', setupMobileMenu);
}); 