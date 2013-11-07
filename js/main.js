var card_ids = new Object();
var house_card_ids = new Object();
var showcards = '';

// clear everything
if (getURLParameter('clear') == "1") {
    eraseCookie('stats');
    clearValues();
}

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
    
    showcards += "<img src='img/" + card_info[card_id]['card'] + ".bmp' border=0 /> ";
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
    html_ouput = table_start() +
    '<tr><td align=center><img src="img/as.bmp" border=0>&nbsp;<img src="img/js.bmp"border=0></td></tr>' +
    '<tr><td align=center>You must collect 21 points without going over.</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="Start!" onclick="storeValue(\'start\', 1); gotopage()">' +
    '</td></tr>' +
    table_end();
    
    return html_ouput;
}
function show_game() {
    html_ouput = table_start() +
    '<tr><td align=center>' + showcards + '</td></tr>' +
    '<tr><td align=center>Points = ' + points + '</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="Hit me!" onclick="storeValue(\'card_ids\', JSON.stringify(card_ids)); storeValue(\'house_card_ids\', JSON.stringify(house_card_ids)); storeValue(\'hitme\', 1); gotopage()">';

    if (points > 10) {
        html_ouput +=
        '<input type="button" value="Stay" onclick="storeValue(\'card_ids\', JSON.stringify(card_ids)); storeValue(\'house_card_ids\', JSON.stringify(house_card_ids)); storeValue(\'stay\', 1); gotopage()">';
    }

    html_ouput +=
    '</td></tr>' + table_end();
    
    return html_ouput;
}
function show_gameover() {
    // clear values on game over
    clearValues();
    
    html_ouput = table_start() +
    '<tr><td align=center><h1>' + gameover_message() + '</h1></td></tr>' +
    '<tr><td align=center>' + showcards + '</td></tr>' +
    '<tr><td align=center>Points = ' + points + '</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="New Game!" onclick="storeValue(\'newgame\', 1); gotopage()">' +
    '</td></tr>' + table_end();
    
    return html_ouput;
}
function show_house() {
    html_ouput = table_start() +
    '<tr><td align=center colspan=2><h1>House\'s Hand</h1></td></tr>' +
    '<tr><td align=center>';

    var locPoints = 0;

    // show house_card_ids size -1 cards, the last one is turned around, unless game ends
    for (i = 0; i < Object.size(house_card_ids); i++) {
        if ((getStoredValue('stay') == '1' || gameover) || i + 1 < Object.size(house_card_ids)) {
            html_ouput += "<img src='img/" + card_info[house_card_ids[i]]['card'] + ".bmp' border=0 />";

            locPoints += card_info[house_card_ids[i]]['points'];
        }
        else
            html_ouput += "<img src='img/back.png' border=0>";
    }

    html_ouput +=
    '<tr><td align=center>House points = ' + ((getStoredValue('stay') == '1' || gameover) ? housePoints : locPoints) + '</td></tr>' +
    '</td></tr>' + table_end();

    return html_ouput;
}

function show_stats() {
    html_output = table_start() +
    '<tr><td align=center colspan=2><h1>Personal Statistics</h1></td></tr>' +

    '<tr><td align=left><b>Wins</b></td><td align=center><b>' + total_wins + '</b></td></tr>' +
    '<tr><td align=left><b>Losses</b></td><td align=center><b>' + total_losses + '</b></td></tr>' +
    '<tr><td align=left><b>Games Played</b></td><td align=center><b>' + (total_wins + total_losses) + '</b></td></tr>' +
    '<tr><td align=left><b>Win Percentage</b></td><td align=center><b>' +
    (total_losses == 0 ? (total_wins == 0 ? "---" : "100%") : (total_wins == 0 ? "0" : (total_wins/(total_wins + total_losses))*100)+'%') +
    '</b></td></tr>' + table_end();

    return html_output;
}

function gameover_message() {
    return (!win ? "You Lose!" : "You Win!");
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