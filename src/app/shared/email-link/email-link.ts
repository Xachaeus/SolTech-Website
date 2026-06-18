import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { SITE } from '../../core/site.config';

/**
 * Clickable contact email with one-click copy.
 *
 * Behaviour (matches the brief):
 *  • Click the address on a DESKTOP (fine pointer)  -> copies to clipboard.
 *  • Click the address on MOBILE (coarse pointer)   -> opens the mail app
 *    via the mailto: href (the native, expected behaviour on phones).
 *  • The copy icon ALWAYS copies, on every device.
 *
 * The mailto: href is always present, so if JS ever fails the link still works
 * everywhere — graceful degradation by default.
 */
@Component({
  selector: 'app-email-link',
  templateUrl: './email-link.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './email-link.css',
})
export class EmailLink {
  protected readonly email = SITE.email;

  /** Brief "Copied!" confirmation state. */
  protected readonly copied = signal(false);

  /** True on touch / coarse-pointer devices (phones, most tablets). */
  private isTouch(): boolean {
    return window.matchMedia?.('(pointer: coarse)').matches ?? false;
  }

  /** Address click: copy on desktop, let mailto open the mail app on mobile. */
  onAddressClick(event: MouseEvent): void {
    if (this.isTouch()) return; // allow the mailto: href to proceed
    event.preventDefault();
    this.copy();
  }

  /** Copy button: always copy. */
  copy(): void {
    void this.writeToClipboard(this.email);
  }

  private async writeToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      this.legacyCopy(text); // older browsers / non-secure contexts
    }
    this.flash();
  }

  /** Fallback copy for environments without the async Clipboard API. */
  private legacyCopy(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {
      /* no-op */
    }
    document.body.removeChild(ta);
  }

  private flash(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
}
