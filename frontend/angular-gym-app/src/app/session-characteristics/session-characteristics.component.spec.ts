import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCharacteristicsComponent } from './session-characteristics.component';

describe('SessionCharacteristicsComponent', () => {
  let component: SessionCharacteristicsComponent;
  let fixture: ComponentFixture<SessionCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
