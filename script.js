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
let linkToFireInfo = [];

function useXML(response){
    console.log(response);

    var eachFireItem = $(response).find("item");

    for (var item=0; item < eachFireItem.length; item++){

        latArray.push(response.getElementsByTagName("geo:lat")[item].textContent);
        longArray.push(response.getElementsByTagName("geo:long")[item].textContent);
        fireName.push(eachFireItem.find("title")[item].textContent);
        linkToFireInfo.push(eachFireItem.find("link")[item].textContent);

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

        var fireLink = $("<a>", {
            href: eachFireItem.find("link")[item].textContent,
            text: `Find out more about ${eachFireItem.find("title")[item].textContent}`,
            target: "blank"
        });

        var linkTo = $("<td>", {
            class: "col-2"
        }).append(fireLink);

        var fireRow = $("<tr>", {
            class: "row"
        }).append(fireTitle, firePublished, fireDescription, linkTo);

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
        createMarker(marker, fireName[place], linkToFireInfo[place]);
    }
}
function createMarker(place, name, link) {

    const image = {
      url: "http://www.stickpng.com/assets/images/58469c62cef1014c0b5e47f6.png",
      scaledSize: new google.maps.Size(30, 30)
      };

    const infoContent = `<a href="${link}" target="blank">${name}</a>`

    const fireMarker = new google.maps.Marker({
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      position: place,
    });
      google.maps.event.addListener(fireMarker, 'click', function() {
      mapWindow.setContent(infoContent);
      mapWindow.open(map, this);
    });
}

