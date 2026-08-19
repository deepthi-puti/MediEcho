
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

function addHistoryEvent(
    medicine, 
    reminder, 
    status,
    historyTime, 
    snoozeMinutes = null
){
    if(!medicine || !reminder){
        return;
    }

    const history = getMedicineHistory();

    const event = {
        id : "history_"+ Date.now()+"_"+ Math.random().toString(36).substring(2,8),
        date : getTodayDate(),
        medicineId : medicine.id,
        reminderId : reminder.id,
        medicineName : medicine.name,

        originalTime : reminder.time,
        historyTime : historyTime,
        status : status,
        snoozeMinutes:snoozeMinutes,
        createdAt : new Date(). toISOString()
    };
    history.push(event);
    saveMedicineHistory(history);
}

// ==========================================
// CURRENT TIME FOR HISTORY
// ==========================================

function getCurrentHistoryTime() {

    const now = new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    return `${hours}:${minutes}`;

}