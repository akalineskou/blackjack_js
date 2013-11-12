// reload the page
function reloadPage() {
    window.location.reload();
}

// returns number from 1-52 with seed
function randomCard() {
    // random seed
    Math.seedrandom(math_seed, true);

    return Math.floor((Math.random() * card_count) + 1);
}

// returns card id of random unused card, and mark said card as unused
function randomCardUnused() {
    var card;

    // if card is used, random another
    do {
        card = randomCard();
    } while (card_info[card]['used']);

    // mark it as used
    makeCardUsed(card);

    return card;
}

// calculate player points and set cards to show
function calcPlayerHand() {
    var loc_points = 0;
    var aces = 0;
    var player_card_count = Object.size(player_card_ids);

    // for each player card calculate points and images
    for (var i = 0; i < player_card_count; i++) {
        // current card id
        var card_id = player_card_ids[i];

        // add the points
        if (card_info[card_id]['points'] == 1) // ace
            aces++;
        else
            loc_points += card_info[card_id]['points'];
        
        // if card count 6, at the 3rd card put new line else space
        card_imgs += "<img src='img/" + card_info[card_id]['card'] + ".bmp'>" +
                    (player_card_count % 6 == 0 && ((i+1) % 3 == 0) ? "<br>" : "&nbsp;");
    }

    if (player_card_count % 6 == 0)
        change_div_height = true;

    /* count aces
     ** loc_points >= 11 then add 1, else 11 */
    for (i = 0; i < aces; i++)
        loc_points += (loc_points < 11 && aces - i == 1 ? 11 : 1);

    player_points = loc_points;
}

// calculates if the house should draw cards
function houseNewCard() {
    house_card_ids[Object.size(house_card_ids)] = randomCardUnused();

    // calculate new house points before checking
    calcHouseHand();

    // end game if house gets 21
    if (house_points == 21)
        gameover = 1;
}
// calculate house points
function calcHouseHand() {
    var loc_points = 0;
    var loc_aces = 0;
    var house_card_count = Object.size(house_card_ids);

    for (var i = 0; i < house_card_count; i++) {
        // current card id
        var hand_card_id = house_card_ids[i];

        // add the card points
        if (card_info[hand_card_id]['points'] == 1) // ace
            loc_aces++;
        else
            loc_points += card_info[hand_card_id]['points'];
    }

    /* count loc_aces
     ** loc_points >= 11 then add 1, else 11 */
    for (i = 0; i < loc_aces; i++)
        loc_points += (loc_points < 11 && loc_aces - i == 1 ? 11 : 1);

    if (house_card_count % 6 == 0)
        change_div_height = true;

    house_points = loc_points;
}

// mark card as used
function makeCardUsed(card) {
    card_info[card]['used'] = true;
}

// returns true if data from game is stored
function inMiddleOfGame() {
    return (getStoredValue('player_card_ids') !== null &&
            getStoredValue('house_card_ids') !== null &&
            getStoredValue('bet_amount') !== null ? true : false);
}

// set name html output visible
function setInnerHTML(name, value){
    var div = document.getElementById(name);
    div.style.display = 'block';
    div.innerHTML = value;
}

// shuffle card info for more randomness
function shuffleCards() {
    var temp_card_info = new Object();
    var used_ids = new Array();
    var rand_card;

    // init used_ids as false
    for (var i = 1; i <= card_count; i++)
        used_ids[i] = false;

    for (var i = 1; i <= card_count; i++) {
        var break_do = false;
        var loc_card_count = 0;

        // if used_ids[rand_card] is true, then temp_card_info[rand_card] is equal to the old card_info[i]
        // since it is random, some numbers will repeat, so checking for true, means that number was set
        do {
            rand_card = randomCard();

            // if random card was not set, break the loop
            if (used_ids[rand_card] == false) {
                used_ids[rand_card] = true;

                break_do = true;
            }

            // all cards have been checked
            if (loc_card_count > card_count)
                break;

            loc_card_count++;
        } while (!break_do);
        
        // place card_info[i] into a unique temp_card_info with a random number
        temp_card_info[rand_card] = card_info[i];
    }

    // save the new card info
    card_info = temp_card_info;
}

// for layout dynamic fixes
function setSectionHeight(height) {
    var div = document.getElementById('main');
    div.style.height = height + "px";
}
function setDivProperties(name, height) {
    var div = document.getElementById(name);
    div.style.lineHeight = height + "px";
    div.style.height = height + "px";
}

// html for select values for the bets
function betAmountSetSelect() {
    var html_output = '<select id="select_bet" onchange="getBetFromSelect()">';

    for (var i = 1; i <= Object.size(bet_info); i++)
        html_output += '<option value="'+ i +'"' +
                        (bet_info[i]['value'] > total_money ? ' disabled' : (i == 1 ? ' selected' : '')) +
                        '>'+ bet_info[i]['name'] + (i == 5 ? '' : '$') + '</option>';
    html_output += '</select>';

    document.getElementById('in_bet').innerHTML = (total_money > 0 ? html_output : '0');
}

// set bet amount and total money to html
function showBetAmount() {
    document.getElementById('in_bet').innerHTML = bet_amount + "$";
}
function showTotalMoney() {
    document.getElementById('total_money').innerHTML = total_money;
}
// check to see if the player can start a game if he has enough money
function checkMoneyStart() {
    if (total_money)
        getBetFromSelect();

    if (total_money == 0)
        alert('You can\'t play because you have no more money to bet!');
    else if (bet_amount > total_money)
        alert('The bet amount is more than your total money!');
    else {
        // start game
        storeValue('start', 1);

        reloadPage();
    }
}

// store/get/remove/clear local values
function storeValue(key, value) {
    localStorage.setItem(key, value);
}
function getStoredValue(key) {
    return localStorage.getItem(key);
}
function removeValue(key) {
    localStorage.removeItem(key);
}
function clearValues() {
    localStorage.clear();
}

// create/read/delete cookies
function createCookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), '; path=/;'].join('');
    document.cookie = cookie;
}
function readCookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
 
    return result;
}
function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
}
function eraseCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++)
        deleteCookie(cookies[i].split("=")[0]);
}

// get associative array size(of object)
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// debug function, output to console
function log(msg) {
    setTimeout(function() {
        throw new Error('~'+msg+'~');
    }, 0);
}
