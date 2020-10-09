import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompProductPage } from './comp-product.page';

describe('CompProductPage', () => {
  let component: CompProductPage;
  let fixture: ComponentFixture<CompProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
