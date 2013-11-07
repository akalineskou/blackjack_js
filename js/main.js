var card_ids = new Object();
var house_card_ids = new Object();
var showcards = '';

// clear values on new game
if (getStoredValue('newgame') == "1")
    clearValues();

// get previous games stats
get_stats();

// if stay, get previous card ids
if (getStoredValue('stay') == '1') {
    card_ids = JSON.parse(getStoredValue('card_ids'));

    house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

    houseNewCard();

    gameover = 1;
} else {
    // get old cards on hit me + add a new one
    if (getStoredValue('hitme') == "1") {
        card_ids = JSON.parse(getStoredValue('card_ids'));
        card_ids[Object.size(card_ids)] = random_card();

        house_card_ids = JSON.parse(getStoredValue('house_card_ids'));

        houseNewCard();
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
    }
}

// for each card calculate the points, and image to show
for (i = 0; i < Object.size(card_ids); i++) {
    // current card id
    var card_id = card_ids[i];
    
    // if same card, random another
    while (card_id in card_ids)
        card_id = random_card();

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
}

function show_default() {
    html_output =
    '<span class="valign">' +
    '<img src="img/as.bmp">&nbsp;<img src="img/js.bmp"><br><br>' +
    'The aim of the game is to accumulate a higher<br />point total than the dealer, but without going over 21.<br>' +
    '</span>';
    
    // set default html output visible
    setInnerHTML('default', html_output);

    button_output = '<input type="button" value="Start Game" onclick="storeValue(\'start\', 1); refreshPage()">';
    setInnerHTML('buttons', button_output);
}
function show_game() {
    html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' + showcards + '<br>' +
    '<b>Points = ' + points + '</b><br></span>';

    // set player html output visible
    setInnerHTML('player', html_output);

    button_output = 
    '<input type="button" value="Hit me" onclick="storeValue(\'card_ids\', JSON.stringify(card_ids)); ' +
    'storeValue(\'house_card_ids\', JSON.stringify(house_card_ids)); storeValue(\'hitme\', 1); refreshPage()">';

    if (points > 10) {
        button_output +=
        '&nbsp;<input type="button" value="&nbsp;Stay&nbsp;" onclick="storeValue(\'card_ids\', JSON.stringify(card_ids)); ' +
        'storeValue(\'house_card_ids\', JSON.stringify(house_card_ids)); storeValue(\'stay\', 1); refreshPage()">';
    }

    setInnerHTML('buttons', button_output);
}
function show_gameover() {
    // clear values on game over
    clearValues();
    
    html_output =
    '<span class="valign"><h1 class="noPad">Your hand</h1><br>' +
    showcards + '<br>' +
    '<b>Points = ' + points + '</b></span>';
    
    // set player html output visible
    setInnerHTML('player', html_output);

    button_output = '<input type="button" value="Main Menu" onclick="storeValue(\'newgame\', 1); refreshPage()">';
    setInnerHTML('buttons', button_output);

    // set title visible
    div = document.getElementById('message');
    div.style.background = (win ? "green" : "#CD0000");
    div.style.color = "white";
    div.style.display = 'block';
    div.innerHTML = '<h1 class="noPad">' + gameover_message() + '</h1>';

    // set height of section
    setSectionHeight(315);
}
function show_house() {
    html_output = '<span class="valign"><h1 class="noPad">Dealer\'s Hand</h1><br>';

    var locPoints = 0;

    // show house_card_ids size -1 cards, the last one is turned around, unless game ends
    for (i = 0; i < Object.size(house_card_ids); i++) {
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
    html_output = '<span class="valign"><h1>Statistics</h1><table>' +
    '<tr><td align=left>Wins</td><td align=center><b>' + total_wins + '</b></td></tr>' +
    '<tr><td align=left>Losses</td><td align=center><b>' + total_losses + '</b></td></tr>' +
    '<tr><td align=left>Games Played</td><td align=center><b>' + (total_wins + total_losses) + '</b></td></tr>' +
    '<tr><td align=left>Win Percentage</td><td align=center><b>' +
    (total_losses == 0 ? (total_wins == 0 ? "---" : "100%") :
                         (total_wins == 0 ? "0" : (total_wins/(total_wins + total_losses))*100)+'%') +
    '</b></td></tr></table></span>';

    html_output = '<span class="valign"><h1>Statistics</h1><pre>' +
    'Wins                   <b>' + total_wins + '</b><br>' +
    'Losses                 <b>' + total_losses + '</b><br>' +
    'Games Played           <b>' + (total_wins + total_losses) + '</b><br>' +
    '</pre></span>';

    // set stats html output visible
    setInnerHTML('stats', html_output);
}

function gameover_message() {
    return (!win ? "You Lose" : "You Win");
}

// set/get/calc stats
function set_stats() {
    stats = new Object();
    
    stats['total_wins'] = total_wins;
    stats['total_losses'] = total_losses;
    
    create_cookie('stats', stats);
}
function get_stats() {
    // get total wins/losses
    stats = read_cookie('stats');
    
    if (stats != null)
    {
        total_wins = stats['total_wins'];
        total_losses = stats['total_losses'];
    }
}
function calculate_stats() {
    win ? total_wins++ : total_losses++;
}