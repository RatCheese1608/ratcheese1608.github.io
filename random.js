console.log("Hello World!")

var phpDat;

function getData() {
	if (phpDat) return Promise.resolve(phpDat);
	return fetch('storageIndex.json')
		.then(res => {
			// console.log("res:",res.text());
			return res.json()
		})
		.then(data => {
			// console.log("data:",data);
			phpDat = data;
			return data;})
		.catch(err => console.log(err));
}

getData().then(dat=>{
	phpDat = dat;
}).catch(err => console.log(err));

