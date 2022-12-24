var myGamePiece;
var myGameEnemy;
var myObstacles = [];
var Weapons = [[]];
var playerBlaster = [];
var myBackground;
var QuestKillMobs = 0;
var pause_game = false;
var myTotalScore;
var myHpScore;
var angel;
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
        console.log("asd")
        window.location.href = "mobile-game.html";
    }
    else {

        startGame()
    }
}

function startGyroscopeGame() {
    let sensor = new Gyroscope();
    sensor.start();

    // sensor.onreading = () => {
    //     document.getElementById("gyroscope-z").textContent = "Z: " + sensor.z
    //     document.getElementById("gyroscope-x").textContent = "X: " + sensor.x
    //     document.getElementById("gyroscope-y").textContent = "Y: " + sensor.y
    // };

    sensor.onerror = event => console.log(event.error.name, event.error.message);

}


function startGame() {
    myGameArea.start();
    

    myGamePiece = new ship("https://www.nicepng.com/png/full/36-365566_jedistarfighter-detail-star-wars-jedi-starfighter-top-view.png", "image");
    //myGameEnemy = new enemy(75,75, "https://pngimg.com/uploads/starwars/starwars_PNG53.png", 100, 0, "image");
    myBackground = new background(innerWidth, innerHeight, "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80", 0, 0, "background");
    //myGameEnemy =  new enemy(75,75, "https://pngimg.com/uploads/starwars/starwars_PNG53.png", 100, 0, "image");
    //<p class="quests">Enemies killed:<span id= "killedMobs"></span></p>
    myTotalScore = new info(innerWidth / 10, innerHeight / 12, "text");
    myHpScore = new info(innerWidth / 10, innerHeight / 8, "text");

}
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
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        window.addEventListener('space', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
        })
        
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    resume: function(){
        this.interval = setInterval(updateGameArea, 20);
    },
    pauseMenu: function(){
        
        this.context.fillStyle = "rgba(0, 0, 0, 0.819)";
        this.context.fillRect(this.canvas.width/4, this.canvas.height/4, this.canvas.width/2, this.canvas.height/2);
        this.context.fillStyle = "rgba(21, 21, 21, 21.819)";
        this.context.fillRect(this.canvas.width/4, this.canvas.height/4, this.canvas.width/2, this.canvas.height/10);
        this.context.font = "bold 25px Star Wars sans-serif";
        this.context.fillStyle = "#FFE81F";
        
        this.context.fillText("Game is paused",((this.canvas.width/2) - 80), (this.canvas.height/3.25));
        this.context.fillStyle = "rgba(0, 0, 0, 0.819)";
        this.context.font = "bold 20px Star Wars sans-serif";
        this.context.fillStyle = "#FFE81F";
        this.context.fillText("Give Up",((this.canvas.width/2)-80), (this.canvas.height/2.5));
        this.context.fillText("Back to Menu",((this.canvas.width/2)-80), (this.canvas.height/2));
        this.context.fillText("Quests",((this.canvas.width/2)-80), (this.canvas.height/1.7));

        const Menu = new Path2D();
        const GiveUp = new Path2D();
        const Quests = new Path2D();
        Menu.rect(this.canvas.width/4, this.canvas.height/2.2, this.canvas.width/2, this.canvas.height/12);
        GiveUp.rect(this.canvas.width/4, this.canvas.height/2.8, this.canvas.width/2, this.canvas.height/12);
        Quests.rect(this.canvas.width/4, this.canvas.height/1.8, this.canvas.width/2, this.canvas.height/12);
        this.context.fillStyle = "#ffffff00";
        this.context.fill(Menu);
        this.context.fill(GiveUp);
        this.context.fill(Quests);
        
        
        this.canvas.addEventListener('click', function(event) {
            // Check whether point is inside correct rect
            if (myGameArea.context.isPointInPath(Menu, event.offsetX, event.offsetY)) {
                window.location.href = "index.html";

            }
            else if (myGameArea.context.isPointInPath(GiveUp, event.offsetX, event.offsetY)){
                window.location.href = "game_is_over.html";
            }
            else if (myGameArea.context.isPointInPath(Quests, event.offsetX, event.offsetY)){
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


    // player vs enemies
    if(obstacle.name == "blast")
    {
        for (i = 0; i < myObstacles.length; i++)
        {
            if (checkObstaclesDestroyed(obstacle, myObstacles[i]))
            {
                QuestKillMobs++;
                //console.log(QuestKillMobs);
                myObstacles[i].vx = -500;
                myObstacles[i].vy = -500;
                myObstacles[i].width = -1;
                myObstacles[i].height = -1;
                obstacle.vx = -500;
                obstacle.vy = -500;
                updateScore();
            }
        }
        
        
    }
    //player crashs/gets hits, enemies crash
    if(checkObstaclesDestroyed(obstacle, myGamePiece) && obstacle.name != "blast") {
        myGamePiece.hpChange();
        
        if(myGamePiece.hp <= 0)
        {
        updateScore(1);
        myGameArea.clear();
        myGameArea.stop();
        myGamePiece.destroy();
        for(i = 0; i < myObstacles.length; i++)
        {
            myObstacles[i].vx = -500;
            myObstacles[i].vy = -500;
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
        Weapons =[[]];
        }
        else{
            
            obstacle.vx = -500;
            obstacle.vy = -500;
            obstacle.width = -1;
            obstacle.height = -1;
        }
    }
}
document.addEventListener('keydown', function (e) {
    switch (e.code) {
        case "Escape":
            pause();
           
    }
})
let sensor = new Gyroscope();
sensor.start();
sensor.onreading = () => {
    myGamePiece.x -= sensor.z * 80;
};
// myGamePiece.x -= angel
sensor.onerror = errorHandler;
function errorHandler(event) {
    console.log(event.error.name, event.error.message);
}
function updateGameArea() {
    var x, y;
    var weapon_id = 0;
    
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        
        
        var Enemy = new enemy(75,75, "https://pngimg.com/uploads/starwars/starwars_PNG53.png", 100, 100, "image");
        myObstacles.push(Enemy);
        
        for (i = 0; i < myObstacles.length; i+=1){
            var weapon1 = new weapon(15,15,myObstacles[i].x+28,myObstacles[i].y+50,4,"https://t3.ftcdn.net/jpg/01/38/42/78/360_F_138427844_Aft7zkJlMICxCMNl5qYheOGX1PEhgSKg.jpg","image");
            Weapons[weapon_id].push(weapon1);   
        }
        weapon_id = myObstacles.length;
    }
   
    if (QuestKillMobs == 50)
    {
        QuestKillMobs = 0;
        GameIsOver();
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

    if (myGameArea.keys && myGameArea.keys[32]) {
        blaster = new blast("https://www.pngarts.com/files/11/Green-Laser-PNG-Image.png", "image", myGamePiece.x, myGamePiece.y - 10);
        myGamePiece.newPos();
        playerBlaster.push(blaster);
    }
    
    /*if (myGameArea.keys && myGameArea.keys[27]) {
        pause();
    }*/
   
    
    myBackground.newPos();
    myBackground.update();
    myGamePiece.newPos();
    myGamePiece.update();
    playerBlaster.forEach(blast => {
        blast.newPos()
        blast.update()
        
        CheckIfDestroyed(blast);
        
    })
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
    this.speedY = -3;
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

    }
}
function weapon(width,height, x,y,speed, url, type)
{
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
    this.move = function (){
        this.y += this.vy;
    }
}
function checkObstaclesDestroyed(a,b)
{
    
		return  a.x <= (b.x + b.width) &&
				b.x <= (a.x + a.width) &&
				a.y <= (b.y + b.height) &&
				b.y <= (a.y + a.height);
	
}
function enemy(width,height, url, x, y, type)
{
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = url;
    }
    this.width = width;
    this.height = height;
    this.x = x + getRandomEnemyPosition(this.width/2,myGameArea.canvas.width-this.width*3);
    this.y = y;
    this.vx= 0.0;
    this.vy= 2.5;
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
        
	this.destroy = function()
    {
        this.isHit = true;
        this.vy = -200;
    }
   
    this.enemyMove = function() {
        this.x += this.vx;
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
        var boundarybottom = myGameArea.canvas.height;
        var boundarytop = 0 + this.height;
        var boundaryright = myGameArea.canvas.width;
        var boundaryLeft = 0 - this.width;
        /*if (this.y > boundarybottom) {
            this.y = boundarytop;
            //this.x = 0;
        }*/
        
        if (this.x < boundaryLeft) {
            this.x = boundaryright
        }
        if (this.x > boundaryright) {
            this.x = 0
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
    this.hp = 10;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
            }
        }

        // else {
        //     ctx.fillStyle = color;
        //     ctx.fillRect(this.x, this.y, this.width, this.height);
        // }
    }
    this.destroy = function(){
        //startGame();
        window.location.href = "game_is_over.html";
    }
    this.hpChange = function()
    {
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
function TryAgain()
{
    window.location.href = "game.html";
}
function BackToMenu()
{
    window.location.href = "index.html";
}
function GameIsOver()
{
    window.location.href = "game_is_over.html";
}


function pause()
{
    if(pause_game == false)
    {
    pause_game = true;
    
    myGameArea.stop();
    myGameArea.pauseMenu();
    
    }
    else{
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

    const newUser = {
        name: nickname,
        score: 0,
        dies: 0
    }

    if (nickname) {
        window.localStorage.setItem('user', JSON.stringify(newUser));
        // location.replace("menu.html")
        window.location.href = "menu.html";

    }
}

function updateScore(die) {
    var user = JSON.parse(localStorage.getItem('user'));
    nickname = user['name']
    death = user['dies']
    score = user['score'];
    var newUser = {
        name: nickname,
        score: QuestKillMobs > score ? QuestKillMobs : score,
        dies: death + die
    }
    localStorage.setItem("user", JSON.stringify(newUser));
}
