// ==========================================
// MEDIECHO MEDICINE
// ==========================================


// ==========================================
// MODAL ELEMENTS
// ==========================================
// ==========================================
// REMINDER MODAL ELEMENTS
// ==========================================

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

const medicineModal =
    document.getElementById("medicineModal");

const addMedicineBtn =
    document.getElementById("addMedicineBtn");

const closeMedicineModal =
    document.getElementById("closeMedicineModal");

const cancelMedicineBtn =
    document.getElementById("cancelMedicineBtn");

const medicineForm =
    document.getElementById("medicineForm");


// ==========================================
// IMAGE ELEMENTS
// ==========================================

const medicineImage =
    document.getElementById("medicineImage");

const medicineImagePreview =
    document.getElementById("medicineImagePreview");

const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");


const removeMedicineImage =
    document.getElementById("removeMedicineImage");


// Stores image as Base64
let medicineImageBase64 = "";
let editMedicineId = null;
let activeReminderMedicineId = null;
let activeReminderId = null;
let reminderPopupShownKey = null;

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
        now.toISOString().split("T")[0];


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


        // -------------------------------
        // UPDATE ONLY THIS REMINDER
        // -------------------------------

        reminder.status =
            "taken";


        reminder.statusDate =
            new Date()
                .toISOString()
                .split("T")[0];


        reminder.snoozeUntil =
            null;


        // -------------------------------
        // SAVE
        // -------------------------------

        saveMedicines(medicines);


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

reminderSkipButton.addEventListener(
    "click",
    function () {

        const medicines = getMedicines();

        // Find the exact medicine
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


        // Find the exact reminder
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


        // ----------------------------------
        // MARK ONLY THIS REMINDER AS SKIPPED
        // ----------------------------------

        reminder.status =
            "skipped";


        reminder.statusDate =
            new Date()
                .toISOString()
                .split("T")[0];


        // Clear any previous snooze
        reminder.snoozeUntil =
            null;


        // ----------------------------------
        // SAVE
        // ----------------------------------

        saveMedicines(medicines);


        // ----------------------------------
        // CLOSE POPUP
        // ----------------------------------

        reminderModal.classList.remove(
            "show"
        );

        // ----------------------------------
        // REFRESH MEDICINE CARD
        // ----------------------------------

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
// SNOOZE REMINDER
// ==========================================

function snoozeReminder(minutes) {

    if (!minutes || minutes <= 0) {

        return;

    }


    const medicines =
        getMedicines();


    // --------------------------------------
    // FIND MEDICINE
    // --------------------------------------

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


    // --------------------------------------
    // FIND EXACT REMINDER
    // --------------------------------------

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


    // --------------------------------------
    // CALCULATE SNOOZE TIME
    // --------------------------------------

    const snoozeTime =
        Date.now() +
        (minutes * 60 * 1000);


    // --------------------------------------
    // UPDATE ONLY THIS REMINDER
    // --------------------------------------

    reminder.status =
        "snoozed";


    reminder.snoozeUntil =
        snoozeTime;


    reminder.snoozeMinutes =
        minutes;


    reminder.statusDate =
        new Date()
            .toISOString()
            .split("T")[0];


    // --------------------------------------
    // SAVE
    // --------------------------------------

    saveMedicines(medicines);


    // --------------------------------------
    // CLOSE POPUP
    // --------------------------------------

    reminderModal.classList.remove(
        "show"
    );


    // Hide snooze options

    snoozeOptions.classList.remove(
        "show"
    );


    // --------------------------------------
    // REFRESH CARD
    // --------------------------------------

    renderTodaysMedicines();

}

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
// OPEN MODAL
// ==========================================

function openMedicineModal(isEdit = false) {

    if (!isEdit) {

        medicineForm.reset();

        resetMedicineImage();

    }


    medicineModal.classList.add("show");

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeMedicineModalFunction() {

    medicineModal.classList.remove("show");

}


// ==========================================
// ADD MEDICINE BUTTON
// ==========================================

addMedicineBtn.addEventListener(
    "click",
    openMedicineModal
);


// ==========================================
// CLOSE BUTTON
// ==========================================

closeMedicineModal.addEventListener(
    "click",
    closeMedicineModalFunction
);


// ==========================================
// CANCEL BUTTON
// ==========================================

cancelMedicineBtn.addEventListener(
    "click",
    closeMedicineModalFunction
);


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

medicineModal.addEventListener(
    "click",
    function (event) {

        if (event.target === medicineModal) {

            closeMedicineModalFunction();

        }

    }
);


// ==========================================
// IMAGE PREVIEW
// ==========================================

medicineImage.addEventListener(
    "change",
    function (event) {

        const file = event.target.files[0];


        if (!file) {

            return;

        }


        // Check image
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            medicineImage.value = "";

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Please choose an image smaller than 5 MB."
            );

            medicineImage.value = "";

            return;

        }

        compressMedicineImage(file);

        // const reader = new FileReader();


        // reader.onload = function (event) {

        //     medicineImageBase64 =
        //         event.target.result;


        //     medicineImagePreview.src =
        //         medicineImageBase64;


        //     imagePreviewContainer.classList.add(
        //         "show"
        //     );

        // };


        // reader.readAsDataURL(file);

    }
);

// ==========================================
// COMPRESS MEDICINE IMAGE
// ==========================================

function compressMedicineImage(file) {

    const reader = new FileReader();


    reader.onload = function (event) {

        const image =
            new Image();


        image.onload = function () {

            const canvas =
                document.createElement("canvas");


            const maxWidth = 500;

            const maxHeight = 500;


            let width =
                image.width;

            let height =
                image.height;


            // ==================================
            // RESIZE
            // ==================================

            if (width > maxWidth) {

                height =
                    height *
                    (maxWidth / width);

                width =
                    maxWidth;

            }


            if (height > maxHeight) {

                width =
                    width *
                    (maxHeight / height);

                height =
                    maxHeight;

            }


            canvas.width =
                width;

            canvas.height =
                height;


            const context =
                canvas.getContext("2d");


            context.drawImage(
                image,
                0,
                0,
                width,
                height
            );


            // ==================================
            // COMPRESS
            // ==================================

            medicineImageBase64 =
                canvas.toDataURL(
                    "image/jpeg",
                    0.7
                );


            // ==================================
            // SHOW PREVIEW
            // ==================================

            medicineImagePreview.src =
                medicineImageBase64;


            imagePreviewContainer.classList.add(
                "show"
            );

        };


        image.src =
            event.target.result;

    };


    reader.readAsDataURL(file);

}

// ==========================================
// REMOVE IMAGE
// ==========================================

removeMedicineImage.addEventListener(
    "click",
    function () {

        medicineImageBase64 = "";

        medicineImage.value = "";

        medicineImagePreview.src = "";

        imagePreviewContainer.classList.remove(
            "show"
        );

    }
);

// ==========================================
// MULTIPLE REMINDER TIMES
// ==========================================

const reminderTimesContainer =
    document.getElementById(
        "reminderTimesContainer"
    );


const addReminderTimeBtn =
    document.getElementById(
        "addReminderTimeBtn"
    );


// ==========================================
// CREATE REMINDER TIME ROW
// ==========================================

function createReminderTimeRow() {

    const row =
        document.createElement("div");

    row.className =
        "reminder-time-row";


    row.innerHTML = `

        <select
            class="reminder-hour"
            aria-label="Hour">

            <option value="1">01</option>
            <option value="2">02</option>
            <option value="3">03</option>
            <option value="4">04</option>
            <option value="5">05</option>
            <option value="6">06</option>
            <option value="7">07</option>
            <option value="8">08</option>
            <option value="9">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>

        </select>


        <span class="time-colon">
            :
        </span>


        <select
            class="reminder-minute"
            aria-label="Minute">

            <option value="00">00</option>
            <option value="05">05</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>

        </select>


        <select
            class="reminder-period"
            aria-label="AM or PM">

            <option value="AM">
                AM
            </option>

            <option value="PM">
                PM
            </option>

        </select>


        <button
            type="button"
            class="remove-time-button"
            title="Remove time">

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    // Remove button

    const removeButton =
        row.querySelector(
            ".remove-time-button"
        );


    removeButton.addEventListener(
        "click",
        function () {

            const rows =
                reminderTimesContainer
                    .querySelectorAll(
                        ".reminder-time-row"
                    );


            // Don't allow all rows to be deleted
            if (rows.length === 1) {

                alert(
                    "At least one reminder time is required."
                );

                return;

            }


            row.remove();

        }
    );


    reminderTimesContainer.appendChild(row);
}


// ==========================================
// LOAD EXISTING REMINDER TIMES FOR EDIT
// ==========================================

function loadExistingReminderTimes(reminders) {

    // Remove existing rows
    reminderTimesContainer.innerHTML = "";


    reminders.forEach(function (reminder) {

        // Create a normal reminder row
        // using your existing function
        createReminderTimeRow();


        // Get the row that was just created
        const rows =
            reminderTimesContainer.querySelectorAll(
                ".reminder-time-row"
            );

        const row =
            rows[rows.length - 1];


        // Get the selects
        const hourSelect =
            row.querySelector(
                ".reminder-hour"
            );

        const minuteSelect =
            row.querySelector(
                ".reminder-minute"
            );

        const periodSelect =
            row.querySelector(
                ".reminder-period"
            );


        // ======================================
        // CONVERT SAVED 24-HOUR TIME
        // TO 12-HOUR FORMAT
        // ======================================

        const parts =
            reminder.time.split(":");


        let hour =
            Number(parts[0]);

        const minute =
            parts[1];


        let period = "AM";


        if (hour >= 12) {

            period = "PM";

        }


        if (hour === 0) {

            hour = 12;

        }
        else if (hour > 12) {

            hour = hour - 12;

        }


        // ======================================
        // SET SELECT VALUES
        // ======================================

        hourSelect.value =
            String(hour);


        minuteSelect.value =
            minute;


        periodSelect.value =
            period;

    });

}

// ==========================================
// ADD NEW REMINDER TIME
// ==========================================

addReminderTimeBtn.addEventListener(
    "click",
    function () {

        createReminderTimeRow();

    }
);


// ==========================================
// FIRST ROW REMOVE BUTTON
// ==========================================

const firstRemoveButton =
    reminderTimesContainer.querySelector(
        ".remove-time-button"
    );


firstRemoveButton.addEventListener(
    "click",
    function () {

        const rows =
            reminderTimesContainer
                .querySelectorAll(
                    ".reminder-time-row"
                );


        if (rows.length === 1) {

            alert(
                "At least one reminder time is required."
            );

            return;

        }


        this.closest(
            ".reminder-time-row"
        ).remove();

    }
);
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
// GET SELECTED FOOD INSTRUCTION
// ==========================================

function getFoodInstruction() {

    const selectedFood =
        document.querySelector(
            'input[name="foodInstruction"]:checked'
        );

    return selectedFood
        ? selectedFood.value
        : null;
}

// ==========================================
// CONVERT 12-HOUR TIME TO 24-HOUR TIME
// ==========================================

function convertTo24Hour(
    hour,
    minute,
    period
) {

    let hour24 =
        parseInt(hour, 10);


    if (period === "AM") {

        if (hour24 === 12) {

            hour24 = 0;

        }

    } else {

        if (hour24 !== 12) {

            hour24 += 12;

        }

    }


    return (
        String(hour24).padStart(2, "0") +
        ":" +
        minute
    );

}

// ==========================================
// GET REMINDER TIMES
// ==========================================

function getReminderTimes() {

    const rows =
        document.querySelectorAll(
            ".reminder-time-row"
        );


    const times = [];


    rows.forEach(function (row) {

        const hour =
            row.querySelector(
                ".reminder-hour"
            ).value;


        const minute =
            row.querySelector(
                ".reminder-minute"
            ).value;


        const period =
            row.querySelector(
                ".reminder-period"
            ).value;


        const time =
            convertTo24Hour(
                hour,
                minute,
                period
            );


        times.push(time);

    });


    return times;

}

// ==========================================
// CREATE MEDICINE OBJECT
// ==========================================

function createMedicineObject() {

    const name =
        document.getElementById(
            "medicineName"
        ).value.trim();


    const purpose =
        document.getElementById(
            "medicinePurpose"
        ).value.trim();


    const notes =
        document.getElementById(
            "medicineNotes"
        ).value.trim();


    const quantity =
        document.getElementById(
            "medicineQuantity"
        ).value;


    const unit =
        document.getElementById(
            "medicineUnit"
        ).value;


    const date =
        document.getElementById(
            "medicineDate"
        ).value;


    const foodInstruction =
        getFoodInstruction();


    const reminderTimes =
        getReminderTimes();


    return {

        id:
            "medicine_" +
            Date.now(),


        name: name,


        purpose:
            purpose || null,


        notes:
            notes || null,


        image:
            medicineImageBase64 || null,


        dosage: {

            quantity:
                Number(quantity),

            unit:
                unit

        },


        // null means every day
        date:
            date || null,


        reminders:
            reminderTimes.map(
                function (time) {

                    return {
                        id: "reminder_"+ Date.now()+"_"+Math.random().toString(36).substring(2, 8),
                        time: time,

                        status: "pending",
                        snoozeUntil : null,
                        statusDate :getTodayDate()

                    };

                }
            ),


        foodInstruction:
            foodInstruction,


        createdAt:
            new Date().toISOString()

    };

}

// ==========================================
// UPDATE EXISTING MEDICINE
// ==========================================

function updateMedicineObject(existingMedicine) {

    const name =
        document.getElementById(
            "medicineName"
        ).value.trim();


    const purpose =
        document.getElementById(
            "medicinePurpose"
        ).value.trim();


    const notes =
        document.getElementById(
            "medicineNotes"
        ).value.trim();


    const quantity =
        document.getElementById(
            "medicineQuantity"
        ).value;


    const unit =
        document.getElementById(
            "medicineUnit"
        ).value;


    const date =
        document.getElementById(
            "medicineDate"
        ).value;


    const foodInstruction =
        getFoodInstruction();


    const reminderTimes =
        getReminderTimes();


    // ======================================
    // PRESERVE EXISTING REMINDER DATA
    // ======================================

    const updatedReminders =
        reminderTimes.map(function (time, index) {

            // Existing reminder at this position
            const oldReminder =
                existingMedicine.reminders[index];


            // If it already exists, preserve:
            // ID
            // status
            // statusDate
            // snoozeUntil

            if (oldReminder) {

                return {

                    ...oldReminder,

                    time: time

                };

            }


            // New reminder

            return {

                id:
                    "reminder_" +
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                time: time,

                status: "pending",

                snoozeUntil: null,

                statusDate: getTodayDate()

            };

        });


    return {

        ...existingMedicine,

        name: name,

        purpose:
            purpose || null,

        notes:
            notes || null,

        image:
            medicineImageBase64 ||
            existingMedicine.image ||
            null,

        dosage: {

            quantity:
                Number(quantity),

            unit:
                unit

        },

        date:
            date || null,

        reminders:
            updatedReminders,

        foodInstruction:
            foodInstruction

    };

}

// ==========================================
// VALIDATE MEDICINE
// ==========================================

function validateMedicine(medicine) {

    if (!medicine.name) {

        alert("Please enter the medicine name.");

        return false;

    }


    if (!medicine.dosage.unit) {

        alert("Please select the dosage unit.");

        return false;

    }


    if (
        !medicine.reminders ||
        medicine.reminders.length === 0
    ) {

        alert(
            "Please add at least one reminder time."
        );

        return false;

    }


    return true;

}


// ==========================================
// SAVE / UPDATE MEDICINE
// ==========================================

medicineForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const medicines = getMedicines();


    // ==========================================
    // EDIT MODE
    // ==========================================

    if (editMedicineId !== null) {

        const medicineIndex = medicines.findIndex(
            function (medicine) {
                return medicine.id === editMedicineId;
            }
        );


        if (medicineIndex === -1) {

            alert("Medicine not found.");

            return;

        }


        const existingMedicine =
            medicines[medicineIndex];


        const updatedMedicine =
            createUpdatedMedicine(existingMedicine);


        if (!validateMedicine(updatedMedicine)) {

            return;

        }


        medicines[medicineIndex] =
            updatedMedicine;


        saveMedicines(medicines);


        alert("Medicine updated successfully!");

    }


    // ==========================================
    // ADD MODE
    // ==========================================

    else {

        const medicine =
            createMedicineObject();


        if (!validateMedicine(medicine)) {

            return;

        }


        medicines.push(medicine);

        saveMedicines(medicines);


        alert("Medicine saved successfully!");

    }


    // ==========================================
    // CLEAN UP
    // ==========================================

    editMedicineId = null;

    closeMedicineModalFunction();

    medicineForm.reset();

    resetMedicineImage();

    renderTodaysMedicines();

});

// ==========================================
// RESET IMAGE
// ==========================================

function resetMedicineImage() {

    medicineImageBase64 = "";

    medicineImage.value = "";

    medicineImagePreview.src = "";

    imagePreviewContainer.classList.remove(
        "show"
    );

}

// ==========================================
// TODAY'S DATE
// ==========================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}

// ==========================================
// CHECK IF MEDICINE IS FOR TODAY
// ==========================================

function isMedicineForToday(medicine) {

    // No date = every day

    if (medicine.date === null) {

        return true;

    }


    // Specific date = only that date

    return medicine.date === getTodayDate();

}

// ==========================================
// FORMAT TIME FOR DISPLAY
// ==========================================

function formatTime(time24) {

    const parts =
        time24.split(":");


    let hour =
        parseInt(parts[0], 10);


    const minute =
        parts[1];


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
// FORMAT SNOOZE TIME
// ==========================================

function formatSnoozeTime(timestamp) {

    if (!timestamp) {
        return "";
    }

    const date = new Date(Number(timestamp));

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
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


// ==========================================
// UPDATE REMINDER STATUS
// ==========================================

function updateReminderStatus(
    medicineId,
    reminderId,
    newStatus
) {

    const medicines = getMedicines();


    const medicine =
        medicines.find(function (medicine) {

            return medicine.id === medicineId;

        });


    if (!medicine) {

        return;

    }


    const reminder =
        medicine.reminders.find(
            function (reminder) {

                return reminder.id === reminderId;

            }
        );


    if (!reminder) {

        return;

    }


    // Update ONLY this reminder

    reminder.status = newStatus;

    reminder.statusDate = getTodayDate();


    // Save

    saveMedicines(medicines);


    // Re-render cards

    renderTodaysMedicines();

}

// ==========================================
// EDIT MEDICINE
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                ".edit-medicine-btn"
            );


        if (!editButton) {

            return;

        }


        const medicineId =
            editButton.dataset.id;


        const medicines =
            getMedicines();


        const medicine =
            medicines.find(
                function (medicine) {

                    return medicine.id ===
                        medicineId;

                }
            );


        if (!medicine) {

            return;

        }


        // Enter edit mode

        editMedicineId =
            medicine.id;


        // ==================================
        // FILL FORM
        // ==================================

        document.getElementById(
            "medicineName"
        ).value =
            medicine.name || "";


        document.getElementById(
            "medicinePurpose"
        ).value =
            medicine.purpose || "";


        document.getElementById(
            "medicineNotes"
        ).value =
            medicine.notes || "";


        document.getElementById(
            "medicineQuantity"
        ).value =
            medicine.dosage.quantity || "";


        document.getElementById(
            "medicineUnit"
        ).value =
            medicine.dosage.unit || "";


        document.getElementById(
            "medicineDate"
        ).value =
            medicine.date || "";


        // ==================================
        // IMAGE
        // ==================================

        medicineImageBase64 =
            medicine.image || "";


        if (medicine.image) {

            medicineImagePreview.src =
                medicine.image;

            imagePreviewContainer.classList.add(
                "show"
            );

        }
        else {

            resetMedicineImage();

        }


        // ==================================
        // LOAD FOOD INSTRUCTION
        // ==================================

        const foodInstruction =
            medicine.foodInstruction || "";

        const foodOptions =
            document.querySelectorAll(
            'input[name="foodInstruction"]'
         );

        foodOptions.forEach(function (option) {

            option.checked =
            option.value === foodInstruction;

        });


        // ==================================
        // LOAD REMINDER TIMES
        // ==================================

       loadExistingReminderTimes(
             medicine.reminders
        );


        // ==================================
        // OPEN MODAL
        // ==================================

        openMedicineModal(true);

    }
);

// ==========================================
// DELETE MEDICINE
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-medicine-btn"
            );


        if (!deleteButton) {

            return;

        }


        const medicineId =
            deleteButton.dataset.id;


        const confirmed =
            confirm(
                "Are you sure you want to delete this medicine?"
            );


        if (!confirmed) {

            return;

        }


        const medicines =
            getMedicines();


        const updatedMedicines =
            medicines.filter(
                function (medicine) {

                    return medicine.id !==
                        medicineId;

                }
            );


        saveMedicines(
            updatedMedicines
        );


        renderTodaysMedicines();

    }
);


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

// ==========================================
// LOAD MEDICINES ON PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderTodaysMedicines();

    }
);

// ==========================================
// CREATE UPDATED MEDICINE
// ==========================================

function createUpdatedMedicine(existingMedicine) {

    const name =
        document.getElementById("medicineName").value.trim();


    const purpose =
        document.getElementById("medicinePurpose").value.trim();


    const notes =
        document.getElementById("medicineNotes").value.trim();


    const quantity =
        document.getElementById("medicineQuantity").value;


    const unit =
        document.getElementById("medicineUnit").value;


    const date =
        document.getElementById("medicineDate").value;


    const foodInstruction =
        getFoodInstruction();


    const reminderTimes =
        getReminderTimes();


    // ==========================================
    // PRESERVE EXISTING REMINDER INFORMATION
    // ==========================================

    const updatedReminders =
        reminderTimes.map(function (time, index) {

            const oldReminder =
                existingMedicine.reminders[index];


            // Existing reminder
            if (oldReminder) {

                return {

                    ...oldReminder,

                    time: time

                };

            }


            // New reminder
            return {

                id:
                    "reminder_" +
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                time: time,

                status: "pending",

                snoozeUntil: null,

                statusDate: getTodayDate()

            };

        });


    return {

        ...existingMedicine,

        name: name,

        purpose:
            purpose || null,

        notes:
            notes || null,

        image:
            medicineImageBase64 ||
            existingMedicine.image ||
            null,

        dosage: {

            quantity:
                Number(quantity),

            unit:
                unit

        },

        date:
            date || null,

        reminders:
            updatedReminders,

        foodInstruction:
            foodInstruction

    };

}



