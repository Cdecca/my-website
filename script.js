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
                <button class="delete-article" data-index="${index}">Xóa bài</button>
            `;
            
            articleList.appendChild(articleDiv);
        });
        
        // Thêm sự kiện cho nội dung bài viết
        document.querySelectorAll('.article-content').forEach(content => {
            content.addEventListener('mouseup', handleTextSelection);
        });
    }
    
    // Xử lý khi bôi đen văn bản
    function handleTextSelection(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0 && selectedText.split(' ').length === 1) {
            currentSelection = selectedText;
            selectedWordSpan.textContent = currentSelection;
            
            // Nếu từ đã có định nghĩa, hiển thị để chỉnh sửa
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
    
    // Khởi tạo hiển thị
    displayArticles();
});