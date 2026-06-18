import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly site = SITE;
}
