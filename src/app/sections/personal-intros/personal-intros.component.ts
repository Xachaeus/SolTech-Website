import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { INTROS } from '../../core/site.content';

@Component({
  selector: 'app-personal-intros',
  imports: [],
  templateUrl: './personal-intros.component.html',
  //changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './personal-intros.component.css',
})
export class PersonalIntros {
  protected readonly intros = INTROS;

  ngAfterViewInit() {
    setTimeout( () => {
      document.querySelectorAll('.intro-card').forEach(el => {
        el.classList.add('anim-done');
      });
    }, 1000);
  }
}
