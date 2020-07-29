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
    let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey3}&from=0&sizes=10&q=${searchVal}`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (res) {

      // Filter out inconsistencies from results, for sort feature
      let filteredResults = res.results.filter(function (result) {
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
                  recipeSection.append($("<h5>").html("<strong>Ingredients:</strong>"));
                  let ingredientList = $("<ul>");
                  let appendIngredients = "";
                  recipeSection.append(ingredientList);
                  for (let j = 0; j < recipe.sections.length; j++) {
                    for (let k = 0; k < recipe.sections[j].components.length; k++) {
                      ingredientList.append($("<li>").text(recipe.sections[j].components[k].raw_text));
                      appendIngredients += `<tr><td>${recipe.sections[j].components[k].raw_text}</td></tr>`
                    }
                  }

                  // Recipe Instructions
                  recipeSection.append($("<h5>").html("<strong>Instructions:</strong>"));
                  let appendInstructions = "";
                  for (let x = 0; x < recipe.instructions.length; x++) {
                    recipeSection.append($("<p>").html("<strong>" + recipe.instructions[x].position + "</strong>" + ". " + recipe.instructions[x].display_text));
                    appendInstructions += `<tr><td><strong>${recipe.instructions[x].position}</strong>. ${recipe.instructions[x].display_text}</td></tr>`
                  }
                  recipeSection.append(`<div class="error-call"></div>`)
                  recipeSection.append($(`<div></div>`).addClass("grid-x").css({ "margin-top": "10px" })
                    .append($(`<input type="email" class="cell email-input" placeholder="E.g. johndoe@isp.com" />`),
                      $(`<button>Send to Email&nbsp; <i class="fa fa-paper-plane" aria-hidden="true"></i></button>`).addClass("cell primary button send-email")
                        .attr({ 'data-name': recipe.name, "data-ingredients": appendIngredients, "data-instructions": appendInstructions, "data-type": "make", "data-src": recipe.thumbnail_url })));
                  // console.log(recipe)
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
        resultDisplay.html(`< div class="callout alert" style = "text-align:center;margin-top:10px;" >
                    <h5>No Results Found!</h5></div > `);
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
            <option value="high-review">Most Reviews</option>
            <option value="low-review">Least Reviews</option>
          </select>
          </form>
        `);

        for (business of businesses) {
          let address = business.location.display_address;
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
    // console.log("changed")
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
    $.ajax({
      url: queryUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      dataType: 'json'
    }).then(function (res) {
      resultModalContent.empty();
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
      let sendEInput = $(`<div class="error-call"></div> <div className="grid-x" style="margin-top:10px;"> 
                          <input type="email" class="cell email-input" placeholder="E.g. johndoe@isp.com"> 
                          <button class="cell primary button send-email" data-name="${res.name}" data-type="go" data-address="${res.location.display_address[0]}, ${res.location.display_address[1]}" data-url="${res.url}" data-src="${res.image_url}">Send to Email&nbsp; <i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                          </div>`);
      cardSection.append(phoneNum, address, rating, transaction, map, sendEInput)
      card.append(cardDivider, resImg, cardSection)
      resultModalContent.append(card);
      modalResult.foundation('open');
    })
  }

  function storeSearches(search, type, url) {
    let storedSearches = JSON.parse(localStorage.getItem("toMakeToGo"));
    const searchVal = Array.isArray(search) ? search[0] : search;
    const locationVal = Array.isArray(search) ? search[1] : '';
    const searchObjInit = {
      search: searchVal.toLowerCase(),
      location: locationVal.toLowerCase(),
      url: url,
      type: type,
    };
    if (storedSearches === null) {
      storedSearches = [];
      storedSearches.push(searchObjInit);
    } else {
      let searchObj = storedSearches.find(element => element.search === searchVal.toLowerCase() && element.type === type && element.location === locationVal.toLowerCase());
      // console.log(searchObj)
      if (!searchObj) {
        storedSearches.push(searchObjInit);
      }
    }
    localStorage.setItem("toMakeToGo", JSON.stringify(storedSearches));
  }

  resultModalContent.on("click", ".send-email", sendEmail);

  //Source https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function sendEmail() {
    const emailAdd = $(".email-input").val();
    if (emailAdd && validateEmail(emailAdd)) {
      let body = parseEmailContent(this)
      // console.log(body)
      Email.send({
        SecureToken: "672072a2-d24f-4024-bc1e-c170cf07a781",
        To: emailAdd,
        From: "tomake.togo@gmail.com",
        Subject: "Thank you for your using To Make or To Go!",
        Body: body
      }).then(
        $(".error-call").html(`<div class="callout success" style="text-align:center;margin-top:10px;">
                              <h5>Email Sent!</h5>
                            </div>`)
      );
    } else {
      $(".error-call").html(`<div class="callout alert" style="text-align:center;margin-top:10px;">
                              <h5>Invalid Email!</h5>
                            </div>`);
    }
  }

  function parseEmailContent(container) {
    let that = $(container);
    if (that.data('type') === "make") {

      // console.log(ingredients)
      return `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta http-equiv="X-UA-Compatible" content="ie=edge">
                  <title>To Make or To Go</title>
                </head>
                <body style="margin: 0; padding: 0;">
                  <table align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                  <tr>
                  <td bgcolor="#52bf6c" style="padding: 40px 30px 40px 30px;"></td>
                </tr>
                <tr>
                  <td align="center">
                  <img width="300px" height="200px" src="${that.data("src")}" alt="To Make or To Go">
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                    <p><strong>Recipe Name : </strong>&nbsp; ${that.data("name")}</p>
                    <p><strong>Ingredients : </strong><table style="margin: 10px 40px;">${that.data("ingredients")}</table></p>
                    <p><strong>Instructions : </strong><table style="margin: 10px 40px;">${that.data("instructions")}</table></p>
                  </td>
                </tr>

                <tr>
                  <td bgcolor="#52bf6c" style="padding: 40px 10px 40px 10px;" align="center">© Created by Jeorge Donato, Duyen Pham, Raymond Tieu, and Alex Tran © 2020</td>
                </tr>
                </table >
                </body >
                </html > `
    } else {
      return `<!DOCTYPE html >
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                          <title>To Make or To Go</title>
                  </head>
                  <body style="margin: 0; padding: 0;">
                      <table align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                        <tr>
                          <td bgcolor="#52bf6c" style="padding: 40px 30px 40px 30px;"></td>
                        </tr>
                        <tr>
                          <td align="center">
                            <img width="300px" height="200px" src="${that.data("src")}" alt="To Make or To Go">
                        </td>
                        </tr>
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <p><strong>Restaurant Name : </strong>&nbsp; ${that.data('name')}</p>
                            <p><strong>Address : </strong>&nbsp; ${that.data('address')}</p>
                            <p><strong>Yelp URL : </strong>&nbsp; <a href="${that.data('url')}" target="_blank">${that.data('name')}</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td bgcolor="#52bf6c" style="padding: 40px 10px 40px 10px;" align="center">© Created by Jeorge Donato, Duyen Pham, Raymond Tieu, and Alex Tran © 2020</td>
                        </tr>
                      </table>
                    </body>
                  </html>`
    }
  }
});

