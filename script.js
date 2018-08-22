$(document).ready(startApp);

function startApp(){
    // console.log("Start App");
    getDataFromInciwebServer();
    // getDataFromTwitter();
}

//CalFire: http://www.fire.ca.gov/rss/rss.xml

//Inciweb API
//https://inciweb.nwcg.gov/feeds/

function getDataFromInciwebServer() {   
    let inciwebURL = "https://inciweb.nwcg.gov/feeds/rss/incidents/";
    let proxy = "https://cors.io/?";
    let getData = {
        url: proxy + inciwebURL,
        method: "GET",
        dataType: "xml",
        success: useXML,
        error: function(){
            console.log("Error");
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

    let eachFireItem = $(response).find("item");
    let fireCount = eachFireItem.length;

    for (let item=0; item < eachFireItem.length; item++){

        latArray.push(response.getElementsByTagName("geo:lat")[item].textContent);
        longArray.push(response.getElementsByTagName("geo:long")[item].textContent);
        fireName.push(eachFireItem.find("title")[item].textContent);
        linkToFireInfo.push(eachFireItem.find("link")[item].textContent);

        let fireTitle = $("<td>", {
            text: eachFireItem.find("title")[item].textContent,
            class: "col-2"
        });
        let firePublished = $("<td>", {
            text: eachFireItem.find("published")[item].textContent,
            class: "col-2"
        });

        if(eachFireItem.find("description")[item]!== undefined){
            var fireDescription = $("<td>", {
                text: eachFireItem.find("description")[item].textContent,
                class: "col-6"
            });
        } else {
            var fireDescription = $("<td>", {
                text: "No update description provided.  Please click on link to find out more.",
                class: "col-8"
            }); 
        }

        let fireLink = $("<a>", {
            href: eachFireItem.find("link")[item].textContent,
            text: `Find out more about the ${eachFireItem.find("title")[item].textContent}`,
            target: "blank"
        });

        let linkTo = $("<td>", {
            class: "col-2"
        }).append(fireLink);

        let fireRow = $("<tr>", {
            class: "row"
        }).append(fireTitle, firePublished, fireDescription, linkTo);

        $("tbody").append(fireRow);
    } 
    runMarkers(); 
    totalFires(fireCount);  
}

function totalFires(fires){
    $("#fireCount").append($("<div>", {text: `Wildfires currently in the U.S: ${fires}`}));
}

//Google Maps API
let map;
let mapWindow;

function getMap(coords) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(36.778259, -119.417931),
        zoom: 5
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

//Twitter API
//https://github.com/m-coding/twitter-application-only-auth
//https://developer.twitter.com/en/docs/basics/authentication/overview/application-only
// function getDataFromTwitter(){
//     let twitterURL = "https://api.twitter.com/1.1/search/tweets.json?";
//     let getData = {
//         url: twitterURL,
//         method: "GET",
//         dataType: "JSON",
//         success: displayTweets,
//         error: function(){
//             console.log("Error");
//         }
//     }
//     $.ajax(getData);
// }

// function displayTweets(){
//     console.log("It worked!");
// }


