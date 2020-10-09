import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectCustomerPage } from './select-customer.page';

describe('SelectCustomerPage', () => {
  let component: SelectCustomerPage;
  let fixture: ComponentFixture<SelectCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
