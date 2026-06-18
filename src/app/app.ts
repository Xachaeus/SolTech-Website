import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Background } from './shared/background/background';
import { Nav } from './shared/nav/nav';
import { Footer } from './shared/footer/footer';

/**
 * Root shell. Holds the global chrome that persists across every route:
 * the animated background, the top nav, and the footer. Page content is
 * swapped into <router-outlet> — today that's just Home, but new pages
 * (e.g. a client portal) drop in via app.routes.ts with zero shell changes.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Background, Nav, Footer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {}
