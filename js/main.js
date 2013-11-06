var card_ids = {}; //{}
var points = aces = 0;
var showcards = '';

if (getStoredValue('hitme'))
{
    card_ids = JSON.parse(getStoredValue('card_ids'));
    card_ids[Object.size(card_ids)] = random_card();
}
else
{
    // draw 2 random cards
    for (i = 0; i <= 1; i++)
        card_ids[i] = random_card();
}

// for each card calculate the points
for (i = 0; i < Object.size(card_ids); i++)
{
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
 ** points >= 11 then add 1, else 11
 */
for (i = 0; i < aces; i++)
    points += (points < 11 && aces - i == 1 ? 11 : 1);

function show_default()
{
    html_ouput =
    '<table cellspacing=0 cellpadding=3 width=400>' +
    '<tr><td colspan=2 cellspacing=0 cellpadding=5 align=center>' +
    '<table width="100%" cellspacing=0 cellpadding=10 bgcolor=white>' +
    '<tr><td align=center><img src="img/as.bmp" border=0>&nbsp;<img src="img/js.bmp"border=0></td></tr>' +
    '<tr><td align=left>You must collect 21 points without going over.</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="Start!" onclick="storeValue(\'start\', 1); gotopage()">' +
    '</td></tr></table>' +
    '</td></tr></table>';
    
    return html_ouput;
}

function show_game()
{
    html_ouput =
    '<table cellspacing=0 cellpadding=3 width=400>' +
    '<tr><td colspan=2 cellspacing=0 cellpadding=5 align=center>' +
    '<table width="100%" cellspacing=0 cellpadding=10 bgcolor=white>' +
    '<tr><td align=center>' + showcards + '</td></tr>' +
    '<tr><td align=center>Points = ' + points + '</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="Hit me!" onclick="storeValue(\'card_ids\', JSON.stringify(card_ids)); storeValue(\'hitme\', 1); gotopage()">';

    if (points > 10)
    {
        html_ouput +=
        '<input type="button" value="Stay" onclick="storeValue(\'stay\', 1); gotopage()">';
    }

    html_ouput +=
    '</td></tr></table>' +
    '</td></tr></table>';
    
    return html_ouput;
}

function show_gameover()
{
    html_ouput =
    '<table cellspacing=0 cellpadding=3 width=400>' +
    '<tr><td colspan=2 cellspacing=0 cellpadding=5 align=center>' +
    '<table width="100%" cellspacing=0 cellpadding=10 bgcolor=white>' +
    '<tr><td align=center>' + showcards + '</td></tr>' +
    '<tr><td align=left>Points = ' + points + '</td></tr>' +
    '<tr><td align=center>' +
    '<input type="button" value="New Game!" onclick="clearValues(); gotopage()">' +
    '</td></tr></table>' +
    '</td></tr></table>';
    
    return html_ouput;
}

function show_stats()
{
    html_output =
    '<br /><br /><br />' +

    '<table cellspacing=0 cellpadding=3 width=400>' +
    '<tr><td colspan=2 cellspacing=0 cellpadding=5 align=center>' +
    '<div align="center"><h1>Personal Statistics</h1></div>' +
    '<tr><td align=left><b>Wins</b></td><td align=center><b></b></td></tr>' +
    '<tr><td align=left><b>Losses</b></td><td align=center><b></b></td></tr>' +
    '<tr><td align=left><b>Games Played</b></td><td align=center><b></b></td></tr>' +
    '<tr><td align=left><b>Win Percentage</b></td><td align=center><b></b></td></tr>' +
    '<tr><td align=left><b>+/-</b></td><td align=center><b></b></td></tr>' +
    '</td></tr></table>';

    return html_output;
}
 