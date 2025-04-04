document.addEventListener('DOMContentLoaded', function() {
    // Lưu trữ dữ liệu
    let articles = JSON.parse(localStorage.getItem('articles')) || [];
    let definitions = JSON.parse(localStorage.getItem('definitions')) || {};
    
    // DOM Elements
    const newArticleInput = document.getElementById('newArticle');
    const addArticleBtn = document.getElementById('addArticle');
    const articleList = document.getElementById('articleList');
    const definitionModal = document.getElementById('definitionModal');
    const selectedWordSpan = document.getElementById('selectedWord');
    const definitionText = document.getElementById('definitionText');
    const saveDefinitionBtn = document.getElementById('saveDefinition');
    const closeBtn = document.querySelector('.close');
    
    let currentSelection = '';
    let currentlyEditingIndex = null;
    
    // Hiển thị bài viết
    function displayArticles() {
        articleList.innerHTML = '';
    
        articles.forEach((article, index) => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'article';
            
            // Xử lý từ đã được định nghĩa
            let processedContent = article.content;
            Object.keys(definitions).forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                processedContent = processedContent.replace(regex, 
                    `<span class="defined-term">${word}<span class="definition-tooltip">${definitions[word]}</span></span>`);
            });
            
        articleDiv.innerHTML = `
            <h3>Bài viết ${index + 1}</h3>
            <div class="article-content">${processedContent}</div>
            <div class="article-actions">
                <button class="edit-btn" data-index="${index}">Chỉnh sửa</button>
                <button class="delete-article" data-index="${index}">Xóa bài</button>
            </div>
        `;
        
        articleList.appendChild(articleDiv);
    });
       
        // Thêm sự kiện cho nội dung bài viết
        document.querySelectorAll('.article-content').forEach(content => {
            content.addEventListener('mouseup', handleTextSelection);
        });
            // Thêm sự kiện cho nút chỉnh sửa
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                openEditModal(index);
            });
        });
    }
    

    // Xử lý khi bôi đen văn bản
    function handleTextSelection(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const wordCount = selectedText.split(' ').length;
        
        if (selectedText.length > 0 && wordCount >= 1 && wordCount <= 10) {
            currentSelection = selectedText;
            selectedWordSpan.textContent = currentSelection;
            
            if (definitions[currentSelection]) {
                definitionText.value = definitions[currentSelection];
            } else {
                definitionText.value = '';
            }
            
            definitionModal.style.display = 'block';
        }
    }
    
    // Thêm bài viết mới
    addArticleBtn.addEventListener('click', function() {
        const content = newArticleInput.value.trim();
        if (content) {
            articles.push({ content });
            localStorage.setItem('articles', JSON.stringify(articles));
            newArticleInput.value = '';
            displayArticles();
        }
    });
    
    // Lưu định nghĩa
    saveDefinitionBtn.addEventListener('click', function() {
        const definition = definitionText.value.trim();
        if (currentSelection && definition) {
            definitions[currentSelection] = definition;
            localStorage.setItem('definitions', JSON.stringify(definitions));
            definitionModal.style.display = 'none';
            displayArticles();
        }
    });
    
    // Xóa bài viết
    articleList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-article')) {
            const index = e.target.getAttribute('data-index');
            articles.splice(index, 1);
            localStorage.setItem('articles', JSON.stringify(articles));
            displayArticles();
        }
    });
    
    // Đóng modal
    closeBtn.addEventListener('click', function() {
        definitionModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === definitionModal) {
            definitionModal.style.display = 'none';
        }
    });

    // Hàm mở modal chỉnh sửa
    function openEditModal(index) {
        currentlyEditingIndex = index;
        document.getElementById('editArticleContent').value = articles[index].content;
        document.getElementById('editModal').style.display = 'block';
    }

    // Hàm lưu chỉnh sửa - SỬA LẠI THÀNH
    document.getElementById('saveEdit')?.addEventListener('click', function() {
        if (currentlyEditingIndex !== null) {
            const newContent = document.getElementById('editArticleContent').value;
            articles[currentlyEditingIndex].content = newContent;
            localStorage.setItem('articles', JSON.stringify(articles)); // Sửa thành trực tiếp
            document.getElementById('editModal').style.display = 'none';
            displayArticles();
        }
    });

    // Đóng modal chỉnh sửa - SỬA LẠI THÀNH
    document.querySelector('.close-edit')?.addEventListener('click', function() {
        document.getElementById('editModal').style.display = 'none';
    });
    
    function saveArticles() {
        localStorage.setItem('articles', JSON.stringify(articles));
    }
        
    // Khởi tạo hiển thị
    displayArticles();
});
