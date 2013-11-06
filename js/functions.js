// reload the page with where added
function gotopage(where)
{
    var path = window.location.pathname;
    var page = path.substr( path.lastIndexOf("/") + 1 );
    
    window.location = page + (where != undefined ? "?" + where : '');
}

// returns number 1-52
function random_card()
{
    return Math.floor((Math.random()*card_count)+1);
}

// store/get/remove local values
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
function removeValue(key) {
    if (localStorage) {
        localStorage.removeItem(key);
    }
}
function clearValues() {
    localStorage.clear();
}


// debug function, output to console
function log(msg) {
    setTimeout(function() {
        throw new Error("#" + msg +"#");
    }, 0);
}
function showStorage() {
    for (var i = 0; i < localStorage.length; i++){
        log("storage["+localStorage.key(i)+"]: " + localStorage.getItem(localStorage.key(i)));
    }
}

// get associative array size(object)
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};