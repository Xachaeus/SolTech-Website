import { Component } from '@angular/core';
import { EmailLink } from '../../shared/email-link/email-link';

@Component({
  selector: 'app-contact',
  imports: [EmailLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
