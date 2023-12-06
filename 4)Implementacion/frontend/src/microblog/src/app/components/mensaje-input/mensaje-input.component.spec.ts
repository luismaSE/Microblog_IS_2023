import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeInputComponent } from './mensaje-input.component';

describe('MensajeInputComponent', () => {
  let component: MensajeInputComponent;
  let fixture: ComponentFixture<MensajeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajeInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
