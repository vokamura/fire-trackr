$(document).ready(startApp);

function startApp(){
    // console.log("Start App");
    getDataFromInciwebServer();
    $(document).ajaxStart(function(){
        $("#wait").css("display", "block");
    });
    $(document).ajaxComplete(function(){
        $("#wait").css("display", "none");
    });
}

//CalFire: http://www.fire.ca.gov/rss/rss.xml

//Inciweb API
//https://inciweb.nwcg.gov/feeds/
function getDataFromInciwebServer() {   
    let inciwebURL = "https://inciweb.nwcg.gov/feeds/rss/incidents/";
    let backupURL = "http://www.vikkiokamura.com/firetrackr/backup.xml";
    let proxy = "https://cors.io/?";
    let getData = {
        url: proxy + inciwebURL,
        method: "GET",
        dataType: "xml",
        success: useXML,
        error: function(){
            console.log("Error: Inciweb is down");
            $.ajax({
                url: proxy + backupURL,
                method: "GET",
                dataType: "xml",
                success: useXML,
                async: true,
                error: function(){
                    console.log("Error: Offline response failed");
                }
            });
        }
    }
    $.ajax(getData);
}

let latArray = [];
let longArray = [];
let fireName = [];
let published = [];
let description = [];
let linkToFireInfo = [];

function useXML(response){

    let eachFireItem = $(response).find("item");
    let fireCount = eachFireItem.length;

    for (let item=0; item < eachFireItem.length; item++){

        latArray.push(response.getElementsByTagName("geo:lat")[item].textContent);
        longArray.push(response.getElementsByTagName("geo:long")[item].textContent);
        fireName.push(eachFireItem.find("title")[item].textContent);
        published.push(eachFireItem.find("published")[item].textContent);
        linkToFireInfo.push(eachFireItem.find("link")[item].textContent);

        let newName = fireName[item];
        let newNewName = newName.replace(/ /g,'');

        let fireTitle = $("<a>", {
            href: "#",
            text: eachFireItem.find("title")[item].textContent,
            onclick: `infoClicked(${latArray[item]}, ${longArray[item]}, "${fireName[item]}", "${linkToFireInfo[item]}")`,
            id: newNewName
        });

        let titleTo = $("<td>", {
        }).append(fireTitle);

        let firePublished = $("<td>", {
            text: eachFireItem.find("published")[item].textContent,
            id: "hidexs"
        });

        let descriptionLink = $("<a>", {
            href: "#",
            text: "Click for description",
            id: item,
        });

        let descriptionTo = $("<td>", {
        }).append(descriptionLink);

        $(descriptionLink).bind("click", openDescModal);

        let fireRow = $("<tr>", {
            id: `${newNewName}row`
        }).append(titleTo, firePublished, descriptionTo);

        $("tbody").append(fireRow);

        if(eachFireItem.find("description")[item]!== undefined){
            description.push(eachFireItem.find("description")[item].textContent);
        } else {
            description.push("No update description provided.  Please click on link to find out more.");
        }
    } 
    runMarkers(); 
    totalFires(fireCount);  
}

function totalFires(fires){
    $("#fireCount").append($("<h3>", {text: `Wildfires (wildland fires) currently tracked in the continental United States:  ${fires}`}));
}

function openDescModal(e){
    $("#descriptionShadow").css({"visibility": "visible"});
    $(".descriptionBody").addClass("descriptionAnimation");

    let name = $("<h1>", {
        text: fireName[e.target.id]
    });

    let lastPublished = $("<div>", {
        text: `Description below last published: ${published[e.target.id]}`
    })

    let fireDescription = $("<div>", {
        text: description[e.target.id]
    });
    
    let fireLink = $("<a>", {
        href: linkToFireInfo[e.target.id],
        text: `Find out more about the ${fireName[e.target.id]}`,
        target: "blank"
    });
    
    $(".descriptionBody").append("<p>Click anywhere to close</p>", name, "<br>", lastPublished, "<br>",  fireDescription, "<br>", fireLink);
}

function closeDescModal(){
    $("#descriptionShadow").css({"visibility": "hidden"});
    $(".descriptionBody").empty();
    $(".descriptionBody").removeClass("descriptionAnimation");
}

//Google Maps API
let map;
let mapWindow;

function getMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(36.778259, -119.417931),
        zoom: 5,
        streetViewControl: false,
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

    const fireMarker = new google.maps.Marker({
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      position: place,
    });

    const infoContent = `<a href="${link}" target="blank">${name}</a>`;

    google.maps.event.addListener(fireMarker, 'click', function() {
        mapWindow.setContent(infoContent);
        mapWindow.open(map, this);

        let newName = name.replace(/ /g,'');
        window.location.href = `#${newName}`

        //When fire icon is clicked, highlight row for a number of seconds in table
        document.getElementById(`${newName}row`).classList.add("rowColor");
        setTimeout(function(){
            document.getElementById(`${newName}row`).classList.remove("rowColor");
        }, 2000);
    }); 
}

function infoClicked(lat, long, name, link){
    const image = {
        url: "http://www.stickpng.com/assets/images/58469c62cef1014c0b5e47f6.png",
        scaledSize: new google.maps.Size(30, 30)
        };

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        icon: image,
        animation: google.maps.Animation.DROP,
        map: map
    
    });

    const infoContent = `<a href="${link}" target="blank">${name}</a>`;

    mapWindow.setContent(infoContent);
    mapWindow.open(map, marker);

}

