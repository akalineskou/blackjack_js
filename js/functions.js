// reload the page with where added
function refreshPage() {
    var path = window.location.pathname;
    var page = path.substr(path.lastIndexOf("/") + 1);
    
    window.location = page;
}

// returns number 1-52
function random_card() {
    return Math.floor((Math.random()*card_count)+1);
}

// calculates if the house should draw cards
function houseNewCard() {
    var locHousePoints = calcHouseHand();
    var tempBool = 0;

    // if house hand has a small card(not ace) draw another card
    for (i = 0; i < Object.size(house_card_ids); i++) {
        if (card_info[house_card_ids[i]]['points'] >= 2 && card_info[house_card_ids[i]]['points'] <= 5) {
            tempBool = 1;

            break;
        }
    }

    // if house points <= 12 or small card draw another card
    if (locHousePoints <= 12 && tempBool)
        house_card_ids[Object.size(house_card_ids)] = random_card();

    locHousePoints = calcHouseHand();

    if (locHousePoints == 21)
        gameover = 1;
}
// calculate house points
function calcHouseHand() {
    var locPoints = 0;
    var locAces = 0;

    for (i = 0; i < Object.size(house_card_ids); i++) {
        // current card id
        var hand_card_id = house_card_ids[i];
        
        // if same card, random another
        while (hand_card_id in house_card_ids)
            hand_card_id = random_card();

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

// set name html output visible
function setInnerHTML(name, value){
    div = document.getElementById(name);
    div.style.display = 'block';
    div.innerHTML = value;
}

function setSectionHeight(height) {
    div = document.getElementById('main');
    div.style.height = height + "px";
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

// create, read, delete cookies
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


// debug function, output to console
function log(msg) {
    setTimeout(function() {
        throw new Error("#" + msg +"#");
    }, 0);
}
function showStorage() {
    for (var i = 0; i < localStorage.length; i++){
        log("storage["+localStorage.key(i)+"]: " + localStorage.getItem(localStorage.key(i)));
    }
}

// get associative array size(object)
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
