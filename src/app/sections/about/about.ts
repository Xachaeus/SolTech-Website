import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SITE } from '../../core/site.config';
import { ABOUT_POINTS } from '../../core/site.content';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about.css',
})
export class About {
  protected readonly site = SITE;
  protected readonly points = ABOUT_POINTS;
}
