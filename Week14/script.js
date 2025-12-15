const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Current page detection
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === 'index.html' || page === '') {
        loadDashboardData();
    } else if (page === 'my_courses.html') {
        loadCourses();
    } else if (page === 'bulletin.html') {
        loadBulletins();
    }

    // Always load user data if elements exist
    loadUserData();
});

async function loadUserData() {
    try {
        const response = await fetch(`${API_BASE}/user`);
        const user = await response.json();

        // Update avatar and name everywhere they might appear
        const names = document.querySelectorAll('.user-menu span, .user-profile-widget h3');
        names.forEach(el => {
            if (el.tagName === 'SPAN') el.innerHTML = `${user.name} <i class="fas fa-chevron-down"></i>`;
            else el.textContent = user.name;
        });

        const avatars = document.querySelectorAll('.user-avatar-sm, .profile-avatar-lg');
        avatars.forEach(el => {
            el.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        });

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadDashboardData() {
    // Load Activities
    try {
        const res = await fetch(`${API_BASE}/activities`);
        const activities = await res.json();
        const container = document.getElementById('activity-feed');
        container.innerHTML = '';

        activities.forEach(item => {
            const html = `
            <div class="card">
                <div class="activity-item">
                    <div class="activity-icon ${item.iconColor}">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${item.title}</h4>
                        <div class="activity-meta">${item.time}</div>
                        <div class="activity-desc">${item.content}</div>
                    </div>
                    <div style="margin-left: auto;">
                        <i class="fas fa-ellipsis-h" style="color: #ccc;"></i>
                    </div>
                </div>
            </div>`;
            container.innerHTML += html;
        });
    } catch (e) {
        console.error(e);
    }

    // Load recent courses (using courses API for demo)
    try {
        const res = await fetch(`${API_BASE}/courses`);
        const courses = await res.json();
        const container = document.getElementById('course-visits');
        container.innerHTML = '';

        // Take first 3
        courses.slice(0, 3).forEach(course => {
            const html = `
             <div class="course-grid-item">
                <div class="course-thumb" style="background: ${course.bg}; color: ${course.color};">
                        <i class="${course.icon}"></i>
                </div>
                <div class="course-info">
                    <h5>${course.title}</h5>
                    <p>${course.department}</p>
                </div>
            </div>`;
            container.innerHTML += html;
        });
    } catch (e) { console.error(e); }

    // Load Todos
    try {
        const res = await fetch(`${API_BASE}/todos`);
        const todos = await res.json();
        const container = document.getElementById('todo-list');
        container.innerHTML = '';

        todos.forEach(todo => {
            const html = `
             <div style="font-size: 0.9em; padding: 10px; background: #f9f9f9; margin-bottom: 5px;">
                <div style="font-weight: bold;">${todo.title}</div>
                <div style="color: #888; font-size: 0.8em;">${todo.status} 截止日期 ${todo.deadline}</div>
            </div>`;
            container.innerHTML += html;
        });
    } catch (e) { console.error(e); }
}

async function loadCourses() {
    try {
        const res = await fetch(`${API_BASE}/courses`);
        const courses = await res.json();
        const container = document.getElementById('course-list');
        container.innerHTML = '';

        courses.forEach(course => {
            const html = `
             <div class="course-item-row">
                <div class="course-row-thumb" style="background: ${course.bg}; color: ${course.color};">
                    <i class="${course.icon}"></i>
                </div>
                <div class="course-row-info">
                        <h3><a href="course_content.html?id=${course.id}">${course.title}</a></h3>
                        <div class="course-code">課程代碼: ${course.code}</div>
                        <div class="course-meta">
                        <span>${course.department}</span>
                        <span>${course.type} (${course.credits})</span>
                        </div>
                </div>
                <div class="course-actions">
                    <div class="course-stats">${course.semester}</div>
                    <a href="course_content.html?id=${course.id}" style="color: var(--primary-color); font-size: 0.9em;">更多</a>
                </div>
            </div>`;
            container.innerHTML += html;
        });

    } catch (e) { console.error(e); }
}

async function loadBulletins() {
    try {
        const res = await fetch(`${API_BASE}/bulletins`);
        const bulletins = await res.json();
        const container = document.getElementById('bulletin-list');
        container.innerHTML = '';

        bulletins.forEach(item => {
            const html = `
            <div class="bulletin-item">
                <div class="bulletin-header">
                    <div class="bulletin-title" style="color: var(--primary-color);">
                        ${item.title} 
                        ${item.isNew ? '<span class="tag-new" style="background:#00bfa5;">已更新</span>' : ''}
                    </div>
                    <i class="fas fa-chevron-down" style="color: #ccc;"></i>
                </div>
                <div style="font-size: 0.8em; color: var(--primary-color); background: #e0f2f1; display: inline-block; padding: 2px 5px; border-radius: 3px; margin-bottom: 5px;">${item.course}</div>
                <div class="bulletin-meta">${item.date} ${item.updateDate ? '更新於: ' + item.updateDate : ''} &nbsp; <i class="fas fa-user-friends"></i> ${item.target}</div>
                 ${item.content ? `<div style="margin-top: 10px; font-size: 0.9em;">${item.content}</div>` : ''}
            </div>`;
            container.innerHTML += html;
        });

    } catch (e) { console.error(e); }
}
