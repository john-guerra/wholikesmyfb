/*jslint browser: true, indent: 4 */
/* global  FB */

function MyFB(callBack, nonAuthCall, needLoginCall) {
    "use strict";
    var appId = (document.domain === "localhost") ? "551689984908268" : "399200564464";
    // "399200564464"; Old id
	// "266059540185296"
    window.fbAsyncInit = function () {
        // init the FB JS SDK
        FB.init({
            appId      : appId,                        // App ID from the app dashboard
            channelUrl : "wholikesmyfb/channel.html", // Channel file for x-domain comms
            status     : true,                                 // Check Facebook Login status
            xfbml      : true                                  // Look for social plugins on the page
        });


        // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
        // for any authentication related change, such as login, logout or session refresh. This means that
        // whenever someone who was previously logged out tries to log in again, the correct case below
        // will be handled.
        FB.Event.subscribe("auth.authResponseChange", function (response) {
            // Here we specify what we do with the response anytime this event occurs.
            if (response.status === "connected") {
                // The response object is returned with a status field that lets the app know the current
                // login status of the person. In this case, we"re handling the situation where they
                // have logged in to the app.
                callBack();
            } else if (response.status === "not_authorized") {
                // In this case, the person is logged into Facebook, but not into the app, so we call
                // FB.login() to prompt them to do so.
                // In real-life usage, you wouldn"t want to immediately prompt someone to login
                // like this, for two reasons:
                // (1) JavaScript created popup windows are blocked by most browsers unless they
                // result from direct interaction from people using the app (such as a mouse click)
                // (2) it is a bad experience to be continually prompted to login upon page load.

                // FB.login();
                nonAuthCall();
            } else {
                // In this case, the person is not logged into Facebook, so we call the login()
                // function to prompt them to do so. Note that at this stage there is no indication
                // of whether they are logged into the app. If they aren"t then they"ll see the Login
                // dialog right after they log in to Facebook.
                // The same caveats as above apply to the FB.login() call here.
                // FB.login(scope:["user_photos"]);
                needLoginCall();
            }
        }); //FB.Event
    }; //fbAsyncInit




      // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return; }
        js = d.createElement(s);
        js.id = id;
        // js.src = "//connect.facebook.net/en_US/all.js";
        js.src = "//connect.facebook.net/en_US/all/debug.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));

    return this;
}
