document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if(path.includes('index.html') || path.endsWith('/')) {
        loadSubjects();
    } 
    else if(path.includes('subject.html')) {
        loadChapters();
    }
});

// Load Subjects
async function loadSubjects() {
    try {
        const response = await fetch('data/subjects.json');
        const subjects = await response.json();
        renderSubjects(subjects);
    } catch (error) {
        showError('#subjectsContainer', 'Failed to load subjects');
    }
}

function renderSubjects(subjects) {
    const container = document.getElementById('subjectsContainer');
    
    subjects.forEach(subject => {
        const card = document.createElement('a');
        card.className = 'subject-card';
        card.href = `subjects/subject.html?subject=${subject.id}`;
        card.innerHTML = `
            <i class="fas ${subject.icon}"></i>
            <h3>${subject.name}</h3>
            <p>Class ${subject.class}</p>
        `;
        container.appendChild(card);
    });
}

// Load Chapters
async function loadChapters() {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('subject');

    if(!subjectId) {
        showError('#chaptersContainer', 'No subject selected');
        return;
    }

    try {
        const response = await fetch('../data/chapters.json');
        const data = await response.json();
        const chapters = data[subjectId];
        
        document.getElementById('subjectTitle').textContent = 
            `${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} Chapters`;
            
        renderChapters(chapters);
    } catch (error) {
        showError('#chaptersContainer', 'Failed to load chapters');
    }
}

function renderChapters(chapters) {
    const container = document.getElementById('chaptersContainer');
    
    chapters.forEach(chapter => {
        const card = document.createElement('a');
        card.className = 'chapter-card';
        card.href = `../chapters/${chapter.path}`;
        card.innerHTML = `
            <div class="chapter-number">${chapter.id}</div>
            <div class="chapter-info">
                <h3>${chapter.title}</h3>
                <p>${chapter.description || ''}</p>
            </div>
            <i class="fas fa-chevron-right"></i>
        `;
        container.appendChild(card);
    });
}

// Utilities
function showError(selector, message) {
    const container = document.querySelector(selector);
    container.innerHTML = `
        <div class="error-card">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}