// ==========================================
// MEDIECHO HISTORY PAGE
// ==========================================


// ==========================================
// HISTORY CONTAINER
// ==========================================

const historyContainer =
    document.getElementById("historyContainer");


// ==========================================
// FORMAT HISTORY TIME
// ==========================================

function formatHistoryTime(time24) {

    if (!time24) {
        return "";
    }

    const parts = time24.split(":");

    if (parts.length < 2) {
        return time24;
    }

    let hour = parseInt(parts[0], 10);

    const minute = parts[1];

    const period =
        hour >= 12
            ? "PM"
            : "AM";

    if (hour === 0) {
        hour = 12;
    }
    else if (hour > 12) {
        hour -= 12;
    }

    return (
        String(hour).padStart(2, "0") +
        ":" +
        minute +
        " " +
        period
    );
}


// ==========================================
// FORMAT HISTORY DATE
// ==========================================

function formatHistoryDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts = String(dateString).split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const date = new Date(
        year,
        month,
        day
    );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


// ==========================================
// STATUS HTML
// ==========================================

function getHistoryStatusHTML(event) {

    if (event.status === "snoozed") {

        return `
            <span class="history-status snoozed">

                <i class="fa-solid fa-bell"></i>

                Snoozed
                (${event.snoozeMinutes || 0} min)

            </span>
        `;
    }


    if (event.status === "taken") {

        return `
            <span class="history-status taken">

                <i class="fa-solid fa-check"></i>

                Taken

            </span>
        `;
    }


    if (event.status === "skipped") {

        return `
            <span class="history-status skipped">

                <i class="fa-solid fa-xmark"></i>

                Skipped

            </span>
        `;
    }


    return `
        <span class="history-status">
            ${event.status || ""}
        </span>
    `;
}


// ==========================================
// CREATE HISTORY ROW
// ==========================================

function createHistoryRow(event) {

    const row =
        document.createElement("div");

    row.className = "history-row";

    row.innerHTML = `

        <div class="history-medicine">

            <span class="history-label">
                Medicine
            </span>

            <strong>
                ${event.medicineName || ""}
            </strong>

        </div>


        <div class="history-time">

            <span class="history-label">
                Time
            </span>

            <span>
                ${formatHistoryTime(event.historyTime)}
            </span>

        </div>


        <div class="history-status-column">

            <span class="history-label">
                Status
            </span>

            ${getHistoryStatusHTML(event)}

        </div>

    `;

    return row;
}


// ==========================================
// CREATE DATE SECTION
// ==========================================

function createHistoryDateSection(date, events) {

    const section =
        document.createElement("div");

    section.className =
        "history-date-section";


    const rowsHTML =
        events
            .map(function (event) {

                return createHistoryRow(event).outerHTML;

            })
            .join("");


    section.innerHTML = `

        <div class="history-date-header">

            <div class="history-date-title">

                <i class="fa-regular fa-calendar"></i>

                <h3>
                    ${formatHistoryDate(date)}
                </h3>

            </div>


            <button
                type="button"
                class="delete-date-btn"
                data-date="${date}">

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

        </div>


        <div class="history-table">

            <div class="history-table-header">

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


            <div class="history-table-body">

                ${rowsHTML}

            </div>

        </div>

    `;


    return section;
}


// ==========================================
// RENDER HISTORY
// ==========================================

function renderHistory() {

    const container =
        document.getElementById("historyContainer");

    if (!container) {
        return;
    }


    const history =
        getMedicineHistory();


    container.innerHTML = "";


    // ======================================
    // NO HISTORY
    // ======================================

    if (!Array.isArray(history) || history.length === 0) {

        container.innerHTML = `

            <div class="history-empty">

                <i class="fa-solid fa-clock-rotate-left"></i>

                <h3>
                    No medicine history yet
                </h3>

                <p>
                    Your medicine activity
                    will appear here.
                </p>

            </div>

        `;

        return;
    }


    // ======================================
    // GROUP BY DATE
    // ======================================

    const groupedHistory = {};


    history.forEach(function (event) {

        if (!event || !event.date) {
            return;
        }


        const eventDate =
            String(event.date);


        if (!groupedHistory[eventDate]) {

            groupedHistory[eventDate] = [];

        }


        groupedHistory[eventDate].push(event);

    });


    // ======================================
    // SORT DATES
    // NEWEST FIRST
    // ======================================

    const dates =
        Object.keys(groupedHistory).sort(
            function (a, b) {

                return b.localeCompare(a);

            }
        );


    // ======================================
    // CREATE SECTIONS
    // ======================================

    dates.forEach(function (date) {

        const events =
            groupedHistory[date];


        // ==================================
        // SORT EVENTS
        // NEWEST TIME FIRST
        // ==================================

        events.sort(function (a, b) {

            const timeA =
                a.historyTime ||
                a.time ||
                "00:00";

            const timeB =
                b.historyTime ||
                b.time ||
                "00:00";

            return timeB.localeCompare(timeA);

        });


        const section =
            createHistoryDateSection(
                date,
                events
            );


        container.appendChild(section);

    });

}


// ==========================================
// DELETE ONE DATE
// ==========================================

function deleteDateHistory(date) {

    console.log(
        "DELETE DATE CLICKED:",
        date
    );


    const history =
        getMedicineHistory();


    console.log(
        "CURRENT HISTORY:",
        history
    );


    if (!Array.isArray(history) || history.length === 0) {

        alert(
            "There is no history to delete."
        );

        return;
    }


    const formattedDate =
        formatHistoryDate(date);


    const confirmed =
        confirm(
            `Are you sure you want to delete the history for ${formattedDate}?`
        );


    if (!confirmed) {
        return;
    }


    // ======================================
    // REMOVE SELECTED DATE
    // ======================================

    const updatedHistory =
        history.filter(function (event) {

            return String(event.date) !== String(date);

        });


    console.log(
        "UPDATED HISTORY:",
        updatedHistory
    );


    // ======================================
    // SAVE CORRECT HISTORY
    // ======================================

    saveMedicineHistory(
        updatedHistory
    );


    // ======================================
    // RENDER AGAIN
    // ======================================

    renderHistory();

}


// ==========================================
// CLEAR ALL HISTORY
// ==========================================

function clearAllHistory() {

    console.log(
        "CLEAR ALL HISTORY CLICKED"
    );


    const history =
        getMedicineHistory();


    if (!Array.isArray(history) || history.length === 0) {

        alert(
            "There is no history to clear."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear ALL medicine history?"
        );


    if (!confirmed) {
        return;
    }


    // ======================================
    // REMOVE ACTUAL HISTORY KEY
    // ======================================

    localStorage.removeItem(
        HISTORY_STORAGE_KEY
    );


    // ======================================
    // RENDER EMPTY HISTORY
    // ======================================

    renderHistory();


    alert(
        "All medicine history has been cleared."
    );

}


// ==========================================
// EVENT DELEGATION
// ==========================================

document.addEventListener(
    "click",
    function (event) {


        // ==================================
        // DELETE DATE
        // ==================================

        const deleteDateButton =
            event.target.closest(
                ".delete-date-btn"
            );


        if (deleteDateButton) {

            const date =
                deleteDateButton.dataset.date;


            if (!date) {

                console.error(
                    "History date is missing."
                );

                return;
            }


            deleteDateHistory(date);

            return;
        }


        // ==================================
        // CLEAR ALL
        // ==================================

        const clearButton =
            event.target.closest(
                "#clearHistoryBtn"
            );


        if (clearButton) {

            clearAllHistory();

            return;
        }

    }
);


// ==========================================
// LOAD HISTORY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderHistory();

    }
);