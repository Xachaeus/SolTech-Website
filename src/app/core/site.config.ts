
export const SITE = {
  brand: 'SolTech',
  legalName: 'Sollenberger Technologies, LLC',

  /** PLACEHOLDER */
  email: 'contact@sollenbergertech.com',

  tagline: 'Custom Technology Solutions & AI Research',

  /** Used by the footer copyright line. Auto-updates each year. */
  get year(): number {
    return new Date().getFullYear();
  },
} as const;
