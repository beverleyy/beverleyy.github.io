import type { ImageMetadata } from 'astro';

/* Imported, not referenced by path: astro:assets only optimises images it can see
   as modules, and anything left in public/ ships at full size. */
import blastnet from '../assets/research/blastnet.png';
import cvr from '../assets/research/cvr.png';
import jfmAbstract from '../assets/research/jfm_graphicalAbstract.jpg';
import sysid from '../assets/research/sysid.png';
import vortex from '../assets/research/vortex.png';
import waffles from '../assets/etc/waffles.png';
import charmcube from '../assets/etc/charmcube.jpg';
import jaxDgVortexPoster from '../assets/research/jax-dg-vortex-poster.png';
import bscwpPoster from '../assets/research/bscwp-poster.png';

export interface TapeSection {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface EducationEntry {
  code: string;
  years: string;
  programme: string;
  institution: string;
  meta: { label: string; value: string }[];
}

export interface ExperienceEntry {
  dates: string;
  company: string;
  role: string;
  department: string;
  status: 'current' | 'past';
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectVideo {
  webm: string;
  mp4: string;
  poster: ImageMetadata;
}

export interface ProjectEntry {
  callsign?: string;
  status: 'current' | 'ongoing' | 'landed';
  squawk: string;
  title: string;
  blurb: string;
  featured?: boolean;
  image?: ImageMetadata;
  /* Animations live in public/media as video. They can't go through astro:assets:
     its image pipeline would flatten an animated source to a single frame. */
  video?: ProjectVideo;
  /* describes the figure for screen readers; omit only for decorative images */
  alt?: string;
  supervisors?: string[];
  team?: string[];
  tools: string[];
  links: ProjectLink[];
}

/* order drives both tapes */
export const tapeSections: TapeSection[] = [
  { id: 'hero-viewport', label: 'Flight Deck' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/beverleyy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/beverleyy' },
  { label: 'Scholar', href: 'https://scholar.google.com/citations?user=wDYVyhYAAAAJ' },
  { label: 'ORCID', href: 'https://orcid.org/0000-0003-0600-8065' },
];

export const highlightLinks: SocialLink[] = [
  { label: 'Stanford Mechanical Engineering PhD Candidate', href: 'https://me.stanford.edu' },
  { label: 'A*STAR NSS (PhD) Scholar', href: 'https://www.a-star.edu.sg/scholarships/home/scholarships/national-science-scholarship-(phd)' },
  { label: 'Supervised by Prof. Juan Alonso', href: 'https://adl.stanford.edu' },
];

export const education: EducationEntry[] = [
  {
    code: 'PhD',
    years: '2023 – 2028 (EXPECTED)',
    programme: 'Ph.D. in Mechanical Engineering',
    institution: 'Stanford University &middot; CA, USA',
    meta: [
      { label: 'Advisor', value: 'Prof. J. Alonso, Prof. G. Iaccarino' },
      { label: 'Focus', value: 'GPU-accelerated discontinuous Galerkin methods for compressible flows' },
      { label: 'Teaching', value: 'TA, Gas-Turbine Design Analysis, Fall 2025 (Prof. M. Ihme)' },
    ],
  },
  {
    code: 'MEng',
    years: '2021 – 2022',
    programme: 'M.Eng. in Mechanical & Aerospace Engineering',
    institution: 'Nanyang Technological University &middot; Singapore',
    meta: [
      { label: 'Advisor', value: 'Prof. W.L. Chan, Dr. B. Elhadidi' },
      { label: 'Thesis', value: 'Investigating Galilean invariance in CFD' },
      { label: 'Coursework', value: 'Finite Element Methods, Advanced Thermal Engineering, Advanced Engineering Maths, Computational Methods, Design of Experiments' },
    ],
  },
  {
    code: 'BEng',
    years: '2017 – 2021',
    programme: 'B.Eng. in Aerospace Engineering (Honours with Distinction)',
    institution: 'Nanyang Technological University &middot; Singapore',
    meta: [
      { label: 'Advisor', value: 'Prof. T.H. New' },
      { label: 'Thesis', value: 'On the flow behavior of confined vortex-rings' },
      { label: 'Honours', value: "CN Yang Scholars Program, CNYSP Research Award (Gold), Dean's List AY19/20, Nanyang Scholarship" },
    ],
  },
  {
    code: 'Exchange',
    years: 'SPRING 2020',
    programme: 'Exchange in Aeronautics & Astronautics',
    institution: 'Purdue University &middot; IN, USA',
    meta: [
      { label: 'Honours', value: "Dean's List Spring 2020, Semester Honors Spring 2020" },
      { label: 'Coursework', value: 'Aerospace Structural Analysis, Computational Aerodynamics, Experimental Aerodynamics, Spacecraft Design, Thermal Sciences' },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    dates: '2026.06 – Present',
    company: 'Los Alamos National Laboratory, NM, USA',
    role: 'Graduate Research Intern',
    department: 'Computing & Artificial Intelligence 2 (CAI-2)',
    status: 'current',
  },
  {
    dates: '2023.09 – Present',
    company: 'Stanford University, CA, USA',
    role: 'Graduate Research Assistant',
    department: 'Mechanical Engineering, then Aeronautics & Astronautics',
    status: 'current',
  },
  {
    dates: '2022.08 – 2023.08',
    company: 'Agency for Science, Technology And Research, Singapore',
    role: 'Research Engineer',
    department: 'Fluid Dynamics (FD), Institute of High Performance Computing',
    status: 'past',
  },
  {
    dates: '2020.06 – 2020.09',
    company: 'Temasek Laboratories@NUS, Singapore',
    role: 'Research Intern',
    department: 'Center for Aerodynamics & Propulsion',
    status: 'past',
  },
  {
    dates: '2019.05 – 2022.08',
    company: 'Nanyang Technological University, Singapore',
    role: 'Project Officer & Research Assistant',
    department: 'Mechanical & Aerospace Engineering',
    status: 'past',
  },
];

export const projects: ProjectEntry[] = [
  {
    status: 'current',
    squawk: '2026',
    title: 'Kokkos Kernels for Quinoa',
    blurb: 'I added GPU capability to the DG code Quinoa using Kokkos.',
    featured: true,
    supervisors: ['Dr. Aditya Pandare', 'Dr. Facundo Airaudo'],
    tools: ['Kokkos', 'Charm++', 'C++', 'CUDA', 'Make', 'Bash'],
    links: [{ label: 'Code →', href: 'https://github.com/quinoacomputing/quinoa/tree/kokkos_july2026' }],
  },
  {
    status: 'ongoing',
    squawk: '2026',
    title: 'Mixed precision for discontinuous Galerkin codes',
    blurb: 'Benchmarking and error analysis of DG operations in single- and double-precision across devices using JAX, and development of interval-arithmetic methodology to rigorously bound the resulting floating-point error.',
    supervisors: ['Prof. Juan Alonso'],
    tools: ['Python', 'JAX'],
    links: [{ label: 'Paper →', href: 'https://arc.aiaa.org/doi/10.2514/6.2026-0376' }],
  },
  {
    status: 'landed',
    squawk: '2025',
    title: 'BLASTNet Website',
    blurb: 'Redesigned interface with Isotope filtering and analytics pulled from Kaggle API, built using a Firebase-hosted JSON cache with cron and the GitHub API for automatic syncing, along with Jekyll templating.',
    featured: true,
    image: blastnet,
    alt:
      'Screenshot of the redesigned BLASTNet datasets page: a filter sidebar beside a grid of dataset cards, each previewing a coloured turbulent-flow volume.',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Jekyll', 'SASS', 'CSS', 'HTML', 'Javascript', 'Kaggle API', 'Python', 'Firebase'],
    links: [
      { label: 'Code →', href: 'https://github.com/blastnet/blastnet.github.io' },
      { label: 'Live →', href: 'https://blastnet.github.io' },
    ],
  },
  {
    status: 'landed',
    squawk: '2025',
    title: 'GPU-accelerated DG solvers with JAX',
    blurb: "Naive CuPy GPU port of in-house code wasn't fast enough, so I built a new one with JAX. It also uses automatic differentiation to optimize artificial viscosity for shock capturing.",
    featured: true,
    video: {
      webm: '/media/jax-dg-vortex.webm',
      mp4: '/media/jax-dg-vortex.mp4',
      poster: jaxDgVortexPoster,
    },
    alt:
      'Animated density contour of an isentropic vortex on a square grid, its blue-green core rotating against a uniform yellow field, scaled from 0.40 to 1.04.',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Python', 'JAX', 'CUDA', 'Google Cloud'],
    links: [
      { label: 'Code (JAX) →', href: 'https://github.com/beverleyy/1DJaxDG' },
      { label: 'Code (CuPy) →', href: 'https://github.com/beverleyy/quail_cupy' },
    ],
  },
  {
    callsign: 'SAP16',
    status: 'landed',
    squawk: '2023',
    featured: true,
    title: 'Transonic aeroelasticity with harmonic balance',
    blurb: 'Harmonic balance-based aerodynamic force calculations for use in transonic flutter prediction of NASA CRM wings.',
    video: {
      webm: '/media/bscwp.webm',
      mp4: '/media/bscwp.mp4',
      poster: bscwpPoster,
    },
    alt:
      'Animated surface pressure contours over a swept supercritical wing, the shock front sweeping across the upper surface through the flutter cycle.',
    supervisors: ['Dr. Daniel Wise', 'Dr. Vinh-Tan Nguyen'],
    team: ['Kendrick Tan'],
    tools: ['C++', 'Python', 'SU2'],
    links: [{ label: 'Code →', href: 'https://github.com/beverleyy/hb_aeroelastic' }],
  },
  {
    callsign: 'M.Eng. Thesis',
    status: 'landed',
    squawk: '2022',
    title: 'Investigating Galilean invariance in CFD',
    blurb: 'Comparison between flow properties and wakes calculated from CFD simulations (LES, DNS) of a moving body in stationary flow vs a stationary body in moving flow.',
    image: jfmAbstract,
    alt:
      'Graphical abstract comparing two reference frames: three rows of red-and-blue wake vorticity contours behind a body held still in moving flow, above three rows for a body moving through still fluid.',
    supervisors: ['Prof. Wai Lee Chan', 'Dr. Basman Elhadidi'],
    tools: ['Fluent', 'OpenFOAM', 'Pointwise', 'Tecplot', 'C++', 'Python', 'MATLAB'],
    links: [{ label: 'Thesis →', href: 'https://dr.ntu.edu.sg/handle/10356/164694' }],
  },
  {
    callsign: 'B.Eng. FYP',
    status: 'landed',
    squawk: '2021',
    title: 'Flow behavior of confined vortex-rings',
    blurb: 'Computational investigations of vortex-ring-induced wall shear stress and pressure on confined geometry, with experimental validation using dye flow visualization.',
    image: cvr,
    alt:
      'Three sequential dye visualisations of a blue vortex ring travelling along a confined cylindrical tube, stretching as it interacts with the wall.',
    supervisors: ['Prof. Daniel New'],
    tools: ['Fluent', 'Flow visualization', 'Pointwise', 'Tecplot', 'MATLAB'],
    links: [{ label: 'Thesis →', href: 'https://dr.ntu.edu.sg/handle/10356/149350' }],
  },
  {
    callsign: 'UAV Senior Design',
    status: 'landed',
    squawk: '2021',
    title: 'Waffles — Weird Take-Off and Landing (WTOL) UAV',
    blurb: 'Novel quadrotor VTOL concept to improve transition performance using two forward-canted rotors at the front and two outward-canted rotors at the back.',
    featured: true,
    image: waffles,
    alt:
      'CAD render of the Waffles WTOL UAV: a straight wing on twin booms carrying four rotors, two canted forward at the nose and two canted outward at the tail.',
    team: ['Zi Liang Wong', 'Yong Chun Chua', 'Benjamin Lim', 'Jiacheng Shi', 'Vicki Woo'],
    supervisors: ['Dr. Basman Elhadidi'],
    tools: ['MATLAB', 'Simulink', 'Arduino', 'SolidWorks', 'Datalogging', 'C'],
    links: [{ label: 'Video →', href: 'https://youtu.be/I5h49ASUCJA' }],
  },
  {
    status: 'landed',
    squawk: '2020',
    title: 'Fusing communication skills with engineering knowledge',
    blurb: "Co-teaching program to improve engineering students' communication skills.",
    supervisors: ['Prof. Wai Lee Chan', 'Prof. Jean Lee'],
    tools: ['MATLAB', 'Python', 'Excel'],
    links: [],
  },
  {
    status: 'landed',
    squawk: '2019',
    title: 'System identification of novel VTOL UAV',
    blurb: 'Determining stability and aerodynamic coefficients from dynamic system response using least-square regression models.',
    image: sysid,
    alt:
      'A white foam VTOL UAV wing mounted on its test rig in the laboratory, instrumented for dynamic pitch response measurements.',
    supervisors: ['Dr. Basman Elhadidi'],
    tools: ['MATLAB', 'Datalogging', 'Arduino'],
    links: [],
  },
  {
    callsign: 'CNYSP Research',
    status: 'landed',
    squawk: '2018',
    title: 'Flow transitions of vortex-ring collisions with density interfaces',
    blurb: 'Planar laser-induced fluorescence and time-resolved particle-image velocimetry flow visualizations of vortex-rings colliding with free surfaces and oil interfaces. Featured on the cover of the NTU College of Engineering Annual Magazine 2026!',
    image: vortex,
    alt:
      'Planar laser-induced fluorescence image of a green fluorescent vortex ring striking a density interface, marked by a dashed line, and mushrooming outward along it.',
    supervisors: ['Prof. Daniel New'],
    team: ['Dr. Jiao Long', 'Jing Yu Koh'],
    tools: ['Flow visualization', 'MATLAB', 'Tecplot'],
    links: [
      { label: 'JOV paper →', href: 'https://doi.org/10.1007/s12650-020-00666-7' },
      { label: 'POF paper →', href: 'https://doi.org/10.1063/5.0176897' },
    ],
  },
  {
    callsign: 'M&T',
    status: 'landed',
    squawk: '2018',
    title: 'Mini Delivery Quadcopter',
    blurb: 'Modified racing drone for autonomous package delivery.',
    image: charmcube,
    alt:
      'A modified racing quadcopter on a laboratory floor, carrying a white cube-shaped parcel and standing inside a blue taped landing square.',
    supervisors: ['Mr. Tony Gan', 'Mr. B Kanesh'],
    team: ['Charmaine Ong', 'Joseph Ang', 'Kai Hong Ong'],
    tools: ['Pixhawk', 'SolidWorks', 'C'],
    links: [{ label: 'Website →', href: 'https://blogs.ntu.edu.sg/ps9888-2018-droneinc' }],
  },
];
