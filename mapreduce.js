var mapReduce = function (data, map, reduce) {
	var mapResult = [], reduceResult = [];
	var mapIx, reduceKey;

	var mapEmit = function(key, value) {
		if(!mapResult[key]) {
			mapResult[key] = [];
		}
		mapResult[key].push(value);
	};

	var reduceEmit = function(obj) {
		reduceResult.push(obj);
	};

	for(mapIx = 0; mapIx < data.length; mapIx++) {
		map(data[mapIx], mapEmit);
	}

	for(reduceKey in mapResult) {
		reduce(reduceKey, mapResult[reduceKey], reduceEmit);
	}

	return reduceResult;
};

var csvToIArray = function(string){
	return string.split(',').map(function(val){ return parseInt(val.trim());});
};

var getFrecuencia = function(str, nC){
	var arr = csvToIArray(str);
	var min = arr.sort(function(a, b){ return a - b; })[0];
	var max = arr.sort(function(a, b){ return b - a; })[0];
	var r = max - min;
	var C = r / nC;

	var map = function(val, emit){
		for(var i = min, ii = 1; i <= max;i += C, ii++){
			if(i+C == max){
				emit(i + " - " + (i+C), val);
				return;
			} else if(i <= val && val < i+C){
				emit(i + " - " + (i+C - 1), val);
				return;
			}
		}
	};

	var reduce = function(key, vals, emit){
		emit({range: key, count: vals.length, vals: vals});
	};

	return mapReduce(arr, map, reduce);
};
