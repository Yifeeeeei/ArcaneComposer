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
    displaying_card_infos = all_card_infos;
    // create a card div for each card
    show_cards();
    // read the update cards
    update_card_numbers = await readJsonFile(
        "https://yifeeeeei.github.io/ArcaneImages/update.json"
    );
    if (update_card_numbers == null) {
        update_card_numbers = [];
    } else {
        // for all elements, if it is an int, convert it to a string
        for (let i = 0; i < update_card_numbers.length; i++) {
            if (typeof update_card_numbers[i] == "number") {
                update_card_numbers[i] = update_card_numbers[i].toString();
            }
        }
        // sort the update card numbers
        update_card_numbers.sort();
    }

    // set shader
    shader = document.getElementById("shader");
    // set decks
    deck_hero = document.getElementById("deck_hero");
    deck_main = document.getElementById("deck_main");
    deck_ability = document.getElementById("deck_ability");
    deck_extra = document.getElementById("deck_extra");

    // change default enter for input filter
    let input_filt = document.getElementById("input_filter");
    input_filt.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            // 13 is the key code for Enter
            console.log("Enter pressed");
            event.preventDefault(); // Prevent the default action to stop form submission
            button_filter_clicked(); // Trigger the button's click event
        }
    });

    // change default enter for input deck code
    let input_deck = document.getElementById("input_deck_code");
    input_deck.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            // 13 is the key code for Enter
            console.log("Enter pressed");
            event.preventDefault(); // Prevent the default action to stop form submission
            onclick_button_build(); // Trigger the button's click event
        }
    });

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
    // focus on the filter input
    input_filt.focus();
    // set up initial deck code if any
    set_up_initial_deck_code();

    // set up initial filter if any
    set_up_initial_filter();
}

function set_up_initial_filter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter_str = urlParams.get("filter");
    console.log("filter_str", filter_str);
    if (filter_str) {
        document.getElementById("input_filter").value = filter_str;
        button_filter_clicked();
    }
}

function main() {
    console.log("Hello from main.js");
    setup();
}

main();
