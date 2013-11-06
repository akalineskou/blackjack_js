// reload the page with where added
function gotopage(where)
{
    var path = window.location.pathname;
    var page = path.substr( path.lastIndexOf("/") + 1 );
    
    window.location = page + "?" + where;
}

// returns number 1-52
function random_card()
{
    return Math.floor((Math.random()*card_count)+1);
}

// store/get local values
function storeValue(key, value) {
    if (localStorage) {
        localStorage.setItem(key, value);
    } else {
        $.cookies.set(key, value);
    }
}

function getStoredValue(key) {
    if (localStorage) {
        return localStorage.getItem(key);
    } else {
        return $.cookies.get(key);
    }
}


// debug function, output to console
function log(msg) {
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}