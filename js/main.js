var card_ids = new Object();
var house_card_ids = new Object();
var showcards = '';

// get previous games stats
get_stats();

// get money/bet
get_money_bet();

no_money = (total_money <= 0 ? true : false);

// if stay, get previous card ids
if (getStoredValue('stay') == '1') {
    card_ids = JSON.parse(getStoredValue('card_ids'));

    house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

    // calculate if house needs to draw
    houseNewCard();

    gameover = 1;
} else {
    // get old cards on hit me + add a new one
    if (getStoredValue('hitme') == "1") {
        card_ids = JSON.parse(getStoredValue('card_ids'));
        card_ids[Object.size(card_ids)] = random_card();

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
                card_ids[i] = random_card();

            // house hand
            for (i = 0; i <= 1; i++)
                house_card_ids[i] = random_card();
        }
        
        // get old values if refresh when in a game
        if (inMiddleOfGame()) {
            card_ids = JSON.parse(getStoredValue('card_ids'));
            house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

            get_money_bet();
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
    
    showcards += "<img src='img/" + card_info[card_id]['card'] + ".bmp' /> ";
}

/* count aces
 ** points >= 11 then add 1, else 11 */
for (i = 0; i < aces; i++)
    points += (points < 11 && aces - i == 1 ? 11 : 1);

// get house points
housePoints = calcHouseHand();

if (points == 21 && housePoints != 21) // win if at 21 and house not at 21
    win = gameover = 1;
else if (points > 21) // end game if over 21
    gameover = 1;
else if (housePoints == 21) // end game if house at 21
    gameover = 1;
else if (housePoints > 21) // end game and win if house hand over 21
    win = gameover = 1;

// if gameover and didnt win with a 21 at start before the house
// calculate the win
if (gameover && win != 1)
    win = (points < 21 && points > housePoints ? 1 : 0);

// at the end of the game
if (gameover) {
    // add the current game to the stats
    calculate_stats();
    
    // set the stats
    set_stats();

    // calculate money before saving it
    calculate_money();

    // set total money
    set_money();
}

function show_default() {
    var html_output =
    '<span class="valign">' +
    '<img src="img/as.bmp">&nbsp;<img src="img/js.bmp"><br><br>' +
    'The aim of the game is to accumulate a higher<br />point total than the dealer, but without going over 21.<br>' +
    '</span>';
    
    // set default html output visible
    setInnerHTML('default', html_output);

    var can_play = "(no_money ? \"alert(\'You can\\\\\'t play because you have no money to bet!\');\" : \"storeValue('start', 1); refreshPage();\")";
    button_output = '<input type="button" value="Start Game" onclick="'+eval(can_play)+'">';
    setInnerHTML('buttons', button_output);
}
function show_game() {
    // remove start, on refresh the old cards remain
    removeValue('start');
    var html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' + showcards + '<br>' +
    '<b>Points = ' + points + '</b><br></span>';

    // set player html output visible
    setInnerHTML('player', html_output);

    storeValue('card_ids', JSON.stringify(card_ids));
    storeValue('house_card_ids', JSON.stringify(house_card_ids));
    storeValue('bet_amount', bet_amount);

    var button_output = 
    '<input type="button" value="Hit me" onclick="'+
        'storeValue(\'hitme\', 1); '+
        'refreshPage()"'+
    '>';

    if (points > 10) {
        button_output +=
        '&nbsp;<input type="button" value="&nbsp;Stay&nbsp;" onclick="'+
            'storeValue(\'stay\', 1); '+
            'refreshPage()"'+
        '>';
    }

    setInnerHTML('buttons', button_output);
}
function show_gameover() {
    // clear values on game over
    clearValues();
    
    var html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' +
    showcards + '<br>' +
    '<b>Points = ' + points + '</b></span>';
    
    // set player html output visible
    setInnerHTML('player', html_output);

    var button_output = '<input type="button" value="Main Menu" onclick="refreshPage()">';
    setInnerHTML('buttons', button_output);

    // set title visible
    var div = document.getElementById('message');
    div.style.background = (win ? "green" : "#CD0000");
    div.style.color = "white";
    div.style.display = 'block';
    div.innerHTML = '<h1 class="noPad">' + gameover_message() + '</h1>';

    // set height of section
    setSectionHeight(315);
}
function show_house() {
    var html_output = '<span class="valign"><h1 class="noPad">Dealer\'s Hand</h1><br>';

    var locPoints = 0;

    // show house_card_ids size -1 cards, the last one is turned around, unless game ends
    for (var i = 0; i < Object.size(house_card_ids); i++) {
        if ((getStoredValue('stay') == '1' || gameover) || i + 1 < Object.size(house_card_ids)) {
            html_output += "<img src='img/" + card_info[house_card_ids[i]]['card'] + ".bmp' />";

            locPoints += card_info[house_card_ids[i]]['points'];
        }
        else
            html_output += "<img src='img/back.png'>";
    }

    html_output +=
    '<br><b>Points = ' + ((getStoredValue('stay') == '1' || gameover) ? housePoints : locPoints) +
    '</b></span>';

    // set house html output visible
    setInnerHTML('house', html_output);
}

function show_stats() {
    var html_output = '<span class="valign"><h1>Statistics</h1><pre>' +
    'Wins                   <b>' + total_wins + '</b><br>' +
    'Losses                 <b>' + total_losses + '</b><br>' +
    'Games Played           <b>' + (total_wins + total_losses) + '</b><br>' +
    '</pre></span>';

    // set stats html output visible
    setInnerHTML('stats', html_output);
}

function gameover_message() {
    return (!win ? "You Lose " : "You Win ") + bet_amount + "$";
}

// set/get/calc stats
function set_stats() {
    var stats = new Object();
    
    stats['total_wins'] = total_wins;
    stats['total_losses'] = total_losses;
    
    create_cookie('stats', stats);
}
// get total wins/losses
function get_stats() {
    
    var stats = read_cookie('stats');
    
    if (stats != null)
    {
        total_wins = stats['total_wins'];
        total_losses = stats['total_losses'];
    }
}
function calculate_stats() {
    win ? total_wins++ : total_losses++;
}

// save money between refresh
function set_money() {
    create_cookie('total_money', total_money);
}
// get total money and bet between refreshes
function get_money_bet() {
    // if null default value, else stored value
    total_money = read_cookie('total_money') === null ? total_money : read_cookie('total_money');
    bet_amount = (getStoredValue('bet_amount') === null ? bet_amount : getStoredValue('bet_amount'));
}
// save money between refresh
function set_bet() {
    // get value of select
    var locBet = document.getElementById('select_bet').value;
    var found = false;

    // check to see if bet value is correct
    for (var bet in bet_info)
        if (bet == locBet)
            found = true;

    // set bet amount to selected bet, or all money if all in
    bet_amount = (!found ? bet_amount : (locBet != 5 ? bet_info[locBet]['value'] : total_money));
    storeValue('bet_amount', bet_amount);

}
// add/substract total money if win or loss
function calculate_money() {
    total_money = (win ? parseInt(total_money) + parseInt(bet_amount) : parseInt(total_money) - parseInt(bet_amount));
}
