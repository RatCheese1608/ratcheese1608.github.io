var serv, cImage;
var qPic

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

function nextImage() {
	cImage++;
	qPic.src=serv.Path+'/'+serv.Images[cImage];
}

// attack...
function attack() {
	nextImage();
}

// main basically
getData().then(dat=>{
	serv = dat;
	console.log("serv:", serv);

	qPic = document.querySelector('img[alt="question pic"]')
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