import { atom } from "recoil";
import { Missing } from "renderer/pages/MissingEpisodes";

export const missingList = atom({
  key: 'missingList',
  default: [] as unknown as Missing[],
});

export const showList = atom({
  key: 'showList',
  default: {},
});