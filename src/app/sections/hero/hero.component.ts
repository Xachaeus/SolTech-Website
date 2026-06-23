import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
  styleUrl: './hero.component.css',
})
export class Hero {
  protected readonly site = SITE;
}
