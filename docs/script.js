 let x="";
 let i=1
while (i<=28){
    x+=`<img src='images/XAMTA Tutorial-${i}.png' class='ui fluid inage'></img>`;
    i++}
document.querySelector('#imgloop').innerHTML=x;
