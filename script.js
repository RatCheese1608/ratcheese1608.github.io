var serv={}, cImage, promised=0;
var qPic

const stor = "storageIndex.json";
const rand = "random.json"
var ansOpt="";
var enhel=100, plhel=100;
var enemy, player;

function getData(api, callback) {
	promised++;
	return fetch(api)
		.then(res => res.json())
		.then(dat => {
			promised-=1
			serv[api]=dat;
			if (promised==0) callback();
			return dat;
		})
		.catch(err => console.log(err))
}

function setAnsOpt(n) {
	ansOpt=n;
}

function nextImage() {
	qPic.src=serv[stor].Path+'/'+serv[stor].Images[++cImage];
}

// attack...
function attack() {
	if (ansOpt) {
		nextImage();
		if (ansOpt==serv[stor].Answers[cImage]) {
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
function main() {
	console.log("serv",serv);
	// preloading img
	var preloadImage = new Image();
	let i=0;
	let preloading = setInterval(()=>{
		if (i==9) {
			clearInterval(preloading);
		}
		let filename = serv[stor].Images[i];
		preloadImage.src=serv[stor].Path+'/'+filename;
		i++;
	},250);

	// set the first pic
	cImage=0;
	qPic.src=serv[stor].Path+'/'+serv[stor].Images[cImage];
}

// load from api
getData('storageIndex.json', main)
getData('random.json', main)