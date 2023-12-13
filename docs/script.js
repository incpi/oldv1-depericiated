 let x="";
 let i=0
while (i<28){
    x+=`<img src='images/XAMTA Tutorial-${i}.png' class='ui fluid inage'></img>`;
    i++}
document.querySelector('#imgloop').innerHTML=x;
