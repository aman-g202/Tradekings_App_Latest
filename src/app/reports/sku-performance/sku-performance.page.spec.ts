import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkuPerformancePage } from './sku-performance.page';

describe('SkuPerformancePage', () => {
  let component: SkuPerformancePage;
  let fixture: ComponentFixture<SkuPerformancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuPerformancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkuPerformancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
