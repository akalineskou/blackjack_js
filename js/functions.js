// refresh the page
function refreshPage() {
    var path = window.location.pathname;
    var page = path.substr(path.lastIndexOf("/") + 1);
    
    window.location = page;
}

// returns number from 1-52
function random_card() {
    // random seed
    Math.seedrandom("Hlektr0n!k0 Emp0r!0", true);

    return Math.floor((Math.random()*card_count)+1);
}

// calculates if the house should draw cards
function houseNewCard() {
    var locHousePoints = calcHouseHand();
    var tempBool = false;

    // if house hand has a small card(not ace) draw another card
    for (var i = 0; i < Object.size(house_card_ids); i++) {
        if (card_info[house_card_ids[i]]['points'] >= 2 && card_info[house_card_ids[i]]['points'] <= 6) {
            tempBool = true;

            break;
        }
    }

    // if house points <= 12 or small card draw another card
    if (locHousePoints <= 12 && tempBool)
        house_card_ids[Object.size(house_card_ids)] = random_card();

    locHousePoints = calcHouseHand();

    // end game if house gets 21
    if (locHousePoints == 21)
        gameover = 1;
}
// calculate house points
function calcHouseHand() {
    var locPoints = 0;
    var locAces = 0;

    for (var i = 0; i < Object.size(house_card_ids); i++) {
        // current card id
        var hand_card_id = house_card_ids[i];

        // add the card points
        if (card_info[hand_card_id]['points'] == 1) // ace
            locAces++;
        else
            locPoints += card_info[hand_card_id]['points'];
    }

    /* count locAces
     ** locPoints >= 11 then add 1, else 11 */
    for (i = 0; i < locAces; i++)
        locPoints += (locPoints < 11 && locAces - i == 1 ? 11 : 1);

    return locPoints;
}

// returns true if data from game is stored
function inMiddleOfGame() {
    return (getStoredValue('card_ids') !== null &&
            getStoredValue('house_card_ids') !== null &&
            getStoredValue('bet_amount') !== null ? true : false);
}

// set name html output visible
function setInnerHTML(name, value){
    var div = document.getElementById(name);
    div.style.display = 'block';
    div.innerHTML = value;
}

// for layout dynamic fixes
function setSectionHeight(height) {
    var div = document.getElementById('main');
    div.style.height = height + "px";
}

// html for select values for the bets
function betAmountSetSelect() {
    var html_output = '<select id="select_bet" onchange="set_bet()">';

    for (i = 1; i <= Object.size(bet_info); i++)
        html_output += '<option value="'+ i +'"' + (i == 1 ? 'selected' : '') + '>'+ bet_info[i]['name'] + (i == 5 ? '' : '$') + '</option>';
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
function create_cookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), '; path=/;'].join('');
    document.cookie = cookie;
}
function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
 
    return result;
}
function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
}
function erase_cookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
        delete_cookie(cookies[i].split("=")[0]);
}

// get associative array size(object)
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
        throw new Error("#" + msg +"#");
    }, 0);
}
