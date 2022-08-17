export type SetJsonCard = {
  artistName: string;
  associatedCardRefs: Array<string>;
  attack: number;
  cardCode: string;
  collectible: true;
  cost: number;
  createdAt: string;
  description: string;
  descriptionRaw: string;
  flavorText: string;
  health: number;
  keywordRefs: Array<string>;
  keywords: Array<string>;
  levelupDescription: string;
  levelupDescriptionRaw: string;
  name: string;
  rarityRef: "None" | "Common" | "Rare" | "Epic" | "Champion";
  regionRefs: Array<string>;
  set: string;
  spellSpeedRef: "" | "Burst" | "Fast" | "Slow";
  subtypeRefs: Array<string>;
  subtypes: Array<string>;
  supertype: "" | "Champion";
  typeRef: string;
  updatedAt: string;
};

export type SetJson = Array<SetJsonCard>;

export type SetJsonObject = { [key: string]: SetJsonCard };

export type DataJsonVocabTerm = {
  description: string;
  name: string;
  nameRef: string;
};

export type DataJsonKeyword = {
  description: string;
  icon: string;
  name: string;
  nameRef: string;
  showInFilter: boolean;
};

export type DataJsonRegion = {
  abbreviation: string;
  color: string;
  icon: string;
  name: string;
  nameRef:
    | "Targon"
    | "Noxus"
    | "Demacia"
    | "Freljord"
    | "ShadowIsles"
    | "Ionia"
    | "Shurima"
    | "Bilgewater"
    | "PiltoverZaun"
    | "BandleCity";
  order: number;
};

export type DataJsonRank = {
  color: string;
  icon: string;
  name: string;
  nameRef:
    | "Masters"
    | "Diamond"
    | "Platinum"
    | "Gold"
    | "Silver"
    | "Bronze"
    | "Iron";
  order: number;
};

export type DataJsonServer = {
  abbreviation: string;
  color: string;
  name: string;
  nameRef: "americas" | "europe" | "apac";
  order: number;
};

export type DataJsonSpellSpeed = {
  name: string;
  nameRef: "Slow" | "Burst" | "Fast";
};

export type DataJsonRarity = {
  color: string;
  icon: string;
  name: string;
  nameRef: "Common" | "Rare" | "Epic" | "Champion";
};
export type DataJsonType = {
  color: string;
  icon: string;
  name: string;
  nameRef:
    | "Champion"
    | "Follower"
    | "Spell"
    | "Landmark"
    | "Ability"
    | "Equipment";
};

export type DataJsonSet = {
  icon: string;
  name: string;
  nameRef: string;
};

export type DataJsonPatch = {
  endTime: string;
  name: string;
  nameRef: string;
  startTime: string;
};

export type DataJsonSeason = {
  endTime: string;
  name: string;
  nameRef: string;
  startTime: string;
};

export type DataJsonRuneterraChampion = {
  abbreviation: string;
  color: string;
  icon: string;
  name: string;
  nameRef: string;
  order: number;
};

export type DataJson = {
  keywords: Array<DataJsonKeyword>;
  patches: Array<DataJsonPatch>;
  ranks: Array<DataJsonRank>;
  rarities: Array<DataJsonRarity>;
  regions: Array<DataJsonRegion>;
  runeterraChampions: Array<DataJsonRuneterraChampion>;
  seasons: Array<DataJsonSeason>;
  servers: Array<DataJsonServer>;
  sets: Array<DataJsonSet>;
  spellSpeeds: Array<DataJsonSpellSpeed>;
  types: Array<DataJsonType>;
  vocabTerms: Array<DataJsonVocabTerm>;
};
