var serv={}, cImage, promised=0;
var qPic;
var infbox;

const stor = "storageIndex.json";
const rand = "random.json"

var lock = true;
var ansOpt="";
var attcc=0;
var enemy={hp:100}, player={hp:100};

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

function updtinfo(n) {
	if (infbox.textContent==n) return;
	console.log("infobox:",n);
	infbox.style.opacity = 0;
	setTimeout(()=>{
		infbox.textContent=n;
		infbox.style.opacity = 100;
	},150);
}

function upd_hel(item, dec) {
	item['hp']-=dec;
	item['elm'].style.width=item['hp']+'%';
}

function en_att() {
	upd_hel(player,20);
	updtinfo("Sang Golden Rat menghancurkan Sang Regular Rat!")
	setTimeout(()=>lock=false, 200);
}

// attack...
function attack() {
	if (lock) return
	lock = true;
	upd_hel(enemy,10);
	updtinfo("Sang Regular Rat menyerang Sang Golden Rat!");
	setTimeout(en_att,1000);
}

// defend...
function defend() {
	nextImage();
	plhel-=15;
	player.textContent = Math.max(plhel,0);
	setTimeout(()=>{if (plhel<=0) alert("Kamu Kalah!");},100);
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

// load variables & api only when web has loaded
window.onload = ()=> {
	qPic = document.querySelector('img[alt="question pic"]')
	enemy['elm'] = document.querySelector("#enemy-container .hpdisplay");
	player['elm'] = document.querySelector("#player-container .hpdisplay");
	infbox = document.querySelector("#actinfo p")
	getData('storageIndex.json', main)
	getData('random.json', main)
	lock=false;
}