var arena_candidate_number = 3;
var arena_chosen_element = "?";
// arena_card_info_added is used to communicate bewteen main loop and after choosing a card
var arena_card_info_added = null;
var arena_total_picks = 41;
var arena_completed_picks = 0;
var arena_current_stage = "选择人物";

var element_placeholders = {
    光: "../resources/placeholders/ele_light.png",
    暗: "../resources/placeholders/ele_dark.png",
    水: "../resources/placeholders/ele_water.png",
    火: "../resources/placeholders/ele_fire.png",
    地: "../resources/placeholders/ele_earth.png",
    气: "../resources/placeholders/ele_air.png",
    无: "../resources/placeholders/ele_none.png",
    // "?": "resources/placeholders/ele_none.png",
};

var description_placeholders = {
    "\\光": "../resources/placeholders/ele_light.png",
    "\\暗": "../resources/placeholders/ele_dark.png",
    "\\水": "../resources/placeholders/ele_water.png",
    "\\火": "../resources/placeholders/ele_fire.png",
    "\\地": "../resources/placeholders/ele_earth.png",
    "\\气": "../resources/placeholders/ele_air.png",
    "\\无": "../resources/placeholders/ele_none.png",
    // "\\?": "resources/placeholders/ele_none.png",
    "\\攻": "../resources/placeholders/attack.png",
    "\\持": "../resources/placeholders/duration.png",
    "\\血": "../resources/placeholders/life.png",
    "\\威": "../resources/placeholders/power.png",
};
