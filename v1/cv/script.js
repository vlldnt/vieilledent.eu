document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach((accordion) => {
        const parent = accordion.closest(".left-content h3");

        accordion.addEventListener("mouseover", () => {
            parent.style.color = "#1092f5";
        });

        accordion.addEventListener("mouseout", () => {
            parent.style.color = "#1D3E56";
        });

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
