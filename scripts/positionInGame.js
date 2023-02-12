class InGamePosition {
    constructor(setting, level) {
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.mann = null;
        this.bullets = [];
        this.lastBulletTime = null;
        this.ufos = [];
        this.bombs = [];
    }
    entry(play) {


        this.man_image = new Image();
        this.ufo_image = new Image();
        this.upSec = this.setting.updateSeconds;
        this.turnAround = 1;
        this.horizontalMoving = 1;
        this.verticalMoving = 0;
        this.ufosAreSinking = false;
        this.ufoPresentSinkingValue = 0;

        let presentLevel = this.level < 11 ? this.level : 10;

        this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7);

        this.bombSpeed = this.setting.bombSpeed + (presentLevel * 10);

        this.bombFrequency = this.setting.bombFrequency + (presentLevel * 0.05); 

        this.manSpeed = this.setting.manSpeed;
        this.object = new Objects();
        this.mann = this.object.man((play.width / 2), play.playBoundaries.bottom, this.man_image);
        const lines = this.setting.ufoLines;
        const columns = this.setting.ufoColumns;
        const ufosInitial = [];
        let line, column;
        for (line = 0; line < lines; line++) {
            for (column = 0; column < columns; column++) {
                this.object = new Objects();
                let x, y;
                x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
                y = (play.playBoundaries.top + 30) + (line * 30);
                ufosInitial.push(this.object.ufo(x, y, line, column, this.ufo_image, this.level));
            }
        }
        this.ufos = ufosInitial;
    }
    update(play) {
        const mann = this.mann;
        const manSpeed = this.manSpeed;
        const upSec = this.setting.updateSeconds;
        const bullets = this.bullets;

        if (play.pressedKeys[37]) {
            mann.x -= manSpeed * upSec;
        }
        if (play.pressedKeys[39]) {
            mann.x += manSpeed * upSec;
        }
        if (play.pressedKeys[38]) {
            mann.y -= manSpeed * upSec;
        }

        if (play.pressedKeys[40]) {
            mann.y += manSpeed * upSec;
        }

        if (play.pressedKeys[32]) {
            this.shoot();
        }
        if (mann.y > play.playBoundaries.bottom) {
            mann.y = play.playBoundaries.bottom;
        }
        if (mann.y < play.playBoundaries.top) {
            mann.y = play.playBoundaries.top;
        }
        if (mann.x < play.playBoundaries.left) {
            mann.x = play.playBoundaries.left;
        }
        if (mann.x > play.playBoundaries.right) {
            mann.x = play.playBoundaries.right;
        }
        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            bullet.y -= upSec * this.setting.bulletSpeed;

            if (bullet.y < 0) {
                bullets.splice(i--, 1);
            }
        }
        let reachedSide = false;
        for (let i = 0; i < this.ufos.length; i++) {
            let ufo = this.ufos[i];
            let fresh_x = ufo.x + this.ufoSpeed * upSec * this.turnAround * this.horizontalMoving;
            let fresh_y = ufo.y + this.ufoSpeed * upSec * this.verticalMoving;
            if (fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left) {
                this.turnAround *= -1;
                reachedSide = true;
                this.horizontalMoving = 0;
                this.verticalMoving = 1;
                this.ufosAreSinking = true;
            }
            if (reachedSide !== true) {
                ufo.x = fresh_x;
                ufo.y = fresh_y;
            }
        }
        if (this.ufosAreSinking == true) {
            this.ufoPresentSinkingValue += this.ufoSpeed * upSec;
            if (this.ufoPresentSinkingValue >= this.setting.ufoSinkingValue) {
                this.ufosAreSinking = false;
                this.verticalMoving = 0;
                this.horizontalMoving = 1;
                this.ufoPresentSinkingValue = 0;
            }
        }
        const frontLineUFOs = [];
        for (let i = 0; i < this.ufos.length; i++) {
            let ufo = this.ufos[i];
            if (!frontLineUFOs[ufo.column] || frontLineUFOs[ufo.column].line < ufo.line) {
                frontLineUFOs[ufo.column] = ufo;
            }
        }
        for (let i = 0; i < this.setting.ufoColumns; i++) {
            let ufo = frontLineUFOs[i];
            if (!ufo)
                continue;
            let chance = this.bombFrequency * upSec;
            this.object = new Objects();
            if (chance > Math.random()) {
                this.bombs.push(this.object.bomb(ufo.x, ufo.y + ufo.height / 2));
            }
        }
        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            bomb.y += upSec * this.bombSpeed;
            if (bomb.y > this.height) {
                this.bombs.splice(i--, 1);
            }
        }

        for (let i = 0; i < this.ufos.length; i++) {
            let ufo = this.ufos[i];
            let collision = false;
            for (let j = 0; j < bullets.length; j++) {
                let bullet = bullets[j];
                if (bullet.x >= (ufo.x - ufo.width / 2) && bullet.x <= (ufo.x + ufo.width / 2) &&
                    bullet.y >= (ufo.y - ufo.height / 2) && bullet.y <= (ufo.y + ufo.height / 2)) {

                    bullets.splice(j--, 1);
                    collision = true;
                    play.score += this.setting.pointsPerUFO;
                }
            }
            if (collision == true) {
                this.ufos.splice(i--, 1);
                play.sounds.playSound('Balloon-pop');
            }
        }
        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            if (bomb.x + 2 >= (mann.x - mann.width / 2) &&
                bomb.x - 2 <= (mann.x + mann.width / 2) &&
                bomb.y + 6 >= (mann.y - mann.height / 2) &&
                bomb.y <= (mann.y + mann.height / 2)) {

                this.bombs.splice(i--, 1);

                play.sounds.playSound('explosion');
                play.shields--; 
            }
        }
        for (let i = 0; i < this.ufos.length; i++) {
            let ufo = this.ufos[i];
            if ((ufo.x + ufo.width / 2) > (mann.x - mann.width / 2) &&
                (ufo.x - ufo.width / 2) < (mann.x + mann.width / 2) &&
                (ufo.y + ufo.height / 2) > (mann.y - mann.height / 2) &&
                (ufo.y - ufo.height / 2) < (mann.y + mann.height / 2)) {

                play.sounds.playSound('explosion');
                play.shields = -1;
            }
        }
        if (play.shields < 0) {
            play.goToPosition(new GameOverPosition());
        }
        if (this.ufos.length == 0) {
            play.level += 1;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
    shoot() {
        if (this.lastBulletTime === null || ((new Date()).getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency)) {
            this.object = new Objects();
            this.bullets.push(this.object.bullet(this.mann.x, this.mann.y - this.mann.height / 2, this.setting.bulletSpeed));
            this.lastBulletTime = (new Date()).getTime();
            play.sounds.playSound('shot');
        }
    }
    draw(play) {
        con.clearRect(0, 0, play.width, play.height);
        con.drawImage(this.man_image, this.mann.x - (this.mann.width / 2), this.mann.y - (this.mann.height / 2));
        con.fillStyle = '#ff0000';
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            con.beginPath();
            con.strokeStyle = '#ff0000';
            con.arc(bullet.x - 1, bullet.y - 6, 3, 0, Math.PI * 2);
            con.fill();

        }
        for (let i = 0; i < this.ufos.length; i++) {
            let ufo = this.ufos[i];
            con.drawImage(this.ufo_image, ufo.x - (ufo.width / 2), ufo.y - (ufo.height / 2));
        }

        con.fillStyle = "#34d5eb";
        for (let i = 0; i < this.bombs.length; i++) {
            let bomb = this.bombs[i];
            con.fillRect(bomb.x - 2, bomb.y, 4, 6);
        }

        con.font = "16px Comic Sans MS";
        con.fillStyle = "#ffff";
        con.textAlign = "left";
        con.fillText("Nhấn S để đổi sound effects ON/OFF.  Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 70);
        let soundStatus = (play.sounds.muted === true) ? "OFF" : "ON";
        con.fillStyle = (play.sounds.muted === true) ? '#FF0000' : '#0B6121';
        con.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);
        con.fillStyle = '#ffff';
        con.textAlign = "right";
        con.fillText("Nhấn P để dừng.", play.playBoundaries.right, play.playBoundaries.bottom + 70);
        con.textAlign = "center";
        con.fillStyle = '#ffff';
        con.font = "bold 24px Comic Sans MS";
        con.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 75);
        con.font = "bold 30px Comic Sans MS";
        con.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);
        con.font = "bold 24px Comic Sans MS";
        con.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 75);
        con.font = "bold 30px Comic Sans MS";
        con.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);
        con.textAlign = "center";
        if (play.shields > 0) {
            con.fillStyle = '#ffff';
            con.font = "bold 24px Comic Sans MS";
            con.fillText("Khiên", play.width / 2, play.playBoundaries.top - 75);
            con.font = "bold 30px Comic Sans MS";
            con.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
        } else {
            con.fillStyle = '#ff4d4d';
            con.font = "bold 24px Comic Sans MS";
            con.fillText("CẢNH BÁO", play.width / 2, play.playBoundaries.top - 75);
            con.fillStyle = '#0B6121';
            con.fillText("Hết khiên", play.width / 2, play.playBoundaries.top - 25);
        }
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 83) { 
            play.sounds.muteSwitch();
            console.log(play);
        }
        if (keyboardCode == 80) { 
            play.pushPosition(new PausePosition());
        }
    }
}