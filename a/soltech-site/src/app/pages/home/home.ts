import { Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Services } from '../../sections/services/services';
import { About } from '../../sections/about/about';
import { Contact } from '../../sections/contact/contact';

/** The landing page: stacks the marketing sections in order. 
 * IDK what HTML file is doing its just 4 lines
*/
@Component({
  selector: 'app-home',
  imports: [Hero, Services, About, Contact],
  templateUrl: './home.html',
})
export class Home {}
