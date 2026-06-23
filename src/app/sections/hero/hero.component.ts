import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.component.css',
})
export class Hero {
  protected readonly site = SITE;
}
