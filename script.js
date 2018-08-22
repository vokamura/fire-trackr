$(document).ready(startApp);

function startApp(){
    console.log("Start App");
    // getMap();
    getDataFromServer();
}

function getDataFromServer() {   
    //https://inciweb.nwcg.gov/feeds/
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

let latArray = [];
let longArray = [];
let fireName = [];

function useXML(response){
    console.log(response);

    var eachFireItem = $(response).find("item");

    for (var item=0; item < eachFireItem.length; item++){

        var fireLat = response.getElementsByTagName("geo:lat")[item].textContent;
        latArray.push(fireLat);

        var fireLong = response.getElementsByTagName("geo:long")[item].textContent;
        longArray.push(fireLong);

        var firePlace = eachFireItem.find("title")[item].textContent;
        fireName.push(firePlace);

        var fireTitle = $("<td>", {
            text: eachFireItem.find("title")[item].textContent,
            class: "col-1"
        });
        var firePublished = $("<td>", {
            text: eachFireItem.find("published")[item].textContent,
            class: "col-1"
        });
        var fireDescription = $("<td>", {
            // text: eachFireItem.find("description")[item].textContent,
            text: "hello",
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
    } 
    runMarkers();   
}

let map;
let mapWindow;

function getMap(coords) {
    $("#map").css("height", "50vh");
    $("#map").css("max-width", "50vw");
    $("#map").css("min-width", "50vw");

    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(36.778259, -119.417931),
        zoom: 6
    });
    
    mapWindow = new google.maps.InfoWindow();    
}

function runMarkers(){
    for (let place = 0; place < latArray.length; place++) {
        let marker = new google.maps.LatLng(latArray[place], longArray[place]);
        createMarker(marker, fireName[place]);
    }
}
function createMarker(place, name) {

    const image = {
      url: "http://www.stickpng.com/assets/images/58469c62cef1014c0b5e47f6.png",
      scaledSize: new google.maps.Size(30, 30)
      };

    const fireMarker = new google.maps.Marker({
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      position: place
    });
      google.maps.event.addListener(fireMarker, 'click', function() {
      mapWindow.setContent(name);
      mapWindow.open(map, this);
    });
}

