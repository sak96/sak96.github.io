function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + (";path=" + {{SITEURL}} + "/") + ";SameSite=Lax";
}
document.querySelector("#navbar-toggler").onclick = function (e) {
    document.querySelectorAll(".nav-start a,.nav-end a").forEach(
        (e) => e.classList.toggle("show")
    )
}
{
    let theme = getCookie("theme");
    if (theme !== "light"){
        document.documentElement.setAttribute('data-theme', ''); 
        setCookie("theme", "", -1); 
    }
}
document.querySelector("#theme").onclick = function (e) {
    if (document.documentElement.getAttribute('data-theme')){
        document.documentElement.setAttribute('data-theme', ''); 
        setCookie("theme", "", -1); 
    }else{
        let l = "light";
        document.documentElement.setAttribute('data-theme', l); 
        setCookie("theme", l, 365); 
    }
} 
