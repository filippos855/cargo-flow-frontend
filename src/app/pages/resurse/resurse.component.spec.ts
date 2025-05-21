import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResurseComponent } from './resurse.component';

describe('ResurseComponent', () => {
  let component: ResurseComponent;
  let fixture: ComponentFixture<ResurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResurseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
