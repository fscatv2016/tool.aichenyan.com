document.addEventListener('DOMContentLoaded', function() {
    const newTaskInput = document.getElementById('newTask');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const totalTasks = document.getElementById('totalTasks');
    const allCount = document.getElementById('allCount');
    const activeCount = document.getElementById('activeCount');
    const completedCount = document.getElementById('completedCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const saveAsBtn = document.getElementById('saveAsBtn');
    const loadHistoryBtn = document.getElementById('loadHistoryBtn');
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    const closeModalBtns = document.querySelectorAll('.close-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    const STORAGE_PREFIX = 'todolist_';

    // 初始化
    function init() {
        renderTasks();
        updateTaskCount();
    }

    // 保存到本地存储
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCount();
    }

    // 添加新任务
    function addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            date: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        tasks.unshift(task);
        saveTasks();
        renderTasks();
    }

    // 删除任务
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // 切换任务状态
    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            task.lastModified = new Date().toISOString();
            saveTasks();
            renderTasks();
        }
    }

    // 编辑任务
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newText = prompt('编辑任务', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                task.lastModified = new Date().toISOString();
                saveTasks();
                renderTasks();
            }
        }
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 更新任务计数
    function updateTaskCount() {
        const total = tasks.length;
        const active = tasks.filter(task => !task.completed).length;
        const completed = total - active;

        totalTasks.textContent = total;
        allCount.textContent = total;
        activeCount.textContent = active;
        completedCount.textContent = completed;
    }

    // 渲染任务列表
    function renderTasks() {
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}>
                <div class="task-content ${task.completed ? 'completed' : ''}">
                    ${task.text}
                    <div class="task-date">
                        <span class="status-tag ${task.completed ? 'completed' : 'active'}">
                            ${task.completed ? '已完成' : '进行中'}
                        </span>
                        创建: ${formatDate(task.date)}
                        ${task.lastModified !== task.date ? 
                            `<br>修改: ${formatDate(task.lastModified)}` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn">编辑</button>
                    <button class="delete-btn">删除</button>
                </div>
            </div>
        `).join('');
    }

    // 保存存档
    function saveArchive() {
        const date = new Date();
        const archiveName = `${STORAGE_PREFIX}${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
        
        const archive = {
            date: date.toISOString(),
            tasks: tasks,
            stats: {
                total: tasks.length,
                completed: tasks.filter(task => task.completed).length,
                active: tasks.filter(task => !task.completed).length
            }
        };

        localStorage.setItem(archiveName, JSON.stringify(archive));
        alert('存档已保存');
    }

    // 获取所有存档
    function getAllArchives() {
        const archives = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(STORAGE_PREFIX)) {
                try {
                    const archive = JSON.parse(localStorage.getItem(key));
                    archives.push({
                        key: key,
                        ...archive
                    });
                } catch (e) {
                    console.error('读取存档出错:', e);
                }
            }
        }
        return archives.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // 加载存档
    function loadArchive(key) {
        try {
            const archive = JSON.parse(localStorage.getItem(key));
            if (archive && archive.tasks) {
                tasks = archive.tasks;
                saveTasks();
                renderTasks();
                historyModal.style.display = 'none';
                alert('存档已加载');
            }
        } catch (e) {
            console.error('加载存档失败:', e);
            alert('加载存档失败');
        }
    }

    // 删除存档
    function deleteArchive(key) {
        if (confirm('确定要���除这个存档吗？')) {
            localStorage.removeItem(key);
            renderHistoryList();
        }
    }

    // 渲染历史记录列表
    function renderHistoryList() {
        const archives = getAllArchives();
        historyList.innerHTML = archives.map(archive => `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-date">
                        ${new Date(archive.date).toLocaleString('zh-CN')}
                    </div>
                    <div class="history-stats">
                        总计: ${archive.stats.total} | 
                        已完成: ${archive.stats.completed} | 
                        未完成: ${archive.stats.active}
                    </div>
                </div>
                <div class="history-actions">
                    <button class="btn load-btn" data-key="${archive.key}">加载</button>
                    <button class="btn delete-history-btn" data-key="${archive.key}">删除</button>
                </div>
            </div>
        `).join('');
    }

    // 事件监听器
    addBtn.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text) {
            addTask(text);
            newTaskInput.value = '';
        }
    });

    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = newTaskInput.value.trim();
            if (text) {
                addTask(text);
                newTaskInput.value = '';
            }
        }
    });

    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const id = parseInt(taskItem.dataset.id);

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(id);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(id);
        } else if (e.target.classList.contains('task-checkbox')) {
            toggleTask(id);
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    saveAsBtn.addEventListener('click', saveArchive);

    loadHistoryBtn.addEventListener('click', () => {
        renderHistoryList();
        historyModal.style.display = 'block';
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            historyModal.style.display = 'none';
        });
    });

    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
    });

    historyList.addEventListener('click', (e) => {
        const key = e.target.dataset.key;
        if (!key) return;

        if (e.target.classList.contains('load-btn')) {
            loadArchive(key);
        } else if (e.target.classList.contains('delete-history-btn')) {
            deleteArchive(key);
        }
    });

    // 初始化应用
    init();
}); 