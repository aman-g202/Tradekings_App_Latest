import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PriceCapturingProductListPage } from './price-capturing-product-list.page';

describe('PriceCapturingProductListPage', () => {
  let component: PriceCapturingProductListPage;
  let fixture: ComponentFixture<PriceCapturingProductListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceCapturingProductListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceCapturingProductListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
