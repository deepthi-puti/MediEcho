// ==========================================
// MEDIECHO SPEECH
// ==========================================


// ==========================================
// SPEECH LANGUAGE SETTINGS
// ==========================================

const SPEECH_LANGUAGES = {

    en: {
        lang: "en-IN",

        message: function (medicine) {

            let message =
                `It's time to take ${medicine.name}. ` +
                `Take ${medicine.dosage.quantity} ${medicine.dosage.unit}.`;

            if (medicine.foodInstruction) {

                message +=
                    ` ${medicine.foodInstruction}.`;
            }

            return message;
        }
    },


    hi: {
        lang: "hi-IN",

        message: function (medicine) {

            let message =
                `यह ${medicine.name} लेने का समय है। ` +
                `${medicine.dosage.quantity} ${getHindiUnit(medicine.dosage.unit)} लें।`;

            if (medicine.foodInstruction) {

                message +=
                    ` ${getHindiFoodInstruction(medicine.foodInstruction)}।`;
            }

            return message;
        }
    },


    te: {
        lang: "te-IN",

        message: function (medicine) {

            let message =
                `${medicine.name} తీసుకునే సమయం వచ్చింది. ` +
                `${medicine.dosage.quantity} ${getTeluguUnit(medicine.dosage.unit)} తీసుకోండి.`;

            if (medicine.foodInstruction) {

                message +=
                    ` ${getTeluguFoodInstruction(medicine.foodInstruction)}.`;
            }

            return message;
        }
    }

};


// ==========================================
// HINDI UNIT
// ==========================================

function getHindiUnit(unit) {

    const units = {

        "Tablet": "टैबलेट",
        "Capsule": "कैप्सूल",
        "ml": "मिलीलीटर",
        "Drop": "ड्रॉप",
        "Spoon": "चम्मच",
        "Other": ""

    };

    return units[unit] || unit;
}


// ==========================================
// TELUGU UNIT
// ==========================================

function getTeluguUnit(unit) {

    const units = {

        "Tablet": "టాబ్లెట్",
        "Capsule": "క్యాప్సూల్",
        "ml": "మిల్లీలీటర్లు",
        "Drop": "చుక్కలు",
        "Spoon": "చెంచా",
        "Other": ""

    };

    return units[unit] || unit;
}


// ==========================================
// HINDI FOOD INSTRUCTION
// ==========================================

function getHindiFoodInstruction(instruction) {

    const instructions = {

        "Before Food": "खाने से पहले लें",
        "After Food": "खाने के बाद लें",
        "With Food": "खाने के साथ लें"

    };

    return instructions[instruction] || instruction;
}


// ==========================================
// TELUGU FOOD INSTRUCTION
// ==========================================

function getTeluguFoodInstruction(instruction) {

    const instructions = {

        "Before Food": "భోజనానికి ముందు తీసుకోండి",
        "After Food": "భోజనం తర్వాత తీసుకోండి",
        "With Food": "భోజనంతో పాటు తీసుకోండి"

    };

    return instructions[instruction] || instruction;
}


// ==========================================
// GET SELECTED LANGUAGE
// ==========================================

function getSpeechLanguage() {

    const savedLanguage =
        localStorage.getItem(
            "mediecho_language"
        );

    if (
        savedLanguage &&
        SPEECH_LANGUAGES[savedLanguage]
    ) {

        return savedLanguage;
    }


    const languageSelect =
        document.getElementById(
            "languageSelect"
        );

    if (
        languageSelect &&
        SPEECH_LANGUAGES[languageSelect.value]
    ) {

        return languageSelect.value;
    }


    const settingsLanguage =
        document.getElementById(
            "settingsLanguage"
        );

    if (
        settingsLanguage &&
        SPEECH_LANGUAGES[settingsLanguage.value]
    ) {

        return settingsLanguage.value;
    }


    return "en";
}


// ==========================================
// FIND BEST VOICE
// ==========================================

function getBestVoice(language) {

    const voices =
        speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {

        return null;
    }


    const languageInfo =
        SPEECH_LANGUAGES[language];

    if (!languageInfo) {

        return null;
    }


    const targetLanguage =
        languageInfo.lang.toLowerCase();


    // Exact language match
    let voice =
        voices.find(function (voice) {

            return (
                voice.lang.toLowerCase() ===
                targetLanguage
            );

        });


    if (voice) {

        return voice;
    }


    // Language family match
    const languageCode =
        targetLanguage.split("-")[0];


    voice =
        voices.find(function (voice) {

            return voice.lang
                .toLowerCase()
                .startsWith(languageCode);

        });


    return voice || null;
}


// ==========================================
// SPEAK MEDICINE REMINDER
// ==========================================

function speakMedicineReminder(medicine) {

    if (
        !("speechSynthesis" in window)
    ) {

        console.warn(
            "Speech synthesis is not supported in this browser."
        );

        return;
    }


    if (!medicine) {

        return;
    }


    if (
        !medicine.name ||
        !medicine.dosage
    ) {

        console.warn(
            "Medicine information is incomplete."
        );

        return;
    }


    // --------------------------------------
    // GET LANGUAGE
    // --------------------------------------

    const language =
        getSpeechLanguage();


    const languageInfo =
        SPEECH_LANGUAGES[language];


    if (!languageInfo) {

        return;
    }


    // --------------------------------------
    // CREATE MESSAGE
    // --------------------------------------

    const message =
        languageInfo.message(
            medicine
        );


    // --------------------------------------
    // STOP PREVIOUS SPEECH
    // --------------------------------------

    speechSynthesis.cancel();


    // --------------------------------------
    // CREATE UTTERANCE
    // --------------------------------------

    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.lang =
        languageInfo.lang;


    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    // --------------------------------------
    // SELECT VOICE
    // --------------------------------------

    const voice =
        getBestVoice(language);


    if (voice) {

        speech.voice =
            voice;

        console.log(
            "Speech voice:",
            voice.name,
            voice.lang
        );

    }
    else {

        console.warn(
            `No ${languageInfo.lang} voice found. Browser will use its default voice.`
        );

    }


    // --------------------------------------
    // SPEECH EVENTS
    // --------------------------------------

    speech.onstart =
        function () {

            console.log(
                "Speaking:",
                message
            );

        };


    speech.onend =
        function () {

            console.log(
                "Speech completed."
            );

        };


    speech.onerror =
        function (event) {

            console.error(
                "Speech error:",
                event.error
            );

        };


    // --------------------------------------
    // SPEAK
    // --------------------------------------

    speechSynthesis.speak(
        speech
    );
}


// ==========================================
// STOP SPEECH
// ==========================================

function stopSpeech() {

    if (
        "speechSynthesis" in window
    ) {

        speechSynthesis.cancel();

    }
}


// ==========================================
// SPEECH VOICES LOADED
// ==========================================

if (
    "speechSynthesis" in window
) {

    speechSynthesis.onvoiceschanged =
        function () {

            console.log(
                "Speech voices loaded:",
                speechSynthesis.getVoices().length
            );

        };

}