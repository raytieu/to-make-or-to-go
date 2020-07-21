$(document).ready(function () {
  const apiKey = 'EcekOi57siTKO6p6p9D5elbIoA0MqCpOTQU-E9D2UH6vuvZ3JAy8s9c4aDAhKxMQ9NieE0DP6oY7UPrBx-Xql4ISVlnBagKJHV_Swb7oxAqWvX6dR-vpm0FSmGMWX3Yx';

  function yelpCaller(search) {
    let searchVal = 'pho';
    let queryUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchVal}&`;

    navigator.geolocation.getCurrentPosition(function (position) {
      callYelp(`${queryUrl}latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
    },
      function (error) {
        // alert("Sorry, your browser does not support HTML5 geolocation.");
        callYelp(`${queryUrl}location=orange county`)
      });
  }



  let callYelp = (queryUrl) => {
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
  }

  yelpCaller();

});