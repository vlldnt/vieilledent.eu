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
