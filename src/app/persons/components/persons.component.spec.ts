import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonsComponent } from './persons.component';
import { Router } from '@angular/router';
import { PersonService } from '../services/person.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('PersonsComponent', () => {
  let component: PersonsComponent;
  let fixture: ComponentFixture<PersonsComponent>;
  let mockRouter: any;
  let mockPersonService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockPersonService = {
      getPersons: () => [
        { id: 1, fullName: 'Popescu Ion', phone: '0712345678', email: 'ion@example.com' }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [PersonsComponent, CommonModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PersonService, useValue: mockPersonService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to person details on viewPerson()', () => {
    const person = { id: 1 } as any;
    component.viewPerson(person);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources/persons', 1]);
  });
});
