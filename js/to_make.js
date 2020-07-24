$(document).foundation();
$(document).ready(function () {
  // Took the Current Url
  let queryString = window.location.search;
  // Splitting the Url Parameters from the current URL
  let urlParams = new URLSearchParams(queryString);
  let modalResult = $("#result-modal")
  let type = urlParams.get('type');
  let resultDisplay = $(".result-display");
  if (type === "make") {
    let search = urlParams.get('search')
    callRecipe(search)
  } else {
    let search = urlParams.get('search')
    let location = urlParams.get('location')
    yelpCaller(search, location)
  }

  function callRecipe(searchVal) {

    let apiKey1 = "4f82145085msh96574383383d13cp17d4bcjsnfeec1f433131" // Jeorge's Key
    let apiKey2 = "0239e03514msh2b775b47a0eb3cep1158c7jsn32e6781cfbcd" // Raymond's Key
    let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey2}&from=0&sizes=10&q=${searchVal}`;
    console.log(queryURL)
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      for (i = 0; i < response.results.length; i++) {

        // variable for response.results
        let recipe = response.results[i];

        // create div for each recipe
        let recipeDiv = $("<div>");
        $(".result-display").append(recipeDiv);

        // name 
        let recipeName = $("<p>").text("Recipe Name: " + recipe.name);
        recipeDiv.append(recipeName);

        // recipe image
        let recipeImage = $("<img>").attr("src", recipe.thumbnail_url).attr("width", 300).attr("height", 200);
        recipeDiv.append(recipeImage);

        // ingredient


        // instructions
        for (j = 0; j < recipe.instructions.length; j++) {
          recipeDiv.append($("<p>").text(recipe.instructions[j].position + ". " + recipe.instructions[j].display_text));
        }

        // recipe video
        let recipeVideo = $("<video>").attr("src", recipe.original_video_url).attr("width", 300).attr("height", 200);

        // user rating
        let recipeRating = $("<p>").text("User Ratings: " + recipe.user_ratings.count_positive + " positive, " + recipe.user_ratings.count_negative + " negative, " + (recipe.user_ratings.score * 100).toFixed(2) + "% approval");
        recipeDiv.append(recipeRating);




      }

    });
  }

  function yelpCaller(searchVal, location) {
    let queryUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchVal}&location=${location}&limit=10`;

    const apiKey = 'EcekOi57siTKO6p6p9D5elbIoA0MqCpOTQU-E9D2UH6vuvZ3JAy8s9c4aDAhKxMQ9NieE0DP6oY7UPrBx-Xql4ISVlnBagKJHV_Swb7oxAqWvX6dR-vpm0FSmGMWX3Yx';
    // console.log(queryUrl)
    $.ajax({
      url: queryUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      dataType: 'json'
    }).then(function (res) {
      let businesses = res.businesses;
      if (businesses.length > 0) {
        for (business of businesses) {
          let address = business.location.display_address;
          resultDisplay.append(
            $(`<div></div>`).html(
              //Adding data id and data type for checking
              `<h5><a href="#" class="result-btn" data-type="to-go" data-id="${business.id}">${business.name}</a> ${business.price ? business.price : ""}</h5>
              <p>${address[0]} ${address[1]}</p>
              <p>${business.phone}</p>
              <img src="${business.image_url}" alt="${business.name}" style="width:300px;height:200px"/>
            `)
          );
        }
      } else {

      }
    })
  }

  //Attached a listener to result-display class to check if were clicking the button to show modal and parse our data
  resultDisplay.on("click", function (e) {
    e.preventDefault()
    let target = $(e.target)
    //Check if button has result-btn class
    if (target.hasClass("result-btn")) {
      let type = target.attr("data-type");
      let id = target.attr("data-id");
      console.log(`${type} - ${id}`)
      modalResult.foundation('open');
    }
  });

  function resultParser(type) {
    if (type === "to-go") {

    }
  }





});