import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerPerformancePage } from './customer-performance.page';

describe('CustomerPerformancePage', () => {
  let component: CustomerPerformancePage;
  let fixture: ComponentFixture<CustomerPerformancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPerformancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerPerformancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
