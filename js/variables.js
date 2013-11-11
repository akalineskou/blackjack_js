// card variables
var card_count = 52;

// money variables
var total_money = 100;
var bet_amount = 10;
/* bet info array
 ** name: text to show user
 ** value: value to add to bet(5 adds total money) */
var bet_info = {
    1 : {
        'name' : '10',
        'value' : 10
    },
    2 : {
        'name' : '25',
        'value' : 25
    },
    3 : {
        'name' : '50',
        'value' : 50
    },
    4 : {
        'name' : '100',
        'value' : 100
    },
    5 : {
        'name' : 'All in',
        'value' : 'set total_money!!'
    }
}

/* cards info array
 ** id - card pic, card points
 *** card num: j - jack, q - queen, k - king
 *** card pic: s - spades, d - diamonds, c - clubs, h - hearts */
var card_info = {
    1 : {
        'card' : '2s',
        'points' : 2
    },
    2 : {
        'card' : '3s',
        'points' : 3
    },
    3 : {
        'card' : '4s',
        'points' : 4
    },
    4 : {
        'card' : '5s',
        'points' : 5
    },
    5 : {
        'card' : '6s',
        'points' : 6
    },
    6 : {
        'card' : '7s',
        'points' : 7
    },
    7 : {
        'card' : '8s',
        'points' : 8
    },
    8 : {
        'card' : '9s',
        'points' : 9
    },
    9 : {
        'card' : '10s',
        'points' : 10
    },
    10 : {
        'card' : 'js',
        'points' : 10
    },
    11 : {
        'card' : 'qs',
        'points' : 10
    },
    12 : {
        'card' : 'ks',
        'points' : 10
    },
    13 : {
        'card' : 'as',
        'points' : 1
    },
    14 : {
        'card' : '2d',
        'points' : 2
    },
    15 : {
        'card' : '3d',
        'points' : 3
    },
    16 : {
        'card' : '4d',
        'points' : 4
    },
    17 : {
        'card' : '5d',
        'points' : 5
    },
    18 : {
        'card' : '6d',
        'points' : 6
    },
    19 : {
        'card' : '7d',
        'points' : 7
    },
    20 : {
        'card' : '8d',
        'points' : 8
    },
    21 : {
        'card' : '9d',
        'points' : 9
    },
    22 : {
        'card' : '10d',
        'points' : 10
    },
    23 : {
        'card' : 'jd',
        'points' : 10
    },
    24 : {
        'card' : 'qd',
        'points' : 10
    },
    25 : {
        'card' : 'kd',
        'points' : 10
    },
    26 : {
        'card' : 'ad',
        'points' : 1
    },
    27 : {
        'card' : '2c',
        'points' : 2
    },
    28 : {
        'card' : '3c',
        'points' : 3
    },
    29 : {
        'card' : '4c',
        'points' : 4
    },
    30 : {
        'card' : '5c',
        'points' : 5
    },
    31 : {
        'card' : '6c',
        'points' : 6
    },
    32 : {
        'card' : '7c',
        'points' : 7
    },
    33 : {
        'card' : '8c',
        'points' : 8
    },
    34 : {
        'card' : '9c',
        'points' : 9
    },
    35 : {
        'card' : '10c',
        'points' : 10
    },
    36 : {
        'card' : 'jc',
        'points' : 10
    },
    37 : {
        'card' : 'qc',
        'points' : 10
    },
    38 : {
        'card' : 'kc',
        'points' : 10
    },
    39 : {
        'card' : 'ac',
        'points' : 1
    },
    40 : {
        'card' : '2h',
        'points' : 2
    },
    41 : {
        'card' : '3h',
        'points' : 3
    },
    42 : {
        'card' : '4h',
        'points' : 4
    },
    43 : {
        'card' : '5h',
        'points' : 5
    },
    44 : {
        'card' : '6h',
        'points' : 6
    },
    45 : {
        'card' : '7h',
        'points' : 7
    },
    46 : {
        'card' : '8h',
        'points' : 8
    },
    47 : {
        'card' : '9h',
        'points' : 9
    },
    48 : {
        'card' : '10h',
        'points' : 10
    },
    49 : {
        'card' : 'jh',
        'points' : 10
    },
    50 : {
        'card' : 'qh',
        'points' : 10
    },
    51 : {
        'card' : 'kh',
        'points' : 10
    },
    52 : {
        'card' : 'ah',
        'points' : 1
    }
}
