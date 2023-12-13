 let x="";
 let i=0
while (i<28){
    x+=`<img src='docs/images/XAMTA Tutorial-${i}.png' ></img>`;
    i++}
document.querySelector('#imgloop').innerHTML=x;
