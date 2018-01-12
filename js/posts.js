/*jslint browser: true, indent: 4 */
/*global d3: false, TreeMap: false, FB: false, getUrlForPhoto: false, getLikersTree: false, alert: false */



function WLPosts(navID) {
    "use strict";
    if (!(this instanceof WLPosts)) {
        return new WLPosts();
    }
    var self = this;
    self.navID = navID

    return self;
}

WLPosts.prototype = new WLItem("#navPosts");
WLPosts.prototype.constructor = WLPosts;