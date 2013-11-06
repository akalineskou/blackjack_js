var card_ids = new Array();
var points = aces = 0;
var showcards = '';

// draw 2 random cards
for (i = 0; i <= 1; i++)
    card_ids[i] = random_card(); 

// for each card calculate the points
for (i = 0; i < card_ids.length; i++)
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

 