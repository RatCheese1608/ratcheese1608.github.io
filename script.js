var serv={}, cImage, promised=0;
var qPic;
var infbox;
var cheese;

const stor = "storageIndex.json";
const rand = "random.json"

var lock = true;
var ansOpt="";
var turn=1;
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

function getOffTop(elm) {
	let total = 0;
	while (elm) {
		total += elm.offsetTop;
		elm = elm.offsetParent;
	}
	return total;
}

function getOffLeft(elm) {
	let total = 0;
	while (elm) {
		total += elm.offsetLeft;
		elm = elm.offsetParent;
	}
	return total;
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

function q_event() {
	console.log('Question TIME!')
}

function upd_hel(item, dec) {
	item['hp']=Math.max(item['hp']-dec, 0);
	item['elm'].style.width=item['hp']+'%';
}

function en_att() {
	upd_hel(player,20);
	updtinfo("Sang Golden Rat menghancurkan Sang Regular Rat!")
	setTimeout(()=>lock=false, 200);
}

function cheesefly(source, target) {
	let sourceTop = getOffTop(source);
	let sourceLeft = getOffLeft(source);
	let targetTop = getOffTop(target);
	let targetLeft = getOffLeft(target);
	let chez = {
		'width':cheese.querySelector('img').width,
		'height':cheese.querySelector('img').height
	}
	cheese.style.top=sourceTop+(source.height-chez.height)/2+'px';
	cheese.style.left=sourceLeft+(source.width-chez.width)/2+'px';
	setTimeout(()=>{
		cheese.style.transitionDuration='.4s';
		cheese.style.opacity="100";
		cheese.style.top=targetTop+(target.height-chez.height)/2+'px';
		cheese.style.left=targetLeft+(target.width-chez.width)/2+'px';
		setTimeout(()=>{
			cheese.style.transitionDuration='.1s';
			cheese.style.opacity="0";
		},500)
	},100);
}

// attack...
function attack() {
	if (!turn%3) {
		q_event()
		return;
	}
	if (lock) return
	lock = true;
	cheesefly(player['img'],enemy['img'])
	setTimeout(()=>{
		upd_hel(enemy,10);
		updtinfo("Sang Regular Rat menyerang Sang Golden Rat!");
	},600);
	setTimeout(en_att,1000);
	turn++;
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
	enemy['img'] = document.querySelector("#enemy-container img");
	player['elm'] = document.querySelector("#player-container .hpdisplay");
	player['img'] = document.querySelector("#player-container .sprite img");
	infbox = document.querySelector("#actinfo p")
	cheese = document.querySelector("#cheese-ball")
	getData('storageIndex.json', main)
	// getData('random.json', main)
	lock=false;
}