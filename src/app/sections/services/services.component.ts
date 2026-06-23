import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SERVICES } from '../../core/site.content';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './services.component.css',
})
export class Services {
  protected readonly services = SERVICES;
}
