document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const galleryGrid = document.getElementById('galleryGrid');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.getElementById('closeModal');
    
    let images = JSON.parse(localStorage.getItem('galleryImages')) || [];
    
    // Render gallery
    function renderGallery() {
        galleryGrid.innerHTML = '';
        
        if (images.length === 0) {
            galleryGrid.innerHTML = '<p class="no-images" style="text-align:center;color:#888;font-size:1.2rem;">No memories yet 🌸</p>';
            return;
        }
        
        const searchTerm = searchInput.value.toLowerCase();
        let filteredImages = images.filter(img => 
            img.name.toLowerCase().includes(searchTerm)
        );
        
        const sortValue = sortSelect.value;
        filteredImages.sort((a, b) => {
            switch (sortValue) {
                case 'date-asc': return new Date(a.date) - new Date(b.date);
                case 'date-desc': return new Date(b.date) - new Date(a.date);
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });
        
        filteredImages.forEach((img, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${img.url}" alt="${img.name}" class="gallery-img">
                <button class="delete-img" data-index="${index}">×</button>
                <div class="gallery-info">
                    <div class="gallery-title">${img.name}</div>
                    <div class="gallery-date">${new Date(img.date).toLocaleDateString()}</div>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });
        
        document.querySelectorAll('.gallery-img').forEach(img => {
            img.addEventListener('click', function() {
                openModal(this.src, this.alt);
            });
        });
        
        document.querySelectorAll('.delete-img').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteImage(parseInt(this.dataset.index));
            });
        });
    }
    
    function openModal(src, caption) {
        modal.style.display = 'block';
        modalImage.src = src;
        modalCaption.textContent = caption;
    }
    
    function closeModalFunc() {
        modal.style.display = 'none';
    }
    
    function uploadImages() {
        const files = imageUpload.files;
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                images.push({
                    url: e.target.result,
                    name: file.name,
                    date: new Date().toISOString()
                });
                saveImages();
                renderGallery();
            };
            reader.readAsDataURL(file);
        });
        
        imageUpload.value = '';
    }
    
    function deleteImage(index) {
        if (confirm('Do you really want to remove this memory? 🌸')) {
            images.splice(index, 1);
            saveImages();
            renderGallery();
        }
    }
    
    function saveImages() {
        localStorage.setItem('galleryImages', JSON.stringify(images));
    }
    
    uploadBtn.addEventListener('click', uploadImages);
    searchInput.addEventListener('input', renderGallery);
    sortSelect.addEventListener('change', renderGallery);
    closeModal.addEventListener('click', closeModalFunc);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    renderGallery();
});
