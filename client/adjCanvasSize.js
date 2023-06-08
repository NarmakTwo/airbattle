let cover = document.getElementById("cover");

resizeWindow();

window.addEventListener("resize",resizeWindow);

function resizeWindow() {
	let screen_height = window.innerHeight;
	screen_height *= 0.9;
	let screen_width = window.innerWidth;
	screen_width *= 0.9;
	
	if ((screen_height/screen_width) > 0.75) {
		//縦のほうが長い
    cover.style.width = screen_width + "px";
    cover.style.height = (screen_width * 0.75) + "px";
    canvas.style.width = screen_width + "px";
    canvas.style.height = (screen_width * 0.75) + "px";
	}else{
		//横の方が長い
    cover.style.width = (screen_height * 1.3333) + "px";
    cover.style.height = screen_height + "px";
    canvas.style.width = (screen_height * 1.3333) + "px";
    canvas.style.height = screen_height + "px";
	}
}