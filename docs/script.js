function genimgloop(){
 let x="";

 let i=1
while (i<=28){
    x+=`<img src='images/XAMTA Tutorial-${i}.png' class='ui fluid inage'></img>`;
    i++}
document.querySelector('#imgloop').innerHTML= x
}
function how2()=>{
   x=`<pre >
   Step 1 - download a zip file with the extension
   If you already have downloaded a file with the plugin - skip this step.

   If you don't have a file, but have a link to a github repository - follow the link, then click the big green "Clone or download" button, then click Download ZIP.

   Step 2 - extract the contents of the zip file
   Right click on the downloaded zip file, then click "Extract Here".

   Step 3 - open the extension page in google chrome
   There are several ways todo that.

   Option 1: type chrome://extensions in the url bar and press enter.

   Option 2: click on the tree dots in the top right of the browser, then click "More tools" then click "Extensions".

   Step 4 - activate developer mode
   Turn on the switch on the top right of the page that says "Developer mode";

   Step 5 - load unpacked extension
   Click on the button on the top left of the page that says "Load unpacked".

   Then select a folder that contains the manifest.json file.
   </pre>`
   
    document.querySelector('#h2use').innerHTML=x
}

function init(){
how2();
genimgloop();
$('.menu .item').tab();}

init()