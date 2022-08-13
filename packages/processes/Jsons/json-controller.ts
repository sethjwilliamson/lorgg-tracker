import axios, { AxiosResponse } from "axios";
import Store from "electron-store";
import fs from "fs";

export type SetJsonCard = {
  associatedCardRefs: Array<string>;
  regionRefs: Array<string>;
  attack: number;
  cost: number;
  health: number;
  description: string;
  descriptionRaw: string;
  levelupDescription: string;
  levelupDescriptionRaw: string;
  flavorText: string;
  artistName: string;
  name: string;
  cardCode: string;
  keywords: Array<string>;
  keywordRefs: Array<string>;
  spellSpeedRef: "" | "Burst" | "Fast" | "Slow";
  rarityRef: "None" | "Common" | "Rare" | "Epic" | "Champion";
  subtypes: Array<string>;
  subtypeRefs: Array<string>;
  supertype: "" | "Champion";
  typeRef: string;
  collectible: true;
  set: string;
  createdAt: string;
  updatedAt: string;
};

export type SetJson = Array<SetJsonCard>;

export type SetJsonObject = { [key: string]: SetJsonCard };

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
}

init();

export { setJson, setJsonObject };
