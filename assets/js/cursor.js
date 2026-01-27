(function($) {
    "use strict";

    // Hide default cursor
    if (window.innerWidth > 1200) {
        document.body.style.cursor = 'none';
    }

    // Init cursor
    const cursor = document.querySelector(".cursor");

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.documentElement.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        currentX += (mouseX - currentX);
        currentY += (mouseY - currentY);

        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";

        requestAnimationFrame(animate);
    }
    animate();

    // Helper to toggle classes
    function toggleClass(className, add = true) {
        cursor.classList[add ? "add" : "remove"](className);
    }

    // Handlers
    const handlers = {
        hover:       { in: () => toggleClass("hover", true),       out: () => toggleClass("hover", false) },
        activeLink:  { in: () => toggleClass("active_link", true), out: () => toggleClass("active_link", false) },
        activeMenu:  { in: () => toggleClass("active_menu", true), out: () => toggleClass("active_menu", false) }
    };
    Object.values(handlers).forEach(h => h.out());

    // Hovers changes the cursor
    function attachHoverListeners(elements, type) {
        elements.forEach(el => {
            el.addEventListener("mouseover", handlers[type].in);
            el.addEventListener("mouseout", handlers[type].out);
        });
    }

    attachHoverListeners(document.querySelectorAll(".hover-target, a:not(.dead), .item:not(.inactive)"), "hover");
    attachHoverListeners(document.querySelectorAll('a:not([href^="#"])'), "activeLink");

    // #top active menu only when it has .active
    document.querySelectorAll('#top').forEach(el => {
        el.addEventListener("mouseover", () => {
            if (el.classList.contains("active")) handlers.activeMenu.in();
        });
        el.addEventListener("mouseout", handlers.activeMenu.out);
    });

    // Mousedown event listeners
    document.addEventListener("mousedown", () => {
        cursor.classList.add("held");
    });
    document.addEventListener("mouseup", () => {
        cursor.classList.remove("held");
    });
    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("held");
    });

})(jQuery);
