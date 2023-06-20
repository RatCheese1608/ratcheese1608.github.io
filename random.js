console.log("Hello World!")

var phpDat;

function getData() {
	if (phpDat) return Promise.resolve(phpDat);
	return fetch('storageIndex.php')
		.then(res => res.json())
		.then(data => {phpDat = data; return data;})
		.catch(err => console.log(err));
}

getData().then(dat=>{
	phpDat = dat;
}).catch(err => console.log(err));

