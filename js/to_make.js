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
    let apiKey3 = "4a7265ba2bmshe954884435eef14p14dc57jsn70a654005e7a" // Alex's Key
    let apiKey4 = "9a93dadb97mshe001d742b476bfep136ad9jsna2e0130232fb" // Duyen's Key
    let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey1}&from=0&sizes=10&q=${searchVal}`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (res) {

      // Filter out inconsistencies from results, for sort feature
      let filteredResults = res.results.filter(function(result) {
        return result.user_ratings;
      });

      // Assign a value of 0, if user_rating.score is null, for sort feature
      for (let i = 0; i < filteredResults.length; i++) {
        if (filteredResults[i].user_ratings && filteredResults[i].user_ratings.score === null) {
          filteredResults[i].user_ratings.score = 0;
        }
      }

      // Div to append all the search results
      let recipeDiv = $(".result-display").css({ "text-align": "center" });
      
      // Add Dropdown menu to sort the search results
      let recipeForm = $(".dropdown-sort").css({ "text-align": "center" });
      let sortForm = $("<form>").text("Sort by: ");
      let sortSelect = $("<select>").addClass("sort-by").css("width", "220px");
      recipeForm.append(sortForm);
      sortForm.append(sortSelect);

      let sortDefault = $("<option>");
      let sortHighApprove = $("<option>").attr("value", "highest-approve").text("Highest Approval %");
      let sortLowApprove = $("<option>").attr("value", "lowest-approve").text("Lowest Approval %");
      let sortHighPositive = $("<option>").attr("value", "most-reviews").text("Most Reviews");
      let sortHighNegative = $("<option>").attr("value", "least-reviews").text("Least Reviews");
      sortSelect.append(sortDefault, sortHighApprove, sortLowApprove, sortHighPositive, sortHighNegative);

      // Gatekeeper to render if search results exist
      if (filteredResults.length > 0) {
        renderDataMake();

        // Function that re-populates search results upon change in Dropdown option
        sortSelect.change(function () {

          let dropDown = sortSelect.val();

          if (dropDown === "highest-approve") {
            recipeDiv.empty();
            filteredResults.sort(function (a, b) { return parseFloat(b.user_ratings.score) - parseFloat(a.user_ratings.score) });
            renderDataMake();
          }
          else if (dropDown === "lowest-approve") {
            recipeDiv.empty();
            filteredResults.sort(function (a, b) { return parseFloat(a.user_ratings.score) - parseFloat(b.user_ratings.score) });
            renderDataMake();
          }
          else if (dropDown === "most-reviews") {
            recipeDiv.empty();
            filteredResults.sort(function (a, b) { return parseFloat(b.user_ratings.count_positive + b.user_ratings.count_negative) - parseFloat(a.user_ratings.count_positive + a.user_ratings.count_negative) });
            renderDataMake();
          }
          else if (dropDown === "least-reviews") {
            recipeDiv.empty();
            filteredResults.sort(function (a, b) { return parseFloat(a.user_ratings.count_positive + a.user_ratings.count_negative) - parseFloat(b.user_ratings.count_positive + b.user_ratings.count_negative) });
            renderDataMake();
          }

        });

        // Fill Recipe Div section with search result cards
        function renderDataMake() {

          // For-loop to append data from each object in array
          for (let i = 0; i < filteredResults.length; i++) {

            // Variable for looping through filteredResults array
            let recipe = filteredResults[i];

            // Condition because API call is inconsistent
            if (recipe.instructions) {

              // Create card for each recipe
              let recipeCard = $("<div>").addClass("card").css({ "width": '60%', "display": "inline-block" });
              let recipeDivider = $("<div>").addClass("card-divider");
              let recipeSection = $("<div>").addClass("card-section");

              // Recipe Name
              let recipeName = $("<h5>").append($("<a>").addClass("recipe-name").attr("data-id", recipe.id).text(recipe.name));

              // Recipe image
              let recipeImage = $("<img>").attr("src", recipe.thumbnail_url).css({ "margin-top": "20px", "width": "300", "height": "200" });
              recipeCard.append(recipeImage);

              // User rating
              let recipeRating = $("<p>").html("<strong>User Ratings:</strong> " + recipe.user_ratings.count_positive + " positive, " + recipe.user_ratings.count_negative + " negative; " + (recipe.user_ratings.score * 100).toFixed(2) + "% approval");

              recipeDiv.append(recipeCard);
              recipeDivider.append(recipeName);
              recipeSection.append(recipeRating);

              recipeCard.append(recipeDivider, recipeImage, recipeSection);

              // Click function to open modal and append target data 
              $(".recipe-name").click(function (e) {

                e.preventDefault();
                let recipeID = $(this).attr("data-id");

                if (recipe.id == recipeID) {

                  resultModalContent.empty();

                  let recipeCard = $("<div>").addClass("card");
                  let recipeDivider = $("<div>").addClass("card-divider");
                  let recipeSection = $("<div>").addClass("card-section");

                  let recipeName = $("<h4>").addClass("recipe-name").attr("data-id", recipe.id).text(recipe.name);
                  let recipeImage = $("<img>").attr("src", recipe.thumbnail_url).css({ "margin-top": "20px", "width": "300", "height": "200" });
                  let recipeRating = $("<p>").html("<strong>User Ratings:</strong> " + recipe.user_ratings.count_positive + " positive, " + recipe.user_ratings.count_negative + " negative, " + (recipe.user_ratings.score * 100).toFixed(2) + "% approval");

                  resultModalContent.append(recipeCard);
                  recipeCard.append(recipeDivider, recipeImage, recipeSection);
                  recipeDivider.append(recipeName);
                  recipeSection.append(recipeRating);

                  // Append video link if it exists
                  if (recipe.original_video_url) {
                    let recipeVideo = $("<p>").html("<strong>Video:</strong> ").append($("<a>").attr({ "href": recipe.original_video_url, "target": "_blank" }).text(recipe.original_video_url));
                    recipeSection.append(recipeVideo);
                  }

                  // Recipe Ingredients
                  recipeSection.append($("<h4>").text("Ingredients:"));
                  let ingredientList = $("<ul>");
                  recipeSection.append(ingredientList);
                  for (let j = 0; j < recipe.sections.length; j++) {
                    for (let k = 0; k < recipe.sections[j].components.length; k++) {
                      ingredientList.append($("<li>").text(recipe.sections[j].components[k].raw_text));
                    }
                  }

                  // Recipe Instructions
                  recipeSection.append($("<h4>").text("Instructions:"));
                  for (let x = 0; x < recipe.instructions.length; x++) {
                    recipeSection.append($("<p>").html("<strong>" + recipe.instructions[x].position + "</strong>" + ". " + recipe.instructions[x].display_text));
                  }

                }

                modalResult.foundation('open');

              });

            }

          }

        }
      } 
      // Remove dropdown menu and display callout if no search results
      else {
        recipeForm.empty();
        resultDisplay.html(`<div class="callout alert" style="text-align:center;margin-top:10px;">
        <h5>No Results Found!</h5></div>`);
      }

      // Store search terms and queryURL into Local Storage
      storeSearches(searchVal, 'make', queryURL);

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
      // console.log(res)
      if (businesses.length > 0) {
        //Adding a dropdown to dropdown-sort
        let dropDown = $(".dropdown-sort").css({ "text-align": "center" });
        dropDown.html(`
          <form >Sort By:
          <select name="sort-to-go" class="sort-to-go" style="width:220px;">
            <option value="default" selected></option>
            <option value="high-rating">Highest Rating</option>
            <option value="low-rating">Lowest Rating</option>
            <option value="high-review">Highest Reviews</option>
            <option value="low-review">Lowest Reviews</option>
          </select>
          </form>
        `);

        for (business of businesses) {
          let address = business.location.display_address;
          // const { location: { display_address: { address } } } = business;
          // console.log(business)
          resultDisplay.append(
            $(`<div ></div>`).html(
              //Adding data id and data type for checking
              //Encasing the output to a card
              `<div class="card-divider" style="margin-bottom:5px;">
                <h5><a href="#" class="result-btn" data-type="to-go" data-id="${business.id}">${business.name}</a></h5>
              </div>
              <img src="${business.image_url}" alt="${business.name}" style="width:300px;height:200px"/>
              <div class="card-section">
              <p>${address[0]}, ${address[1]}</p>
              <p>${business.phone}</p>
              </div>
            `).addClass("card go-card").css({ "width": '60%', "display": "inline-block" }).attr({ "data-rating": business.rating, "data-review": business.review_count })
          ).css({ "text-align": "center" });
        }
        storeSearches([searchVal, location], 'go', queryUrl);

      } else {
        resultDisplay.html(`<div class="callout alert" style="text-align:center;margin-top:10px;">
                              <h5>No Results Found!</h5>
                            </div>`)
      }
    })
  }

  //Attached a listener to result-display class to check if were clicking the button to show modal and parse our data
  resultDisplay.on("click", ".result-btn", function (e) {
    e.preventDefault()
    let type = $(this).attr("data-type");
    let id = $(this).attr("data-id");
    if (type === 'to-go') {
      yelpResultCaller(id)
    }
  });

  //On change of the dropdown
  $(".dropdown-sort").on("change", ".sort-to-go", function (e) {
    let changeVal = $(this).val();
    console.log("changed")
    //Find all the div inside the result display
    let divCards = resultDisplay.find(".go-card");
    if (changeVal === "high-rating") {
      divCards.sort(function (a, b) {
        let cardARating = parseFloat($(a).attr("data-rating"));
        let cardBRating = parseFloat($(b).attr("data-rating"));
        return cardBRating - cardARating;
      });
      resultDisplay.html(divCards)
    } else if (changeVal === "low-rating") {
      divCards.sort(function (a, b) {
        let cardARating = parseFloat($(a).attr("data-rating"));
        let cardBRating = parseFloat($(b).attr("data-rating"));
        return cardARating - cardBRating;
      });
      resultDisplay.html(divCards)
    } else if (changeVal === "high-review") {
      divCards.sort(function (a, b) {
        let cardAReview = parseFloat($(a).attr("data-review"));
        let cardBReview = parseFloat($(b).attr("data-review"));
        return cardBReview - cardAReview;
      });
      resultDisplay.html(divCards)
    } else if (changeVal === "low-review") {
      divCards.sort(function (a, b) {
        let cardAReview = parseFloat($(a).attr("data-review"));
        let cardBReview = parseFloat($(b).attr("data-review"));
        return cardAReview - cardBReview;
      });
      resultDisplay.html(divCards)
    }
  });

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
      modalResult.foundation('open');
    })
  }

  function storeSearches(search, type, url) {
    // console.log(search[0] ? search[0] : search)
    let storedSearches = JSON.parse(localStorage.getItem("toMakeToGo"));
    const searchVal = Array.isArray(search) ? search[0] : search;
    const locationVal = Array.isArray(search) ? search[1] : '';
    const searchObjInit = {
      search: searchVal,
      location: locationVal,
      url: url,
      type: type,
    };
    // console.log(searchObjInit);
    if (storedSearches === null) {
      storedSearches = [];
      storedSearches.push(searchObjInit);
    } else {
      let searchObj = storedSearches.find(element => element.search === searchVal && element.type === type);
      // console.log(searchObj)
      if (!searchObj) {
        storedSearches.push(searchObjInit);
      }
    }
    localStorage.setItem("toMakeToGo", JSON.stringify(storedSearches));
  }

  // function isExisting(search) {
  //   return search.search === search && search.type === type
  // }

});