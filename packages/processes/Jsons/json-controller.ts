import axios, { AxiosResponse } from "axios";
import Store from "electron-store";
import fs from "fs";
import { DataJson, SetJson, SetJsonObject } from "packages/types";

try {
  var setJson: SetJson = JSON.parse(
    fs.readFileSync("setJson.json", "utf8")
  ) as SetJson;
} catch {
  var setJson: SetJson = [] as SetJson;
}

try {
  var setJsonObject: SetJsonObject = JSON.parse(
    fs.readFileSync("setJsonObject.json", "utf8")
  ) as SetJsonObject;
} catch {
  var setJsonObject: SetJsonObject = {} as SetJsonObject;
}

try {
  var dataJson: DataJson = JSON.parse(
    fs.readFileSync("data.json", "utf8")
  ) as DataJson;
} catch {
  var dataJson: DataJson = {} as DataJson;
}

function init() {
  axios
    .get("https://lor.gg/storage/json/en_us/setJson.json")
    .then((response: AxiosResponse<SetJson>) => {
      let setJsonObjectTemp: SetJsonObject = {};
      for (let card of response.data) {
        setJsonObjectTemp[card.cardCode] = card;
      }

      fs.writeFileSync(
        "setJson.json",
        JSON.stringify(response.data, null, 2),
        "utf8"
      );
      fs.writeFileSync(
        "setJsonObject.json",
        JSON.stringify(setJsonObjectTemp, null, 2),
        "utf8"
      );

      setJson = response.data;
      setJsonObject = setJsonObjectTemp;
    });

  axios
    .get("https://lor.gg/storage/json/en_us/data.json")
    .then((response: AxiosResponse<DataJson>) => {
      fs.writeFileSync(
        "data.json",
        JSON.stringify(response.data, null, 2),
        "utf8"
      );

      dataJson = response.data;
    });
}

init();

export { setJson, setJsonObject, dataJson };
