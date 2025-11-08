function updateRandomSubjectAndName() {
    const apiKey = 'AIzaSyBYmI12gI0XjJxi9mWrAEGRuBvm7Ekqu6I'; // Замените на ваш API-ключ Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
        Generate a random academic subject name in Uzbek language and a random Uzbek full name (first name, last name, patronymic) (for example: "Matematika" and "Sultonov Shavkat Murodovich").
        Return the response in JSON format like this:
        {
            "subject": "Subject Name",
            "fullName": "FirstName LastName Patronymic"
        }
        Example:
        {
            "subject": "Matematika",
            "fullName": "Abdullaev Zornazar Murodovich"
        }
    `;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Извлекаем сгенерированный текст из ответа Gemini
            const generatedText = data.candidates[0].content.parts[0].text;

            // Удаляем возможные маркеры кода (```json) и парсим JSON
            const cleanedText = generatedText.replace(/```json|```/g, '').trim();
            const result = JSON.parse(cleanedText);

            // Находим <h1> и <span> элементы
            const header = document.querySelector('h1.breadcrumb-header');
            const nameSpan = header.querySelector('span.text-info');

            if (header && nameSpan) {
                // Обновляем название предмета (заменяем текст перед span)
                header.childNodes[0].textContent = result.subject + ' - ';
                // Обновляем ФИО внутри span
                nameSpan.textContent = result.fullName;
            } else {
                console.error('HTML elements not found');
            }
        })
        .catch(error => {
            console.error('Error fetching data from Gemini API:', error);
            // Запасной вариант на случай ошибки
            const header = document.querySelector('h1.breadcrumb-header');
            const nameSpan = header.querySelector('span.text-info');
            if (header && nameSpan) {
                header.childNodes[0].textContent = 'Fan Nomi - ';
                nameSpan.textContent = 'Ism Familya Otasining Ismi';
            }
        });
}

window.onload = function () {
    updateRandomSubjectAndName();
}