function getRandomColor() {
    // Generate random RGB values
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    // Create the color string in the format "rgb(r, g, b)"
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function changeTopBoxColor() {

    var color=getRandomColor();

    var topBox = document.getElementById("topBox");
    var button = document.getElementById("btn-submit")
    var socialMedia=document.getElementById("social-media")
    topBox.style.transition = "background-color 0.5s"; // Add transition property
    topBox.style.backgroundColor=color;

    button.style.transition="background-color 0.5s";
    button.style.backgroundColor=color;

    socialMedia.style.transition="background-color 0.5s";
    socialMedia.style.backgroundColor=color;

}

// Change the color every 2 seconds
setInterval(changeTopBoxColor, 2000);


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({
behavior: 'smooth'
});
});
});





