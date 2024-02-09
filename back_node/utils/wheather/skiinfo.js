const maxPages = 15;
const data = {};
module.exports.data = data;

module.exports.gatherData = gatherData;
async function gatherData({ browser }) {
  const page = await browser.newPage();

  await page.goto("https://www.skiinfo.fr");

  await page.waitForSelector(".styles_grid__3RaKI");
  const mountains = await page.$$eval(".styles_grid__3RaKI > *", (elements) => {
    return elements.map((element) => {
      return {
        textContent: element.textContent,
        href: element.href,
      };
    });
  });
  mountains.pop();

  // GO to montain pages
  const stationsHref = [];
  for (const mountain of mountains) {
    await page.goto(mountain.href);

    const listStation = await page.$$eval("section > table > tbody > tr > td > a", (elements) => {
      return elements.map((element) => {
        return element.href;
      });
    });

    for (const station of listStation) {
      stationsHref.push(station);
    }
  }
  await page.close();

  // Go to station page
  let actualOpenedPages = 0;

  async function getStationInfos(stationHref) {
    if (!stationHref) return;
    const pageStation = await browser.newPage();
    try {
      await pageStation.goto(stationHref);
      try {
        //Get station Name
        await pageStation.waitForSelector(".h2.styles_h2__1fsE4");
        const stationData = await pageStation.$$eval(".h2.styles_h2__1fsE4", (elements) => {
          try {
            const result = elements[0].innerText.split(":");
            return { name: result[0], status: result[1].slice(1) };
          } catch (error) {
            console.log(error);
            return { name: "ERROR", status: "ERROR" };
          }
        });

        //Get station location
        const stationLocation = await pageStation.$$eval("span.styles_region__2x2a_", (elements) => {
          try {
            const result = elements[0].innerText;
            return result;
          } catch (error) {
            console.log(error);
            return "ERROR";
          }
        });
        stationData.locatioName = stationLocation;

        //Get station data
        try {
          await pageStation.waitForSelector("figcaption.styles_value__ocDGV");
          const stationWeatherData = await pageStation.$$eval("figcaption.styles_value__ocDGV", (elements) => {
            try {
              const regexSnow = /\b(\d+)cm\b/;
              const matchSnwoBot = elements[0].innerText.match(regexSnow);
              const snowBot = matchSnwoBot ? parseInt(matchSnwoBot[1]) : 0;
              const matchSnwoTop = elements[1].innerText.match(regexSnow);
              const snowTop = matchSnwoTop ? parseInt(matchSnwoTop[1]) : 0;
              const regexSkiLift = /(\d+) \/ (\d+)/;
              const matchesLift = elements[2].innerText.match(regexSkiLift);
              const skiLiftOpen = matchesLift[1] ? parseInt(matchesLift[1]) : 0;
              const skiLiftTotal = matchesLift[2] ? parseInt(matchesLift[2]) : 0;
              const regexOpenTrack = /(\d+)\/(\d+) km/;
              const matchesOpenTrack = elements[3].innerText.match(regexOpenTrack);
              const openTrack = matchesOpenTrack ? parseInt(matchesOpenTrack[1]) : 0;
              const trackTotal = matchesOpenTrack ? parseInt(matchesOpenTrack[2]) : 0;
              return { snowBot, snowTop, skiLiftOpen, skiLiftTotal, openTrack, trackTotal };
            } catch (error) {
              console.log(error);
              return {
                snowBot: 0,
                snowTop: 0,
                skiLiftOpen: 0,
                skiLiftTotal: 0,
                openTrack: 0,
                trackTotal: 0,
              };
            }
          });
          stationData.snowBot = stationWeatherData.snowBot;
          stationData.snowTop = stationWeatherData.snowTop;
          stationData.skiLiftOpen = stationWeatherData.skiLiftOpen;
          stationData.skiLiftTotal = stationWeatherData.skiLiftTotal;
          stationData.openTrack = stationWeatherData.openTrack;
          stationData.trackTotal = stationWeatherData.trackTotal;
        } catch {
          stationData.snowBot = 0;
          stationData.snowTop = 0;
          stationData.skiLiftOpen = 0;
          stationData.skiLiftTotal = 0;
          stationData.openTrack = 0;
          stationData.trackTotal = 0;
        }

        //Get temp
        const temp = await pageStation.$$eval(".h4.styles_h4__2Uc5w", (elements) => {
          try {
            const result = elements
              .filter((element) => element.innerText.split("/").length > 1)
              .map((element) => {
                const regexTemp = /(-?\d+) \/ (-?\d+) C°/;
                const matches = element.innerText.match(regexTemp);
                if (!matches || matches.length !== 3) return {};
                else return { max: parseInt(matches[1]), min: parseInt(matches[2]) };
              });
            return result[0];
          } catch (error) {
            console.log(error);
            return { max: 0, min: 0 };
          }
        });
        stationData.max = temp.max;
        stationData.min = temp.min;

        //Get tracks
        const tracks = await pageStation.$$eval("div.styles_box__3XF8j>div>div.styles_value__fB0LV", (elements) => {
          if (elements.length < 4) return { openTrack: 0, totalTrack: 0 };
          try {
            const regexTrack = /(\d+)\/(\d+)/;
            const matchesGreen = elements[0].innerText.match(regexTrack);
            const matchesBlue = elements[1].innerText.match(regexTrack);
            const matchesRed = elements[2].innerText.match(regexTrack);
            const matchesBlack = elements[3].innerText.match(regexTrack);

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

            return { openTrack, totalTrack };
          } catch (error) {
            console.log(error);
            return { openTrack: 0, totalTrack: 0 };
          }
        });
        stationData.openTrack = tracks.openTrack;
        stationData.totalTrack = tracks.totalTrack;

        await pageStation.close();
        data[stationData.name.toLowerCase()] = stationData;
        actualOpenedPages--;
      } catch (error) {
        await pageStation.evaluate((error) => {
          console.log(error);
          return;
        }, error);
        actualOpenedPages--;
      }
    } catch {
      await pageStation.close();
    }
  }

  while (stationsHref.length !== 0) {
    if (stationsHref.length !== 0 && actualOpenedPages < maxPages) {
      actualOpenedPages++;
      const stationHref = stationsHref.pop();
      try {
        getStationInfos(stationHref);
      } catch (error) {
        //console.log(error);
        console.log("\x1b[33m" + stationHref + "\x1b[0m");
        actualOpenedPages--;
      }
    }
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }

  while (actualOpenedPages !== 0) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }
  console.log(data);

  return;
}
