// blackjack variables
var total_wins = 0;
var total_losses = 0;
var points = 0;
var house_points = 0;
var aces = 0;
var win = 0;
var gameover = 0;
var card_ids = new Object();
var house_card_ids = new Object();
var card_imgs = '';

// get previous games stats
getStats();

// get money/bet
getMoneyBet();

no_money = (total_money <= 0 ? true : false);

// if stay, get previous card ids
if (getStoredValue('stay') == '1') {
    card_ids = JSON.parse(getStoredValue('card_ids'));

    house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

    // make sure house draws if the players stays, and it has small cards
    for (var i = 0; i < 5; i++)
        // calculate if house needs to draw
        houseNewCard();

    // end game on stay
    gameover = 1;
} else {
    // get old cards on hit me + add a new one
    if (getStoredValue('hitme') == "1") {
        card_ids = JSON.parse(getStoredValue('card_ids'));
        card_ids[Object.size(card_ids)] = randomCard();

        house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

        // calculate if house needs to draw
        houseNewCard();

        // remove hit me after drawing a card
        removeValue('hitme');
    } else {
        // at the start, random 2 cards
        if (getStoredValue('start') == "1")
        {
            // player hand
            for (i = 0; i <= 1; i++)
                card_ids[i] = randomCard();

            // house hand
            for (i = 0; i <= 1; i++)
                house_card_ids[i] = randomCard();
        }
        
        // get old values if reload when in a game
        if (inMiddleOfGame()) {
            card_ids = JSON.parse(getStoredValue('card_ids'));
            house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

            getMoneyBet();
        }
    }
}

// for each card calculate the points, and image to show
for (i = 0; i < Object.size(card_ids); i++) {
    // current card id
    var card_id = card_ids[i];

    // add the points
    if (card_info[card_id]['points'] == 1) // ace
        aces++;
    else
        points += card_info[card_id]['points'];
    
    card_imgs += "<img src='img/" + card_info[card_id]['card'] + ".bmp'> ";
}

/* count aces
 ** points >= 11 then add 1, else 11 */
for (i = 0; i < aces; i++)
    points += (points < 11 && aces - i == 1 ? 11 : 1);

// get house points
house_points = calcHouseHand();

if (points == 21 && house_points != 21) // win if at 21 and house not at 21
    win = gameover = 1;
else if (points > 21) // end game if over 21
    gameover = 1;
else if (house_points == 21) // end game if house at 21
    gameover = 1;
else if (house_points > 21) // end game and win if house hand over 21
    win = gameover = 1;

// if gameover and didnt win with a 21 at start before the house
// calculate the win
if (gameover && win != 1)
    win = (points < 21 && points > house_points ? 1 : 0);

// do at the end of the game
if (gameover) {
    // add the current game to the stats
    calculateStats();
    
    // set the stats
    setStats();

    // calculate money before saving it
    calculateMoney();

    // set total money
    setMoney();
}

function showDefault() {
    var html_output =
    '<span class="valign">' +
        '<img src="img/as.bmp">&nbsp;<img src="img/js.bmp"><br><br>' +
        'The aim of the game is to accumulate a higher<br>point total than the dealer, but without going over 21.<br>' +
    '</span>';
    
    // set default html output visible
    setInnerHTML('default', html_output);

    var can_play = "(no_money ? \"alert(\'You can\\\\\'t play because you have no money to bet!\');\" : \"storeValue('start', 1); reloadPage();\")";
    button_output = '<input type="button" value="Start Game" onclick="'+eval(can_play)+'">';

    setInnerHTML('buttons', button_output);
}
function showGame() {
    // remove start, on reload the old cards remain
    removeValue('start');

    var html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' + card_imgs + '<br>' +
        '<b>' + points + ' Points</b><br>'+
    '</span>';

    // set player html output visible
    setInnerHTML('player', html_output);

    // store data
    storeValue('card_ids', JSON.stringify(card_ids));
    storeValue('house_card_ids', JSON.stringify(house_card_ids));
    storeValue('bet_amount', bet_amount);

    var button_output = 
    '<input type="button" value="Hit me" onclick="'+
        'storeValue(\'hitme\', 1); '+
        'reloadPage();"'+
    '>';

    if (points > 10) {
        button_output +=
        '&nbsp;<input type="button" value="&nbsp;Stay&nbsp;" onclick="'+
            'storeValue(\'stay\', 1); '+
            'reloadPage();"'+
        '>';
    }

    setInnerHTML('buttons', button_output);
}
function showGameover() {
    // clear values on game over
    clearValues();
    
    var html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' +
    card_imgs + '<br>' +
    '<b>' + points + ' Points</b></span>';
    
    // set player html output visible
    setInnerHTML('player', html_output);

    var button_output = '<input type="button" value="Main Menu" onclick="reloadPage();">';
    setInnerHTML('buttons', button_output);

    // set title visible
    var div = document.getElementById('message');
    div.style.background = (win ? "green" : "#CD0000");
    div.style.color = "white";
    div.style.display = 'block';
    div.innerHTML = '<h1 class="noPad">' + gameoverMessage() + '</h1>';

    // set height of section
    setSectionHeight(315);
}
function showHouse() {
    var html_output = '<span class="valign"><h1 class="noPad">Dealer\'s Hand</h1><br>';

    var loc_points = 0;

    // show house_card_ids size -1 cards, the last one is turned around, unless game ends
    for (var i = 0; i < Object.size(house_card_ids); i++) {
        if ((getStoredValue('stay') == '1' || gameover) || i + 1 < Object.size(house_card_ids)) {
            html_output += "<img src='img/" + card_info[house_card_ids[i]]['card'] + ".bmp'>";

            loc_points += card_info[house_card_ids[i]]['points'];
        }
        else
            html_output += "<img src='img/back.png'>";
    }

    html_output +=
    '<br><b>' + ((getStoredValue('stay') == '1' || gameover) ? house_points : loc_points) +
    ' Points</b></span>';

    // set house html output visible
    setInnerHTML('house', html_output);
}

function showStats() {
    var html_output = '<span class="valign"><h1>Statistics</h1><pre>' +
    'Wins                   <b>' + total_wins + '</b><br>' +
    'Losses                 <b>' + total_losses + '</b><br>' +
    'Games Played           <b>' + (total_wins + total_losses) + '</b><br>' +
    '</pre></span>';

    // set stats html output visible
    setInnerHTML('stats', html_output);
}

function gameoverMessage() {
    return (!win ? "You Lose " : "You Win ") + bet_amount + "$";
}

// set/get/calc stats as cookies
function setStats() {
    var stats = new Object();
    
    stats['total_wins'] = total_wins;
    stats['total_losses'] = total_losses;
    
    createCookie('stats', stats);
}
// get total wins/losses
function getStats() {
    
    var stats = readCookie('stats');
    
    if (stats != null)
    {
        total_wins = stats['total_wins'];
        total_losses = stats['total_losses'];
    }
}
function calculateStats() {
    win ? total_wins++ : total_losses++;
}

// save money between reload as cookie
function setMoney() {
    createCookie('total_money', total_money);
}
// get total money and bet between reloads
function getMoneyBet() {
    // if null default value, else stored value
    total_money = readCookie('total_money') === null ? total_money : readCookie('total_money');
    bet_amount = (getStoredValue('bet_amount') === null ? bet_amount : getStoredValue('bet_amount'));
}
// save money between reload
function setBet() {
    // get value of select
    var loc_bet = document.getElementById('select_bet').value;
    var found = false;

    // check to see if bet value is valid
    for (var bet in bet_info)
        if (bet == loc_bet)
            found = true;

    // set bet amount to selected bet, or total money if all in
    bet_amount = (!found ? bet_amount : (loc_bet != 5 ? bet_info[loc_bet]['value'] : total_money));

    storeValue('bet_amount', bet_amount);
}
// add/substract total money if win or loss
function calculateMoney() {
    total_money = (win ? parseInt(total_money) + parseInt(bet_amount) : parseInt(total_money) - parseInt(bet_amount));
}
