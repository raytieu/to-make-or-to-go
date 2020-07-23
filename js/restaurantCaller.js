//Initializing Foundation Framework
$(document).foundation();
$(document).ready(function () {

  let searchModalContent = $(".search-modal-content");
  let modal = $("#search-modal");

  function yelpCaller(searchVal, location) {
    // let searchVal = 'pho';
    let queryUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchVal}&location=${location}`;

    const apiKey = 'EcekOi57siTKO6p6p9D5elbIoA0MqCpOTQU-E9D2UH6vuvZ3JAy8s9c4aDAhKxMQ9NieE0DP6oY7UPrBx-Xql4ISVlnBagKJHV_Swb7oxAqWvX6dR-vpm0FSmGMWX3Yx';
    $.ajax({
      url: queryUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      dataType: 'json'
    }).then(function (res) {
      console.log(res)
    })

    // navigator.geolocation.getCurrentPosition(function (position) {
    //   callYelp(`${queryUrl}latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
    // },
    //   function (error) {
    //     // alert("Sorry, your browser does not support HTML5 geolocation.");
    //     callYelp(`${queryUrl}location=orange county`)
    //   });
  }

  let callRecipe = (searchVal) => {
    // let recipeQuery;
    apiKey1 = "4f82145085msh96574383383d13cp17d4bcjsnfeec1f433131" // Jeorge's Key
    apiKey2 = "0239e03514msh2b775b47a0eb3cep1158c7jsn32e6781cfbcd" // Raymond's Key
    let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey2}&from=0&sizes=20&q=${searchVal}`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
    });
  }

  $(".to-make-btn").on("click", function (e) {
    e.preventDefault()
    parseSearchContent("to make");
    modal.foundation('open');
  });

  $(".to-go-btn").on("click", function (e) {
    e.preventDefault()
    parseSearchContent("to go");
    modal.foundation('open');
  });

  let parseSearchContent = (type) => {

    searchModalContent.empty()
    if (type === "to make") {
      searchModalContent.append(
        $(`<h4></h4>`).text("To Make"),
        $(`<label></label>`).html(`Search Criteria <input type="text" placeholder="E.g. Pho, Steak, Chicken" class="search-input" />`),
        $(`<button type="button" class="success button search-modal-btn" data-search-type="make" style="color:white;float:right;"></button>`).html(`<i class="fa fa-search" aria-hidden="true"></i> Search`)
      );
    } else {
      searchModalContent.append(
        $(`<h4></h4>`).text("To Go"),
        $(`<label></label>`).html(`Search Criteria <input type="text" placeholder="E.g. Pho, Steak, Fried Chicken" class="search-input" />`),
        $(`<label></label>`).html(`Search Location <input type="text" placeholder="E.g. Orang County, Irvine, Texas" class="search-location" />`),
        $(`<button type="button" class="success button search-modal-btn" data-search-type="go" style="color:white;float:right;"></button>`).html(`<i class="fa fa-search" aria-hidden="true"></i> Search`)
      );
    }
  }

  searchModalContent.on("click", function (e) {
    e.preventDefault();
    let target = $(e.target)
    if (target.hasClass("search-modal-btn")) {

      const type = target.attr("data-search-type");
      if (type === "make") {
        let value = $(".search-input").val();
        if (value) {
          callRecipe(value)
        }
      } else {
        let value = $(".search-input").val();
        let location = $(".search-location").val();
        if (value && location) {
          yelpCaller(value, location)
        }
      }
    }
  });


});