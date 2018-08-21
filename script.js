$(document).ready(startApp);

function startApp(){
    console.log("Start App");
    // getMap();
    getDataFromServer();
}

function getDataFromServer() {   
    var myURL = "https://inciweb.nwcg.gov/feeds/rss/incidents/";
    var proxy = "https://cors.io/?";
    var getData = {
        url: proxy + myURL,
        method: "GET",
        dataType: "xml",
        success: useXML,
        error: function(xhr, status){
            console.log("Error", xhr, status);
        }
    }
    $.ajax(getData);
}

var latArray = [];
var longArray = [];

function useXML(response){
    console.log(response);

    var eachFireItem = $(response).find("item");

    // var prefix = "geo:";
    // var fireLat = eachFireItem.getElementsByTagName(prefix + "lat");
    // console.log(fireLat);

    for (var item=0; item < eachFireItem.length; item++){

        var fireTitle = $("<td>", {
            text: eachFireItem.find("title")[item].textContent,
            class: "col-1"
        });
        var firePublished = $("<td>", {
            text: eachFireItem.find("published")[item].textContent,
            class: "col-1"
        });
        var fireDescription = $("<td>", {
            text: eachFireItem.find("description")[item].textContent,
            class: "col-8"
        });

        var fireLink = $("<td>", {
            text: eachFireItem.find("link")[item].textContent,
            class: "col-2"
        });

        var fireRow = $("<tr>", {
            class: "row"
        }).append(fireTitle, firePublished, fireDescription, fireLink);

        $("table").append(fireRow);

        // var fireLat = eachFireItem.find("geo:lat")[i].textContent;
        // console.log(fireLat);
        // latArray.push(fireLat);
        // var fireLong = eachFireItem.find("geo:long")[i].textContent;
        // longArray.push(fireLong);
    }    
}

let map;
let mapWindow;

// function createMapElements() {
    // const zipCodeLabel = $("<label>", {
    //     class: "zipLayout",
    //     text: "Please enter a 5 digit zip code: "
    // });
    // const zipCodeContainer = $("<div>", {
    //     class: "zipContainer"
    // });
    // const zipCodeInput = $("<input>", {
    //     id: "zipcode",
    //     type: "text",
    //     maxLength: "5",
    //     placeholder: "Enter a zip code",
    //     class: "zipInput"
    // });
    // const submitButton = $("<div>", {
    //     id: "submit",
    //     text: "Submit",
    //     class: "zipInput"
    // });
    // const restartButton = $("<div>", {
    //     class: "restartButton",
    //     text: "",
    //     on: {
    //         click: startOver
    //     }
    // });
    // $("#map").css("height", "50vh");
    // $(restartButton).css("display", "block").css("margin", "auto");
    // $(zipCodeLabel).append(zipCodeInput);
    // $(zipCodeContainer).append(zipCodeInput, submitButton)
//     $(".selectQ").prepend(zipCodeContainer);
//     $(".mapLayout").append(restartButton);
//     $("#submit").on("click", onlyNumbers);
// }

// function onlyNumbers() {
//       const convertZip = $("#zipcode").val();
//       if (isNaN(convertZip) || convertZip.length !==5) {
//             alert("Please enter 5 numbers");
//             return;
//       } else {
//             getZipCodeLatLon();
//       }
// }

// function getZipCodeLatLon() {
//       const zipCode = $("#zipcode").val();
//       const apiKey = "AIzaSyA1IdZ7v8vp2cRJO5et2ynz2tEcllfxPtE";
//       const settings = {
//             url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`,
//             method: "GET",
//             dataType: "JSON",
//             success: function(response) {
//                   const mapCoordinates = response.results[0].geometry.location;
//                   results = getMap(mapCoordinates);
//             },
//             failure: function(error) {
//                   console.log("error");
//             }
//       }
//       $.ajax(settings);
// }

function getMap(coords) {
    $("#map").css("height", "50vh");
    $("#map").css("width", "30vw");
    let currentLocation = coords ? coords : {lat: 36.778259, lng: -119.417931};

    map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 6
    });
    
    mapWindow = new google.maps.InfoWindow();
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: currentLocation,
        radius: 1000000,
        type: ["bakery"],
        openNow: true,
        keyword: "bakery"
    }, mapCallback);
}

function mapCallback(mapResults, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let place = 0; place < mapResults.length; place++) {
            createMarker(mapResults[place]);
        }
    }
}

function createMarker(place) {
    // const placeLoc = place.geometry.location;

    const image = {
      url: "http://www.stickpng.com/assets/images/58469c62cef1014c0b5e47f6.png",
      scaledSize: new google.maps.Size(30, 30)
      };

    const fireMarker = new google.maps.Marker({
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });
      google.maps.event.addListener(fireMarker, 'click', function() {
      mapWindow.setContent(place.name);
      mapWindow.open(map, this);
    });
}

