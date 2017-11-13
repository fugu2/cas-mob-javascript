function initialize(){
	document.getElementById('fileChooser').onchange = function (evt) {
		var tgt = evt.target || window.event.srcElement,
			files = tgt.files;
		if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = function () {
				document.getElementById("image").src = fr.result;
			}
			fr.readAsDataURL(files[0]);
		}
	}
}

function manipulateImage(callback){
	var img = document.getElementById('image');
	
	var canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var pixelData = ctx.getImageData(0, 0, img.width, img.height);
	
	var pixelDataAsArray = convertToTwoDimensionalArray(pixelData);
	var newData = callback(pixelDataAsArray);	
	var imgData = convertToImageData(newData,ctx);
	
	var canvas2 = document.createElement('canvas');
	canvas2.width = imgData.width;
	canvas2.height = imgData.height;
	var ctx2 = canvas2.getContext('2d');
	ctx2.putImageData(imgData,0,0);
	
	var result = canvas2.toDataURL("image/png").replace("image/png", "image/octet-stream");
	document.getElementById("image").src = result;
}

function convertToImageData(newData, ctx){
	var imgData = ctx.createImageData(newData[0].length,newData.length);
	i = 0;
	for(y = 0; y < newData.length; y++){
		for(x = 0; x< newData[0].length; x++){
			imgData.data[i+0] = (newData[y][x] & (255 << 16)) >> 16;
			imgData.data[i+1] = (newData[y][x] & (255 << 8)) >> 8;
			imgData.data[i+2] = newData[y][x] & 255;
			imgData.data[i+3] = 255;
			i+=4;
		}
	}
	return imgData;
}

function convertToTwoDimensionalArray(imageData){
	var pixelDataAsArray = []
	var i = 0;
	for(y = 0; y < imageData.height; y++){
		pixelDataAsArray[y] = [];
		for(x = 0; x< imageData.width; x++){
			pixelDataAsArray[y][x] = (((0 | imageData.data[i+0] << 16) | imageData.data[i+1] << 8) | imageData.data[i+2]);
			i+=4;
		}
	}
	return pixelDataAsArray;
}