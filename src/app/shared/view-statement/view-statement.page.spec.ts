import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewStatementPage } from './view-statement.page';

describe('ViewStatementPage', () => {
  let component: ViewStatementPage;
  let fixture: ComponentFixture<ViewStatementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewStatementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
