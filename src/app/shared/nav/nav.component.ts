import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { NAV_LINKS } from '../../core/site.content';

/** Fixed top navigation. Collapses to a hamburger menu on small screens. */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink],
  styleUrl: './nav.component.css',
})
export class Nav {
  protected readonly site = SITE;
  protected readonly links = NAV_LINKS;

  /** Mobile menu open/closed state. */
  protected readonly menuOpen = signal(false);

  toggle(): void {
    this.menuOpen.update((v) => !v);
  }
  close(): void {
    this.menuOpen.set(false);
  }
}
