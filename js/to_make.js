$(document).foundation();
$(document).ready(function () {
  // Took the Current Url
  let queryString = window.location.search;
  // Splitting the Url Parameters from the current URL
  let urlParams = new URLSearchParams(queryString);
  let modalResult = $("#result-modal")
  let type = urlParams.get('type');

  let resultDisplay = $(".result-display");
  let resultModalContent = $(".result-modal-content")

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

    }).then(function (res) {
      console.log(res);

      // create div for each recipe
      let recipeDiv = $("<div>");
      $(".result-display").append(recipeDiv);

      for (i = 0; i < res.results.length; i++) {

        // variable for response.results
        let recipe = res.results[i];

        if (recipe.instructions) {

          // create card for each recipe
          let recipeCard = $("<div>").addClass("card");
          recipeDiv.append(recipeCard);

          // name 
          let recipeName = $("<p>").text("Recipe Name: " + recipe.name);
          recipeCard.append(recipeName);

          // user rating
          let recipeRating = $("<p>").text("User Ratings: " + recipe.user_ratings.count_positive + " positive, " + recipe.user_ratings.count_negative + " negative, " + (recipe.user_ratings.score * 100).toFixed(2) + "% approval");
          recipeCard.append(recipeRating);

          // recipe image
          let recipeImage = $("<img>").attr("src", recipe.thumbnail_url).css({ "width": "300", "height": "200" });
          recipeCard.append(recipeImage);

          // ingredient
          for (j = 0; j < recipe.sections.length; j++) {
            for (k = 0; k < recipe.sections[j].components.length; k++) {
              recipeCard.append($("<li>").text(recipe.sections[j].components[k].raw_text));
            }
          }

          // instructions
          for (x = 0; x < recipe.instructions.length; x++) {
            recipeCard.append($("<p>").text(recipe.instructions[x].position + ". " + recipe.instructions[x].display_text));
          }

          // recipe video
          // let recipeVideo = $("<video>").attr("src", recipe.original_video_url).attr("width", 300).attr("height", 200);


        }

      }

    });

  }



  function yelpCaller(searchVal, location) {
    let queryUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchVal}&location=${location}&limit=20`;

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
              <p>${address[0]}, ${address[1]}</p>
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
      resultParser(id, type)
      modalResult.foundation('open');
    }
  });

  function resultParser(id, type) {
    if (type === "to-go") {
      yelpResultCaller(id)
    }
  }

  function yelpResultCaller(id) {
    let queryUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`;
    resultModalContent.empty()
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

      //Initializing Card 
      let card = $(`<div></div>`).addClass("card")
      let cardDivider = $(`<div></div>`).addClass("card-divider").html(`<h4>${res.name} ${res.price ? res.price : ""}</h4>`)
      let resImg = $(`<img src="${res.image_url}" alt="${res.name}"/>`).css({ "width": 300, "height": 200 })
      let cardSection = $(`<div></div>`).addClass("card-section")
      let phoneNum = $(`<p></p>`).html(`<strong>Phone Number</strong> : ${res.display_phone}`);
      let address = $(`<p></p>`).html(`<strong>Address</strong> : ${res.location.display_address[0]}, ${res.location.display_address[1]}`);
      let rating = $(`<p></p>`).html(`<strong>Rating</strong> : ${res.rating ? res.rating + " / 5" : "N/A"}`);
      //Check if transactions have property then map the array take the first letter (charAt(0)) make it to upper case and take the remaining characters and add it to the Uppercased character substring(1) then join all the strings
      let transaction = $(`<p></p>`).html(`<strong>Transaction</strong> : ${res.transactions.length > 0 ? res.transactions.map((t) => t.charAt(0).toUpperCase() + t.substring(1)).join(', ') : "N/A"}</p>`);
      //Implemented Google Maps to show the directions of the restaurant
      //Used iframe per google's requirement
      let map = $(`<iframe
                  width="500"
                  height="450"
                  frameborder="0" style="border:0"
                  src="https://www.google.com/maps/embed/v1/search?key=AIzaSyA-GRo-XmaBhR1SmutbREnSA6IlbJFJi0g&q=${res.name.trim().replace("&", "")}&center=${res.coordinates.latitude + "," + res.coordinates.longitude}&zoom=18" allowfullscreen>
                </iframe>`)
      cardSection.append(phoneNum, address, rating, transaction, map)
      card.append(cardDivider, resImg, cardSection)
      resultModalContent.append(card)
    })
  }





});