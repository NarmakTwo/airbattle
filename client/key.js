var key = {
	"up":false,
	"down":false,
	"left":false,
	"right":false,
	"space":false,
	"shift":false,
	"z":false,
	"x":false,
	"c":false,
  "w":false,
  "a":false,
  "s":false,
  "d":false,
  "q":false,
  "e":false,
  "i":false,
  "k":false,
  "j":false,
  "r":false,
  "o":false,
  "l":false
};
var afnc = {
	"ArrowUp":"up",
	"ArrowDown":"down",
	"ArrowLeft":"left",
	"ArrowRight":"right",
	"Shift":"shift",
	"z":"z",
	"x":"x",
	"c":"c",
  "w":"w",
  "a":"a",
  "s":"s",
  "d":"d",
  "q":"q",
  "e":"e",
  "i":"i",
  "k":"k",
  "j":"j",
  "r":"r",
  "o":"o",
  "l":"l"
}

//キー入力の判定プログラム in 折りたたみ用if文
if (true) {
	window.addEventListener('keydown', event => {
		if (event.key === " ") {
			key.space = true;
		}else if (event.key !== "undefined") {
			key[afnc[event.key]] = true;
		}
	});

	window.addEventListener('keyup', event => {
		if (event.key === " ") {
			key.space = false;
		}else if (event.key !== "undefined") {
			key[afnc[event.key]] = false;
		}
	});
}
