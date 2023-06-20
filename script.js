var serv, cImage;
var qPic

var ansOpt="";
var enhel=100, plhel=100;
var enemy, player;

// getting storage info
function getData() {
	if (serv) return Promise.resolve(serv);
	return fetch('storageIndex.json')
		.then(res => {
			// console.log("res:",res.text());
			return res.json()
		})
		.then(data => {
			console.log("data:",data);
			serv = data;
			return data;})
		.catch(err => console.log(err));
}

function setAnsOpt(n) {
	ansOpt=n;
}

function nextImage() {
	qPic.src=serv.Path+'/'+serv.Images[++cImage];
}

// attack...
function attack() {
	if (ansOpt) {
		nextImage();
		if (ansOpt==serv.Answers[cImage]) {
			enhel-=10;
			enemy.textContent = Math.max(enhel,0);
			setTimeout(()=>{if (enhel<=0) alert("Selamat! Kamu Menang!");},100);
		} else {
			plhel-=30;
			player.textContent = Math.max(plhel,0);
			setTimeout(()=>{if (plhel<=0) alert("Kamu Kalah!");},100);
		}
		ansOpt=""
	}
}

// defend...
function defend() {
	nextImage();
	plhel-=15;
	player.textContent = Math.max(plhel,0);
	setTimeout(()=>{if (plhel<=0) alert("Kamu Kalah!");},100);
}

// load variables only when web has loaded
window.onload = ()=> {
	qPic = document.querySelector('img[alt="question pic"]')
	enemy = document.querySelector("h1#enemy");
	player = document.querySelector("h1#player");
}

// main basically
getData().then(dat=>{
	serv = dat;
	console.log("serv:", serv);

	// preloading img
	var preloadImage = new Image();
	let i=0;
	let preloading = setInterval(()=>{
		if (i==9) {
			clearInterval(preloading);
		}
		let filename = serv.Images[i];
		preloadImage.src=serv.Path+'/'+filename;
		i++;
	},250);

	// set the first pic
	cImage=0;
	qPic.src=serv.Path+'/'+serv.Images[cImage];
}).catch(err => console.log(err));