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
    localStorage.setItem(key, value);
}
function getStoredValue(key) {
    return localStorage.getItem(key);
}
function removeValue(key) {
    localStorage.removeItem(key);
}
function clearValues() {
    localStorage.clear();
}

// create, read, delete cookies
function create_cookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), '; path=/;'].join('');
    document.cookie = cookie;
}
function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
 
    return result;
}
function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
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

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}