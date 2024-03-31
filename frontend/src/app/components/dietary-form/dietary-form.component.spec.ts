import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietaryFormComponent } from './dietary-form.component';

describe('DietaryFormComponent', () => {
  let component: DietaryFormComponent;
  let fixture: ComponentFixture<DietaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DietaryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
