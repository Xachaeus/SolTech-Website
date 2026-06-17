import { Component } from '@angular/core';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly site = SITE;
}
