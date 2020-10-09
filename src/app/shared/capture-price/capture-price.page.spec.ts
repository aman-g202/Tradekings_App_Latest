import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CapturePricePage } from './capture-price.page';

describe('CapturePricePage', () => {
  let component: CapturePricePage;
  let fixture: ComponentFixture<CapturePricePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturePricePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CapturePricePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
