function showNotification(message) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';

    const header = document.createElement('div');
    header.className = 'notification-header';
    header.textContent = 'Уведомление';

    const body = document.createElement('div');
    body.className = 'notification-body';
    body.textContent = message;

    notificationContainer.appendChild(header);
    notificationContainer.appendChild(body);

    document.body.appendChild(notificationContainer);

    // Показать уведомление
    setTimeout(() => {
        notificationContainer.classList.add('show');
    }, 100);

    // Скрыть уведомление через 5 секунд
    setTimeout(() => {
        notificationContainer.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notificationContainer);
        }, 500); // Дождаться окончания анимации
    }, 5000);
}
