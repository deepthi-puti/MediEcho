// ==========================================
// HISTORY
// ==========================================


// ==========================================
// SAVE DAY TO HISTORY
// ==========================================

function saveDayToHistory(
    medicine,
    date
) {

    const history =
        getMedicineHistory();


    // --------------------------------------
    // CHECK REMINDERS
    // --------------------------------------

    if (
        !medicine.reminders ||
        medicine.reminders.length === 0
    ) {
        return;
    }


    // --------------------------------------
    // COPY REMINDER DATA
    // --------------------------------------

    const historyReminders =
        medicine.reminders.map(
            function (reminder) {

                return {

                    reminderId:
                        reminder.id,

                    time:
                        reminder.time,

                    status:
                        reminder.status ||
                        "pending",

                    snoozeUntil:
                        reminder.snoozeUntil ||
                        null,

                    snoozeMinutes:
                        reminder.snoozeMinutes ||
                        null

                };

            }
        );


    // --------------------------------------
    // CREATE HISTORY ENTRY
    // --------------------------------------

    const historyEntry = {

        id:
            `${medicine.id}_${date}`,

        medicineId:
            medicine.id,

        medicineName:
            medicine.name,

        image:
            medicine.image || "",

        dosage:
            medicine.dosage,

        purpose:
            medicine.purpose || "",

        foodInstruction:
            medicine.foodInstruction || "",

        notes:
            medicine.notes || "",

        date:
            date,

        reminders:
            historyReminders

    };


    // --------------------------------------
    // FIND EXISTING ENTRY
    // --------------------------------------

    const existingIndex =
        history.findIndex(
            function (entry) {

                return (
                    entry.medicineId ===
                        medicine.id &&

                    entry.date ===
                        date
                );

            }
        );


    // --------------------------------------
    // UPDATE EXISTING
    // --------------------------------------

    if (existingIndex !== -1) {

        history[existingIndex] =
            historyEntry;

    }

    // --------------------------------------
    // CREATE NEW
    // --------------------------------------

    else {

        history.push(
            historyEntry
        );

    }


    // --------------------------------------
    // SAVE
    // --------------------------------------

    saveMedicineHistory(
        history
    );

}

// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory() {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!container) {

        console.warn(
            "historyList not found."
        );

        return;

    }


    const history =
        getMedicineHistory();


    // ======================================
    // NO HISTORY
    // ======================================

    if (
        !history ||
        history.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                <i class="fa-solid fa-file-medical"></i>

                <h3>
                    No history yet
                </h3>

                <p>
                    Your medicine activity
                    will appear here
                </p>

            </div>

        `;

        return;

    }


    // Clear existing content
    container.innerHTML = "";


    // ======================================
    // NEWEST HISTORY FIRST
    // ======================================

    const sortedHistory =
        history
            .slice()
            .sort(
                function (a, b) {

                    return b.date.localeCompare(
                        a.date
                    );

                }
            );


    sortedHistory.forEach(
        function (entry) {

            const card =
                createHistoryCard(
                    entry
                );

            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// CREATE HISTORY CARD
// ==========================================

function createHistoryCard(entry) {

    const card =
        document.createElement("div");

    card.className =
        "history-card";


    // ======================================
    // REMINDERS
    // ======================================

    const remindersHTML =
        entry.reminders
            .map(
                function (reminder) {

                    let statusClass =
                        "pending";

                    let statusIcon =
                        "fa-clock";

                    let statusText =
                        "Pending";


                    // TAKEN
                    if (
                        reminder.status ===
                        "taken"
                    ) {

                        statusClass =
                            "taken";

                        statusIcon =
                            "fa-check";

                        statusText =
                            "Taken";

                    }


                    // SKIPPED
                    else if (
                        reminder.status ===
                        "skipped"
                    ) {

                        statusClass =
                            "skipped";

                        statusIcon =
                            "fa-xmark";

                        statusText =
                            "Skipped";

                    }


                    // SNOOZED
                    else if (
                        reminder.status ===
                        "snoozed"
                    ) {

                        statusClass =
                            "snoozed";

                        statusIcon =
                            "fa-bell";

                        statusText =
                            "Snoozed";

                    }


                    return `

                        <div
                            class="history-reminder">

                            <div
                                class="history-reminder-time">

                                <i
                                    class="fa-regular fa-clock">
                                </i>

                                <span>
                                    ${formatTime(
                                        reminder.time
                                    )}
                                </span>

                            </div>


                            <div
                                class="history-reminder-status ${statusClass}">

                                <i
                                    class="fa-solid ${statusIcon}">
                                </i>

                                <span>
                                    ${statusText}
                                </span>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    // ======================================
    // MEDICINE IMAGE
    // ======================================

    let imageHTML = "";


    if (entry.image) {

        imageHTML = `

            <img
                src="${entry.image}"
                alt="${entry.medicineName}"
                class="history-medicine-image">

        `;

    }

    else {

        imageHTML = `

            <div
                class="history-medicine-placeholder">

                <i
                    class="fa-solid fa-pills">
                </i>

            </div>

        `;

    }


    // ======================================
    // CARD
    // ======================================

    card.innerHTML = `

        <div class="history-card-header">


            <div class="history-medicine-info">

                ${imageHTML}


                <div>

                    <h3>
                        ${entry.medicineName}
                    </h3>


                    <p>

                        ${
                            entry.dosage
                                ? entry.dosage.quantity
                                : ""
                        }

                        ${
                            entry.dosage
                                ? " " + entry.dosage.unit
                                : ""
                        }

                    </p>

                </div>

            </div>


            <div class="history-date">

                <i
                    class="fa-regular fa-calendar">
                </i>

                ${entry.date}

            </div>

        </div>


        <div class="history-reminders">

            ${remindersHTML}

        </div>

    `;


    return card;

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderHistory();

    }
);