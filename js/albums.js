/*jslint browser: true, indent: 4 */
/*global WLItem: false, d3: false,  TreeMap: false, getLikersTree: false, FB: false, getUrlForPhoto: false, alert: false */



function WLAlbums(navID) {
    "use strict";
    if (!(this instanceof WLAlbums)) {
        return new WLAlbums();
    }
    // WLItem.call(this, navID);
    var self = this;
    self.navID = navID;

    return self;
}


WLAlbums.prototype = new WLItem("#navAlbums");
WLAlbums.prototype.constructor = WLAlbums;
WLAlbums.prototype.runFBQuery = function () {
    "use strict";
    var self = this;
    FB.api("me/albums?fields=id,name,cover_photo,created_time,link,likes.summary(true),comments.summary(true)", self.displayPosts);
};

WLAlbums.prototype.getItemIcon = function (d) {
    if (d.cover_photo) {
        return getUrlForPhoto(d.cover_photo, "thumbnail");
    }

};

WLAlbums.prototype.getItemTitle = function (d) {
    return d.name + " with " + (d.likes && d.likes.data ? d.likes.summary.total_count : 0) + " likes" + " created at " + d.created_time;
};

WLAlbums.prototype.changeTitle = function () {
    if (showLikes && showComments) {
        d3.select("h1#title").text("Who likes/comments my albums?");
        d3.select("#sortByLikes").text("Likes+comments");
    } else if (showLikes) {
        d3.select("h1#title").text("Who likes my albums?");
        d3.select("#sortByLikes").text("Likes");
    } else {
        d3.select("h1#title").text("Who comments my albums?");
        d3.select("#sortByLikes").text("Comments");
    }
};


// WLAlbums.prototype.refreshPosts = function (data) {
//     "use strict";
//     var self = this;
//     d3.select("#postsInfo")
//         .html("<p>Showing friends for the last " + data.length + " posts, back to <span class='date' title='" + minDate.toISOString() + "''>" + minDate.toISOString() + "</span></p>");
//     $(".date").prettyDate();

//     d3.select("#albumsData").text("");
//     var album =d3.select("#albumsData").selectAll(".album")
//     .data(data, function(d) { return d.id; })
//     .enter()
//     .append("div")
//     .attr("class", "album");

//     album.append("div")
//     .append("title")
//         // .attr("class", "title")
//         .text(function(d) {
//             return d.name + " with " + d.count + " photos";
//         });

//     album
//         .attr("class", "postTitle lefter")
//         .append("a")
//         .attr("target", "_blank")
//         .attr("href", function(d){
//             return d.link;
//         })
//         .append("img")
//         .attr("height", "30px")
//         // function(d) { return 30 + 5* (d.likes&&d.likes.data? d.likes.data.length:0) + "px"})
//         .attr("width", "30px")
//         .attr("style", "padding-right: 5px")
//         .attr("src", function(d) {
//             if (d.cover_photo) {
//                 return getUrlForPhoto(d.cover_photo, "thumbnail");
//             }
//         })
//         .attr("alt", function(d) {
//             return d.name + " with " + d.count + " photos";
//         })
//         .attr("title", function(d) {
//             return d.name + " with " + d.count + " photos" + " and " + (d.likes&&d.likes.data? d.likes.data.length:0) + " likes";
//         });


//     album
//         .selectAll(".liker")
//         .data(function(d) { return d.likes && d.likes.data ? d.likes.data: [];})
//         .enter()
//         .append("img")
//         .on("mouseover", function (d) {
//             d3.select("#albums").classed("selected", true);
//             d3.select("#likersTreeMap").classed("selected", true);
//             d3.selectAll(".liker"+d.id).classed("selected", true);
//         })
//         .on("mouseout", function () {
//             d3.select("#albums").classed("selected", false);
//             d3.select("#likersTreeMap").classed("selected", false);
//             d3.selectAll(".liker").classed("selected", false);
//         })
//         .attr("class", function(d) { return "liker liker"+d.id;})
//         .attr("width", "20px")
//         .attr("title", function (l) { return l.name + " " + self.dLikerCount[l.name].count + " likes"; } )
//         .attr("src", function(d) { return getUrlForPhoto(d.id, "square"); })

//         .append("title")
//         .text(function (l) { return l.name + " " + self.dLikerCount[l.name].count + " likes"; } );

//     album.append("div")
//         .attr("class", "clearer");
// };

