import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseComponent } from './curse.component';

describe('CurseComponent', () => {
  let component: CurseComponent;
  let fixture: ComponentFixture<CurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
