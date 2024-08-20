import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalRoutinesComponent } from './historical-routines.component';

describe('HistoricalRoutinesComponent', () => {
  let component: HistoricalRoutinesComponent;
  let fixture: ComponentFixture<HistoricalRoutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalRoutinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
