import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.css',
})
export class Footer {
  protected readonly site = SITE;
}
