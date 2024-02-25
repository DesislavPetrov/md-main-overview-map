mapboxgl.accessToken =
  "pk.eyJ1IjoiY291bnRyeS1jaGFuZ2UiLCJhIjoiY2xtdDd5N2liMDJtaTJrbXNjdGVxZWhuYSJ9.2_l1izu_uVDTRVoc9kmY2Q";

var filterGroup = document.getElementById("ll");
// var filterGroup = document.getElementById('filter-group');

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/country-change/cloh5ebey001101qyh00a5103",
  center: [145.77391454377837, -34.97881526576915],
  zoom: 7,
  preserveDrawingBuffer: true,
  customAttribution:
    '<a target="_blank" href=http://www.geocadder.bg/en>GEOCADDDER</a>',
});

var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "bottom-left");

var bounds = new mapboxgl.LngLatBounds();

var markersAllIds = [];

var markersAllIdsLatsLongs = [];
var onlySelectedaccessibilityPoints = [];
var isinitialSelectedMarkerId = false;
var initialSelectedMarkerId = "";
var counter = 0;

var mainPointLatitude;
var mainPointLongitude;

/// loading POIs data from Google Sheets table///
$.getJSON(
  "https://sheets.googleapis.com/v4/spreadsheets/1czGrKm-cLMhyc0CMJAz-sS0v0qwdLdyXEboHVVkDw_M/values/OverviewMap!A2:H3000?majorDimension=ROWS&key=AIzaSyArKykrTA2zH924RmE2yORI4zT42lNr1HQ",
  function (response) {
    response.values.forEach(function (marker) {
      if (parseFloat(marker[2])) {
        var lgaName = marker[0];
        // var address = marker[1];
        var latitude = parseFloat(marker[1]);
        var longitude = parseFloat(marker[2]);
        var projectlink = marker[4];
        // var developerName = marker[5];
        // var startingFrom = marker[6];
        // var completion = marker[7];
        // var image = marker[8];
        // var icon = marker[9];

        // if (image.indexOf("open?id") === -1) {
        //   image = image.replace("file/d/", "uc?id=");
        //   image = image.replace("/view?usp=drive_link", "");
        // } else {
        //   image = image.replace("open?id=", "uc?id=");
        // }

        var markerId = "";

        bounds.extend([longitude, latitude]);
        mainPointLatitude = parseFloat(marker[1]);
        mainPointLongitude = parseFloat(marker[2]);

        // var popupContent =
        //   "<div class='popup-container'><a target='_blank' href='" +
        //   projectlink +
        //   "'>";

        // popupContent +=
        //   "<div class='popup-image'><img src = '" + image + "'></div>";

        // popupContent +=
        //   "<div class='popup-text'><div class='title'>" +
        //   lgaName +
        //   "</div>";

        // popupContent +=
        //   "<div class='sub-title'>" +
        //   developerName +
        //   "</div><hr class='text-subtext-divider'>";

        // popupContent +=
        //   "<div class='popup-sub-text'><div class='first-sub-text'><p class='attribute-name'>Starting from:</p><p class='attribute-value'>" +
        //   startingFrom +
        //   "</p></div><div class='second-sub-text'><p class='attribute-name'>Completion:</p><p class='attribute-value'>" +
        //   completion +
        //   "</p></div></div>";

        if (projectlink) {
        }

        // popupContent += "</div></a></div>";

        // popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
        //   popupContent
        // );

        // create a HTML element for each feature
        var el = document.createElement("div");
        el.className = "marker " + markerId;

        el.innerHTML =
          "<div class='marker-icon-text-container'><div class='marker-icon-image'><img src='https://uploads-ssl.webflow.com/650167c877dd38466d76ae92/65dbb1cc8344f32704559557_marker.svg'></div><div class='marker-icon-text'>" +
          lgaName +
          "</div></div>";

        map.on("zoom", () => {
          console.log(map.getZoom() )
          if (map.getZoom() < 7) {
            $("div.marker-icon-image > img").css("height", "30px");
            $("div.marker-icon-text").css("font-size", "9px");
          } else {
            $("div.marker-icon-image > img").css("height", "60px");
            $("div.marker-icon-text").css("font-size", "12px");
          }
        });

        el.id = markerId;

        var markerObj = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          // .setPopup(popup)
          .addTo(map);

        // el.style.backgroundImage = "url(tree.svg)";

        $(el).click(function () {
          // var currentZoom = map.getZoom();
          // map.flyTo({
          //   center: [longitude, latitude],
          //   zoom: currentZoom,
          //   offset: [0, -150],
          //   duration: 1000,
          // });
          window.open(projectlink);
        });

        if (marker[7] !== "main") {
          markersAllIds.push({
            markerId: markerId,
          });
        }

        markersAllIdsLatsLongs.push({
          markerId: markerId,
          latitude: latitude,
          longitude: longitude,
        });

        counter++;

        $(".popup-text").click(function (e) {
          e.preventDefault();
          console.log("desi");
          window.location = projectlink;
        });

        $(".popup-text").on("click", function () {
          console.log("desi");
          window.open(projectlink);
          e.preventDefault();
        });
      }
    });

    var objectsJson = markersAllIds.map((object) => JSON.stringify(object));
    var objectsJsonSet = new Set(objectsJson);
    var uniqueJsonArray = Array.from(objectsJsonSet);
    var uniqueObjectsByContent = uniqueJsonArray.map((string) =>
      JSON.parse(string)
    );

    // close all opened popups
    $(".marker").click(function () {
      $(".mapboxgl-popup").remove();
    });

    $(".mapboxgl-canvas").click(function () {
      $(".mapboxgl-popup").remove();
    });

    map.fitBounds(bounds, { padding: 80 });
  }
);
