import { Dictionary } from "./dictionary.model";

export interface DictionaryItem {
  id: number;
  dictionary: Dictionary;
  name: string;
}