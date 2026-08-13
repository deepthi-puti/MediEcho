// ==========================================
// MEDIECHO APP NAVIGATION
// ==========================================


// Get navigation buttons
const navItems = document.querySelectorAll(".nav-item");


// Get pages
const pages = document.querySelectorAll(".page");


// ==========================================
// FUNCTION TO SHOW PAGE
// ==========================================

function showPage(pageId) {

    // Hide every page
    pages.forEach((page) => {
        page.classList.remove("active-page");
    });


    // Remove active from every navigation button
    navItems.forEach((item) => {
        item.classList.remove("active");
    });


    // Find the page we want to show
    const selectedPage = document.getElementById(pageId);


    // Find the navigation button for that page
    const selectedNav = document.querySelector(
        `.nav-item[data-page="${pageId}"]`
    );


    // Show selected page
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    // Highlight selected navigation button
    if (selectedNav) {
        selectedNav.classList.add("active");
    }
}


// ==========================================
// NAVIGATION CLICK EVENTS
// ==========================================

navItems.forEach((navItem) => {

    navItem.addEventListener(
        "click",
        function () {

            const pageId =
                this.getAttribute("data-page");


            // Show selected page
            showPage(pageId);


            // ======================================
            // LOAD HISTORY PAGE
            // ======================================

            if (pageId === "historyPage") {

                renderHistory();

            }

        }
    );

});