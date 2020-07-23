$(document).foundation();
$(document).ready(function () {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
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
    // let recipeQuery;
    let apiKey1 = "4f82145085msh96574383383d13cp17d4bcjsnfeec1f433131" // Jeorge's Key
    let apiKey2 = "0239e03514msh2b775b47a0eb3cep1158c7jsn32e6781cfbcd" // Raymond's Key
    let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey2}&from=0&sizes=10&q=${searchVal}`;
    console.log(queryURL)
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (res) {
      console.log(response);
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
              `<h5><a href="" data-id="${business.id}">${business.name}</a> ${business.price ? business.price : ""}</h5>
              <p>${address[0]} ${address[1]}</p>
              <p>${business.phone}</p>
              <img src="${business.image_url}" alt="${business.name}" width="300" height="200"/>
            `)
          );

        }
      } else {

      }
    })
  }



});