var img = new Image();
img.src = "./assets/tower.png";
export class Tower {
    constructor(x, y, radius, color,imgSrc) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.damage = 10;
        this.range = 150;
        this.fireRate = 800; // время между выстрелами в миллисекундах
        this.lastShotTime = 0; // начальное значение, означающее, что башня готова стрелять
        this.img = new Image();
        this.img.src = imgSrc;  // Загрузка изображения
    }

    draw(c) {
        // Проверяем, загружено ли изображение
        if (!this.img.complete) {
            // Если изображение не загружено, можно выводить сообщение или попытаться перезагрузить
            console.log("Изображение еще загружается");
            this.img.onload = () => this.draw(c); // Повторный вызов draw после загрузки
            return;
        }

        // Рисуем изображение на канвасе
        c.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        c.fill();
    }

    shoot(enemies, currentTime) {
        if (currentTime - this.lastShotTime < this.fireRate) {
            return null; // Если не прошло достаточно времени с последнего выстрела, выстрел не производится
        }

        for (let enemy of enemies) {
            if (this.isInRange(enemy)) {
                enemy.health -= this.damage;
                this.lastShotTime = currentTime; // Обновляем время последнего выстрела
                return enemy;
            }
        }
        return null;
    }

    isInRange(enemy) {
        const distance = Math.sqrt((this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2);
        return distance < this.range;
    }
}
