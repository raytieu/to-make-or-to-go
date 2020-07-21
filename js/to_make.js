$(document).ready(function() {

  let recipeQuery;
  apiKey1 = "4f82145085msh96574383383d13cp17d4bcjsnfeec1f433131" // Jeorge's Key
  apiKey2 = "0239e03514msh2b775b47a0eb3cep1158c7jsn32e6781cfbcd" // Raymond's Key
  let queryURL = `https://tasty.p.rapidapi.com/recipes/list?rapidapi-key=${apiKey2}&from=0&sizes=20&q=${recipeQuery}`;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

  });

});