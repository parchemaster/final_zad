var myGamePiece;
var myObstacles = [];
var Weapons = [[]];
var playerBlaster = [];
var myBackground;
var QuestKillMobs = 0;
var pause_game = false;
var myTotalScore;
var myHpScore;
var isGyroscopeGame;
var myBoss;
var bossAppearKills = 10;
var bossWeapon = [];
var number_difficulty_chosen = 0;
var myMusic;
var game_level = JSON.parse(window.localStorage.getItem('current-level'));





function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}


function checkDevice() {

    if (detectMob()) {
        fetchLevels();
        window.location.href = "mobile-game.html";
    }
    else {
        fetchLevels();
        window.location.href = "difficulty_choose.html";
    }
}

function d1() {

    number_difficulty_chosen = 0;

    startGame(number_difficulty_chosen);


}
function d2() {

    number_difficulty_chosen = 1;

    startGame(number_difficulty_chosen);


}
function d3() {

    number_difficulty_chosen = 2;

    startGame(number_difficulty_chosen);

}
function d4() {

    number_difficulty_chosen = 3;

    startGame(number_difficulty_chosen);

}
function d5() {

    number_difficulty_chosen = 4;

    startGame(number_difficulty_chosen);

}


async function fetchLevels() {
    console.log("asd");
    response = await fetch("levels.json");

    data = await response.json();


    window.localStorage.setItem('level', JSON.stringify(data));

}
function GyroscopeHtml() {
    window.location.href = "difficulty_choose_gyroscope.html";
}

function startGyroscopeGame(x) {
    isGyroscopeGame = true;
    number_difficulty_chosen = x;
    if (isGyroscopeGame) {
        let sensor = new Gyroscope();
        sensor.start();
        sensor.onreading = () => {
            myGamePiece.x += sensor.y * 80;
            myGamePiece.y += sensor.x * 30;
        };
        sensor.onerror = errorHandler;
        function errorHandler(event) {
            console.log(event.error.name, event.error.message);
        }
    }
    startGame(number_difficulty_chosen);
}

var current_level;
function startGame(current_difficult) {
    // var game_level = JSON.parse(window.localStorage.getItem('current-level'));
    console.log(game_level['level']);
    console.log(number_difficulty_chosen);
    game_level['level'] = current_difficult
    localStorage.setItem("current-level", JSON.stringify(game_level))

    //fetchLevels();
    myGameArea.start();


    // myMusic = new sound("http://soundfxcenter.com/movies/star-wars/8d82b5_Star_Wars_Main_Theme_Song.mp3");
    // myMusic.play();


    level = JSON.parse(window.localStorage.getItem('level'));

    current_level = level.levels[number_difficulty_chosen];
    //console.log(current_level.difficulty);

    myGamePiece = new ship("https://www.nicepng.com/png/full/36-365566_jedistarfighter-detail-star-wars-jedi-starfighter-top-view.png", "image");

    user = JSON.parse(window.localStorage.getItem('user'));
    myBackground = new background(innerWidth - 10, innerHeight - 10, user['background'], 0, 0, "background");
    myBoss = new boss(250, 250, "images/deathstar.png", innerWidth / 2, 0, "image");

    myTotalScore = new info(innerWidth / 10, innerHeight / 12, "text");
    myHpScore = new info(innerWidth / 10, innerHeight / 8, "text");

}

// function sound(src) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function () {
//         this.sound.play();
//     }
//     this.stop = function () {
//         this.sound.pause();
//     }
// }


function info(x, y, type) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = "16px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(this.text, this.x, this.y);
        }
    }
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = innerWidth - 10;
        this.canvas.height = innerHeight - 10;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
        window.addEventListener('space', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
        });

        window.addEventListener('click', function (e) {
            blaster = new blast("https://www.pngarts.com/files/11/Green-Laser-PNG-Image.png", "image", myGamePiece.x, myGamePiece.y - 10);
            //myGamePiece.newPos();
            //myGamePiece.update();
            playerBlaster.push(blaster);
        });
        if (!detectMob()) {
            window.onmousedown = function (event) {

                function moveAt(pageX, pageY) {
                    myGamePiece.x = pageX - myGamePiece.width / 2;
                    myGamePiece.y = pageY - myGamePiece.height / 2;
                }

                // move ship under the pointer
                moveAt(event.pageX, event.pageY);

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                //  move the ship on mousemove
                window.addEventListener('mousemove', onMouseMove);

                // drop the ship, remove unneeded handlers
                window.onmouseup = function () {
                    //alert(pageX);
                    window.removeEventListener('mousemove', onMouseMove);
                    window.onmouseup = null;
                };

            };
            window.ondragstart = function () {
                return false;
            };
        }

        //drag
        if (detectMob && !isGyroscopeGame) {
            window.addEventListener('touchmove', function (e) {
                myGameArea.x = e.touches[0].screenX;
                myGameArea.y = e.touches[0].screenY;
                //myGamePiece.newPos();
                //myGamePiece.update();
            })
        }

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    resume: function () {
        this.interval = setInterval(updateGameArea, 20);
    },

    pauseMenu: function () {

        this.context.fillStyle = "rgba(0, 0, 0, 0.819)";
        this.context.fillRect(this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 2, this.canvas.height / 2);
        this.context.fillStyle = "rgba(21, 21, 21, 21.819)";
        this.context.fillRect(this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 2, this.canvas.height / 10);
        this.context.font = "bold 25px Star Wars sans-serif";
        this.context.fillStyle = "#FFE81F";

        this.context.fillText("Game is paused", ((this.canvas.width / 2) - 80), (this.canvas.height / 3.25));
        this.context.fillStyle = "rgba(0, 0, 0, 0.819)";
        this.context.font = "bold 20px Star Wars sans-serif";
        this.context.fillStyle = "#FFE81F";
        this.context.fillText("Give Up", ((this.canvas.width / 2) - 80), (this.canvas.height / 2.5));
        this.context.fillText("Back to Menu", ((this.canvas.width / 2) - 80), (this.canvas.height / 2));
        this.context.fillText("Quests", ((this.canvas.width / 2) - 80), (this.canvas.height / 1.7));

        const Menu = new Path2D();
        const GiveUp = new Path2D();
        const Quests = new Path2D();
        Menu.rect(this.canvas.width / 4, this.canvas.height / 2.2, this.canvas.width / 2, this.canvas.height / 12);
        GiveUp.rect(this.canvas.width / 4, this.canvas.height / 2.8, this.canvas.width / 2, this.canvas.height / 12);
        Quests.rect(this.canvas.width / 4, this.canvas.height / 1.8, this.canvas.width / 2, this.canvas.height / 12);
        this.context.fillStyle = "#ffffff00";
        this.context.fill(Menu);
        this.context.fill(GiveUp);
        this.context.fill(Quests);


        this.canvas.addEventListener('click', function (event) {
            // Check whether point is inside correct rect
            if (myGameArea.context.isPointInPath(Menu, event.offsetX, event.offsetY)) {
                window.location.href = "menu.html";

            }
            else if (myGameArea.context.isPointInPath(GiveUp, event.offsetX, event.offsetY)) {
                window.location.href = "game_is_over.html";
            }

            else if (myGameArea.context.isPointInPath(Quests, event.offsetX, event.offsetY)) {
                window.location.href = "quests.html";
            }
        });
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
function CheckIfDestroyed(obstacle) {
    var levels = JSON.parse(window.localStorage.getItem('level'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    var currentLevel = levels.levels.find(level => level['difficulty'] == user['difficulty']);
    var nextIndex = levels.levels.indexOf(currentLevel) + 1;
    user['quest1'] = QuestKillMobs > 3 && nextIndex - 1 == game_level.level ? true : false;
    localStorage.setItem("user", JSON.stringify(user));


    // player vs enemies/boss
    if (obstacle.name == "blast" && obstacle.width != -1) {
        for (i = 0; i < myObstacles.length; i++) {
            if (checkObstaclesDestroyed(obstacle, myObstacles[i])) {

                myObstacles[i].hpChange();
                obstacle.vx = -500;
                obstacle.vy = -500;
                obstacle.width = -1;
                obstacle.height = -1;
                if (myObstacles[i].hp <= 0) {
                    QuestKillMobs++;

                    obstacle.vx = -500;
                    obstacle.vy = -500;
                    obstacle.width = -1;
                    obstacle.height = -1;
                    myObstacles[i].vx = -500;
                    myObstacles[i].vy = -500;
                    myObstacles[i].width = -1;
                    myObstacles[i].height = -1;

                    obstacle.vx = -500;
                    obstacle.vy = -500;
                    obstacle.width = -1;
                    obstacle.height = -1;
                    updateScore();
                }


            }
        }
        if (QuestKillMobs == bossAppearKills && myBoss.Appeared) {
            if (checkObstaclesDestroyed(obstacle, myBoss)) {
                if (myBoss.hp > 0) {
                    myBoss.hpChange();
                    obstacle.vx = -500;
                    obstacle.vy = -500;
                    obstacle.width = -1;
                    obstacle.height = -1;
                }
                else {
                    var newUser = JSON.parse(localStorage.getItem('user'));
                    newUser['quest2'] = true;
                    localStorage.setItem("user", JSON.stringify(newUser));
                    QuestKillMobs++;
                    myBoss.vx = -500;
                    myBoss.vy = -500;
                    myBoss.width = -1;
                    myBoss.height = -1;
                    obstacle.vx = -500;
                    obstacle.vy = -500;
                    obstacle.width = -1;
                    obstacle.height = -1;
                    myBoss.Alive = false;
                    myBoss.Appeared = false;
                    updateScore();
                }

            }
        }


    }
    //player crashs/gets hits, enemies crash
    if (checkObstaclesDestroyed(obstacle, myGamePiece) && obstacle.name != "blast" && obstacle.width != -1) {
        myGamePiece.hpChange();
        if (obstacle.name == "boss") {
            obstacle.hpChange();
            if (obstacle.hp <= 0) {
                QuestKillMobs++;
                obstacle.vx = -500;
                obstacle.vy = -500;
                obstacle.width = -1;
                obstacle.height = -1;
                updateScore();

            }
        }
        if (myGamePiece.hp <= 0) {
            updateScore(1);
            myGameArea.clear();
            myGameArea.stop();

            for (i = 0; i < myObstacles.length; i++) {
                myObstacles[i].vx = -500;
                myObstacles[i].vy = -500;
                myObstacles[i].width = -1;
                myObstacles[i].height = -1;
            }
            for (let i of Weapons) {
                for (let j of i) {
                    j.vx = -500;
                    j.vy = -500;
                    j.width = -1;
                    j.height = -1;
                }
            }
            for (let i of bossWeapon) {

                i.vx = -500;
                i.vy = -500;
                i.width = -1;
                i.height = -1;

            }
            myObstacles = [];
            Weapons = [[]];
            bossWeapon = [];
            myBoss.vx = -500;
            myBoss.vy = -500;
            myBoss.width = -1;
            myBoss.height = -1;
            GameIsOver();

        }
        else if (obstacle.name != "boss" && obstacle.name != "enemy") {

            obstacle.vx = -500;
            obstacle.vy = -500;
            obstacle.width = -1;
            obstacle.height = -1;

        }
        else if (obstacle.name == "enemy") {
            obstacle.hpChange();
            if (obstacle.hp <= 0) {
                QuestKillMobs++;
                obstacle.vx = -500;
                obstacle.vy = -500;
                obstacle.width = -1;
                obstacle.height = -1;
                var levels = JSON.parse(window.localStorage.getItem('level'));
                var user = JSON.parse(window.localStorage.getItem('user'));
                var currentLevel = levels.levels.find(level => level['difficulty'] == user['difficulty']);
                var nextIndex = levels.levels.indexOf(currentLevel) + 1;
                user['quest1'] = QuestKillMobs > 17 && nextIndex - 1 == game_level.level ? true : false;
                localStorage.setItem("user", JSON.stringify(user));

            }
        }


    }
}
document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "Escape":
            pause();

    }
})

function updateGameArea() {
    var x, y;
    var weapon_id = 0;

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(6)) {
        if (myGameArea.keys && myGameArea.keys[32]) {
            myGameArea.canvas.click();
        }
    }
    if (myGameArea.frameNo == 1 || everyinterval(current_level.enemy_respawn_frequency)) {

        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        if (QuestKillMobs < bossAppearKills || QuestKillMobs > bossAppearKills) {
            var Enemy = new enemy(45, 45, "https://pngimg.com/uploads/starwars/starwars_PNG53.png", 100, 100, "image");
            myObstacles.push(Enemy);

            for (i = 0; i < myObstacles.length; i += 1) {
                var weapon1 = new weapon(11, 11, myObstacles[i].x + 18, myObstacles[i].y + 40, 5, "https://t3.ftcdn.net/jpg/01/38/42/78/360_F_138427844_Aft7zkJlMICxCMNl5qYheOGX1PEhgSKg.jpg", "image");
                Weapons[weapon_id].push(weapon1);
            }
            weapon_id = myObstacles.length;
            bossWeapon = [];
        }
        else {
            for (i = 0; i < 3; i += 1) {
                var weapon2 = new weapon(20, 20, myBoss.x + 43 + (i * 22), myBoss.y + 250, 7, "images/gr_true.png", "image");
                bossWeapon.push(weapon2);
            }

        }


    }

    if (QuestKillMobs == 20) {


        updateScore();
        myObstacles = [];
        Weapons = [[]];
        bossWeapon = [];

        myGameArea.clear();
        myGameArea.stop();

        Congrats();
    }

    if (QuestKillMobs == bossAppearKills && myBoss.Alive == false) {

        for (i = 0; i < myObstacles.length; i++) {
            myObstacles[i].vx = -500;
            myObstacles[i].vy = -500;
            myObstacles[i].width = -1;
            myObstacles[i].height = -1;
        }
        for (let i of Weapons) {
            for (let j of i) {
                j.vx = -500;
                j.vy = -500;
                j.width = -1;
                j.height = -1;
            }
        }
        myObstacles = [];
        Weapons = [[]];

        myBoss.Alive = true;
        myBoss.Appeared = true;

    }

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) moveleft();
    if (myGameArea.keys && myGameArea.keys[39]) moveright();
    if (myGameArea.keys && myGameArea.keys[38]) moveup();
    if (myGameArea.keys && myGameArea.keys[40]) movedown();

    if (myGameArea.keys && myGameArea.keys[65]) moveleft();
    if (myGameArea.keys && myGameArea.keys[68]) moveright();
    if (myGameArea.keys && myGameArea.keys[87]) moveup();
    if (myGameArea.keys && myGameArea.keys[83]) movedown();



    //drag 
    if (myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
    }


    myBackground.newPos();
    myBackground.update();
    //myGamePiece.onmousedown();
    myGamePiece.newPos();
    myGamePiece.update();


    playerBlaster.forEach(blast => {
        blast.newPos()
        blast.update()

        CheckIfDestroyed(blast);

    })
    if (myBoss.Appeared == true) {
        myBoss.bossMove();
        myBoss.update();
        CheckIfDestroyed(myBoss);

        for (let i of bossWeapon) {


            i.move();
            i.update();
            CheckIfDestroyed(i);

        }

    }
    if (QuestKillMobs != bossAppearKills) {
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].enemyMove();
            myObstacles[i].update();
            CheckIfDestroyed(myObstacles[i]);
        }
        for (let i of Weapons) {
            for (let j of i) {


                j.move();
                j.update();
                CheckIfDestroyed(j);
            }
        }
    }
    myTotalScore.text = "Total killed for game: " + QuestKillMobs;
    myHpScore.text = "HP: " + myGamePiece.hp;

    myHpScore.update();
    myTotalScore.update();
    myBackground.speedY = 1;

}
function getRandomEnemyPosition(minGap, maxGap) {
    return Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
}
function blast(url, type, x, y) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = 300 * .10;
    this.height = 300 * .10;
    this.speedX = 0;
    this.speedY = -10;
    this.x = x;
    this.name = "blast";
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y == (this.height)) {
                this.y = 0;
            }

        }
        else {
            this.hitBoundary()
        }
    }
    this.hitBoundary = function () {
        var boundarytop = 0;

        if (this.y == boundarytop) {
            this.width = -1;
            this.height = -1;
            this.x = -500;
            this.y = -500;
        }

    }

}
function weapon(width, height, x, y, speed, url, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = speed;
    this.name = "weapon";

    this.update = function () {
        ctx = myGameArea.context;

        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }

    }
    this.move = function () {
        this.y += this.vy;
    }
}
function checkObstaclesDestroyed(a, b) {

    return a.x <= (b.x + b.width) &&
        b.x <= (a.x + a.width) &&
        a.y <= (b.y + b.height) &&
        b.y <= (a.y + a.height);

}
function boss(width, height, url, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vx = 3.0;
    this.hp = current_level.boss_hp;
    this.vy = 0.0;
    this.Alive = false;
    this.Appeared = false;
    this.direction = 1;
    this.name = "boss";
    this.update = function () {
        ctx = myGameArea.context;

        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }

    }


    this.bossMove = function () {
        this.x += this.vx * this.direction;
        this.y += this.vy;

        if (this.type == "background") {
            if (this.y == (this.height)) {
                this.y = 0;
            }

        }
        else {
            this.hitBoundary()
        }
    }
    this.hpChange = function () {
        this.hp--;
    }

    this.hitBoundary = function () {

        var boundaryright = myGameArea.canvas.width - this.width;
        var boundaryLeft = 0;

        if (this.x <= boundaryLeft) {

            this.direction = 1;
        }
        if (this.x >= boundaryright) {

            this.direction = -1;
        }
    }
}

function enemy(width, height, url, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = width;
    this.height = height;
    this.x = x + getRandomEnemyPosition(this.width / 2, myGameArea.canvas.width - this.width * 3);
    this.y = y;
    this.vx = current_level.enemy_speed_vx;
    this.vy = current_level.enemy_speed_vy;
    this.hp = current_level.enemy_hp;
    this.direction = 1;
    this.name = "enemy";
    this.update = function () {
        ctx = myGameArea.context;

        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }

    }

    this.destroy = function () {
        this.isHit = true;
        this.vy = -200;
    }
    this.hpChange = function () {
        this.hp--;
    }

    this.enemyMove = function () {
        this.x += this.vx * this.direction;
        this.y += this.vy;

        if (this.type == "background") {
            if (this.y == (this.height)) {
                this.y = 0;
            }

        }
        else {
            this.hitBoundary()
        }
    };

    this.hitBoundary = function () {

        var boundaryright = myGameArea.canvas.width - this.width;
        var boundaryLeft = 0;

        if (this.x <= boundaryLeft) {

            this.direction = 1;
        }
        if (this.x >= boundaryright) {

            this.direction = -1;
        }
    }
}
function ship(url, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = 341 * .12;
    this.name = "ship";
    this.height = 692 * .12;
    this.speedX = 0;
    this.speedY = 0;
    this.x = myGameArea.canvas.width / 2 - this.width / 2;
    this.y = myGameArea.canvas.height - this.height / 2;
    this.hp = current_level.player_hp;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }

    }

    this.destroy = function () {

        window.location.href = "game_is_over.html";
    }
    this.hpChange = function () {
        this.hp--;
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y == (this.height)) {
                this.y = 0;
            }

        }
        else {
            this.hitBoundary()
        }
    }
    // if space ship goes throw the boundary
    this.hitBoundary = function () {
        var boundarybottom = myGameArea.canvas.height - this.height - 50;
        var boundarytop = 0 + this.height - 50;
        var boundaryright = myGameArea.canvas.width;
        var boundaryLeft = 0 - this.width
        if (this.y > boundarybottom) {
            this.y = boundarybottom;
        }
        if (this.y < boundarytop) {
            this.y = boundarytop;
        }
        if (this.x < boundaryLeft) {
            this.x = boundaryright
        }
        if (this.x > boundaryright) {
            this.x = 0
        }
    }
}
function background(width, height, url, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.y == (this.height)) {
                this.y = 0;
            }

        }
    }
}

function moveup() {
    myGamePiece.speedY -= 15;
}

function movedown() {
    myGamePiece.speedY += 15;
}

function moveleft() {
    myGamePiece.speedX -= 15;
}

function moveright() {
    myGamePiece.speedX += 15;
}

function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}
function TryAgain() {
    window.location.href = "game.html";
}
function BackToMenu() {
    window.location.href = "menu.html";
}
function GameIsOver() {
    window.location.href = "game_is_over.html";
}
function Congrats() {
    window.location.href = "congratulations_game.html";
}


function pause() {
    if (pause_game == false) {
        pause_game = true;

        myGameArea.stop();
        myGameArea.pauseMenu();

    }
    else {
        pause_game = false;
        myGameArea.resume();
    }


}
function checkUser() {
    user = window.localStorage.getItem('user');
    if (user) {
        // location.replace("menu.html")
        window.location.href = "menu.html";

    }
    else {
        // location.replace("nickname.html")
        window.location.href = "nickname.html";
    }
}

function submiteForm() {
    var nickname = document.getElementById("nickname").value
    fetchLevels();
    const newUser = {
        name: nickname,
        score: 0,
        dies: 0,
        background: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
        difficulty: "youngling",
        quest1: false,
        quest2: false,
        total: 0
    }

    const current_level = {
        level: 0
    }

    if (nickname) {
        window.localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('current-level', JSON.stringify(current_level))
        window.location.href = "menu.html";

    }
}

function updateScore(die) {
    var user = JSON.parse(localStorage.getItem('user'));
    death = user['dies'];
    score = user['score'];
    user['score'] = QuestKillMobs > score ? QuestKillMobs : score;
    user['dies'] = death + die;
    localStorage.setItem("user", JSON.stringify(user));
}

function checkBackground() {
    var body = document.getElementsByTagName('body')[0];
    user = JSON.parse(window.localStorage.getItem('user'));

    body.style.backgroundImage = "url('" + user['background'] + "')";
}

function checkDifficulty() {
    var difficultyDiv = document.getElementById("difficulty-div").children;
    var levels = JSON.parse(window.localStorage.getItem('level'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    for (level in levels.levels) {
        if (levels.levels[level]['difficulty'] == user['difficulty']) {
            for (let i = parseInt(level) + 1; i < levels.levels.length; i++) {
                console.log(i);
                difficultyDiv[i].href = "#";
            }
            break;
        }
    }
}

function checkLevel() {
    var levelField = document.getElementById('level');
    var levels = JSON.parse(window.localStorage.getItem('level'));
    var user = JSON.parse(window.localStorage.getItem('user'));
    var currentLevel = levels.levels.find(level => level['difficulty'] == user['difficulty']);
    var nextIndex = levels.levels.indexOf(currentLevel) + 1;

    var game_level = JSON.parse(window.localStorage.getItem('current-level'));
    levelField.textContent = levels.levels[game_level.level].difficulty;

    if (game_level.level < nextIndex - 1) {
        document.getElementById('quest-status1').textContent = "done";
        document.getElementById('quest-status2').textContent = "done";
    }

    else {
        if (user['quest1'] && user['quest2']) {
            if (nextIndex <= 4) {
                console.log(levels.levels[nextIndex]['difficulty']);
                user['difficulty'] = levels.levels[nextIndex]['difficulty'];
                user['quest1'] = false;
                user['quest2'] = false;
                localStorage.setItem("user", JSON.stringify(user));
                // document.getElementById('level').textContent = user['difficulty'];

            }
        }
        console.log(nextIndex - 1)
        console.log(game_level.level)
        if (user['quest1']) {
            document.getElementById('quest-status1').textContent = "done";
        }
        if (user['quest2']) {
            document.getElementById('quest-status2').textContent = "done";
        }
    }
}

function checkResult() {
    var user = JSON.parse(window.localStorage.getItem('user'));

    document.getElementById('total').textContent = user['total'];
    document.getElementById('max-killed').textContent = user['score'];
    document.getElementById('max-rank').textContent = user['difficulty'];
    document.getElementById('max-death').textContent = user['dies'];
}