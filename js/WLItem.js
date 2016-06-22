/*jslint browser: true, indent: 4 */
/*global console: false, $: false, d3: false, TreeMap: false, FB: false, getUrlForPhoto: false, getLikersTree: false, alert: false */


function WLItem(navID) {
    "use strict";
    var self = this,
        albums = [],
        sortBy = "date",
        recCount = 0, //Recursion level
        MAX_RECURSION = 3, //
        treeMap = new TreeMap("#likersTreeMap"),
        nextPage = null,
        showLikes = true,
        showComments = false;

    self.dLikerCount = {};
    self.navID = navID;

    function countLikesByPeople(albums) {
        var countLike = function (l) {
            if (!self.dLikerCount[l.name]) {
                self.dLikerCount[l.name] = {
                    "id": l.id,
                    "count": 0
                };
            }
            if (FB.getUserID() === l.id) {
                //Don"t count me
                return;
            }
            self.dLikerCount[l.name].count += 1;
        };
        //Count likes by people
        albums.forEach(function (d) {
            if (showLikes && d.likes) {
                d.likes.data.forEach(countLike);
            }
            if (showComments && d.comments) {
                d.comments.data.map(function (e) { return e.from; }).forEach(countLike);
            }

        });
    }

    function sortData() {
        albums = albums.sort(function (a, b) {
            var aVal, bVal;
            if (sortBy === "likes") {
                aVal = 0;
                bVal = 0;

                aVal += showLikes && a.likes ? a.likes.summary.total_count : 0;
                bVal += showLikes && b.likes ? b.likes.summary.total_count : 0;

                aVal += showComments && a.comments ? a.comments.summary.total_count : 0;
                bVal += showComments && b.comments ? b.comments.summary.total_count : 0;
            } else if (sortBy === "type") {
                bVal = b.icon;
                aVal = a.icon;
            } else {
                aVal = a.created_time;
                bVal = b.created_time;
            }

            return d3.descending(aVal, bVal);

        });

        albums.forEach(function (d) {
            if (!d.likes) {
                return;
            }
            if (showLikes) {
                d.likes.data.sort(function (a, b) {
                    return d3.descending(self.dLikerCount[a.name].count,
                        self.dLikerCount[b.name].count);
                });
            }
        });
    }

    function getMinMax(data, fn, attr) {
        //finds the min or max (specified by fn) of an attr in a data array
        return fn(data.filter(function (d) { return d[attr]; })
                .map(function (d) { return d[attr]; }));

    }

    self.getItemIcon = function (d) {
        return d.icon || "undefined.gif";
    };

    self.getItemTitle = function (d) {
        return d.type + " with " + (d.likes && d.likes.data ? d.likes.summary.total_count : 0) + " likes" + " created at " + d.created_time;
    };

    self.refreshPosts = function (data) {
        var minDate = new Date(),
            minDateVal = getMinMax(data, d3.min, "created_time");
        if (minDateVal) {
            minDate.setISO8601(minDateVal);
        }

        d3.select("#postsInfo")
            .html("<p>Showing friends for the last " + data.length + " posts, back to <span class='date' title='" + minDate.toISOString() + "''>" + minDate.toISOString() + "</span></p>");
        $(".date").prettyDate();

        d3.select("#albumsData").text("");
        var album = d3.select("#albumsData").selectAll(".post")
            .data(data, function (d) { return d.id; })
            .enter()
            .append("div")
            .attr("class", "post");

        album.append("div")
            .attr("class", "postTitle lefter")
            .append("a")
            .attr("target", "_blank")
            .on("click", function (d) { console.log(d); })
            .attr("href", function (d) { return d.link; })

            .append("img")
            // .attr("height", "30px")
                // function(d) { return 30 + 5* (d.likes&&d.likes.data? d.likes.data.length:0) + "px"})
            // .attr("width", "30px")
            .attr("class", "lefter")
                .attr("src", self.getItemIcon)
            // .attr("alt", function(d) {
            //      return d.name + " with " + d.count + " photos" })
            .attr("title", self.getItemTitle);
        album.select("div.postTitle")
            .append("div")
            .attr("class", "numLikes")
            .text(function (d) {
                var totalInteractions = 0;
                totalInteractions += (showLikes && d.likes && d.likes.summary) ?
                        d.likes.summary.total_count  :
                        0;
                totalInteractions += (showComments && d.comments && d.comments.summary) ?
                        d.comments.summary.total_count  :
                        0;
                return totalInteractions;
            });


        album.append("div")
            .attr("class", "likers lefter")
            .selectAll(".liker")
            .data(function (d) {
                var data = [];
                if (showLikes && d.likes && d.likes.data) {
                    data = data.concat(d.likes.data);
                }
                if (showComments && d.comments && d.comments.data) {
                    data = data.concat(d.comments.data.map(function (e) { return e.from; }));
                }
                return data;
            })
            .enter()
            .append("img")
            .on("mouseover", function (d) {
                d3.select("#albums").classed("selected", true);
                d3.select("#likersTreeMap").classed("selected", true);
                d3.selectAll(".liker" + d.id).classed("selected", true);
            })
            .on("mouseout", function () {
                d3.select("#albums").classed("selected", false);
                d3.select("#likersTreeMap").classed("selected", false);
                d3.selectAll(".liker").classed("selected", false);
            })
            .attr("class", function (d) { return "liker liker" + d.id; })
            .attr("width", "20px")
            .attr("title", function (l) { return l.name + " " + self.dLikerCount[l.name].count + " likes"; })
            .attr("src", function (d) { return getUrlForPhoto(d.id, "square"); })


            .append("title")
                .text(function (l) { return l.name + " " + self.dLikerCount[l.name].count + " likes"; });
        album.append("div")
            .attr("class", "clearer");
        // album.select(".divlikesCount")
        //     .text(function (d) {
        //         if (d.likes && d.likes.data) {
        //             return d.likes.data.length + "likes";
        //         } else {
        //             return null;
        //         }
        //     });
    }; //refreshPosts

    self.changeTitle = function () {
        if (showLikes && showComments) {
            d3.select("h1#title").text("Who likes/comments my posts?");
            d3.select("#sortByLikes").text("Likes+comments");
        } else if (showLikes) {
            d3.select("h1#title").text("Who likes my posts?");
            d3.select("#sortByLikes").text("Likes");
        } else {
            d3.select("h1#title").text("Who comments my posts?");
            d3.select("#sortByLikes").text("Comments");
        }
    };

    function refresh() {
        self.changeTitle();
        self.dLikerCount = {};
        countLikesByPeople(albums);
        treeMap.update(getLikersTree(self.dLikerCount));
        sortData();
        self.refreshPosts(albums);
    }


    function processPosts(response) {
        countLikesByPeople(response.data);
        albums = albums.concat(response.data);
        sortData();
        self.refreshPosts(albums);
        treeMap.update(getLikersTree(self.dLikerCount));
    }

    function showLoadMoreIfMore() {
        if (nextPage) {
            d3.select("#loadMoreButton").text("Load more!");
            $("#loadMoreButton").show();
            $("#loadMoreButton").prop("disabled", false);
        } else {
            $("#loadMoreButton").hide();
        }
    }

    function loadMore() {
        $("#loadMoreButton").prop("disabled", true);
        d3.select("#loadMoreButton").text("loading");
        if (nextPage) {
            d3.json(nextPage, function (error, response) {
                if (error) {
                    alert("Error loading more");
                }
                processPosts(response);
                nextPage = response.paging && response.paging.next ?
                        response.paging.next :
                        null;
                showLoadMoreIfMore();
            });
        }
    }

    // http://stackoverflow.com/questions/728360/how-to-correctly-clone-a-javascript-object
    function clone(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function flattenAlbums(albums) {
        var flatten = [];
        albums.forEach(function (a) {
            if (a.likes && a.likes.data) {
                a.likes.data.forEach(function (l) {
                    var obj = clone(a);
                    obj.typeInteraction="like";
                    obj.friend = l.name;
                    obj.friendId = l.id;
                    obj.interactionTime = null;
                    obj.interactionDetail = null;
                    flatten.push(obj);
                });
            }
            if (a.comments && a.comments.data) {
                a.comments.data.forEach(function (c) {
                    var obj = clone(a);
                    obj.typeInteraction="comments";
                    obj.friend = c.from.name;
                    obj.friendId = c.id;
                    obj.interactionTime = c.created_time;
                    obj.interactionDetail = c.message;
                    flatten.push(obj);
                });
            }


        });
        return flatten;
    }

    function download() {
        $("#downloadButton").prop("disabled", true);


        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += toCsv(flattenAlbums(albums));
        // albums.forEach(function(album, index) {

        //    dataString = album.join(",");
        //    csvContent += index < data.length ? dataString+ "\n" : dataString;

        // });

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);


        $("#downloadButton").prop("disabled", false);
    }




    function recursePages(response) {
        if (!response.data) {
            return;
        }
        processPosts(response);
        if (response.paging && response.paging.next) {
            d3.json(response.paging.next, function (error, data) {
                if (error) {
                    alert("error recursing");
                }
                if (recCount++ < MAX_RECURSION) {
                    recursePages(data);
                } else {
                    nextPage = response.paging && response.paging.next ?
                            response.paging.next :
                            null;
                    $("#showComments").prop("disabled", false);
                    $("#showLikes").prop("disabled", false);
                    showLoadMoreIfMore();
                }
            });
        }
    }
    self.displayPosts = function(response) {
        if (!response.data) {
            alert("Couldn't get posts");
            if (response.error && response.error.message) {
                alert("error: " + response.error.message);
            }
            return;
        }

        recursePages(response);
    };


    self.load = function () {
        d3.select("#sortByDate").on("click", function () {
            sortBy = "date";
            sortData();
            self.refreshPosts(albums);
            d3.selectAll(".sortButton").classed("active", false);
            d3.select(this).classed("active", true);
        });
        d3.select("#sortByLikes").on("click", function () {
            sortBy = "likes";
            sortData();
            self.refreshPosts(albums);
            d3.selectAll(".sortButton").classed("active", false);
            d3.select(this).classed("active", true);
        });
        d3.select("#sortByType").on("click", function () {
            sortBy = "type";
            sortData();
            self.refreshPosts(albums);
            d3.selectAll(".sortButton").classed("active", false);
            d3.select(this).classed("active", true);
        });

        d3.select("#showLikes")
            .on("click", function () {
                var val = !d3.select("#showLikes").classed("active");
                // d3.select("#showLikes").classed("active", val);
                showLikes = val;
                if (!showLikes && !showComments) {
                    showComments = true;
                    d3.select("#showComments").classed("active", true);
                }
                refresh();
            });
        d3.select("#showComments")
            .on("click", function () {
                var val = !d3.select("#showComments").classed("active");
                // d3.select("#showComments").classed("active", val);
                showComments = val;
                if (!showLikes && !showComments) {
                    showLikes = true;
                    d3.select("#showLikes").classed("active", true);
                }
                refresh();
            });

        d3.select("#loadMoreButton")
            .on("click", loadMore);
        d3.select("#downloadButton")
            .on("click", download);


        $("#loadMoreButton").prop("disabled", true);
        $("#showComments").prop("disabled", true);
        $("#showLikes").prop("disabled", true);
        treeMap.init();

        d3.selectAll(".nav-option").classed("active", false);
        d3.select(self.navID).classed("active", true);

        self.runFBQuery();

    };

    self.runFBQuery = function () {
        FB.api("/me/posts?fields=id,icon,created_time,type,link,likes.summary(true),comments.summary(true)", self.displayPosts);
    };


    self.test = function () {

    };





    return self;
}