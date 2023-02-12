class PausePosition {
    constructor() {}
    draw(play) {
        con.clearRect(0, 0, play.width, play.height);
        con.font = "60px Times";
        con.textAlign = "center";
        const gradient = con.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradient.addColorStop("0", "#fff");
        gradient.addColorStop("0.5", "#fff");
        gradient.addColorStop("1.0", "#F29F05");
        con.fillStyle = gradient;
        con.fillText("Paused", play.width / 2, play.height / 2 - 300);

        con.font = "40px TImes";
        con.fillText("(P): back to the current game", play.width / 2, play.height / 2 - 250);
        con.fillText("(ESC): quit the current game", play.width / 2, play.height / 2 - 210);
        con.font = "40px Times";
        con.fillStyle = '#fff';
        con.fillText("Game controls reminder", play.width / 2, play.height / 2 - 120);
        con.fillStyle = '#fff';
        con.font = "40px Times";
        con.fillText("Left Arrow : Move Left", play.width / 2, play.height / 2 - 70);
        con.fillText("Right Arrow : Move Right", play.width / 2, play.height / 2 - 30);
        con.fillText("Space : Fire", play.width / 2, play.height / 2 + 10);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 80) {
            play.popPosition();
        }
        if (keyboardCode == 27) { 
            play.pushPosition(new GameOverPosition());
        }
    }
}