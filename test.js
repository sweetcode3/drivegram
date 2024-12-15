async showFileAutocomplete(input) {
    const repoSelect = input.parentElement.querySelector('.github-repo-select');
    const repoFullName = repoSelect.value;
    if (!repoFullName) return;

    const currentPath = input.value.split('/').slice(0, -1).join('/');
    const files = await this.loadRepoFiles(repoFullName, currentPath);
    
    let dropdown = document.getElementById('file-autocomplete');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'file-autocomplete';
        dropdown.style.cssText = `
            position: absolute;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            max-height: 300px;
            overflow-y: auto;
            width: 300px;
            z-index: 1000;
            margin-top: 2px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        input.parentElement.appendChild(dropdown);
    }

    // Сортируем файлы: сначала папки, потом файлы
    const sortedFiles = files.sort((a, b) => {
        if (a.type === b.type) {
            return a.path.localeCompare(b.path);
        }
        return a.type === 'dir' ? -1 : 1;
    });

    dropdown.innerHTML = '';
    sortedFiles.forEach(file => {
        const item = document.createElement('div');
        const icon = file.type === 'dir' ? '📁' : '📄';
        item.textContent = `${icon} ${file.path}`;
        item.style.cssText = `
            padding: 6px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: monospace;
        `;

        item.addEventListener('mouseover', () => {
            item.style.background = 'var(--background-hover)';
        });

        item.addEventListener('mouseout', () => {
            item.style.background = 'none';
        });

        item.addEventListener('click', () => {
            input.value = file.path;
            dropdown.remove();
        });

        dropdown.appendChild(item);
    });

    // Добавляем обработчик клика вне dropdown для его закрытия
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== input) {
            dropdown.remove();
        }
    });
}
