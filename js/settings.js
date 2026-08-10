// ==========================================
// MEDIECHO SETTINGS
// ==========================================

console.log("settings.js loaded");


// ==========================================
// ELEMENTS
// ==========================================

const themeToggle =
    document.getElementById("themeToggle");

const languageSelect =
    document.getElementById("languageSelect");

const settingsLanguage =
    document.getElementById("settingsLanguage");

const settingsThemeToggle =
    document.getElementById("settingsThemeToggle");

const themeIcon =
    themeToggle.querySelector("i");


// ==========================================
// THEME
// ==========================================

function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        "mediecho_theme",
        theme
    );

    if (theme === "dark") {

        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");

        settingsThemeToggle.textContent =
            "Dark Mode";

    } else {

        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");

        settingsThemeToggle.textContent =
            "Light Mode";
    }

    console.log("Theme:", theme);
}


// ==========================================
// THEME TOGGLE
// ==========================================

themeToggle.addEventListener(
    "click",
    function () {

        const currentTheme =
            localStorage.getItem("mediecho_theme");

        if (currentTheme === "dark") {

            applyTheme("light");

        } else {

            applyTheme("dark");
        }
    }
);


// ==========================================
// SETTINGS THEME BUTTON
// ==========================================

settingsThemeToggle.addEventListener(
    "click",
    function () {

        const currentTheme =
            localStorage.getItem("mediecho_theme");

        if (currentTheme === "dark") {

            applyTheme("light");

        } else {

            applyTheme("dark");
        }
    }
);


// ==========================================
// LANGUAGE
// ==========================================

function applyLanguage(language) {

    languageSelect.value = language;

    settingsLanguage.value = language;

    localStorage.setItem(
        "mediecho_language",
        language
    );

    console.log("Language:", language);
}


// ==========================================
// HEADER LANGUAGE
// ==========================================

languageSelect.addEventListener(
    "change",
    function () {

        applyLanguage(this.value);

    }
);


// ==========================================
// SETTINGS LANGUAGE
// ==========================================

settingsLanguage.addEventListener(
    "change",
    function () {

        applyLanguage(this.value);

    }
);


// ==========================================
// LOAD SAVED SETTINGS
// ==========================================

function loadSettings() {

    // ------------------------------
    // Theme
    // ------------------------------

    let savedTheme =
        localStorage.getItem("mediecho_theme");


    if (
        savedTheme !== "dark" &&
        savedTheme !== "light"
    ) {

        savedTheme = "light";

    }


    applyTheme(savedTheme);


    // ------------------------------
    // Language
    // ------------------------------

    let savedLanguage =
        localStorage.getItem("mediecho_language");


    if (
        savedLanguage !== "en" &&
        savedLanguage !== "hi" &&
        savedLanguage !== "te"
    ) {

        savedLanguage = "en";

    }


    applyLanguage(savedLanguage);
}


// ==========================================
// START SETTINGS
// ==========================================

loadSettings();