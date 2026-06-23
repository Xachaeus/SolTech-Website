import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../../sections/hero/hero.component';
import { Services } from '../../sections/services/services.component';
import { About } from '../../sections/about/about.component';
import { Contact } from '../../sections/contact/contact.component';

/** The landing page: stacks the marketing sections in order.
 * IDK what HTML file is doing its just 4 lines
 */
@Component({
  selector: 'app-home',
  imports: [Hero, Services, About, Contact],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './home.page.html',
})
export class Home {}
