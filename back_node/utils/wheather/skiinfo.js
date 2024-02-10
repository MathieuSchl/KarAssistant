const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const maxPages = 15;
const data = {};
const url = "https://www.skiinfo.fr";
const regexSnow = /\b(\d+)cm\b/;
const regexSkiLift = /(\d+) \/ (\d+)/;
const regexOpenTrack = /(\d+)\/(\d+) km/;
const regexTemp = /(-?\d+) \/ (-?\d+) C°/;
const regexTrack = /(\d+)\/(\d+)/;
module.exports.data = data;

async function getPage(href) {
  return await new Promise((resolve, reject) => {
    axios
      .get(href)
      .then(function (response) {
        fs.writeFileSync("./test.html", response.data);
        const dom = new JSDOM(response.data);
        resolve(dom.window.document);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        const dom = new JSDOM("<html><head>error</head></html>");
        resolve(dom);
      });
  });
}

module.exports.gatherData = gatherData;
async function gatherData() {
  //Get maintain list
  const documentHomePage = await getPage(url);

  const mountainsHtml = documentHomePage.querySelector(".styles_grid__3RaKI").children;
  const mountains = [];
  for (let index = 0; index < mountainsHtml.length - 1; index++) {
    const element = mountainsHtml[index];
    mountains.push({
      textContent: element.textContent,
      href: element.href,
    });
  }

  // Get Stations href
  const stationsHref = [];
  for (let index = 0; index < mountains.length; index++) {
    const documentMontain = await getPage(url + mountains[index].href);
    const elementStation = documentMontain.querySelectorAll("section > table > tbody > tr > td > a");
    for (let index = 0; index < elementStation.length; index++) {
      const element = elementStation[index];
      stationsHref.push(element.href);
    }
  }

  // Go to data from station
  for (let index = 0; index < stationsHref.length; index++) {
    const element = stationsHref[index];
    const documentStation = await getPage(url + stationsHref[index]);

    //Get station name and status
    const elementName = documentStation.querySelectorAll(".h2.styles_h2__1fsE4");
    const resultStationName = elementName[0].textContent.split(":");
    const stationData = { name: resultStationName[0], status: resultStationName[1].slice(1) };

    //Get station location
    const elementLocation = documentStation.querySelectorAll("span.styles_region__2x2a_");
    stationData.locatioName = elementLocation[0].textContent;

    //Get station data
    try {
      const elementData = documentStation.querySelectorAll("figcaption.styles_value__ocDGV");
      const matchSnwoBot = elementData[0].textContent.match(regexSnow);
      stationData.snowBot = matchSnwoBot ? parseInt(matchSnwoBot[1]) : 0;
      const matchSnwoTop = elementData[1].textContent.match(regexSnow);
      stationData.snowTop = matchSnwoTop ? parseInt(matchSnwoTop[1]) : 0;
      const matchesLift = elementData[2].textContent.match(regexSkiLift);
      stationData.skiLiftOpen = matchesLift[1] ? parseInt(matchesLift[1]) : 0;
      stationData.skiLiftTotal = matchesLift[2] ? parseInt(matchesLift[2]) : 0;
      const matchesOpenTrack = elementData[3].textContent.match(regexOpenTrack);
      stationData.openTrack = matchesOpenTrack ? parseInt(matchesOpenTrack[1]) : 0;
      stationData.trackTotal = matchesOpenTrack ? parseInt(matchesOpenTrack[2]) : 0;
    } catch (error) {
      stationData.snowBot = 0;
      stationData.snowTop = 0;
      stationData.skiLiftOpen = 0;
      stationData.skiLiftTotal = 0;
      stationData.openTrack = 0;
      stationData.trackTotal = 0;
    }

    //Get station temperatures
    try {
      const elementData = documentStation.querySelectorAll(".h4.styles_h4__2Uc5w");
      const matches = elementData[1].textContent.match(regexTemp);
      if (!matches || matches.length !== 3) {
        stationData.max = 0;
        stationData.min = 0;
      } else {
        stationData.max = parseInt(matches[1]);
        stationData.min = parseInt(matches[2]);
      }
    } catch (error) {
      stationData.max = 0;
      stationData.min = 0;
    }

    //Get station tracks
    try {
      const elementData = documentStation.querySelectorAll("div.styles_box__3XF8j>div>div.styles_value__fB0LV");
      const matchesGreen = elementData[0].textContent.match(regexTrack);
      const matchesBlue = elementData[1].textContent.match(regexTrack);
      const matchesRed = elementData[2].textContent.match(regexTrack);
      const matchesBlack = elementData[3].textContent.match(regexTrack);

      let openTrack = 0;
      let totalTrack = 0;
      if (matchesGreen) {
        openTrack += parseInt(matchesGreen[1]);
        totalTrack += parseInt(matchesGreen[2]);
      }
      if (matchesBlue) {
        openTrack += parseInt(matchesBlue[1]);
        totalTrack += parseInt(matchesBlue[2]);
      }
      if (matchesRed) {
        openTrack += parseInt(matchesRed[1]);
        totalTrack += parseInt(matchesRed[2]);
      }
      if (matchesBlack) {
        openTrack += parseInt(matchesBlack[1]);
        totalTrack += parseInt(matchesBlack[2]);
      }

      stationData.openTrack = openTrack;
      stationData.totalTrack = totalTrack;
    } catch (error) {
      stationData.openTrack = 0;
      stationData.totalTrack = 0;
    }

    data[stationData.name.toLowerCase()] = stationData;
  }
  return;
}
