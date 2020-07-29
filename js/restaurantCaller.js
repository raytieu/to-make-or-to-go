//Initializing Foundation Framework
$(document).foundation();
$(document).ready(function () {

  let searchModalContent = $(".search-modal-content");
  let modal = $("#search-modal");
  //Attaching a click event to the buttons
  $(".to-make-btn").on("click", function (e) {
    e.preventDefault()
    parseSearchContent("to make");
  });

  $(".to-go-btn").on("click", function (e) {
    e.preventDefault()
    parseSearchContent("to go");
  });


  //Populate the modal content
  let parseSearchContent = (type) => {
    searchModalContent.empty()

    if (type === "to make") {
      let searches = retrieveSearches('make');
      // console.log(constructSearches(searches))
      searchModalContent.append(
        $(`<h4></h4>`).text("To Make"),
        $(`<label></label>`).html(`Search Criteria <input type="text" placeholder="E.g. Pho, Steak, Chicken" class="search-input" />`),
        $(`<label></label>`).html(`Search History`),
        $(`<ul class="dropdown menu searches" data-dropdown-menu></ul>`).html(constructSearches(searches)),
        $(`<button type="button" class="button clear-to-make" style="color:white;float:left;"></button>`).html(`<i class="fa fa-trash" aria-hidden="true"></i> Clear History`),
        $(`<button type="button" class="success button search-modal-btn" data-search-type="make" style="color:white;float:right;"></button>`).html(`<i class="fa fa-search" aria-hidden="true"></i> Search`)
      );
      new Foundation.DropdownMenu($('.searches'));
    } else {
      let searches = retrieveSearches('go');
      // console.log(constructSearches(searches))
      searchModalContent.append(
        $(`<h4></h4>`).text("To Go"),
        $(`<label></label>`).html(`Search Criteria <input type="text" placeholder="E.g. Pho, Steak, Fried Chicken" class="search-input" />`),
        $(`<label></label>`).html(`Search Location <input type="text" placeholder="E.g. Orange County, Irvine, Texas" class="search-location" />`),
        $(`<label></label>`).html(`Search History`),
        $(`<ul class="dropdown menu searches" data-dropdown-menu></ul>`).html(constructSearches(searches)),
        $(`<button type="button" class="button clear-to-go" style="color:white;float:left;"></button>`).html(`<i class="fa fa-trash" aria-hidden="true"></i> Clear History`),
        $(`<button type="button" class="success button search-modal-btn" data-search-type="go" style="color:white;float:right;"></button>`).html(`<i class="fa fa-search" aria-hidden="true"></i> Search`)
      );
      new Foundation.DropdownMenu($('.searches'));
    }
    modal.foundation('open');
  }


  function constructSearches(searches) {
    let li = '';
    if (searches) {
      searches.slice(0, 5).forEach(s => {
        if (s.type === 'make') {
          li += `<li class='li-search' data-type='make' data-search='${s.search}'><a href="#" style="font-size:18px;">${s.search}</a></li>`
        } else {
          li += `<li class='li-search' data-type='go' data-search='${s.search}' data-location='${s.location}'><a href="#" style="font-size:18px;">${s.search} - ${s.location}</a></li>`
        }
      });
      return li;
    } else {
      return '';
    }
  }


  //Attaching a click event to modal's search button
  // Event delegation using jQuery container.on(event,selector,function)
  searchModalContent.on("click", ".search-modal-btn", function (e) {
    e.preventDefault();
    const type = $(this).attr("data-search-type");
    if (type === "make") {
      let value = $(".search-input").val();
      if (value) {
        window.location.href = `result.html?type=make&search=${value}`;
      }
    } else {
      let value = $(".search-input").val();
      let location = $(".search-location").val();
      if (value && location) {
        window.location.href = `result.html?type=go&search=${value}&location=${location}`;
      }
    }
  });


  searchModalContent.on('click', '.li-search', function (e) {
    e.preventDefault();
    const type = $(this).attr('data-type');
    if (type === 'make') {
      let search = $(this).attr('data-search');
      window.location.href = `result.html?type=make&search=${search}`;
    } else {
      let search = $(this).attr('data-search');
      let location = $(this).attr('data-location');
      window.location.href = `result.html?type=go&search=${search}&location=${location}`;
    }
  })


  function retrieveSearches(type) {
    let storedSearches = JSON.parse(localStorage.getItem("toMakeToGo"));
    if (storedSearches !== null) {
      if (storedSearches.length > 0) {
        storedSearches.slice(0, 5)
        return storedSearches.reverse().filter(element => element.type === type)
      } else {
        return null;
      }
    }
  }


  searchModalContent.on('click', '.clear-to-make', function (e) {
    e.preventDefault();
    let storedSearches = JSON.parse(localStorage.getItem("toMakeToGo"));
    let clearToMake = storedSearches.filter(function (search) {
      return search.type === "go";
    });
    localStorage.setItem("toMakeToGo", JSON.stringify(clearToMake));
    searchModalContent.empty();
    parseSearchContent("to make");
  });


  searchModalContent.on('click', '.clear-to-go', function (e) {
    e.preventDefault();
    let storedSearches = JSON.parse(localStorage.getItem("toMakeToGo"));
    let clearToGo = storedSearches.filter(function (search) {
      return search.type === "make";
    });
    localStorage.setItem("toMakeToGo", JSON.stringify(clearToGo));
    searchModalContent.empty();
    parseSearchContent("to go");
  });

});