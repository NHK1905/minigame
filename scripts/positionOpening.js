class OpeningPosition {
    constructor() {}
    draw(play) {
        con.clearRect(0, 0, play.width, play.height);
        con.font = "70px times";
        con.textAlign = "center";
        const gradient = con.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradient.addColorStop("0", "#21D4FD");
        gradient.addColorStop("1.0", "#B721FF");
        con.fillStyle = gradient;
        con.fillText("Bắn Bóng", play.width / 2, play.height / 2 - 70);
        con.fillText("Bắn Bóng", play.width / 2, play.height / 2 - 70);
        con.font = "40px Times";
        con.fillStyle = '#fff';
        con.fillText("Cố gắng tránh nước rơi từ quả bóng", play.width / 2, play.height / 2 - 40);
        con.font = "40px Times";
        con.fillText("Nhấn 'Enter' để bắt đầu.", play.width / 2, play.height / 2);
        con.fillStyle = '#fff';
        con.fillText("Phím điều khiển", play.width / 2, play.height / 2 + 130);
        con.fillText("Trái : Sang trái", play.width / 2, play.height / 2 + 190);
        con.fillText("Phải : Sang phải", play.width / 2, play.height / 2 + 220);
        con.fillText("Trên : Lên trên", play.width / 2, play.height / 2 + 260);
        con.fillText("Xuống : Đi xuống", play.width / 2, play.height / 2 + 290);
        const gradients = con.createLinearGradient((play.width / 2 - 180), (play.height / 2), (play.width / 2 + 180), (play.height / 2));
        gradients.addColorStop("0", "#0093E9");
        gradients.addColorStop("0.5", "#80D0C7");
        gradients.addColorStop("1.0", "#ffffff");
        con.fillStyle = gradients;
        con.fillText("Phím cách : Bắn bằng bằng bể bong bóng ", play.width / 2, play.height / 2 + 360);
    }
    keyDown(play, keyboardCode) {
        if (keyboardCode == 13) {
            play.level = 1;
            play.score = 0;
            play.shields = 2;
            play.goToPosition(new TransferPosition(play.level));
        }
    }
}