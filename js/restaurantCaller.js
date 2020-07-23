//Initializing Foundation Framework
$(document).foundation();
$(document).ready(function () {

  let searchModalContent = $(".search-modal-content");
  let modal = $("#search-modal");

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
  console.log(window.location.pathname)
  searchModalContent.on("click", function (e) {
    e.preventDefault();
    let target = $(e.target)
    if (target.hasClass("search-modal-btn")) {
      const type = target.attr("data-search-type");
      if (type === "make") {
        let value = $(".search-input").val();
        if (value) {
          window.location = `${window.location.pathname.split('/').splice(1, 4).join('/')}/result.html?type=make&search=${value}`;
        }
      } else {
        let value = $(".search-input").val();
        let location = $(".search-location").val();
        if (value && location) {
          window.location = `${window.location.pathname.split('/').splice(1, 4).join('/')}/result.html?type=go&search=${value}&location=${location}`;
        }
      }
    }
  });
});