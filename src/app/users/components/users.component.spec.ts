import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const mockUserService = {
    getUsers: () => [
      {
        id: 1,
        username: 'admin1',
        passwordHash: 'secret',
        role: { id: 1, name: 'Admin', dictionaryId: 4 } as DictionaryItem,
        person: {
          id: 1,
          fullName: 'Andrei Ionescu',
          email: 'andrei@example.com',
          phone: '0722333444'
        },
        isActive: true
      }
    ]
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, CommonModule, RouterModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(component.users.length).toBe(1);
    expect(component.users[0].username).toBe('admin1');
  });

  it('should navigate to user details on viewUser()', () => {
    const user = { id: 1 } as any;
    component.viewUser(user);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users', 1]);
  });
});
