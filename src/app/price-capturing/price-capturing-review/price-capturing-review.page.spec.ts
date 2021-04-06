import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PriceCapturingReviewPage } from './price-capturing-review.page';

describe('PriceCapturingReviewPage', () => {
  let component: PriceCapturingReviewPage;
  let fixture: ComponentFixture<PriceCapturingReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceCapturingReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceCapturingReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
