import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC8ZuICX3j6tZ1-4T-q5aW7E0W_1NBc6gA", // 替換成您的 Firebase API 金鑰
    authDomain: "japan-75b79.firebaseapp.com", // 替換成您的 Firebase 驗證網域
    projectId: "japan-75b79", // 替換成您的 Firebase 專案 ID
    storageBucket: "japan-75b79.firebasestorage.app", // 替換成您的 Firebase 儲存空間
    messagingSenderId: "719245058006", // 替換成您的 Firebase 訊息發送者 ID
    appId: "1:719245058006:web:7f0e7c3b1737b5ad28ce77" // 替換成您的 Firebase 應用程式 ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
    loadData();
});

const STORAGE_KEY = 'tokyo_trip_plan';

export function toggleDetails(title) {
    const details = title.parentElement.querySelector('.details');
    details.style.display = details.style.display === 'block' ? 'none' : 'block';
}

const editMode = document.getElementById('edit-mode');
editMode.addEventListener('change', function () {
    const isEditMode = this.checked;
    document.querySelectorAll('.details textarea').forEach(textarea => {
        textarea.style.display = isEditMode ? 'block' : 'none';
    });
    document.querySelectorAll('.edit-title').forEach(button => {
        button.style.display = isEditMode ? 'inline-block' : 'none';
    });
    document.querySelectorAll('.delete-section').forEach(button => {
        button.style.display = isEditMode ? 'inline-block' : 'none';
    });

    if (!isEditMode) {
        sortDateSections();
        saveData();
    }
});

export function renderMarkdown(textarea) {
    const markdownPreview = textarea.parentElement.querySelector('.markdown-preview');
    markdownPreview.innerHTML = marked.parse(textarea.value);
    saveData();
}

export function editTitle(button) {
    const title = button.parentElement.querySelector('h2');
    const newTitle = prompt('請輸入新的標題', title.textContent);
    if (newTitle) {
        title.textContent = newTitle;
        saveData();
    }
}

export function deleteSection(button) {
    const section = button.parentElement;
    section.remove();
    saveData();
}

export function addDateSection() {
    const section = document.createElement('div');
    section.classList.add('date-section');
    section.innerHTML = `
        <h2 onclick="toggleDetails(this)">新行程日期 <button class="edit-title" style="display:none" onclick="editTitle(this)">編輯</button><button class="delete-section" style="display:none" onclick="deleteSection(this)">刪除</button></h2>
        <div class="details">
            <textarea placeholder="請輸入行程內容..." oninput="renderMarkdown(this)"></textarea>
            <div class="markdown-preview"></div>
        </div>
    `;
    document.getElementById('sections-container').appendChild(section);
    sortDateSections();
}

export function sortDateSections() {
    const sections = Array.from(document.querySelectorAll('.date-section'));
    sections.sort((a, b) => {
        const titleA = a.querySelector('h2').textContent.trim();
        const titleB = b.querySelector('h2').textContent.trim();
        return titleA.localeCompare(titleB);
    });
    sections.forEach(section => document.getElementById('sections-container').appendChild(section));
}

export function saveData() {
    const sections = Array.from(document.querySelectorAll('.date-section')).map(section => {
        return {
            title: section.querySelector('h2').textContent.trim(),
            content: section.querySelector('textarea').value.trim()
        };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

export function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        const sections = JSON.parse(storedData);
        sections.forEach(section => {
            const sectionElement = document.createElement('div');
            sectionElement.classList.add('date-section');
            sectionElement.innerHTML = `
                <h2 onclick="toggleDetails(this)">${section.title} <button class="edit-title" style="display:none" onclick="editTitle(this)">編輯</button><button class="delete-section" style="display:none" onclick="deleteSection(this)">刪除</button></h2>
                <div class="details">
                    <textarea placeholder="請輸入行程內容..." oninput="renderMarkdown(this)">${section.content}</textarea>
                    <div class="markdown-preview"></div>
                </div>
            `;
            document.getElementById('sections-container').appendChild(sectionElement);
        });
        sortDateSections();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addSectionButton = document.querySelector('.add-section');
    addSectionButton.addEventListener('click', addDateSection);
});