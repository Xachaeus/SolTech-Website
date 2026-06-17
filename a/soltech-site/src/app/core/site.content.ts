/**
 * SITE CONTENT — edit copy here, not in templates.
 *
 * Each array below is rendered with @for in its section component, so to add,
 * remove, or reword a card just edit the relevant array. No HTML changes needed.
 */

export interface NavLink {
  label: string;
  /** In-page anchor, e.g. '#services'. */
  href: string;
}

export interface Service {
  title: string;
  body: string;
}

export interface AboutPoint {
  title: string;
  body: string;
}
/* Navlinks, but contact is kinda irrelevant since we have get in touch button? */
export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }, 
];

export const SERVICES: Service[] = [
  {
    title: 'Custom Websites & Web Apps',
    body: 'Hand-built from scratch — no page builders, no cookie-cutter templates. We design and develop websites and full web applications tailored to your brand, workflow, and goals.',
  },
  {
    title: 'AI Integration & Research',
    body: 'We research, prototype, and integrate AI solutions into real business workflows — from custom language model pipelines to intelligent automation that actually saves you time and money.',
  },
  {
    title: 'Technology Consulting',
    body: "Not sure what you need? We'll assess your current stack, identify opportunities, and build a clear technology roadmap — honest recommendations with no unnecessary upsells.",
  },
];

export const ABOUT_POINTS: AboutPoint[] = [
  {
    title: 'Everything is Custom',
    body: "We don't drop you into a Wix template or a generic AI wrapper. Every project starts from your specific problem and is built to solve it exactly.",
  },
  {
    title: 'Real AI, Real Results',
    body: 'Our AI work is grounded in actual research — not marketing buzzwords. We stay current with the field so your integrations use what actually works.',
  },
  {
    title: 'Straight Talk, Always',
    body: "We'll tell you when something is overkill, when a simpler solution is better, and what you actually need — not what earns us more hours.",
  },
];
