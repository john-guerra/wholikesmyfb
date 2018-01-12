/*jslint browser: true, indent: 4 */
/* global d3: false, $: false, MyFB: false, WLAlbums: false, WLPosts: false, FB: false, console: false */
"use strict";
function getUrlForPhoto(id, type) {
    return "https://graph.facebook.com/" + id + "/picture?type=" + type + "&access_token=" + FB.getAccessToken();
}

Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);
    var time;

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] === "-") ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
};


function getLikersTree(dLikerCount) {
    var children = [],
        liker;

    for (liker in dLikerCount ) {
        if (dLikerCount.hasOwnProperty(liker)) {
            children.push({
                "id": dLikerCount[liker].id,
                "name": liker,
                "size": dLikerCount[liker].count
            });
        }
    }
    return {"name": "likers",
        "children": children
        };
}




(function () {
    var albums, posts, type, logout;

    logout = function () {
        $("#logout").hide();
        FB.logout(function () {
            $("#mainContainer").load("login.html");
        });
    };

    function errorAuthCall() {
        d3.select("body")
            .append("div")
            .attr("id", "login_message")
            .text("You need to authorize our app to use it")
                    .on("click", function () {
                        FB.login(function (res) {
                            console.log("Facebook login");
                            console.log(res);
                        },
                            {
                                scope: 'user_photos,user_status,user_posts',
                                return_scopes: true
                            });
                    });
    }

    function needLoginCall() {
        d3.select("body")
            .append("div")
            .attr("id", "login_message")
            .text("Please login to Facebook to use this app")
                    .on("click", function () {
                        FB.login(function (res) {
                            console.log("Facebook login");
                            console.log(res);
                        },
                            {
                                scope: 'user_photos,user_status,user_posts',
                                return_scopes: true
                            });
                    });
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function fbReady() {
        d3.select("#loginDiv").remove();

        $("#logout").show();
        d3.select("#logout").on("click", logout);
        if (type === "albums") {
            $("#mainContainer").load("albums.html",
                function () {
                        albums.load();
                    });
        } else {
            $("#mainContainer").load("posts.html",
                function () {
                        posts.load();
                    });

        }
    }

    new MyFB(fbReady, errorAuthCall, needLoginCall);
    albums = new WLAlbums("#navAlbums");
    posts = new WLPosts("#navPosts");

    type = getParameterByName("type") || "albums";
    $("#nav").load("nav.html");
    $("#mainContainer").load("login.html");



}());