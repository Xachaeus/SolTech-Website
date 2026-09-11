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

export interface Intro {
  name: string;
  url_name: string;
  position: string;
  email: string;
  alt_email: string;
  text: string;
}

/* Navlinks, but contact is kinda irrelevant since we have get in touch button? */
export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: 'services' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

export const SERVICES: Service[] = [
  {
    title: 'New Ideas Every Day',
    body: 'We love to think up new and interesting ideas, and our team finds the best ways to make them real.',
  },
  {
    title: 'Expert Ventures from Expert Developers',
    body: 'Our think tank consists exclusively of high-performance, passionate, expert developers who love what they do.',
  },
  {
    title: 'Building Our Own Future',
    body: "Our self-funded team seeks to build the future we want to see, innovating project after project as we go.",
  },
];

export const ABOUT_POINTS: AboutPoint[] = [
  {
    title: 'Venture Builders',
    body: 'We are a self-funded team of developers and researchers who are always looking for ways to make our crazy ideas into reality.'
  },
  {
    title: 'From Start To Finish',
    body: 'We don\'t just come up with ideas or fund other people\'s projects; we take our ideas from concept to completion, working at every phase of product development.',
  },
  {
    title: 'Many Ideas At A Time',
    body: "Our passionate team works day and night to build our visions into reality, letting us handle several ventures at once.",
  },
];

export const INTROS: Intro[] = [
  {
    name: "Zack Sollenberger",
    url_name: "zack-sollenberger",
    position: "Co-Founder and CEO",
    email: "zsollenberger@sollenbergertech.com",
    alt_email: "zsollenberger",
    text: "Zack is a rising Senior at the University of Delaware who has been \
    programming as a hobby since he was seven years old. He is currently \
    pursuing a Bachelor's Degree in Computer Science, and is enrolled in UD's 4+1 \
    program. He has been leading a research team under Dr. Sunita Chandrasekaran since \
    2023, is the primary author of two internationally-published research papers, \
    and is the recipient of UD's Computer Department's Outstanding Sophomore/Junior of the Year \
    Award. He is extraordinarily passionate about technological development and continues to \
    spend his free time on tech projects."
  },

  {
    name: "Maksym Shkopas",
    url_name: "maksym-shkopas",
    position: "Co-Founder and CMO",
    email: "mshkopas@sollenbergertech.com",
    alt_email: "mshkopas",
    text: "Max is a recent graduate of the University of Delaware, holding a Bachelor's Degree in \
    Computer Science with a concentration in Artificial Intelligence, and is currently pursuing \
    a Master's Degree in Electrical Engineering. He has three years of experience developing AI \
    systems for Military and and Department of Defense applications, is a co-author on three \
    internationally-published computer vision research papers, and has spent his career working at \
    the intersection of machine learning, computer vision, and mission-critical software. In his free \
    time, he develops advanced Artificial Intelligence applications for subjects he is passionate about."
  },

]
