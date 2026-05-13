async function arena_main_loop() {
    arena_card_info_added = null;
    // choose hero card
    arena_update_progress("选择人物");
    arena_prepare_candidates(arena_filter_hero);
    await arena_wait_till_card_added();
    arena_chosen_element = arena_card_info_added.category;
    // choose main deck
    arena_card_info_added = null;
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 15; i++) {
            arena_update_progress("选择主卡");
            arena_prepare_candidates(
                arena_create_filter_function_for_main_deck(
                    "main",
                    arena_chosen_element
                ),
                arena_weight_function_for_main_deck
            );
            await arena_wait_till_card_added();
            arena_card_info_added = null;
        }
        // choose ability deck
        for (let i = 0; i < 5; i++) {
            arena_update_progress("选择技能");
            arena_prepare_candidates(
                arena_create_filter_function_for_ability_deck(
                    "ability",
                    arena_chosen_element
                ),
                arena_weight_function_for_ability_deck
            );
            await arena_wait_till_card_added();
            arena_card_info_added = null;
        }
    }
    console.log("Arena main loop finished");
    arena_update_progress("构筑完成");
    // click the export button
    document.getElementById("button_export").click();
}

function arena_update_progress(stage) {
    arena_current_stage = stage;
    const stageElement = document.getElementById("arena_stage");
    const countElement = document.getElementById("arena_pick_count");
    const elementElement = document.getElementById("arena_element");
    if (stageElement) {
        stageElement.textContent = stage;
    }
    if (countElement) {
        countElement.textContent = `${arena_completed_picks} / ${arena_total_picks}`;
    }
    if (elementElement) {
        elementElement.textContent =
            arena_chosen_element === "?" ? "属性未定" : `属性 ${arena_chosen_element}`;
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function arena_wait_till_card_added(interval = 100) {
    while (arena_card_info_added === null) {
        await sleep(interval);
    }
}

// this function choose the corresponding cards and displays them
function arena_prepare_candidates(filter_function, weight_function = null) {
    console.log("prepare candidates");
    ok_card_infos = [];
    for (let i = 0; i < all_card_infos.length; i++) {
        if (filter_function(all_card_infos[i])) {
            ok_card_infos.push(all_card_infos[i]);
        }
    }
    weights = [];
    for (let i = 0; i < ok_card_infos.length; i++) {
        if (weight_function === null) {
            console.log("weight function is null");
            weights.push(1);
        } else {
            weights.push(weight_function(ok_card_infos[i]));
        }
    }

    // randomly choose some cards with no duplication according to the weight
    chosen_indexes = arena_choose_cards_by_weight(
        weights,
        arena_candidate_number
    );

    displaying_card_infos = [];
    for (let i = 0; i < chosen_indexes.length; i++) {
        displaying_card_infos.push(ok_card_infos[chosen_indexes[i]]);
    }

    show_cards();
}
function arena_choose_cards_by_weight(weights, number) {
    let chosen_indexes = [];
    let indexes = weights.map((_, index) => index);
    let total_weight = weights.reduce((acc, weight) => acc + weight, 0);

    for (let i = 0; i < number; i++) {
        let random_number = Math.random() * total_weight;
        let sum = 0;

        for (let j = 0; j < weights.length; j++) {
            sum += weights[j];

            if (random_number < sum) {
                chosen_indexes.push(indexes[j]);
                total_weight -= weights[j];

                // Remove the selected index and its weight
                weights.splice(j, 1);
                indexes.splice(j, 1);

                break;
            }
        }
    }

    return chosen_indexes;
}

// for arena onclick, rewirte the add button function
function onclick_add_button(event) {
    if (arena_card_info_added !== null) {
        return;
    }
    const idx = event.target.getAttribute("idx");
    const card_info = displaying_card_infos[idx];
    const deck = find_deck_for_card(card_info);
    current_deck[deck].push(card_info);
    sort_cards_by_number(current_deck[deck]);
    // add spawns
    const spawns = card_info.hasOwnProperty("spawns") ? card_info.spawns : [];
    for (let i = 0; i < spawns.length; i++) {
        // parse it to int then to string
        let spawn_number = parseInt(spawns[i]).toString();
        const spawn_info = get_card_info_by_number(spawn_number);
        const spawn_deck = find_deck_for_card(spawn_info);
        let card_already_in_extra_deck = false;
        for (let j = 0; j < current_deck[spawn_deck].length; j++) {
            if (current_deck[spawn_deck][j].number == spawn_number) {
                card_already_in_extra_deck = true;
                break;
            }
        }
        if (card_already_in_extra_deck) {
            continue;
        }
        current_deck[spawn_deck].push(spawn_info);
        sort_cards_by_number(current_deck[spawn_deck]);
    }
    show_decks();
    // clear displaying cards
    displaying_card_infos = [];
    show_cards();
    // inform a card is chosen
    arena_card_info_added = card_info;
    arena_completed_picks += 1;
    arena_update_progress(arena_current_stage);

    // block onclick event being passed to parent elements
    event.stopPropagation();
}

// overwrite show_decks() function

function show_decks() {
    const deck_elements = [deck_hero, deck_main, deck_ability, deck_extra];
    const deck_list = ["hero", "main", "ability", "extra"];
    for (let i = 0; i < deck_list.length; i++) {
        deck_elements[i].innerHTML = "";
        for (let j = 0; j < current_deck[deck_list[i]].length; j++) {
            const card_info = current_deck[deck_list[i]][j];
            let deck_card_container = document.createElement("div");
            deck_card_container.className = "deck_card_container";

            let card_name_ele = document.createElement("div");
            card_name_ele.setAttribute("idx", j);
            card_name_ele.setAttribute("card_number", card_info.number);
            card_name_ele.setAttribute("img_src", get_image_src(card_info));
            card_name_ele.innerHTML = card_info.name;
            card_name_ele.onclick = onclick_element_show_detail;
            card_name_ele.addEventListener(
                "mouseover",
                mouseover_card_name_element
            );
            card_name_ele.addEventListener(
                "mouseout",
                mouseout_card_name_element
            );

            if (is_legend(card_info)) {
                card_name_ele.innerHTML += " ✡";
            }
            card_name_ele.className = "deck_card";
            deck_card_container.appendChild(card_name_ele);
            // no minus button here
            // let deck_minus_button = document.createElement("button");
            // deck_minus_button.innerHTML = "-";
            // deck_minus_button.className = "deck_minus_button";
            // deck_minus_button.setAttribute("deck_name", deck_list[i]);
            // deck_minus_button.setAttribute("idx", j);
            // deck_minus_button.onclick = onclick_deck_minus_button;

            // deck_card_container.appendChild(deck_minus_button);

            deck_elements[i].appendChild(deck_card_container);
        }
    }
    document.getElementById("hero_header").innerHTML =
        "<strong>" + "人物 " + current_deck["hero"].length + "/1" + "</strong>";
    document.getElementById("main_header").innerHTML =
        "<strong>" +
        "主要卡组 " +
        current_deck["main"].length +
        "/30" +
        "</strong>";
    document.getElementById("ability_header").innerHTML =
        "<strong>" +
        "技能卡组 " +
        current_deck["ability"].length +
        "/10" +
        "</strong>";
    document.getElementById("extra_header").innerHTML =
        "<strong>" + "额外卡组 " + current_deck["extra"].length + "</strong>";
    show_deck_info();
}
