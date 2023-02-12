class GameOverPosition {
    constructor() {}
    draw(play) {
        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = "40px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillStyle = '#ffff';
        ctx.fillText("Non!!!!!!", play.width / 2, play.height / 2 - 120);
        ctx.font = "36px Comic Sans MS";
        ctx.fillStyle = '#FE2EF7';
        ctx.fillText("Bạn đã chơi tới level " + play.level + " và điểm của bạn là " + play.score + ".", play.width / 2, play.height / 2 - 40);
        ctx.font = "36px Comic Sans MS";
        ctx.fillStyle = '#ff4d4d';
        ctx.fillText("Nhấn 'Space' để tiếp tục.", play.width / 2, play.height / 2 + 40);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 32) {
            play.goToPosition(new OpeningPosition());
        }
    }
}