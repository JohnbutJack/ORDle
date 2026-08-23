
const randomIndex =
    Math.floor(Math.random() * items.length);

const item =
    items[randomIndex];

const countryRegions = {
    "United States": "North America",
    "Canada": "North America",

    "United Kingdom": "Western Europe",
    "France": "Western Europe",
    "Germany": "Western Europe",
    // "Belgium": "Western Europe",
    // "Italy": "Western Europe",

    "Poland": "Eastern Europe",
    // "Czech Republic": "Eastern Europe",
    "Romania": "Eastern Europe",
    "Bulgaria": "Eastern Europe",

    "Russia": "Eastern Europe",
    // "Ukraine": "Former Soviet States",
    // "Belarus": "Eastern Europe",
    // "Kazakhstan": "Former Soviet States",

    "China": "East Asia",
    "Japan": "East Asia",
    "North Korea": "East Asia",
    // "South Korea": "East Asia",

    // "India": "South Asia",
    // "Pakistan": "South Asia",

    "Israel": "Middle East",
    "Iran": "Middle East",
    "Iraq": "Middle East"
};

const subcategoriesByCategory = {

    "Projectile": [
        "HE",
        "HEAT",
        "HEP/HESH",
        "RAP/HERA",
        "APHE",
        "Dispensing",
        "Bursting"
    ],

    "Rocket": [
        "HE",
        "HEAT"
    ],

    "Grenade": [
        "HE/Frag",
        "Blast",
        "Smoke"
    ],

    "Bomb": [
        "HE",
        "Fragmentation",
        "GBU",
        "Practice"
    ],

    "Mine": [
        "Anti-Personnel: Blast",
        "Anti-Personnel: Bounding Frag",
        "Anti-Personnel: Directional Frag",
        "Anti-Vehicle"
    ],

    "Submunition": [
        "Fragmentation",
        "HEAT"
    ],

    "Fuze": [
        "Point Detonating",
        "Base Detonating",
        "Mechanical Time",
        "Electronic Time",
        "PTTF",
        "Proximity"
    ]
};

const categories =
    Object.keys(subcategoriesByCategory);

const ordnanceImage =
    document.getElementById("ordnanceImage");

const catInput =
    document.getElementById("catInput");

const subcatInput =
    document.getElementById("subcatInput");

const countryInput =
    document.getElementById("countryInput");

const diamInput =
    document.getElementById("diamInput");

const guessButton =
    document.getElementById("guessButton");

const attempts =
    document.getElementById("attempts");

const feedback =
    document.getElementById("feedback");

populateDropdown(
    catInput,
    categories
);

populateCountryDropdownByRegion();

ordnanceImage.src = item.image;


let attemptsRemaining = 6;

let gameOver = false;

const shareResults = [];

const blurLevels = [
    20,  // Starting blur
    12,  // After guess 1,  // After guess 2
    7,   // After guess 3
    2,
    0,   // After guess 4
    0,   // After guess 5
    0    // Game over
];

let guessesMade = 0;

guessButton.addEventListener(
    "click",
    makeGuess
);

catInput.addEventListener(
    "change",
    updateSubcategoryDropdown
);

diamInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            makeGuess();
        }

    }
);


function makeGuess() {

    if (gameOver) {
        return;
    }


    const catGuess =
        catInput.value;

    const subcatGuess =
        subcatInput.value;

    const countryGuess =
        countryInput.value;

    const diamGuess =
        Number(diamInput.value);


    if (
        catGuess === "" ||
        subcatGuess === "" ||
        countryGuess === "" ||
        diamInput.value === ""
    ) {

        alert(
            "Please make a guess for all four categories."
        );

        return;
    }


    const catCorrect =
        catGuess === item.cat;

    const subcatCorrect =
        subcatGuess === item.subcat;

    const countryCorrect =
        countryGuess === item.country;

    const countryClose =
        !countryCorrect &&
        countryRegions[countryGuess] === countryRegions[item.country];

const diamCorrect =
    Math.abs(diamGuess - item.diam) <= 0.075 * item.diam;


    addGuessRow(
        catGuess,
        subcatGuess,
        countryGuess,
        diamGuess,
        catCorrect,
        subcatCorrect,
        countryCorrect,
        countryClose,
        diamCorrect
    );


    const allCorrect =
        catCorrect &&
        subcatCorrect &&
        countryCorrect &&
        diamCorrect;


    if (allCorrect) {

        setTimeout(function() {

            endGame(true);

        }, 1600);

        return;
    }


    attemptsRemaining--;

    guessesMade++;

    updateBlur();


    attempts.textContent =
        "Attempts remaining: " +
        attemptsRemaining;


    if (attemptsRemaining <= 0) {

        endGame(false);

        return;
    }


    clearInputs();}


function addGuessRow(
    catGuess,
    subcatGuess,
    countryGuess,
    diamGuess,
    catCorrect,
    subcatCorrect,
    countryCorrect,
    countryClose,
    diamCorrect
) {

    const row =
        document.createElement("div");

    row.classList.add("guess-row");


    const catBox =
        createFeedbackBox(
            "Category",
            catGuess,
            catCorrect
                ? "correct"
                : "incorrect"
        );


    const subcatBox =
        createFeedbackBox(
            "Subcategory",
            subcatGuess,
            subcatCorrect
                ? "correct"
                : "incorrect"
        );


    let countryClass;

    if (countryCorrect) {

        countryClass = "correct";

    } else if (countryClose) {

        countryClass = "close";

    } else {

        countryClass = "incorrect";

    }


    const countryBox =
        createFeedbackBox(
            "Country",
            countryGuess,
            countryClass
        );


    let diameterClass;
    let diameterText;


    if (diamCorrect) {

        diameterClass = "correct";

        diameterText =
            diamGuess + " mm ✓";

    } else if (diamGuess >= 0.75*item.diam && diamGuess < item.diam) {

        diameterClass = "close";

        diameterText =
            diamGuess + " mm ↑";

    } else if (diamGuess <= 1.25*item.diam && diamGuess > item.diam) {

        diameterClass = "close";

        diameterText =
            diamGuess + " mm ↓";

    } else if (diamGuess < 0.75*item.diam) {

        diameterClass = "incorrect";

        diameterText =
            diamGuess + " mm ↑↑";

    } else {

        diameterClass = "incorrect";

        diameterText =
            diamGuess + " mm ↓↓";

    }

    shareResults.push([
        catCorrect ? "correct" : "incorrect",
        subcatCorrect ? "correct" : "incorrect",
        countryClass,
        diameterClass
    ]);

    const diamBox =
        createFeedbackBox(
            "Diameter",
            diameterText,
            diameterClass
        );


    row.appendChild(catBox);
    row.appendChild(subcatBox);
    row.appendChild(countryBox);
    row.appendChild(diamBox);

    feedback.prepend(row);


    // Animate tiles one at a time
    const tiles =
        row.querySelectorAll(".feedback-box");

    tiles.forEach(function(tile, index) {

        setTimeout(function() {

            tile.classList.add("flip");

            // Change color halfway through flip
            setTimeout(function() {

                tile.classList.add(
                    tile.dataset.status
                );

            }, 400);

        }, index * 220);

    });
}


function createFeedbackBox(
    title,
    value,
    statusClass
) {

    const box =
        document.createElement("div");

    box.classList.add(
        "feedback-box"
    );

    box.dataset.status =
        statusClass;


    const titleElement =
        document.createElement("div");

    titleElement.classList.add(
        "feedback-title"
    );

    titleElement.textContent =
        title;


    const valueElement =
        document.createElement("div");

    valueElement.classList.add(
        "feedback-value"
    );

    valueElement.textContent =
        value;


    box.appendChild(titleElement);

    box.appendChild(valueElement);


    return box;
}


function clearInputs() {

    catInput.value = "";

    subcatInput.value = "";

    countryInput.value = "";

    diamInput.value = "";
}


function endGame(won) {

    gameOver = true;

    guessButton.disabled = true;

    ordnanceImage.style.filter = "blur(0px)";

    catInput.disabled = true;

    subcatInput.disabled = true;

    countryInput.disabled = true;

    diamInput.disabled = true;


    const message =
        document.createElement("div");

    message.classList.add(
        "game-message"
    );


    if (won) {

        message.innerHTML = `
            <h2>Correct!</h2>

            <p>
                The item is
                <strong>${item.name}</strong>.
            </p>

            <p>
                <a
                    href="${item.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View CAT-UXO entry
                </a>
            </p>
        `;

    } else {

        message.innerHTML = `
            <h2>Game Over</h2>

            <p>
                The item was
                <strong>${item.name}</strong>.
            </p>

            <p>
                Category:
                <strong>${item.cat}</strong>
            </p>

            <p>
                Subcategory:
                <strong>${item.subcat}</strong>
            </p>

            <p>
                Country:
                <strong>${item.country}</strong>
            </p>

            <p>
                Diameter:
                <strong>${item.diam} mm</strong>
            </p>

            <p>
                <a
                    href="${item.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View CAT-UXO entry
                </a>
            </p>
        `;

    }

    const shareButton =
        document.createElement("button");

    shareButton.textContent =
        "SHARE RESULTS";

    shareButton.classList.add(
        "share-button"
    );

    shareButton.addEventListener(
        "click",
        function() {
            shareGame(won);
        }
    );

    message.appendChild(
        shareButton
    );
    
    feedback.prepend(message);
}

function updateBlur() {

    ordnanceImage.style.filter =
        `blur(${blurLevels[guessesMade]}px)`;
}

function populateDropdown(
    dropdown,
    values
) {

    const sortedValues =
        [...values].sort();

    sortedValues.forEach(function(value) {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        dropdown.appendChild(option);

    });
}

function updateSubcategoryDropdown() {

    const selectedCategory =
        catInput.value;

    // Clear previous options
    subcatInput.innerHTML = "";


    if (selectedCategory === "") {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Choose category first";

        subcatInput.appendChild(option);

        subcatInput.disabled = true;

        return;
    }


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Choose subcategory";

    subcatInput.appendChild(defaultOption);


    const validSubcategories =
        subcategoriesByCategory[selectedCategory];


    populateDropdown(
        subcatInput,
        validSubcategories
    );


    subcatInput.disabled = false;
}

function buildShareText(won) {

    const symbols = {
        correct: "🟩",
        close: "🟨",
        incorrect: "⬛"
    };

    const rows = shareResults
        .map(function(row) {

            return row
                .map(function(result) {
                    return symbols[result];
                })
                .join("");

        })
        .join("\n");


    const score =
        won
            ? shareResults.length + "/6"
            : "X/6";


    return (
        "ORDle " + score +
        "\n\n" +
        rows +
        "\n\n" +
        "Category • Subcategory • Country • Diameter" +
        "\n\n" +
        "Play at: https://eod-ordle.netlify.app"
    );
}

async function shareGame(won) {

    const shareText =
        buildShareText(won);


    if (navigator.share) {

        try {

            await navigator.share({
                title: "ORDle",
                text: shareText
            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    } else {

        try {

            await navigator.clipboard.writeText(
                shareText
            );

            alert(
                "Results copied to clipboard!"
            );

        } catch (error) {

            alert(
                shareText
            );

        }

    }
}

function populateCountryDropdownByRegion() {

    // Keep the default option
    countryInput.innerHTML = `
        <option value="">
            Choose country
        </option>
    `;


    // Get all unique regions
    const regions =
        [...new Set(Object.values(countryRegions))];


    regions.forEach(function(region) {

        // Create a labeled region group
        const group =
            document.createElement("optgroup");

        group.label = region;


        // Find countries belonging to this region
        const countries =
            Object.keys(countryRegions)
                .filter(function(country) {

                    return countryRegions[country] === region;

                })
                .sort();


        // Add countries to the group
        countries.forEach(function(country) {

            const option =
                document.createElement("option");

            option.value = country;
            option.textContent = country;

            group.appendChild(option);

        });


        countryInput.appendChild(group);

    });
}