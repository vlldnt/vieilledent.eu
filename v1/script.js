document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-link");

  links.forEach((link) => {
    link.addEventListener("mouseover", () => {
      link.style.color = "#0D74CE";
    });

    link.addEventListener("mouseout", () => {
      link.style.color = "";
    });
  });
});


const menuToggle = document.querySelector('.menu-toggle');
const headerMenu = document.querySelector('.header-menu');

menuToggle.addEventListener('click', () => {
  headerMenu.classList.toggle('show');
});

document.addEventListener('click', (event) => {
  if (!headerMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    headerMenu.classList.remove('show');
  }
});