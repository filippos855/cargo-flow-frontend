import { TestBed } from '@angular/core/testing';
import { PersonService } from './person.service';
import { Person } from '../models/person.model';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all persons', () => {
    const persons = service.getPersons();
    expect(Array.isArray(persons)).toBeTrue();
    expect(persons.length).toBeGreaterThan(0);
  });

  it('should return a person by ID', () => {
    const person = service.getPersonById(1);
    expect(person).toBeDefined();
    expect(person?.id).toBe(1);
  });

  it('should update an existing person', () => {
    const original = service.getPersonById(1)!;
    const updated: Person = {
      ...original,
      phone: '0700000000'
    };

    service.updatePerson(updated);

    const result = service.getPersonById(1);
    expect(result?.phone).toBe('0700000000');
  });

  it('should not update a non-existent person', () => {
    const initialLength = service.getPersons().length;

    const fakePerson: Person = {
      id: 999,
      fullName: 'Persoană Inexistentă',
      phone: '0700000000',
      email: 'fake@example.com'
    };

    service.updatePerson(fakePerson);

    expect(service.getPersons().length).toBe(initialLength);
    expect(service.getPersonById(999)).toBeUndefined();
  });
});
