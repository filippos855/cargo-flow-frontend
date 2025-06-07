import { Injectable } from '@angular/core';
import { DictionaryItem } from '../models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionaries: DictionaryItem[] = [
    // 🔐 Roluri (4)
    { id: 1, name: 'Admin', dictionaryId: 4 },
    { id: 3, name: 'Operator', dictionaryId: 4 },
    { id: 4, name: 'Financiar', dictionaryId: 4 },

    // 🧾 Tip factură (10)
    { id: 1, name: 'Emisă', dictionaryId: 10 },
    { id: 2, name: 'Primită', dictionaryId: 10 },

    // 💰 Status factură (11)
    { id: 1, name: 'Neachitată', dictionaryId: 11 },
    { id: 2, name: 'Achitată', dictionaryId: 11 },

    // 🚛 Tip vehicul (3)
    { id: 1, name: 'Tractor', dictionaryId: 3 },
    { id: 2, name: 'Trailer', dictionaryId: 3 }
  ];

  getByDictionaryId(dictionaryId: number): DictionaryItem[] {
    return this.dictionaries.filter(d => d.dictionaryId === dictionaryId);
  }

  getById(id: number): DictionaryItem | undefined {
    return this.dictionaries.find(d => d.id === id);
  }

  getByNameAndDict(name: string, dictionaryId: number): DictionaryItem | undefined {
    return this.dictionaries.find(d => d.name === name && d.dictionaryId === dictionaryId);
  }
}
