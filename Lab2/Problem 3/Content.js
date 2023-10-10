//array of images
let catsImages = [
    "https://www.nautiljon.com/images/jeuxvideo_persos/00/42/raiden_shogun_5024.webp",
    "https://www.pockettactics.com/wp-content/sites/pockettactics/2023/05/genshin-impact-raiden.jpg",
    "https://videogames.si.com/.image/ar_1.91%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cg_faces:center%2Cq_auto:good%2Cw_1200/MTk0OTA1MDMxNzc2OTM3MTIy/genshin-impact-raiden-shogun.jpg",
    "https://www.pockettactics.com/wp-content/sites/pockettactics/2022/11/genshin-impact-raiden-1.jpg",
	"https://i.redd.it/n43lghx8t1b71.jpg"
];

document.body.style.backgroundColor = 'black';

//Change all paragraphs to comic sans
const paragraphs = document.getElementsByTagName("p");
for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.fontFamily = 'Comic Sans MS';
}

//Reverse through array of images
//Getting random image from the array we created before (we use math.floor and math.random to grab a random index in the array)
const imgs = document.getElementsByTagName("img");
for(let i = 0; i < imgs.length; i++) {
    const randomImg = Math.floor(Math.random() * catsImages.length)
    imgs[i].src = catsImages[randomImg]
}
//Do the same for h1 elements
const headers = document.getElementsByTagName("h1");
for (let i = 0; i < headers.length; i++){
    headers[i].innerText = "GENSHIN IS AWESOME!";
}
//Do the same for p elements
const p = document.getElementsByTagName("p");
for (let i = 0; i < p.length; i++){
    p[i].innerText = "This websit is about SHOGUN.";
}

// Changes the content and style of input elements
const inputs = document.getElementsByTagName("input");

for (let i = 0; i < inputs.length; i++) {
	
    inputs[i].style.backgroundColor = 'pink'; 
    inputs[i].style.color = 'white'; 
    inputs[i].style.padding = '5px';
    inputs[i].style.borderRadius = '5px';
    inputs[i].style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
    
    // make all search bar say PLAY GENSHIN
    if (inputs[i].placeholder) {
        inputs[i].placeholder = "PLAY GENSHIN!";
    }
    
    inputs[i].type = "text";
}

// Give all span a random colour and changes them to small boxes.
const divs = document.getElementsByTagName("span");
for (let i = 0; i < divs.length; i++) {
    const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    divs[i].style.backgroundColor = randomColor;
    divs[i].style.color = 'white'; 
    divs[i].style.padding = '10px';
    divs[i].style.borderRadius = '5px';
    divs[i].style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
    divs[i].textContent = "RAIDEN SHOGUN!";
}

