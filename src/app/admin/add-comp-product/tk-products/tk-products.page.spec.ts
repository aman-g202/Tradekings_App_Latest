import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TkProductsPage } from './tk-products.page';

describe('TkProductsPage', () => {
  let component: TkProductsPage;
  let fixture: ComponentFixture<TkProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TkProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TkProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
