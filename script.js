document.addEventListener('DOMContentLoaded', function() {
    // Музыкальный плеер
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.error("Автовоспроизведение заблокировано:", e));
            musicBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });

    // Обработка автовоспроизведения
    document.body.addEventListener('click', function() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(e => console.error("Автовоспроизведение заблокировано:", e));
        }
    }, { once: true });

    // Таймер обратного отсчета
    const endDate = new Date("2026-05-09T00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "Той басталды!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Обработка формы RSVP
    const modal = document.getElementById("modal");
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById("name");
        const name = nameInput.value.trim();
        const status = document.querySelector("input[name='status']:checked").value;

        // Валидация
        if (!name) {
            alert("Есіміңізді енгізіңіз!");
            nameInput.focus();
            return;
        }

        // Токен бота и chat_id (замените на свои реальные значения)
        const botToken = "8087654132:AAFBv4z-cdN3Fme2dWCGK4eecC02bMNJMos";
        const chatId = "1628281600";

        // Формируем текст сообщения в зависимости от статуса
        let statusText;
        switch(status) {
            case "solo":
                statusText = "Әрине, келемін";
                break;
            case "with":
                statusText = "Жұбайыммен келемін";
                break;
            case "no":
                statusText = "Өкінішке орай, келе алмаймын";
                break;
            default:
                statusText = "Статус белгісіз";
        }

        // Отправка в Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `🎉 Жаңа қонақ!\n👤 Есім: ${name}\n📌 Статус: ${statusText}`,
                parse_mode: "HTML"
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Сообщение отправлено:", data);
            modal.style.display = "block";
            nameInput.value = ""; // Очищаем поле ввода
        })
        .catch(error => {
            console.error("Ошибка отправки:", error);
            alert("Хабарлама жіберілмеді. Қайталап көріңіз немесе админге хабарласыңыз.");
        });
    });

    // Закрытие модального окна
    document.getElementById("closeModal").addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});
