// imageChecker.js - Rasm tekshiruv skripti
(function() {
    // Style qo'shish
    const style = document.createElement('style');
    style.textContent = `
        .red-dot-indicator {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 12px;
            height: 12px;
            background: #ff0000;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            z-index: 10001;
            pointer-events: none;
        }
        .image-with-indicator {
            position: relative;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

    // O'ng siltashni 2 marta bosishni aniqlash
    let lastRightClick = 0;
    
    document.addEventListener('contextmenu', function(e) {
        const currentTime = new Date().getTime();
        if (currentTime - lastRightClick < 500) {
            e.preventDefault();
            checkAllImages();
        }
        lastRightClick = currentTime;
    });

    function checkAllImages() {
        // Avvalgi indikatorlarni tozalash
        document.querySelectorAll('.red-dot-indicator').forEach(indicator => {
            indicator.remove();
        });

        const images = document.querySelectorAll('img');
        let count = 0;

        images.forEach(img => {
            try {
                const src = img.src;
                const filename = src.split('/').pop();
                const basename = filename.substring(0, filename.lastIndexOf('.'));
                const lastChar = basename.slice(-1).toLowerCase();

                if (lastChar === 'a') {
                    count++;
                    markImage(img);
                }
            } catch (error) {
                console.log('Rasmni tekshirishda xato:', error);
            }
        });

        showNotification(`${count} ta to'g'ri javob rasmlari topildi`);
    }

    function markImage(img) {
        const parent = img.parentElement;
        
        // Agar rasm allaqachon belgilangan bo'lsa, o'tkazib yuborish
        if (parent && parent.querySelector('.red-dot-indicator')) {
            return;
        }

        // Rasm atrofida container yaratish
        if (!parent || !parent.classList.contains('image-with-indicator')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-with-indicator';
            
            if (parent) {
                parent.insertBefore(wrapper, img);
            } else {
                img.parentNode.insertBefore(wrapper, img);
            }
            wrapper.appendChild(img);
        }

        // Qizil nuqta qo'shish
        const dot = document.createElement('div');
        dot.className = 'red-dot-indicator';
        img.parentElement.appendChild(dot);
    }

    function showNotification(message) {
        // Avvalgi bildirishnomani olib tashlash
        const oldNotification = document.getElementById('image-checker-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'image-checker-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border-left: 4px solid #ff0000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 3 soniyadan keyin bildirishnomani olib tashlash
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    console.log('Rasm tekshiruv skripti muvaffaqiyatli yuklandi!');
})();
