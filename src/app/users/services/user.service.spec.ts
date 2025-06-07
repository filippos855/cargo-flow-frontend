import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of users', () => {
    const users = service.getUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should return a user by ID', () => {
    const user = service.getUserById(1);
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });

  it('should update a user', () => {
    const user = service.getUserById(1)!;
    const updated = { ...user, username: 'updatedAdmin' };
    service.updateUser(updated);
    const result = service.getUserById(1);
    expect(result?.username).toBe('updatedAdmin');
  });

  it('should not update a non-existent user', () => {
    const initialLength = service.getUsers().length;

    const fakeUser = {
      id: 999,
      username: 'ghost',
      passwordHash: 'none',
      role: { id: 99, name: 'None', dictionaryId: 4 },
      person: { id: 99, fullName: 'Ghost', email: '', phone: '' },
      isActive: false
    };

    service.updateUser(fakeUser);
    expect(service.getUsers().length).toBe(initialLength);
    expect(service.getUserById(999)).toBeUndefined();
  });
});
