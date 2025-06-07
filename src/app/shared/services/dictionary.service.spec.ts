import { TestBed } from '@angular/core/testing';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
  let service: DictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all roles with dictionaryId 4', () => {
    const roles = service.getByDictionaryId(4);
    expect(roles.length).toBeGreaterThan(0);
    expect(roles.every(r => r.dictionaryId === 4)).toBeTrue();
  });

  it('should return item by id', () => {
    const item = service.getById(1);
    expect(item).toBeDefined();
    expect(item?.id).toBe(1);
  });

  it('should return item by name and dictionaryId', () => {
    const item = service.getByNameAndDict('Emisă', 10);
    expect(item).toBeDefined();
    expect(item?.name).toBe('Emisă');
    expect(item?.dictionaryId).toBe(10);
  });

  it('should return undefined for invalid name/dictionary', () => {
    const item = service.getByNameAndDict('Inexistent', 999);
    expect(item).toBeUndefined();
  });
});
