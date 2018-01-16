/*jslint browser: true, indent: 4 */
/* global  FB */

// function MyFB(callBack, nonAuthCall, needLoginCall) {
//     "use strict";
    var appId = (document.domain === "localhost") ? "551689984908268" : "399200564464";
    // "399200564464"; Old id
	// "266059540185296"

    // This is called with the results from from FB.getLoginStatus().
      function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          fbReady();
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          // document.getElementById('status').innerHTML = 'Please log ' +
          //   'into this app.';

            nonAuthCall();
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          // document.getElementById('status').innerHTML = 'Please log ' +
          //   'into Facebook.';

            needLoginCall();
        }
      }

      // This function is called when someone finishes with the Login
      // Button.  See the onlogin handler attached to it in the sample
      // code below.
      function checkLoginState() {
        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
      }



    window.fbAsyncInit = function () {
        // init the FB JS SDK
        FB.init({
            appId      : appId,                        // App ID from the app dashboard
            // channelUrl : "wholikesmyfb/channel.html", // Channel file for x-domain comms
            status     : true,                                 // Check Facebook Login status
            cookie     : true,                       // enable cookies to allow the server to access
                                                     // the session
            version    : 'v2.8',
            xfbml      : true                        // Look for social plugins on the page
        });

        FB.AppEvents.logPageView();   

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
          });       
    }; //fbAsyncInit



   
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

//     return this;
// }
