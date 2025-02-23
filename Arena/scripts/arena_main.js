// setting up everything for the first time

// bind show_hint to hint text

async function setup() {
    // read the files
    // all_card_infos = await readJsonFile("resources/all_card_infos.json");
    all_card_infos = await readJsonFile(
        "https://yifeeeeei.github.io/ArcaneImages/output/all_card_infos.json"
    );
    sort_cards_by_number(all_card_infos);
    console.log(all_card_infos.length, "all card infos read");
    // display all cards
    displaying_card_infos = [];
    // create a card div for each card
    show_cards();

    // set shader
    shader = document.getElementById("shader");
    // set decks
    deck_main = document.getElementById("deck_main");
    deck_ability = document.getElementById("deck_ability");
    deck_extra = document.getElementById("deck_extra");
    deck_hero = document.getElementById("deck_hero");
    // set up input_deck_code
    input_deck_code = document.getElementById("input_deck_code");
    // set up button_build
    button_build = document.getElementById("button_build");

    // set up card_number_to_idx
    for (let i = 0; i < all_card_infos.length; i++) {
        card_number_to_idx[all_card_infos[i].number] = i;
    }

    // setup popups
    // popup = document.getElementById("popup");
    popup_hint = document.getElementById("popup_hint");
    popup_img = document.getElementById("popup_img");

    zoom_img = document.getElementById("zoom_img");
    zoom_info = document.getElementById("zoom_info");
    zoom_text = document.getElementById("zoom_text");

    // show deck to init bar plot
    show_decks();
    // hide the deckinfo
    hide_element(document.getElementById("deck_info"));

    arena_main_loop();
}

function main() {
    console.log("Hello from arena_main.js");
    setup();
}

main();
