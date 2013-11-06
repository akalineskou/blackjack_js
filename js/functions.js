/* reload the page with where added */
function gotopage(where)
{
    var path = window.location.pathname;
    var page = path.substr( path.lastIndexOf("/") + 1 );
    
    window.location = page + "?" + where;
}