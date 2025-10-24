// example8_script.js
// 宣告一個學生物件，包含屬性與方法

var student = {
  name: '小明',
  id: 'A123456789',
  scores: [85, 90, 78],
  getAverage: function() {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }
    return sum / this.scores.length;
  },
  info: function() {
    return '姓名：' + this.name + '\n學號：' + this.id;
  },
  getGrade: function() {
    var n = this.getAverage();
    var level = ''
    if (n<60) {
        level='F';
    } else if (n<70) {
       level='D';
    } else if(n<80){
        level='C';
    }else if(n<90){
        level= 'B';
    } else{
       level= 'A';
    }
    return level;
  }
};

var text = student.info() + '\n平均：' + student.getAverage().toFixed(2)
            +'\n'+'等第:'+student.getGrade();
document.getElementById('result').textContent = text;

