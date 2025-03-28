document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach((accordion) => {
        accordion.addEventListener("click", () => {
            const panel = accordion.nextElementSibling;

            panel.classList.toggle("open");

            if (panel.classList.contains("open")) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const accordionsRight = document.querySelectorAll(".accordion-right");

    accordionsRight.forEach((accordionsRight) => {
        accordionsRight.addEventListener("click", () => {
            const panel = accordionsRight.nextElementSibling;

            panel.classList.toggle("open");
            
            if (panel.classList.contains("open")) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
});