import { Component } from '@angular/core';
import { SERVICES } from '../../core/site.content';

@Component({
  selector: 'app-services',
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly services = SERVICES;
}
