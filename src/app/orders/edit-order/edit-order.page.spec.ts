import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditOrderPage } from './edit-order.page';

describe('EditOrderPage', () => {
  let component: EditOrderPage;
  let fixture: ComponentFixture<EditOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
