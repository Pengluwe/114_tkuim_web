
var temp = prompt('temp:');
parseFloat(temp);
var CorF = prompt('C/F:');
function transtemp(temp, CorF){
    if(CorF == 'C'){
        var rlt = temp * 9 / 5 + 32 ;
        return rlt.toFixed(2) +'℉';
    } else if(CorF == 'F'){  
        var rlt = (temp - 32) * 5 / 9; 
        return rlt.toFixed(2) +'℃' ;
    } else{
        return 'error';
    }
}
var t ='';
if(CorF == 'C'){
        t = '℃';
    } else if(CorF == 'F'){  
        t = '℉';
    } else{
        t = 'error'
    }

text = '（攝氏 ↔ 華氏）:'+ temp + t + ' = ' + transtemp(temp, CorF);
alert(text);
console.log(text);
document.getElementById('result').textContent = text;