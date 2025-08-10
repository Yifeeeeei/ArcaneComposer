const imageRepoBase = "https://yifeeeeei.github.io/ArcaneImages";
const width = numberToVw(177 * 0.15);
const height = numberToVw(258 * 0.15);

function numberToVw(num) {
    return num.toString() + "vh";
}

async function setup() {
    all_card_infos = await readJsonFile(
        `${imageRepoBase}/output/all_card_infos.json`
    );

    document.body.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            // 'Space' is the modern, consistent way
            spaceBar();
            event.preventDefault(); // stops the page from scrolling
        }
    });
}
function openpack() {
    all_card_numbers = [];
    numberToPathMapping = {};
    for (var i = 0; i < all_card_infos.length; i++) {
        all_card_numbers.push(all_card_infos[i].number);
        numberToPathMapping[all_card_infos[i].number] =
            all_card_infos[i].output_path;
    }
    let picked = drawNByWeight(
        all_card_numbers,
        getWeightByCardNumber,
        6,
        true
    );

    for (var i = 0; i < picked.length; i++) {
        backUrl = "";
        cardNumber = picked[i];
        if (cardNumber[0] == "1" || cardNumber[0] == "2") {
            backUrl = imageRepoBase + "/card_back/crad_back0.png";
        }
        if (cardNumber[0] == "3") {
            backUrl = imageRepoBase + "/card_back/crad_back3.png";
        }
        if (cardNumber[0] == "4") {
            backUrl = imageRepoBase + "/card_back/crad_back4.png";
        }
        c = new CardObject(
            picked[i],
            imageRepoBase + "/" + numberToPathMapping[picked[i]],
            backUrl,
            width,
            height
        );
        container = document.getElementsByClassName("container")[0];
        c.setParent(container);
    }
}

function getWeightByCardNumber(cardNumber) {
    // hero card 1, legendary card 1, normal card 100, spawns 0
    if (cardNumber[0] == "4") {
        return 20;
    }
    if (cardNumber[2] == "1") {
        return 20;
    }
    if (cardNumber[2] == "0") {
        return 0;
    }
    return 100;
}

function drawNByWeight(list, weightFunc, n, canDupe) {
    if (!Array.isArray(list) || list.length === 0) return [];

    // Compute total weight
    const weights = list.map(weightFunc);
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const results = [];

    for (let i = 0; i < n; i++) {
        let r = Math.random() * totalWeight;
        let chosenIndex = -1;

        for (let j = 0; j < list.length; j++) {
            r -= weights[j];
            if (r <= 0) {
                chosenIndex = j;
                break;
            }
        }

        if (chosenIndex === -1) chosenIndex = list.length - 1;

        results.push(list[chosenIndex]);

        if (!canDupe) {
            totalWeight -= weights[chosenIndex];
            list.splice(chosenIndex, 1);
            weights.splice(chosenIndex, 1);
            if (list.length === 0) break;
        }
    }

    return results;
}

function spaceBar() {
    // find the first deck which is flipped, click it
    cardEles = document.getElementsByClassName("card");
    for (var i = 0; i < cardEles.length; i++) {
        if (cardEles[i].classList.contains("backup")) {
            cardEles[i].click();
            return;
        }
    }

    document.getElementById("openpack").click();
    const element = document.getElementsByClassName("container")[0];
    element.scrollTop = element.scrollHeight;
}

async function readJsonFile(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            // throw new Error("Network response was not ok");
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading the JSON file:", error);
        return null;
    }
}

setup();
