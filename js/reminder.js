const reminderModal =
    document.getElementById("reminderModal");

const closeReminderModal =
    document.getElementById( "closeReminderModal");

const reminderPopupImage =
    document.getElementById("reminderPopupImage");

const reminderPopupMedicineName =
    document.getElementById("reminderPopupMedicineName");

const reminderPopupDosage =
    document.getElementById("reminderPopupDosage");

const reminderPopupFoodInstruction =
    document.getElementById("reminderPopupFoodInstruction");

const reminderPopupTime =
    document.getElementById("reminderPopupTime");

const reminderTakenButton =
    document.getElementById("reminderTakenButton");

const reminderSkipButton =
    document.getElementById("reminderSkipButton");

const reminderSnoozeButton = 
    document.getElementById("reminderSnoozeButton");

const snoozeOptions =
    document.getElementById( "snoozeOptions");

const customSnoozeButton =
    document.getElementById(  "customSnoozeButton");

const snoozeOptionButtons =
    document.querySelectorAll( ".snooze-option[data-minutes]");


let reminderPopupShownKey = null;
let activeReminderMedicineId = null;
let activeReminderId = null;
let activeReminderOccurrenceTime = null;
// ==========================================
// OPEN REMINDER POPUP
// ==========================================

function openReminderPopup(
    medicine,
    reminder
) {

    snoozeOptions.classList.remove(
        "show"
    );

    activeReminderMedicineId =
        medicine.id;

    activeReminderId =
        reminder.id;

    activeReminderOccurrenceTime =
        getCurrentReminderTime();

    // ======================================
    // IMAGE
    // ======================================

    if (medicine.image) {

        reminderPopupImage.src =
            medicine.image;

        reminderPopupImage.style.display =
            "block";

    }
    else {

        reminderPopupImage.removeAttribute(
            "src"
        );

        reminderPopupImage.style.display =
            "none";

    }


    // ======================================
    // MEDICINE NAME
    // ======================================

    reminderPopupMedicineName.textContent =
        medicine.name;


    // ======================================
    // DOSAGE
    // ======================================

    reminderPopupDosage.textContent =
        `${medicine.dosage.quantity} ${medicine.dosage.unit}`;


    // ======================================
    // FOOD INSTRUCTION
    // ======================================

    reminderPopupFoodInstruction.textContent =
        medicine.foodInstruction
            ? medicine.foodInstruction
            : "";


    // ======================================
    // REMINDER TIME
    // ======================================

    reminderPopupTime.textContent =
        formatTime(reminder.time);


    // ======================================
    // SHOW POPUP
    // ======================================

    reminderModal.classList.add("show");
    speakMedicineReminder(medicine);

}

// ==========================================
// CHECK MEDICINE REMINDERS
// ==========================================

function checkReminders() {

    const medicines = getMedicines();

    if (!medicines || medicines.length === 0) {
        return;
    }


    const now = new Date();


    // --------------------------------------
    // CURRENT TIME
    // --------------------------------------

    const currentHour =
        String(now.getHours()).padStart(2, "0");

    const currentMinute =
        String(now.getMinutes()).padStart(2, "0");

    const currentTime =
        `${currentHour}:${currentMinute}`;


    // --------------------------------------
    // TODAY
    // --------------------------------------

    const today =
        getTodayDate();


    medicines.forEach(function (medicine) {

        // ----------------------------------
        // CHECK MEDICINE DATE
        // ----------------------------------

        if (
            medicine.date &&
            medicine.date !== today
        ) {
            return;
        }


        // ----------------------------------
        // CHECK REMINDERS
        // ----------------------------------

        if (
            !medicine.reminders ||
            medicine.reminders.length === 0
        ) {
            return;
        }


        medicine.reminders.forEach(
            function (reminder) {

                // ==================================
                // RESET STATUS FOR A NEW DAY
                // ==================================

                if (
                    reminder.statusDate !== today
                ) {

                    reminder.status =
                        "pending";

                    reminder.statusDate =
                        today;

                    reminder.snoozeUntil =
                        null;

                    reminder.snoozeMinutes =
                        null;

                }


                // ==================================
                // TAKEN / SKIPPED
                // ==================================

                if (
                    reminder.status === "taken" ||
                    reminder.status === "skipped"
                ) {

                    return;

                }


                // ==================================
                // CHECK SNOOZED REMINDER
                // ==================================

                if (
                    reminder.status === "snoozed"
                ) {

                    if (
                        !reminder.snoozeUntil
                    ) {

                        return;

                    }


                    const snoozeTime =
                        Number(
                            reminder.snoozeUntil
                        );


                    // Snooze time has NOT arrived

                    if (
                        Date.now() < snoozeTime
                    ) {

                        return;

                    }


                    // ==================================
                    // SNOOZE TIME HAS ARRIVED
                    // ==================================

                    reminder.status =
                        "pending";


                    const popupKey =
                        `${medicine.id}_${reminder.id}_snooze_${snoozeTime}`;


                    if (
                        reminderPopupShownKey ===
                        popupKey
                    ) {

                        return;

                    }


                    reminderPopupShownKey =
                        popupKey;


                    // Open popup immediately
                    // DO NOT check original reminder.time

                    openReminderPopup(
                        medicine,
                        reminder
                    );


                    return;

                }


                // ==================================
                // NORMAL REMINDER
                // ==================================

                if (
                    reminder.time !==
                    currentTime
                ) {

                    return;

                }


                // ==================================
                // PREVENT DUPLICATE POPUP
                // ==================================

                const popupKey =
                    `${medicine.id}_${reminder.id}_${today}_${currentTime}`;


                if (
                    reminderPopupShownKey ===
                    popupKey
                ) {

                    return;

                }


                reminderPopupShownKey =
                    popupKey;


                // ==================================
                // OPEN NORMAL REMINDER POPUP
                // ==================================

                openReminderPopup(
                    medicine,
                    reminder
                );

            }
        );

    });

}

function formatTimestampTime(timestamp) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(
            Number(timestamp)
        );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

}


// ==========================================
// RUN REMINDER CHECKER EVERY SECOND
// ==========================================

setInterval(
    checkReminders,
    1000
);

// ==========================================
// CLOSE REMINDER POPUP
// ==========================================

closeReminderModal.addEventListener(
    "click",
    function () {

        reminderModal.classList.remove(
            "show"
        );

    }
);


// ==========================================
// SNOOZE REMINDER
// ==========================================

function snoozeReminder(minutes) {

    if (!minutes || minutes <= 0) {
        return;
    }

    const medicines =
        getMedicines();


    // ======================================
    // FIND MEDICINE
    // ======================================

    const medicine =
        medicines.find(
            function (medicine) {

                return (
                    medicine.id ===
                    activeReminderMedicineId
                );

            }
        );


    if (!medicine) {

        console.error(
            "Medicine not found."
        );

        return;

    }


    // ======================================
    // FIND EXACT REMINDER
    // ======================================

    const reminder =
        medicine.reminders.find(
            function (reminder) {

                return (
                    reminder.id ===
                    activeReminderId
                );

            }
        );


    if (!reminder) {

        console.error(
            "Reminder not found."
        );

        return;

    }

    // const snoozeActionDate =
    //     new Date();

    // const snoozeActionHours =
    //     String(
    //         snoozeActionDate.getHours()
    //     ).padStart(2, "0");

    // const snoozeActionMinutes =
    //     String(
    //         snoozeActionDate.getMinutes()
    //     ).padStart(2, "0");

    // const snoozeActionTime =
    //     `${snoozeActionHours}:${snoozeActionMinutes}`;
    
     const historyTime = getCurrentHistoryTime();
    // ======================================
    // CALCULATE SNOOZE TIME
    // ======================================

    const snoozeTime =
        Date.now() +
        (minutes * 60 * 1000);

    // ======================================
    // SAVE HISTORY EVENT
    // ======================================

    addHistoryEvent(
        medicine,
        reminder,
        "snoozed",
        historyTime,
        minutes
    );

    // ======================================
    // UPDATE REMINDER
    // ======================================

    reminder.status =
        "snoozed";

    reminder.snoozeUntil =
        snoozeTime;

    reminder.snoozeMinutes =
        minutes;

    reminder.statusDate =
        getTodayDate();


    // ======================================
    // SAVE SNOOZE HISTORY
    // IMPORTANT:
    // Store ORIGINAL reminder.time
    // in 24-hour format
    // ======================================
    // const historyReminderTime =
    //     getCurrentSnoozeHistoryTime(reminder);

    // saveSnoozeHistoryEvent(
    //     medicine,
    //     reminder.time,
    //     minutes,
    //     snoozeTime
    // );


    // ======================================
    // SAVE MEDICINES
    // ======================================

    saveMedicines(
        medicines
    );


    // ======================================
    // CLOSE POPUP
    // ======================================

    reminderModal.classList.remove(
        "show"
    );


    // ======================================
    // HIDE SNOOZE OPTIONS
    // ======================================

    snoozeOptions.classList.remove(
        "show"
    );


    // ======================================
    // REFRESH HOME CARD
    // ======================================

    renderTodaysMedicines();

}

// ==========================================
// TAKEN BUTTON
// ==========================================

reminderTakenButton.addEventListener(
    "click",
    function () {

        const medicines = getMedicines();

        const medicine =
            medicines.find(
                function (medicine) {

                    return (
                        medicine.id ===
                        activeReminderMedicineId
                    );

                }
            );


        if (!medicine) {

            console.error(
                "Medicine not found."
            );

            return;

        }


        const reminder =
            medicine.reminders.find(
                function (reminder) {

                    return (
                        reminder.id ===
                        activeReminderId
                    );

                }
            );


        if (!reminder) {

            console.error(
                "Reminder not found."
            );

            return;

        }

        const historyTime = getCurrentHistoryTime();

        addHistoryEvent(medicine, reminder, "taken", historyTime, null);


        // -------------------------------
        // UPDATE ONLY THIS REMINDER
        // -------------------------------

        reminder.status =
            "taken";


        reminder.statusDate =
            getTodayDate();


        reminder.snoozeUntil =
            null;
        reminder.snoozeMinutes = null;


        // -------------------------------
        // SAVE
        // -------------------------------

        saveMedicines(medicines);


        // saveDayToHistory(medicine,getTodayDate());
        // -------------------------------
        // CLOSE POPUP
        // -------------------------------

        reminderModal.classList.remove(
            "show"
        );


        // -------------------------------
        // REFRESH HOME CARD
        // -------------------------------

        renderTodaysMedicines();

    }
);

// ==========================================
// SKIP BUTTON
// ==========================================

// ==========================================
// SKIP BUTTON
// ==========================================

reminderSkipButton.addEventListener(
    "click",
    function () {

        const medicines =
            getMedicines();


        const medicine =
            medicines.find(
                function (medicine) {

                    return (
                        medicine.id ===
                        activeReminderMedicineId
                    );

                }
            );


        if (!medicine) {

            return;

        }


        const reminder =
            medicine.reminders.find(
                function (reminder) {

                    return (
                        reminder.id ===
                        activeReminderId
                    );

                }
            );


        if (!reminder) {

            return;

        }


        // ==================================
        // HISTORY TIME
        // ==================================

        const historyTime =
            getCurrentHistoryTime();


        // ==================================
        // SAVE HISTORY
        // ==================================

        addHistoryEvent(
            medicine,
            reminder,
            "skipped",
            historyTime,
            null
        );


        // ==================================
        // UPDATE REMINDER
        // ==================================

        reminder.status =
            "skipped";

        reminder.statusDate =
            getTodayDate();

        reminder.snoozeUntil =
            null;

        reminder.snoozeMinutes =
            null;


        // ==================================
        // SAVE
        // ==================================

        saveMedicines(
            medicines
        );


        // ==================================
        // CLOSE
        // ==================================

        reminderModal.classList.remove(
            "show"
        );


        // ==================================
        // REFRESH
        // ==================================

        renderTodaysMedicines();

    }
);
// ==========================================
// SHOW SNOOZE OPTIONS
// ==========================================

reminderSnoozeButton.addEventListener(
    "click",
    function () {

        snoozeOptions.classList.toggle(
            "show"
        );

    }
);

// ==========================================
// PRESET SNOOZE TIMES
// ==========================================

snoozeOptionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const minutes =
                    Number(
                        button.dataset.minutes
                    );


                snoozeReminder(
                    minutes
                );

            }
        );

    }
);

// ==========================================
// CUSTOM SNOOZE
// ==========================================

customSnoozeButton.addEventListener(
    "click",
    function () {

        const input =
            prompt(
                "Enter snooze time in minutes:"
            );


        if (input === null) {

            return;

        }


        const minutes =
            Number(input);


        if (
            !Number.isFinite(minutes) ||
            minutes <= 0
        ) {

            alert(
                "Please enter a valid number of minutes."
            );

            return;

        }


        snoozeReminder(
            minutes
        );

    }
);

// ==========================================
// FORMAT SNOOZE TIME
// ==========================================

function formatSnoozeTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    const date =
        new Date(Number(timestamp));

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );
}

// ==========================================
// REMINDER BUTTON CLICKS
// ==========================================

document.addEventListener(
    "click",
    function (event) {


        // ==================================
        // TAKEN
        // ==================================

        const takenButton =
            event.target.closest(
                ".reminder-taken-btn"
            );


        if (takenButton) {

            const medicineId =
                takenButton.dataset.medicineId;

            const reminderId =
                takenButton.dataset.reminderId;


            updateReminderStatus(
                medicineId,
                reminderId,
                "taken"
            );


            return;

        }


        // ==================================
        // SKIPPED
        // ==================================

        const skipButton =
            event.target.closest(
                ".reminder-skip-btn"
            );


        if (skipButton) {

            const medicineId =
                skipButton.dataset.medicineId;

            const reminderId =
                skipButton.dataset.reminderId;


            updateReminderStatus(
                medicineId,
                reminderId,
                "skipped"
            );


            return;

        }

    }
);

function getCurrentReminderTime() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}