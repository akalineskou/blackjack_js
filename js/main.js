// blackjack variables
var total_wins = 0;
var total_losses = 0;
var total_games = 0;
var player_points = 0;
var house_points = 0;

var win = false;
var draw = false;
var gameover = false;

var player_card_ids = new Object();
var house_card_ids = new Object();
var card_imgs = '';
var change_div_height = false;

// test if cookies are enabled
testCookies();

// gets all the stored data
getData();

// if stay, get previous card ids
if (getStoredValue('stay') == '1') {
    player_card_ids = JSON.parse(getStoredValue('player_card_ids'));
    house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

    // calculate player/house points
    calcPlayerHand();
    calcHouseHand();
    
    // if player has less than 21, the house should draw
    if (player_points <= 21) {
        // while the house has less points, draw since it is at the end
        while (house_points < player_points)
            houseNewCard();
    }

    // end game on stay
    gameover = true;
} else {
    // get old cards on hit me + add a new one
    if (getStoredValue('hitme') == "1") {
        // player cards
        player_card_ids = JSON.parse(getStoredValue('player_card_ids'));
        player_card_ids[Object.size(player_card_ids)] = randomCardUnused();

        // hosue cards
        house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

        // calculate player/house points
        calcPlayerHand();
        calcHouseHand();

        // if player has 21 points, house should draw
        if (player_points == 21 && house_points != 21) {
            // while the house has less points, draw
            while (house_points < player_points)
                houseNewCard();
        }

        // remove hit me after drawing a card
        removeValue('hitme');
    } else {
        // at the start of the game, random 2 cards for each one
        if (getStoredValue('start') == "1") {
            // player hand
            for (i = 0; i <= 1; i++)
                player_card_ids[i] = randomCardUnused();

            // house hand
            for (i = 0; i <= 1; i++)
                house_card_ids[i] = randomCardUnused();

            // calculate player/house points
            calcPlayerHand();
            calcHouseHand();

            // player starting hand 21, house should draw cards
            if (player_points == 21 && house_points != 21) {
                // while the house has less points, draw
                while (house_points < player_points)
                    houseNewCard();
            }
        }
        
        // get old values if reload when in a game
        if (inMiddleOfGame()) {
            player_card_ids = JSON.parse(getStoredValue('player_card_ids'));
            house_card_ids = JSON.parse(getStoredValue('house_card_ids'));  

            // calculate player/house points
            calcPlayerHand();
            calcHouseHand();
        }
    }
}

if (player_points == 21 && house_points != 21) // win if at 21 and house not at 21
    win = gameover = true;
else if (player_points > 21) // end game if over 21
    gameover = true;
else if (player_points != 21 && house_points == 21) // end game if house at 21
    gameover = true;
else if (house_points > 21) // end game and win if house hand over 21
    win = gameover = true;
else if (gameover && player_points == house_points) // draw
    draw = true;

// calculate the win
if (gameover && !win)
    win = (player_points < 21 && player_points > house_points ? true : false);

// do at the end of the game
if (gameover)
    setData();

// default screen panel
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

// player panel
function showPlayer() {
    if (gameover)
        clearValues(); // clear values on game over
    
    removeValue('start'); // remove start, on reload the old cards remain

    var html_output =
    '<span class="valign"><h1 class="noPad">Your Hand</h1><br>' +
        card_imgs + '<br>' +
    '<b>' + player_points + ' Points</b></span>';

    // set player html output visible
    setInnerHTML('player', html_output);

    if (!gameover) {
        // store data between reloads
        storeValue('player_card_ids', JSON.stringify(player_card_ids));
        storeValue('house_card_ids', JSON.stringify(house_card_ids));
        storeValue('bet_amount', bet_amount);
        storeValue('card_info', JSON.stringify(card_info));
    }

    var button_output;

    if (!gameover) {
        button_output = 
        '<input type="button" value="Hit Me" onclick="' +
            'storeValue(\'hitme\', 1); ' +
            'reloadPage();"' +
        '>';

        if (player_points > 10) {
            button_output +=
            '&nbsp;<input type="button" value="&nbsp;Stay&nbsp;" onclick="' +
                'storeValue(\'stay\', 1); ' +
                'reloadPage();"' +
            '>&nbsp;';
        }
    } else
        button_output = '<input type="button" value="Main Menu" onclick="reloadPage();">';

    setInnerHTML('buttons', button_output);

    if (gameover) {
        // set title visible
        var div = document.getElementById('message');
        div.style.background = (draw ? "#FFD700" : (win ? "green" : "#CD0000"));
        div.style.color = "white";
        div.style.display = 'block';
        div.innerHTML = '<h1 class="noPad">' + gameoverMessage() + '</h1>';

        // set height of section
        setSectionHeight(317);

        // set height of player div if cards > 6
        if (change_div_height) {
            setDivProperties('player', 300);

            setSectionHeight(417);
        }
    } else {
        // set height of player div if cards > 6
        if (change_div_height) {
            setDivProperties('player', 300);

            setSectionHeight(340);
        }
    }
}

// shows house cards, and hides the last card
function showHouse() {
    // if player stays or game is over and has <= 21 points, show the last cards
    var show_last_card = (getStoredValue('stay') == '1' || gameover) && player_points <= 21;

    // last card's points
    var hidden_card_points = card_info[house_card_ids[Object.size(house_card_ids)-1]]['points'];
    
    var html_output = '<span class="valign"><h1 class="noPad">Dealer\'s Hand</h1><br>';

    // show house_card_ids size -1 cards, the last one is turned around, unless game ends
    for (var i = 0; i < Object.size(house_card_ids); i++) {
        // show last card on stay/gameover
        html_output += "<img src='img/" +
                        (show_last_card || i + 1 < Object.size(house_card_ids) ?
                            card_info[house_card_ids[i]]['card'] + '.bmp' :
                            'back.png') +
                        "'>" +
                        // if house card count 6, at the 3rd card put new line else space
                        (Object.size(house_card_ids) % 6 == 0 && ((i+1) % 3 == 0) ? "<br>" : "&nbsp;");
    }

    html_output +=
    '<br><b>' + (show_last_card ? house_points : house_points - hidden_card_points) +
    ' Points</b></span>';

    // set house html output visible
    setInnerHTML('house', html_output);

    // set height of house div if cards > 6
    if (change_div_height)
        setDivProperties('house', 300);
}

// end of game
function showGameover() {
    // clear values on game over
    clearValues();

    var html_output =
    '<span class="valign"><h1 class="noPad">Your Hand</h1><br>' +
        card_imgs + '<br>' +
    '<b>' + player_points + ' Points</b></span>';
    
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
    setSectionHeight(317);

    // set height of player div if cards > 6
    if (change_div_height) {
        setDivProperties('player', 300);

        setSectionHeight(417);
    }
}

function showStats() {
    var percent = (total_wins / total_games) * 100;

    var html_output =
    '<span class="valign" style="width: 100%;"><h1>Statistics</h1>' +
    '<table style="margin: 0 auto;" width=35%>'+
        '<tr><td align="left">Wins</td><td>' + total_wins + '</td></tr>' +
        '<tr><td align="left">Losses</td><td>' + total_losses + '</td></tr>' +
        '<tr><td align="left">Games Played</td><td>' + total_games + '</td></tr>' +
        '<tr><td align="left">Win Percentage</td><td>' +
            (total_losses == 0 ? (total_wins == 0 ? "0" : "100") :
                                 (total_wins == 0 ? "0" : parseFloat(percent.toPrecision(4)))) + '%' +
        '</td></tr>' +        
    '</table>' +
    '</span>';

    // set stats html output visible
    setInnerHTML('stats', html_output);
}

// show message on game over + win/loss amount
function gameoverMessage() {
    return (draw ? "Draw" : "You " + (!win ? "Lost " : "Won ") + bet_amount + "$");
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

// store new shuffled card_info
function setShuffledCards() {
    //shuffleCards();

    storeValue('shuffled_cards', JSON.stringify(card_info));
}
// get shuffled_cards at start, then remove it since it is stored in card_info again
function getShuffledCards() {
    if (getStoredValue('shuffled_cards') !== null) {
        card_info = JSON.parse(getStoredValue('shuffled_cards'));

        removeValue('shuffled_cards');
    }
}

// calls all functions to set/get data
function setData() {
    // add the current game to the stats
    calculateStats();
    
    // set the stats
    setStats();

    // calculate money before saving it
    calculateMoney();

    // set total money
    setMoney();
}
function getData() {
    // get used cards info
    getCardInfo();

    // get previous games stats
    getStats();

    // get money/bet
    getMoneyBet();

    // get shuffled cards
    getShuffledCards();
}
