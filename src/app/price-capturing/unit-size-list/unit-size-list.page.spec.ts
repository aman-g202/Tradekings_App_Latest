import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnitSizeListPage } from './unit-size-list.page';

describe('UnitSizeListPage', () => {
  let component: UnitSizeListPage;
  let fixture: ComponentFixture<UnitSizeListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitSizeListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnitSizeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
