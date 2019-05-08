export function changeCaseJsonKey(jsonObj,type = 0){
    for (var key in jsonObj){
        let nkey =  type ? key.toUpperCase() : key.toLowerCase();
        jsonObj[nkey] = jsonObj[key];
        if(nkey != key){
            delete(jsonObj[key]);
        }
    }
    return jsonObj;
}


export async function asyncForEach(arr, callback){
    const length = arr.length;
    const O = Object(arr);
    let k = 0;
    while (k < length) {
      if (k in O) {
        console.log('doing foreach...');
        const kValue = O[k];
        await callback(kValue, k, O);
      }
      k++;
    }
  };

