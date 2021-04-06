import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditUserSmListPage } from './edit-user-sm-list.page';

describe('EditUserSmListPage', () => {
  let component: EditUserSmListPage;
  let fixture: ComponentFixture<EditUserSmListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserSmListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserSmListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
