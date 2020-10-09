import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryTotalModalPage } from './category-total-modal.page';

describe('CategoryTotalModalPage', () => {
  let component: CategoryTotalModalPage;
  let fixture: ComponentFixture<CategoryTotalModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTotalModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTotalModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
