import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonDetailsComponent } from './person-details.component';
import { PersonService } from '../../services/person.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('PersonDetailsComponent', () => {
  let component: PersonDetailsComponent;
  let fixture: ComponentFixture<PersonDetailsComponent>;

  const mockPersonService = {
    getPersonById: (id: number) => ({
      id,
      fullName: 'Popescu Ion',
      phone: '0712345678',
      email: 'ion@example.com'
    }),
    updatePerson: jasmine.createSpy('updatePerson')
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonDetailsComponent],
      providers: [
        { provide: PersonService, useValue: mockPersonService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updatePerson on save()', () => {
    component.enableEdit();
    component.save();
    expect(mockPersonService.updatePerson).toHaveBeenCalledWith(component.person);
  });

  it('should navigate back on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources/persons']);
  });
});
