"use strict";
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '399200564464',                        // App ID from the app dashboard
      channelUrl : 'www.dutovis.com/albumsExplorer/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });


	// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
	  // for any authentication related change, such as login, logout or session refresh. This means that
	  // whenever someone who was previously logged out tries to log in again, the correct case below
	  // will be handled.
	  FB.Event.subscribe('auth.authResponseChange', function(response) {
	    // Here we specify what we do with the response anytime this event occurs.
	    if (response.status === 'connected') {
	      // The response object is returned with a status field that lets the app know the current
	      // login status of the person. In this case, we're handling the situation where they
	      // have logged in to the app.
	      loadAlbums();
	    } else if (response.status === 'not_authorized') {
	      // In this case, the person is logged into Facebook, but not into the app, so we call
	      // FB.login() to prompt them to do so.
	      // In real-life usage, you wouldn't want to immediately prompt someone to login
	      // like this, for two reasons:
	      // (1) JavaScript created popup windows are blocked by most browsers unless they
	      // result from direct interaction from people using the app (such as a mouse click)
	      // (2) it is a bad experience to be continually prompted to login upon page load.
        d3.select("body")
        .append("div")
        .attr("id", "login_message")
        .text("Please login to Facebook to use this app");
	      // FB.login();
	    } else {
	      // In this case, the person is not logged into Facebook, so we call the login()
	      // function to prompt them to do so. Note that at this stage there is no indication
	      // of whether they are logged into the app. If they aren't then they'll see the Login
	      // dialog right after they log in to Facebook.
	      // The same caveats as above apply to the FB.login() call here.
	      // FB.login(scope:["user_photos"]);
	    }
	  });
  };


  var dLikerCount={},
      albums = [],
      sortByLikes = true;

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     // js.src = "//connect.facebook.net/en_US/all.js";
     js.src = "//connect.facebook.net/en_US/all/debug.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

    // Here we run a very simple test of the Graph API after login is successful.
  // This testAPI() function is only called in those cases.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }

  function loadAlbums() {
  	d3.select("#albums").append("h3").text("Who likes my albums?");
    d3.select("#albums")
      .append("a")
      .attr("href", "#")
      .on("click", function(d) {
        sortByLikes=false;
        sortData();
        refreshAlbums(albums);
      })
      .text("sort by date");
    d3.select("#albums").append("span").text(" | ")
    d3.select("#albums")
      .append("a")
      .attr("href", "#")
      .on("click", function(d) {
        sortByLikes=true;
        sortData();
        refreshAlbums(albums);
      })
      .text("sort by number of likes");
    d3.select("#albums").append("div")
      .attr("id", "albumsData")
      .text("Who likes my albums?");
  	FB.api("/me/albums", displayAlbums);
  }

  function getUrlForPhoto(id, type) {
  	return "https://graph.facebook.com/"+id+"/picture?type="+type+"&access_token="+FB.getAccessToken();
  }

  function refreshAlbums(data) {
  	d3.select("#albumsData").text("")
	var album =d3.select("#albumsData").selectAll(".album")
  			.data(data, function(d) { return d.id; })
  			.enter()
  			.append("div")
  				.attr("class", "album")


  		album.append("div")
  			.append("title")
  				// .attr("class", "title")
  				.text(function(d) {
  					return d.name + " with " + d.count + " photos" });

  		album
  			.append("a")
  			.attr("target", "_blank")
  			.attr("href", function(d){ return d.link})

  			.append("img")
  			.attr("height", "30px")
  				// function(d) { return 30 + 5* (d.likes&&d.likes.data? d.likes.data.length:0) + "px"})
  			.attr("width", "30px")
  			.attr("style", "padding-right: 5px")
  				.attr("src", function(d) { if (d.cover_photo) {return getUrlForPhoto(d.cover_photo, "thumbnail");} } )
  			.attr("alt", function(d) {
  					return d.name + " with " + d.count + " photos" })
  			.attr("title", function(d) {
  					return d.name + " with " + d.count + " photos" + " and " + (d.likes&&d.likes.data? d.likes.data.length:0) + " likes"});


  		album
  			.selectAll(".liker")
  			.data(function(d) { return d.likes&&d.likes.data ? d.likes.data: [];})
  			.enter()
  			.append("img")
        .on("mouseover", function(d) {
          d3.select("#albums").classed("selected", true);
          d3.selectAll(".liker"+d.id).classed("selected", true); })
        .on("mouseout", function(d) {
          d3.select("#albums").classed("selected", false);
          d3.selectAll(".liker").classed("selected", false); })
  			.attr("class", function(d) { return "liker liker"+d.id;})
  			.attr("width", "20px")
        .attr("title", function (l) { return l.name + " " + dLikerCount[l.name] + " likes";; } )
  			.attr("src", function(d) { return getUrlForPhoto(d.id, "square"); })

			.append("title")
  			.text(function (l) { return l.name + " " + dLikerCount[l.name] + " likes"; } )

  }

  function countLikesByPeople(albums) {
    //Count likes by people
    albums.forEach(function (d) {
      if (!d.likes) {
        return;
      }
      d.likes.data.forEach(function(l) {
        if (!dLikerCount[l.name]) {
          dLikerCount[l.name]=0;
        }
        dLikerCount[l.name]+=1;
      })
    });
  }

  function sortData() {
    albums = albums.sort(function(a,b) {
      if (sortByLikes) {
        return d3.descending(a.likes?a.likes.data.length:0,
              b.likes?b.likes.data.length:0);
      } else {
        return d3.descending(a.created_time,
              b.created_time);
      }
    });

    albums.forEach( function (d) {
      if (!d.likes) {
        return;
      }
      d.likes.data.sort( function(a,b) {
        return d3.descending(dLikerCount[a.name],
          dLikerCount[b.name]);
      });
    });
  }

  function displayAlbums(response) {
  	if (!response.data) {
  		alert("Couldn't get albums");
  		return;
  	}


  	recursePages(response);

  	function recursePages(response) {
  		if (!response.data) {
  			return;
  		}

      countLikesByPeople(response.data);
  		albums = albums.concat(response.data);
      sortData();
  		refreshAlbums(albums);
  		if (response.paging && response.paging.next) {
  			d3.json(response.paging.next, function(error, data) {
  				if (error) {
  					alert("error recursing");
  				}
  				recursePages(data);
  			})
  		}

  	}



  }