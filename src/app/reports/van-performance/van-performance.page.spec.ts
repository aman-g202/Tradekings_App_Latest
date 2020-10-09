import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VanPerformancePage } from './van-performance.page';

describe('VanPerformancePage', () => {
  let component: VanPerformancePage;
  let fixture: ComponentFixture<VanPerformancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanPerformancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VanPerformancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
