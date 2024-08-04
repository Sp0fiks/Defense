import { Tower } from './tower.js';
import { enemy } from './enemy.js';
import { Player } from './player.js';
/*const path = [
    { x: 0, y: 290 },  // Начало пути у верхнего края
    { x: 100, y: 290 },
    { x: 100, y: 138 },
    { x: 315, y: 138 },
    { x: 315, y: 455 },
    { x: 115, y: 455 },
    { x: 115, y: 790 },
    { x: 325, y: 790 },
    { x: 325, y: 650 },
    { x: 525, y: 650 },
];
*/

function createScaledPath(canvasWidth, canvasHeight) {
    const path = [
        { x: 0, y: 0.31 },  // Начало пути у верхнего края (31% от высоты)
        { x: 0.23, y: 0.31 },
        { x: 0.23, y: 0.15 },
        { x: 0.73, y: 0.15 },
        { x: 0.73, y: 0.49 },
        { x: 0.27, y: 0.49 },
        { x: 0.27, y: 0.85 },
        { x: 0.76, y: 0.85 },
        { x: 0.76, y: 0.7 },
        { x: 1.22, y: 0.7 },  // Возможно, стоит проверить это значение, так как оно выходит за пределы ширины холста
    ].map(point => ({
        x: point.x * canvasWidth,
        y: point.y * canvasHeight
    }));
    return path;
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scaledPath = createScaledPath(canvas.width, canvas.height);
let playerHealth = 100;  // Use let if you need to modify it
let money = 10000;
const pathtower = [
    {x:397, y:701},
    {x:264, y:726},
    {x: 173, y: 727},
    {x: 52, y: 671},
    {x: 178, y: 523},
    {x: 256, y: 398},
    {x: 260, y: 192},
    {x: 36, y: 348},
];
const baseTowerCost = 20;
const towers = [];
let towerCount = 0;
let towerCostIncrement = 20;
const enemies = [];
canvas.addEventListener('click', handleGameAreaClick);

function handleGameAreaClick(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    console.log("{x: "+x+",","y: "+y+"},");
}
//const TT = new Tower(200, 100, 30, 'red');
//towers.push(TT)
function spawnEnemy() {
    console.log(scaledPath[0].x)
    const enemyInstance = new enemy(scaledPath[0].x, scaledPath[0].y, 10, 100, scaledPath);
    enemies.push(enemyInstance);
}

function addTower() {
    if (towerCount >= pathtower.length) {
        console.log("Все позиции для башен заполнены.");
        return;
    }

    const newTowerCost = baseTowerCost + (towerCount * towerCostIncrement);
    console.log("Стоимость новой башни:", newTowerCost);

    if (money >= newTowerCost) {
        const newTower = new Tower(pathtower[towerCount].x, pathtower[towerCount].y, 15, 'red', "/assets/tower.png");
        towers.push(newTower);
        towerCount++;
        money -= newTowerCost;
        draw();
    } else {
        showNotification("Недостаточно денег для покупки башни!");
    }
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    towers.forEach(tower => {
        tower.draw(c);
    });
    enemies.forEach((enes, index) => {
        enes.startMoving();
        enes.draw(c);
        if (enes.x > canvas.width) {
            playerHealth -= enes.damage;
            enemies.splice(index, 1);  // Use index for correct removal
        }
    });
}
function drawInfoPanel() {
    // Фон панели информации
    c.fillStyle = 'green';
    c.fillRect(20, 10, canvas.width-50, 100);

    // Стиль текста
    c.fillStyle = 'white';
    c.font = '18px Arial';

    // Данные для отображения
    const infoData = {
        'Монеты': money,
        'Здоровье': playerHealth,
        'Время': new Date().toTimeString().slice(0, 5),
        'Заработок в час': '50 монет'
    };

    // Отрисовка текста
    let yPos = 40;
    Object.keys(infoData).forEach((key, index) => {
        c.fillText(`${key}: ${infoData[key]}`, 30, yPos);
        yPos += 20;
    });
}
function shootAtEnemies() {
    const currentTime = Date.now();
    towers.forEach(tower => {
        const targetEnemy = tower.shoot(enemies, currentTime);
        if (targetEnemy && targetEnemy.health <= 0) {
            money += 5;
            const index = enemies.indexOf(targetEnemy);
            if (index > -1) {
                enemies.splice(index, 1); // Correct method to remove from array
            }
        }    
    });
}

//MAGAZINE
document.getElementById('shopToggleButton').addEventListener('click', toggleShop);
document.getElementById('closeShops').addEventListener('click', closeShop);
document.getElementById('Buytower').addEventListener('click', addTower);
const ShopButton = document.getElementById('shopToggleButton');
function toggleShop() {
    const shopPanel = document.getElementById('shopPanel');
    const butt = document.getElementById('Buytower');
    if (shopPanel.style.bottom === '0px' || shopPanel.classList.contains('open')) {
        shopPanel.classList.remove('open');
        shopPanel.style.bottom = '-100%'; // Прячем панель
        ShopButton.style.display = 'block';
    } else {
        let newTowerCosts = baseTowerCost + (towerCount * towerCostIncrement);
        shopPanel.classList.add('open');
        shopPanel.style.bottom = '0'; // Показываем панель
        butt.textContent = "Купить башню:"+newTowerCosts;
        ShopButton.style.display = 'none';
    }
}

function closeShop() {
    const shopPanel = document.getElementById('shopPanel');
    shopPanel.classList.remove('open');
    shopPanel.style.bottom = '-100%'; // Прячем панель
    ShopButton.style.display = 'block';
}


///


function gameLoop() {
    shootAtEnemies();
    draw();
    drawInfoPanel();
    if (playerHealth <= 0) {
        clearInterval(enemySpawnInterval);
        clearInterval(enemyMoveInterval);
        showNotification("Игра окончена!");
    }
}

const enemySpawnInterval = setInterval(spawnEnemy, 5000);  // Use const for interval IDs
const enemyMoveInterval = setInterval(gameLoop, 60);

console.log(enemies);
console.log(c);
console.log(canvas.width,canvas.height)
