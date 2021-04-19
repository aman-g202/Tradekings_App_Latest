import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SchedulersPage } from './schedulers.page';

describe('SchedulersPage', () => {
  let component: SchedulersPage;
  let fixture: ComponentFixture<SchedulersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
