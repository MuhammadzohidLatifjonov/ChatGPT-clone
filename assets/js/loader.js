// Preloader
let myVar;
let body = document.querySelector("body");
body.onload = function myFunction() {
    myVar = setTimeout(showPage, 4000);
    // myVar = setTimeout(showPage)
}

function showPage() {
    document.querySelector(".loader").style.display = "none";
    body.style.display = "block";
    document.querySelector("#myDiv").style.display = "block";
}