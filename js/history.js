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
        document.getElementById("historyList");


    if (!container) {

        console.warn(
            "historyList not found."
        );

        return;

    }


    const medicineHistory =
        getMedicineHistory();


    const snoozeHistory =
        getSnoozeHistory();


    // ======================================
    // COMBINE HISTORY
    // ======================================

    const historyRows = [];


    // ======================================
    // TAKEN / SKIPPED
    // ======================================

    medicineHistory.forEach(
        function (entry) {

            if (
                !entry.reminders ||
                entry.reminders.length === 0
            ) {

                return;

            }


            entry.reminders.forEach(
                function (reminder) {

                    // Only show actual actions
                    // Pending should not appear

                    if (
                        reminder.status !== "taken" &&
                        reminder.status !== "skipped"
                    ) {

                        return;

                    }


                    historyRows.push({

                        date:
                            entry.date,

                        medicineName:
                            entry.medicineName,

                        time:
                            reminder.time,

                        status:
                            reminder.status,

                        snoozeMinutes:
                            null,

                        snoozeUntil:
                            null

                    });

                }
            );

        }
    );


    // ======================================
    // SNOOZED
    // ======================================

    snoozeHistory.forEach(
        function (entry) {

            historyRows.push({

                date:
                    entry.date,

                medicineName:
                    entry.medicineName,

                time:
                    entry.time,

                status:
                    "snoozed",

                snoozeMinutes:
                    entry.snoozeMinutes,

                snoozeUntil:
                    entry.snoozeUntil

            });

        }
    );


    // ======================================
    // NO HISTORY
    // ======================================

    if (historyRows.length === 0) {

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


    // ======================================
    // GROUP BY DATE
    // ======================================

    const groupedHistory = {};


    historyRows.forEach(
        function (row) {

            if (!groupedHistory[row.date]) {

                groupedHistory[row.date] = [];

            }


            groupedHistory[row.date].push(
                row
            );

        }
    );


    // ======================================
    // SORT DATES - NEWEST FIRST
    // ======================================

    const dates =
        Object.keys(groupedHistory)
            .sort()
            .reverse();


    container.innerHTML = "";


    // ======================================
    // CREATE DATE SECTIONS
    // ======================================

    dates.forEach(
        function (date) {

            const dateSection =
                document.createElement("div");

            dateSection.className =
                "history-date-section";


            // ==================================
            // DATE HEADING
            // ==================================

            const dateHeading =
                document.createElement("div");

            dateHeading.className =
                "history-date-heading";

            dateHeading.innerHTML = `

                <i class="fa-regular fa-calendar"></i>

                <span>
                    ${formatHistoryDate(date)}
                </span>

            `;


            // ==================================
            // TABLE
            // ==================================

            const table =
                document.createElement("div");

            table.className =
                "history-table";


            // ==================================
            // TABLE HEADER
            // ==================================

            table.innerHTML = `

                <div class="history-row history-header">

                    <div>
                        Medicine Name
                    </div>

                    <div>
                        Time
                    </div>

                    <div>
                        Status
                    </div>

                </div>

            `;


            // ==================================
            // SORT ROWS BY TIME
            // ==================================

            const rows =
                groupedHistory[date]
                    .sort(
                        function (a, b) {

                            return convertHistoryTimeToMinutes(
                                a.time
                            )
                            -
                            convertHistoryTimeToMinutes(
                                b.time
                            );

                        }
                    );


            // ==================================
            // CREATE ROWS
            // ==================================

            rows.forEach(
                function (row) {

                    let statusClass =
                        "";

                    let statusIcon =
                        "";

                    let statusText =
                        "";


                    // ==========================
                    // TAKEN
                    // ==========================

                    if (
                        row.status === "taken"
                    ) {

                        statusClass =
                            "taken";

                        statusIcon =
                            "fa-check";

                        statusText =
                            "Taken";

                    }


                    // ==========================
                    // SKIPPED
                    // ==========================

                    else if (
                        row.status === "skipped"
                    ) {

                        statusClass =
                            "skipped";

                        statusIcon =
                            "fa-xmark";

                        statusText =
                            "Skipped";

                    }


                    // ==========================
                    // SNOOZED
                    // ==========================

                    else if (
                        row.status === "snoozed"
                    ) {

                        statusClass =
                            "snoozed";

                        statusIcon =
                            "fa-bell";


                        statusText =
                            `Snoozed (${row.snoozeMinutes} min)`;

                    }


                    const historyRow =
                        document.createElement("div");

                    historyRow.className =
                        "history-row";


                    historyRow.innerHTML = `

                        <div class="history-medicine-name">

                            <i class="fa-solid fa-pills"></i>

                            <span>
                                ${row.medicineName}
                            </span>

                        </div>


                        <div class="history-time">

                            <i class="fa-regular fa-clock"></i>

                            <span>
                                ${formatTime(row.time)}
                            </span>

                        </div>


                        <div
                            class="history-status ${statusClass}">

                            <i
                                class="fa-solid ${statusIcon}">
                            </i>

                            <span>
                                ${statusText}
                            </span>

                        </div>

                    `;


                    table.appendChild(
                        historyRow
                    );

                }
            );


            dateSection.appendChild(
                dateHeading
            );


            dateSection.appendChild(
                table
            );


            container.appendChild(
                dateSection
            );

        }
    );

}

// ==========================================
// FORMAT HISTORY DATE
// ==========================================

function formatHistoryDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}

// ==========================================
// CONVERT TIME TO MINUTES
// ==========================================

function convertHistoryTimeToMinutes(time) {

    if (!time) {

        return "";

    }

   // Already in 12-hour format
    if (time.includes("AM") || time.includes("PM")) {
        return time;
    }

    const parts = time.split(":");

    if (parts.length < 2) {
        return time;
    }

    let hour = Number(parts[0]);
    const minute = parts[1];

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute} ${period}`;

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

// ==========================================
// SNOOZE HISTORY STORAGE
// ==========================================

const SNOOZE_HISTORY_KEY =
    "mediecho_snooze_history";


function getSnoozeHistory() {

    const history =
        localStorage.getItem(
            SNOOZE_HISTORY_KEY
        );


    if (!history) {

        return [];

    }


    try {

        return JSON.parse(
            history
        );

    }
    catch (error) {

        console.error(
            "Error reading snooze history:",
            error
        );

        return [];

    }

}


function saveSnoozeHistory(
    history
) {

    localStorage.setItem(
        SNOOZE_HISTORY_KEY,
        JSON.stringify(history)
    );

}

// ==========================================
// SAVE SNOOZE EVENT
// ==========================================

function saveSnoozeHistoryEvent(
    medicine,
    reminderTime,
    snoozeMinutes,
    snoozeUntil
) {

    const history =
        getSnoozeHistory();


    history.push({

        id:
            `${medicine.id}_${Date.now()}`,

        date:
            getTodayDate(),

        medicineId:
            medicine.id,

        medicineName:
            medicine.name,

        time:
            reminderTime,

        status:
            "snoozed",

        snoozeMinutes:
            snoozeMinutes,

        snoozeUntil:
            snoozeUntil

    });


    saveSnoozeHistory(
        history
    );

}