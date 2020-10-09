import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTKProductPage } from './add-tk-product.page';

describe('AddTKProductPage', () => {
  let component: AddTKProductPage;
  let fixture: ComponentFixture<AddTKProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTKProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTKProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
