var serv={};
var qCount={def:8, sp:''};
var itemCount={val:0};
var promised=0;
var skipQ=new Set();
var qPic;
var qCont;
var infbox;
var cheese;
var resmsg;
var pastmp;
var itmtmp;
var defmsg="Pilihlah sebuah aksi!"
var lasmsg=defmsg;

const stor = "storageIndex.json";
const rand = "random.json"

var lock = true;
var ansOpt="";
var turn=2;
var enemy={id:'en', hp:100, elm:'', img:''}, player={id:'pl', hp:100, elm:'', img:''};

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

function updtinfo(n) {
	if (infbox.textContent==n) return;
	lasmsg=n;
	console.log("infobox:",n);
	infbox.style.opacity = 0;
	setTimeout(()=>{
		infbox.textContent=n;
		infbox.style.opacity=1;
	},150);
	if (lasmsg!=defmsg) {
		if (resmsg!='') clearInterval(resmsg);
		resmsg = setInterval(()=>{
			if (lasmsg==infbox.textContent && lasmsg!=defmsg) {
				clearInterval(resmsg);
				resmsg='';
				updtinfo(defmsg);
			}
		},2500);
	}
}

function show_popup(target) {
	target.style.display='flex';
	setTimeout(()=>target.style.opacity=1,200);
}

function hide_popup(target){
	target.style.opacity=0;
	setTimeout(()=>target.style.display='none',200);
}

function q_event(n) {
	console.log('Question TIME!');
	lock = true;
	if (typeof(n)=="number") {
		console.log("spec",qCount)
		hide_popup(document.querySelector("#past-container"))
		qCount.sp=n;
		setTimeout(()=>{
			qPic.src=serv[stor].Path+'/'+serv[stor].Images[n];
			show_popup(qCont);
		},200);
	} else {
		turn = 1;
		if (qCount.def<=9) {
			show_popup(qCont);
		}
	}
}

function closeQ() {
	console.log(qCount)
	hide_popup(qCont);
	setTimeout(()=>{
		lock=false;
	},500);
	ansOpt='';
}

function accept() {
	if (ansOpt=='') return;
	console.log(qCount)
	a = qCount.def;
	if (typeof(qCount.sp)=="number") {
		console.log('hullo')
		a = qCount.sp;
		document.querySelector("#pq-"+a).remove();
		skipQ.delete(a);
		qCount.sp='';
	} else qCount.def++;
	if (serv[stor].Answers[a] == ansOpt) {
		updtinfo("Selamat kamu betul! Kamu telah mendapatkan sebuah ITEM!");
		console.log("Selamat kamu betul");
		let clone = itmtmp.cloneNode(true);
		clone.id="";
		clone.textContent=serv[stor].Items[itemCount.val++];
		itemCount.val%=7;
		itmtmp.parentNode.appendChild(clone);
	} else {
		updtinfo("Gawat! Kamu ternyata salah!");
		console.log("YAHAHAH KAMU SALAH")
	}
	qPic.src=serv[stor].Path+'/'+serv[stor].Images[qCount.def];
	closeQ()
}

function decline() {
	closeQ();
	console.log(qCount)
	a = qCount.def;
	if (typeof(qCount.sp)=="number") a = qCount.sp;
	else qCount.def++;
	if (skipQ.has(a)==false) {
		skipQ.add(a);
		let clone = pastmp.cloneNode(true);
		clone.id="pq-"+a;
		clone.children[0].src=serv[stor].Path+'/'+serv[stor].Images[a];
		clone.setAttribute("onclick","q_event("+a+")");
		pastmp.parentNode.appendChild(clone);
	}
}

function upd_hel(item, dec) {
	item.hp=Math.min(Math.max(item.hp-dec, 0), 100);
	item.elm.style.width=item.hp+'%';
	setTimeout(()=>{
		if (item.hp==0) {
			lock=true
			if (item.id=="pl") {
				window.location.href = "lose.html";
			} else {
				window.location.href = "win.html";
			}
		}
	},750);
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
function attack(source, target) {
	if (lock && source==player) return
	if (source==player && turn%3==0) {
		q_event();
		return;
	}
	cheesefly(source.img,target.img)
	if (source == player) {
		lock = true;
		turn++;
		setTimeout(()=>{
			upd_hel(enemy,10);
			updtinfo("Sang Regular Rat menyerang Sang Golden Rat!");
			setTimeout(()=>attack(target,source),500);
		},600);
	}  else {
		setTimeout(()=>{
			upd_hel(player,30);
			updtinfo("Sang Golden Rat menghancurkan Sang Regular Rat!");
			setTimeout(()=>lock=false, 650);
		},600);
	}
}

function item_use(target) {
	lock = 1;
	hide_popup(document.querySelector("#item-container"));
	target.remove();
	setTimeout(()=>{
		upd_hel(player,-60);
		updtinfo("Kamu telah menggunakan ITEM!");
	}, 200);
	setTimeout(()=>lock=false, 1000);
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
	qPic.src=serv[stor].Path+'/'+serv[stor].Images[qCount.def];	
}

// load variables & api only when web has loaded
window.onload = ()=> {
	qPic = document.querySelector('img[alt="question pic"]');
	qCont = document.querySelector('#question-container');
	enemy.elm = document.querySelector("#enemy-container .hpdisplay");
	enemy.img = document.querySelector("#enemy-container img");
	player.elm = document.querySelector("#player-container .hpdisplay");
	player.img = document.querySelector("#player-container .sprite img");
	infbox = document.querySelector("#actinfo p")
	cheese = document.querySelector("#cheese-ball")
	pastmp = document.querySelector("#past-template")
	itmtmp = document.querySelector("#item-template")
	getData('storageIndex.json', main)
	// getData('random.json', main)
	lock=false;
}