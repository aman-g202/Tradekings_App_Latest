import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NavigationDrawerPage } from './navigation-drawer.page';

describe('NavigationDrawerPage', () => {
  let component: NavigationDrawerPage;
  let fixture: ComponentFixture<NavigationDrawerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationDrawerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationDrawerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
