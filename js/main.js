// blackjack variables
var total_wins = 0;
var total_losses = 0;
var total_games = 0;
var points = 0;
var house_points = 0;
var aces = 0;
var win = 0;
var draw = 0;
var gameover = 0;
var card_ids = new Object();
var house_card_ids = new Object();
var card_imgs = '';

// get used cards info
getCardInfo();

// get previous games stats
getStats();

// get money/bet
getMoneyBet();

// if stay, get previous card ids
if (getStoredValue('stay') == '1') {
    card_ids = JSON.parse(getStoredValue('card_ids'));
    house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

    // calculate player/house points
    calcPlayerHand();
    calcHouseHand();
    
    // if player has less than 21, the house should draw
    if (points <= 21) {
        // while the house has less points, draw since it is at the end
        while (house_points < points)
            houseNewCard(true);
    }

    // end game on stay
    gameover = 1;
} else {
    // get old cards on hit me + add a new one
    if (getStoredValue('hitme') == "1") {
        // player cards
        card_ids = JSON.parse(getStoredValue('card_ids'));
        card_ids[Object.size(card_ids)] = randomCardUnused();

        // hosue cards
        house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

        // calculate new player points
        calcPlayerHand();

        // calculate if house needs to draw
        if (points <= 21)
            houseNewCard();
        else
            calcHouseHand();

        // remove hit me after drawing a card
        removeValue('hitme');
    } else {
        // at the start of the game, random 2 cards for each one
        if (getStoredValue('start') == "1") {
            // player hand
            for (i = 0; i <= 1; i++)
                card_ids[i] = randomCardUnused();

            // house hand
            for (i = 0; i <= 1; i++)
                house_card_ids[i] = randomCardUnused();

            // calculate player/house points
            calcPlayerHand();
            calcHouseHand();
        }
        
        // get old values if reload when in a game
        if (inMiddleOfGame()) {
            card_ids = JSON.parse(getStoredValue('card_ids'));
            house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

            getMoneyBet();  

            // calculate player/house points
            calcPlayerHand();
            calcHouseHand();
        }
    }
}

if (getStoredValue('start') == "1" || inMiddleOfGame()) {
    if (points == 21 && house_points != 21) // win if at 21 and house not at 21
        win = gameover = 1;
    else if (points > 21) // end game if over 21
        gameover = 1;
    else if (points != 21 && house_points == 21) // end game if house at 21
        gameover = 1;
    else if (house_points > 21) // end game and win if house hand over 21
        win = gameover = 1;
    else if (gameover && points == house_points) // draw
        draw = 1;
}

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

    button_output = '<input type="button" value="Start Game" onclick="checkMoneyStart();">';

    setInnerHTML('buttons', button_output);
}
function showGame() {
    // remove start, on reload the old cards remain
    removeValue('start');

    var html_output =
    '<span class="valign"><h1 class="noPad">Your Hand</h1><br>' + card_imgs + '<br>' +
        '<b>' + points + ' Points</b><br>' +
    '</span>';

    // set player html output visible
    setInnerHTML('player', html_output);

    // store data
    storeValue('card_ids', JSON.stringify(card_ids));
    storeValue('house_card_ids', JSON.stringify(house_card_ids));
    storeValue('bet_amount', bet_amount);
    storeValue('card_info', JSON.stringify(card_info));

    var button_output = 
    '<input type="button" value="Hit Me" onclick="' +
        'storeValue(\'hitme\', 1); ' +
        'reloadPage();"' +
    '>';

    if (points > 10) {
        button_output +=
        '&nbsp;<input type="button" value="&nbsp;Stay&nbsp;" onclick="' +
            'storeValue(\'stay\', 1); ' +
            'reloadPage();"' +
        '>';
    }

    setInnerHTML('buttons', button_output);
}
function showGameover() {
    // clear values on game over
    clearValues();
    
    var html_output =
    '<span class="valign"><h1 class="noPad">Your Hand</h1><br>' +
        card_imgs + '<br>' +
    '<b>' + points + ' Points</b></span>';
    
    // set player html output visible
    setInnerHTML('player', html_output);

    var button_output = '<input type="button" value="Main Menu" onclick="reloadPage();">';
    setInnerHTML('buttons', button_output);

    // set title visible
    var div = document.getElementById('message');
    div.style.background = (draw ? "#FFD700" : (win ? "green" : "#CD0000"));
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
        // show last card on stay/gameover
        if ((getStoredValue('stay') == '1' || gameover) || i + 1 < Object.size(house_card_ids)) {
            html_output += "<img src='img/" + card_info[house_card_ids[i]]['card'] + ".bmp'>&nbsp;";

            loc_points += (card_info[house_card_ids[i]]['points'] == 1 ? 11 : card_info[house_card_ids[i]]['points']);
        }
        else
            html_output += "<img src='img/back.png'>&nbsp;";
    }

    html_output +=
    '<br><b>' + ((getStoredValue('stay') == '1' || gameover) ? house_points : loc_points) +
    ' Points</b></span>';

    // set house html output visible
    setInnerHTML('house', html_output);
}

function showStats() {
    var html_output = '<span class="valign"><h1 class="bigger">Statistics</h1><pre>' +
    'Wins                   <b>' + total_wins + '</b><br>' +
    'Losses                 <b>' + total_losses + '</b><br>' +
    'Games Played           <b>' + total_games + '</b><br>' +
    '</pre></span>';

    // set stats html output visible
    setInnerHTML('stats', html_output);
}

// show message on game over + win/loss amount
function gameoverMessage() {
    return "You " + (draw ? "Draw" : (!win ? "Lost " : "Won ") + bet_amount + "$");
}

// get card_info values if stored, else default
function getCardInfo() {
    card_info = (getStoredValue('card_info') === null ? card_info : JSON.parse(getStoredValue('card_info')));
}

// set/get stats as cookies
function setStats() {
    var stats = new Object();
    
    stats['total_wins'] = total_wins;
    stats['total_losses'] = total_losses;
    stats['total_games'] = total_games;
    
    createCookie('stats', stats);
}
function getStats() {
    
    var stats = readCookie('stats');
    
    if (stats != null)
    {
        total_wins = stats['total_wins'];
        total_losses = stats['total_losses'];
        total_games = stats['total_games'];
    }
}
// add total wins/losses
function calculateStats() {
    total_games++;
    (draw ? '' : (win ? total_wins++ : total_losses++));
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
function getBetFromSelect() {
    // get value of select
    var loc_bet = document.getElementById('select_bet').value;
    var found = false;

    // check to see if bet value is valid
    for (var bet in bet_info)
        if (bet == loc_bet)
            found = true;

    // set bet amount to selected bet, or total money if all in
    bet_amount = (!found ? bet_amount : (loc_bet != 5 ? bet_info[loc_bet]['value'] : total_money));

    // store bet_amount between reloads
    storeValue('bet_amount', bet_amount);
}

// add/substract total money if win or loss
function calculateMoney() {
    total_money = (draw ? total_money : (win ? parseInt(total_money) + parseInt(bet_amount) : parseInt(total_money) - parseInt(bet_amount)));
}
