/**
 * Crew Artist Gallery Platform
 * Main JavaScript Application
 */

// ===== DATA CONFIGURATION =====
const CONFIG = {
    logoCount: 6,
    logoSrc: 'images/logo-modified.png',
    galleryImages: [
        'https://i.pinimg.com/736x/6d/51/52/6d515265832c025517e66c873c281c00.jpg',
        'https://i.pinimg.com/736x/0e/b6/23/0eb6238efc661a6cff8a6004cd1e0c5d.jpg',
        'https://i.pinimg.com/736x/ee/23/13/ee2313e2dad633d4cfea5647bb7a7b0c.jpg',
        'https://i.pinimg.com/736x/03/49/a2/0349a2a0ccd529beeddb4a664ff06858.jpg',
        'https://i.pinimg.com/736x/d7/4e/c5/d74ec5adbbbc249e940d58b1183dd4be.jpg',
        'https://i.pinimg.com/736x/4d/0b/ce/4d0bce4707dca64a565053f832da4978.jpg',
        'https://i.pinimg.com/736x/79/4d/68/794d6890156b4c596b4b910a39ec6ed0.jpg',
        'https://i.pinimg.com/736x/77/aa/f6/77aaf65a635b8749efc2afe532bdeef8.jpg',
        'https://i.pinimg.com/736x/6d/51/52/6d515265832c025517e66c873c281c00.jpg'
    ]
};

// ===== DYNAMIC CONTENT GENERATION =====
function generateLogos() {
    const logoContainer = document.querySelector('.logo-container');
    if (!logoContainer) return;
    
    // Clear existing logos
    logoContainer.innerHTML = '';
    
    // Generate logos using loop
    for (let i = 1; i <= CONFIG.logoCount; i++) {
        const img = document.createElement('img');
        img.src = CONFIG.logoSrc;
        img.alt = `Gallery logo ${i}`;
        img.loading = 'lazy';
        logoContainer.appendChild(img);
    }
}

function generateGallery() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    
    // Clear existing gallery items
    gallery.innerHTML = '';
    
    // Generate gallery items using loop
    CONFIG.galleryImages.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('role', 'gridcell');
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Gallery image ${index + 1}`;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        gallery.appendChild(galleryItem);
    });
}

// ===== GALLERY FUNCTIONALITY =====
let galleryImages = [];
let currentIndex = 0;

function openModal(src) {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('modalImg');
    
    if (!modal || !modalImg) return;
    
    modalImg.src = src;
    modal.classList.add('active');
    
    // Find current image index
    currentIndex = galleryImages.findIndex(img => img.src === src);
}

function closeModal() {
    const modal = document.getElementById('imgModal');
    if (!modal) return;
    
    modal.classList.remove('active');
}

function showImage(index) {
    if (galleryImages.length === 0) return;
    
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;
    
    currentIndex = index;
    const modalImg = document.getElementById('modalImg');
    if (modalImg) {
        modalImg.src = galleryImages[currentIndex].src;
    }
}

// ===== APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Generate dynamic content
    generateLogos();
    generateGallery();
    
    // Load gallery images after generation
    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    
    // Event delegation for gallery images
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        gallery.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                openModal(e.target.src);
            }
        });
    }
    
    // Modal close events
    const modalBg = document.querySelector('.modal-bg');
    const modalImg = document.getElementById('modalImg');
    
    if (modalBg) {
        modalBg.addEventListener('click', closeModal);
    }
    
    if (modalImg) {
        modalImg.addEventListener('click', closeModal);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('imgModal')?.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                showImage(currentIndex + 1);
                break;
            case 'ArrowLeft':
                showImage(currentIndex - 1);
                break;
        }
    });
    
    // Touch/swipe navigation
    if (modalImg) {
        let startX = 0;
        let isTouch = false;
        
        modalImg.addEventListener('touchstart', function(e) {
            isTouch = true;
            startX = e.touches[0].clientX;
        });
        
        modalImg.addEventListener('touchend', function(e) {
            if (!isTouch) return;
            
            let endX = e.changedTouches[0].clientX;
            if (endX - startX > 50) showImage(currentIndex - 1); // swipe right
            if (startX - endX > 50) showImage(currentIndex + 1); // swipe left
            isTouch = false;
        });
        
        // Mouse drag for desktop
        let mouseDown = false, mouseStartX = 0;
        
        modalImg.addEventListener('mousedown', function(e) {
            mouseDown = true;
            mouseStartX = e.clientX;
        });
        
        modalImg.addEventListener('mouseup', function(e) {
            if (!mouseDown) return;
            
            let mouseEndX = e.clientX;
            if (mouseEndX - mouseStartX > 50) showImage(currentIndex - 1); // drag right
            if (mouseStartX - mouseEndX > 50) showImage(currentIndex + 1); // drag left
            mouseDown = false;
        });
        
        // Click left/right side of image to navigate
        modalImg.addEventListener('click', function(e) {
            const rect = modalImg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x < rect.width / 2) {
                showImage(currentIndex - 1); // Left side
            } else {
                showImage(currentIndex + 1); // Right side
            }
        });
    }
    
    console.log('Crew Artist Gallery initialized');
});

// ===== UTILITY FUNCTIONS =====
function addGalleryImage(imageSrc) {
    CONFIG.galleryImages.push(imageSrc);
    generateGallery();
    galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
}

function removeGalleryImage(index) {
    if (index >= 0 && index < CONFIG.galleryImages.length) {
        CONFIG.galleryImages.splice(index, 1);
        generateGallery();
        galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    }
}

// ===== GLOBAL FUNCTIONS (for backward compatibility) =====
window.openModal = openModal;
window.closeModal = closeModal;
window.addGalleryImage = addGalleryImage;
window.removeGalleryImage = removeGalleryImage;
