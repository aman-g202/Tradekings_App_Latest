import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PriceExecutiveDashboardPage } from './price-executive-dashboard.page';

describe('PriceExecutiveDashboardPage', () => {
  let component: PriceExecutiveDashboardPage;
  let fixture: ComponentFixture<PriceExecutiveDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceExecutiveDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceExecutiveDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
