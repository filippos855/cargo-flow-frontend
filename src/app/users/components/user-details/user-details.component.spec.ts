import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  const mockUserService = {
    getUserById: (id: number) => ({
      id,
      username: 'testuser',
      passwordHash: 'secret',
      role: { id: 1, name: 'Admin', dictionaryId: 4 },
      person: {
        id: 1,
        fullName: 'Popescu Ion',
        email: 'popescu@example.com',
        phone: '0722333444'
      },
      isActive: true
    }),
    updateUser: jasmine.createSpy('updateUser')
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  const mockLocation = {
    back: jasmine.createSpy('back')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UserService, useValue: mockUserService },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(component.user).toBeDefined();
    expect(component.user.id).toBe(1);
  });

  it('should save and disable edit mode', () => {
    component.isEditing = true;
    component.save();
    expect(mockUserService.updateUser).toHaveBeenCalledWith(component.user);
    expect(component.isEditing).toBeFalse();
  });

  it('should navigate back on goBack()', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
