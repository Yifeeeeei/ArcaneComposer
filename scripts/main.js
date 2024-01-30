// setting up everything for the first time

// bind show_hint to hint text
function show_hint() {
    show_element(popup);
    show_element(popup_hint);
    hide_element(popup_img);
}
function hide_hint() {
    hide_element(popup);
    hide_element(popup_hint);
    hide_element(popup_img);
}

async function setup() {
    // read the files
    // all_card_infos = await readJsonFile("resources/all_card_infos.json");
    all_card_infos = await readJsonFile(
        "https://yifeeeeei.github.io/SorceryImages/all_card_infos.json"
    );
    sort_cards_by_number(all_card_infos);
    console.log(all_card_infos.length, "all card infos read");
    // display all cards
    displaying_card_infos = all_card_infos;
    // create a card div for each card
    show_cards();

    // set shader
    shader = document.getElementById("shader");
    // set decks
    deck_main = document.getElementById("deck_main");
    deck_ability = document.getElementById("deck_ability");
    deck_extra = document.getElementById("deck_extra");

    // set up input_deck_code
    input_deck_code = document.getElementById("input_deck_code");
    // set up button_build
    button_build = document.getElementById("button_build");

    // set up card_number_to_idx
    for (let i = 0; i < all_card_infos.length; i++) {
        card_number_to_idx[all_card_infos[i].number] = i;
    }

    // setup popups
    popup = document.getElementById("popup");
    popup_hint = document.getElementById("popup_hint");
    popup_img = document.getElementById("popup_img");

    document.getElementById("hint").addEventListener("mouseover", show_hint);
    document.getElementById("hint").addEventListener("mouseout", hide_hint);
}

function main() {
    console.log("Hello from main.js");
    setup();
}

main();
