function init() {
    chrome.tabs.executeScript({
        allFrames: !0,
        code: "document.documentElement.outerHTML"
    }, function(a) {
        parseHTML(a[0])
    })
}

function parseHTML(a) {
    var b = "document/",
        c = "ratings/",
        d = a.indexOf(b),
        e = a.indexOf(c),
        f = a.substring(d + b.length, e - 1);
    req(uUrl), req(fUrl + f), fLink = bUrl + fUrl + dUrl + f
}

function req(a) {
	var b = new XMLHttpRequest;
	
    b.open("GET", bUrl + a, !0), b.onload = function() {
        if (b.status >= 200 || b.status <= 400) {
            //var a = JSON.parse(b.responseText);
			var a = document.createElement( 'html' );
			a.innerHTML = b.responseText;
			a.getElementsByTagName( 'a' )
            console.log(a), manageData(a), console.log(fLink)
				
        } else console.log("Bad response from server.")
    }, b.send()
}

function manageData(a) {
    a.user_id ? uInfo = a : a.db_filename ? (fInfo = a, cID = fInfo.course_id, getAll ? req(cUrl + cID + limit) : download()) : getAll && (cInfo = a, download())
}

function download() {
    if (getAll) {
        var a = bUrl + fUrl + dUrl;
        console.log("Trying cID" + cID);
        for (file in cInfo) console.log(file, a + cInfo[file].db_filename, cInfo[file].title), chrome.downloads.download({
            url: a + cInfo[file].db_filename
        })
    } else console.log(fLink, fInfo.title, fInfo.course.dept_acro, fInfo.course.course_num), chrome.downloads.download({
        url: fLink
    })
}
var bUrl = "https://www.coursehero.com/api/v1/",
    uUrl = "users/",
    fUrl = "documents/",
    dUrl = "download/",
    cUrl = "documents/course/",
    fLink, uInfo, fInfo, cInfo, limit = "/?limit=1000",
    getAll = !1;
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: "Download this file.",
        id: "getOne",
        contexts: ["all"]
    }), chrome.contextMenus.create({
        title: "Download all files from this course.",
        id: "getAll",
        contexts: ["all"]
    })
}), chrome.contextMenus.onClicked.addListener(function(a, b) {
    "getOne" === a.menuItemId ? getAll = !1 : "getAll" === a.menuItemId && (getAll = !0), init()
});
