import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PersonalIntros } from '../../sections/personal-intros/personal-intros.component';

/** The landing page: stacks the marketing sections in order.
 * IDK what HTML file is doing its just 4 lines
 */
@Component({
  selector: 'app-who-we-are',
  imports: [PersonalIntros],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './who-we-are.page.html',
})
export class WhoWeAre {}
