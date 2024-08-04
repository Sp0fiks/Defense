function drawInfoPanel() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Фон панели информации
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 780, 100);

    // Стиль текста
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';

    // Данные для отображения
    const infoData = {
        'Монеты': '100',
        'Здоровье': '100%',
        'Время': new Date().toTimeString().slice(0, 5),
        'Заработок в час': '50 монет'
    };

    // Отрисовка текста
    let yPos = 40;
    Object.keys(infoData).forEach((key, index) => {
        ctx.fillText(`${key}: ${infoData[key]}`, 20, yPos);
        yPos += 20;
    });
}

// Первоначальная отрисовка и обновление каждую минуту
drawInfoPanel();
setInterval(drawInfoPanel, 60000);  // Обновление времени каждую минуту
