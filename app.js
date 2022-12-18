'use strict'

/* ----- ELEMENTS ----- */
const parallax = document.getElementById('parallax');

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

/* ----- PARALLAX ----- */
window.addEventListener('scroll', function() {
    let offset = window.pageYOffset;
    parallax.style.backgroundPositionY = offset * 0.7 + 'px';
})

/* ----- HAMBURGER MENU ----- */
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}))