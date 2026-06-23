import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EmailLink } from '../../shared/email-link/email-link.component';

@Component({
  selector: 'app-contact',
  imports: [EmailLink],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact.component.css',
})
export class Contact {}
