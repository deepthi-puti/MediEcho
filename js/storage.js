
// ==========================================
// MEDICINE STORAGE
// ==========================================


const MEDICINES_STORAGE_KEY = "mediecho_medicines";

function getMedicines() {

    const medicines =
        localStorage.getItem(
            MEDICINES_STORAGE_KEY
        );

    if (!medicines) {

        return [];

    }

    try {

        return JSON.parse(medicines);

    } catch (error) {

        console.error(
            "Error reading medicines:",
            error
        );

        return [];

    }
}


function saveMedicines(medicines) {

    localStorage.setItem(
        MEDICINES_STORAGE_KEY,
        JSON.stringify(medicines)
    );

}


// ==========================================
// HISTORY STORAGE
// ==========================================

const HISTORY_STORAGE_KEY =
    "mediecho_history";


function getMedicineHistory() {

    const history =
        localStorage.getItem(
            HISTORY_STORAGE_KEY
        );

    if (!history) {
        return [];
    }

    try {

        return JSON.parse(history);

    } catch (error) {

        console.error(
            "Error reading medicine history:",
            error
        );

        return [];

    }
}


function saveMedicineHistory(history) {

    localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history)
    );

}