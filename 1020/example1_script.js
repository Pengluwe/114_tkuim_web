// example1_script.js
// 傳統語法：僅使用 var、function、字串串接

// 顯示提示窗
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息
console.log('Hello JavaScript from console');

// 在頁面指定區域輸出文字
var el = document.getElementById('result');
el.textContent = '這行文字是由外部 JS 檔案寫入的。';
var el  = document.getElementById('result2');
el.textContent = '412630062 彭律瑋';
var button = document.getElementById('hello')
button.textContent = 'hello';
button.onclick = function(){
    alert('Hello!');
};


