import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChildCategoryPage } from './child-category.page';

describe('ChildCategoryPage', () => {
  let component: ChildCategoryPage;
  let fixture: ComponentFixture<ChildCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildCategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChildCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
