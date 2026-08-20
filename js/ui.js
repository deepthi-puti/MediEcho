// ==========================================
// CREATE MEDICINE CARD
// ==========================================

function createMedicineCard(medicine) {

    const card = document.createElement("div");

    card.className = "medicine-card";

    card.dataset.id = medicine.id;


    // ======================================
    // IMAGE
    // ======================================

    const imageHTML = medicine.image

        ? `
            <img
                src="${medicine.image}"
                alt="${medicine.name}"
                class="medicine-card-image">
          `

        : `
            <div class="medicine-card-image medicine-placeholder">

                <i class="fa-solid fa-pills"></i>

            </div>
          `;


    // ======================================
    // PURPOSE
    // ======================================

    const purposeHTML = medicine.purpose

        ? `
            <div class="medicine-detail">

                <span class="detail-label">
                    Purpose
                </span>

                <span class="detail-value">
                    ${medicine.purpose}
                </span>

            </div>
          `

        : "";


    // ======================================
    // NOTES
    // ======================================

    const notesHTML = medicine.notes

        ? `
            <div class="medicine-notes-section">

                <span class="detail-label">
                    Notes
                </span>

                <p class="medicine-notes">
                    ${medicine.notes}
                </p>

            </div>
          `

        : "";


    // ======================================
    // FOOD INSTRUCTION
    // ======================================

    const foodHTML = medicine.foodInstruction

        ? `
            <div class="medicine-detail">

                <span class="detail-label">
                    Food Instruction
                </span>

                <span class="detail-value">
                    ${medicine.foodInstruction}
                </span>

            </div>
          `

        : "";


    // ======================================
    // REMINDER TIMES
    // ======================================

    const reminderHTML = medicine.reminders
    .map(function (reminder) {

        let statusClass = "pending";

        let statusIcon = "fa-regular fa-clock";

        let statusHTML = `<span> Pending</span>`;


        // Taken
        if (reminder.status === "taken") {

            statusClass = "taken";

            statusIcon = "fa-solid fa-check";

            statusHTML = `<span>Taken</span>`;

        }


        // Skipped
        else if (reminder.status === "skipped") {

            statusClass = "skipped";

            statusIcon = "fa-solid fa-xmark";

            statusHTML = `<span> Skipped </span>`;

        }

        else if (reminder.status === "snoozed"){
            statusClass ="snoozed";
            statusIcon = "fa-solid fa-bell";

            const snoozeTime = formatSnoozeTime(reminder.snoozeUntil);
               statusHTML = `

                        <div class="snoozed-status-content">

                        <span>Snoozed</span>
                        <small>Reminds at ${snoozeTime}</small>

                        </div>

                        `;
        }

        


        return `

    <div
        class="reminder-item"
        data-reminder-id="${reminder.id}">

        <!-- REMINDER TIME -->

        <div class="reminder-time">

            <i class="fa-regular fa-clock"></i>

            <span>
                ${formatTime(reminder.time)}
            </span>

        </div>


        <!-- REMINDER STATUS -->

        <div class="reminder-actions">

            <div
                class="reminder-status ${statusClass}">

                <i class="${statusIcon}"></i>

                ${statusHTML}
            </div>

        </div>

    </div>

`;

    })
    .join("");


    // ======================================
    // CARD HTML
    // ======================================

    card.innerHTML = `

        <div class="medicine-card-header">

            <div class="medicine-image-wrapper">

                ${imageHTML}

            </div>


            <div class="medicine-main-info">

                <h3 class="medicine-name">
                    ${medicine.name}
                </h3>


                <div class="medicine-dosage">

                    <i class="fa-solid fa-pills"></i>

                    <span>
                        ${medicine.dosage.quantity}
                        ${medicine.dosage.unit}
                    </span>

                </div>

            </div>

        </div>


        <div class="medicine-details">

            ${purposeHTML}

            ${foodHTML}

        </div>


        ${notesHTML}


        <div class="medicine-reminders-section">

            <h4>
                Reminder Times
            </h4>


            <div class="medicine-reminders">

                ${reminderHTML}

            </div>

        </div>


        <div class="medicine-card-footer">

            <button
                type="button"
                class="edit-medicine-btn"
                data-id="${medicine.id}">

                <i class="fa-solid fa-pen"></i>

                Edit

            </button>


            <button
                type="button"
                class="delete-medicine-btn"
                data-id="${medicine.id}">

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>

        </div>

    `;


    return card;

}


// ==========================================
// RENDER TODAY'S MEDICINES
// ==========================================

function renderTodaysMedicines() {

    const container =
        document.getElementById(
            "todaysMedicinesContainer"
        );


    if (!container) {

        return;

    }


    const medicines = getMedicines();


    const todaysMedicines =
        medicines.filter(function (medicine) {

            // Empty date = every day

            if (
                !medicine.date ||
                medicine.date === null
            ) {

                return true;

            }


            // Fixed date = only on that date

            return medicine.date === getTodayDate();

        });


    container.innerHTML = "";


    // ======================================
    // NO MEDICINES
    // ======================================

    if (todaysMedicines.length === 0) {

        container.innerHTML = `

            <div class="empty-medicines">

                <i class="fa-solid fa-pills"></i>

                <h3>
                    No medicines for today
                </h3>

                <p>
                    Add a medicine to create
                    your reminder schedule.
                </p>

            </div>

        `;

        return;

    }


    // ======================================
    // CREATE CARDS
    // ======================================

    todaysMedicines.forEach(function (medicine) {

        const card =
            createMedicineCard(medicine);

        container.appendChild(card);

    });

}

