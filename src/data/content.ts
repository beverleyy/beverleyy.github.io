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

export interface ProjectEntry {
  callsign: string;
  status: 'current' | 'ongoing' | 'landed';
  squawk: string;
  edu: 'phd' | 'meng' | 'beng' | 'pro';
  category: 'research' | 'engineering';
  types: string[];
  title: string;
  blurb: string;
  image?: string;
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
  { id: 'research', label: 'Research' },
  { id: 'contact', label: 'Contact' },
];

export const socialLinks: SocialLink[] = [
  { label: 'Mail', href: 'mailto:yeokwb@stanford.edu' },
  { label: 'GitHub', href: 'https://github.com/beverleyy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/beverleyy' },
  { label: 'Scholar', href: 'https://scholar.google.com/citations?user=wDYVyhYAAAAJ' },
  { label: 'ORCID', href: 'https://orcid.org/0000-0003-0600-8065' },
];

export const highlightLinks: SocialLink[] = [
  { label: 'Stanford Mechanical Engineering PhD Candidate', href: 'https://me.stanford.edu' },
  { label: 'A*STAR NSS (PhD) Scholar', href: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/national-science-scholarship-phd' },
  { label: 'Supervised by Prof. Juan Alonso', href: 'https://adl.stanford.edu' },
];

export const education: EducationEntry[] = [
  {
    code: 'PhD',
    years: '2023 – PRESENT',
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
];

export const projects: ProjectEntry[] = [
  {
    callsign: '',
    status: 'current',
    squawk: '2026',
    edu: 'pro',
    category: 'engineering',
    types: ['code'],
    title: 'Kokkos Kernels for Quinoa',
    blurb: 'Adding GPU capability to the DG code Quinoa using Kokkos.',
    supervisors: ['Dr. Aditya Pandare', 'Dr. Facundo Airaudo'],
    tools: ['Kokkos', 'Charm++', 'C++', 'CUDA', 'Make', 'Bash'],
    links: [{ label: 'Code →', href: 'https://github.com/quinoacomputing/quinoa/tree/kokkos_july2026' }],
  },
  {
    callsign: '',
    status: 'ongoing',
    squawk: '2026',
    edu: 'phd',
    category: 'research',
    types: ['code', 'math'],
    title: 'Interval arithmetic for floating-point error quantification',
    blurb: 'Developing methodology to bound floating-point error for a discontinuous Galerkin kernel.',
    supervisors: ['Prof. Juan Alonso'],
    tools: ['Python'],
    links: [],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2025',
    edu: 'phd',
    category: 'research',
    types: ['code', 'math'],
    title: 'Mixed precision for discontinuous Galerkin codes',
    blurb: 'Benchmarking DG operations in single- and double-precision on various devices.',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Python', 'JAX'],
    links: [{ label: 'Paper →', href: 'https://arc.aiaa.org/doi/10.2514/6.2026-0376' }],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2025',
    edu: 'phd',
    category: 'engineering',
    types: ['code'],
    title: 'BLASTNet',
    blurb: 'Redesigned interface with Isotope filtering and analytics synced from Kaggle API, built using a JSON cache with cron and the GitHub API along with Jekyll templating.',
    image: '/research/blastnet.png',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Jekyll', 'SASS', 'CSS', 'HTML', 'Javascript', 'Kaggle API', 'Python', 'Firebase'],
    links: [
      { label: 'Code →', href: 'http://github.com/blastnet/blastnet.github.io' },
      { label: 'Live →', href: 'https://blastnet.github.io' },
    ],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2025',
    edu: 'phd',
    category: 'engineering',
    types: ['code'],
    title: 'CuPyQuail',
    blurb: 'GPU-compatible version of in-house discontinuous Galerkin code, Quail.',
    image: '/research/cupyquail.png',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Python', 'CUDA'],
    links: [{ label: 'Code →', href: 'http://github.com/beverleyy/quail_cupy' }],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2024',
    edu: 'phd',
    category: 'research',
    types: ['code', 'math'],
    title: 'Automatic differentiation for shock capturing',
    blurb: 'JAX automatic gradient to optimize artificial viscosity parameter.',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Python', 'JAX'],
    links: [],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2024',
    edu: 'phd',
    category: 'engineering',
    types: ['code', 'math'],
    title: 'JAX_DG',
    blurb: 'Development of hardware-independent discontinuous Galerkin solver using Google JAX.',
    image: '/research/jax_dg_vortex.gif',
    supervisors: ['Prof. Matthias Ihme'],
    tools: ['Python', 'JAX', 'Google Cloud'],
    links: [{ label: 'Code →', href: 'http://github.com/beverleyy/1DJaxDG' }],
  },
  {
    callsign: 'SAP16',
    status: 'landed',
    squawk: '2023',
    edu: 'pro',
    category: 'research',
    types: ['code', 'math', 'flows'],
    title: 'Transonic aeroelasticity with harmonic balance',
    blurb: 'Harmonic balance-based aerodynamic force calculations for use in transonic flutter prediction of NASA CRM wings.',
    image: '/research/bscwp.gif',
    supervisors: ['Dr. Daniel Wise', 'Dr. Vinh-Tan Nguyen'],
    team: ['Kendrick Tan'],
    tools: ['C++', 'Python', 'SU2'],
    links: [{ label: 'Code →', href: 'http://github.com/beverleyy/hb_aeroelastic' }],
  },
  {
    callsign: 'M.Eng. Thesis',
    status: 'landed',
    squawk: '2022',
    edu: 'meng',
    category: 'research',
    types: ['flows'],
    title: 'Investigating Galilean invariance in CFD',
    blurb: 'Comparison between flow properties and wakes calculated from CFD simulations (LES, DNS) of a moving body in stationary flow vs a stationary body in moving flow.',
    image: '/research/jfm_graphicalAbstract.jpg',
    supervisors: ['Prof. Wai Lee Chan', 'Dr. Basman Elhadidi'],
    tools: ['Fluent', 'OpenFOAM', 'Pointwise', 'Tecplot', 'C++', 'Python', 'MATLAB'],
    links: [{ label: 'Thesis →', href: 'https://dr.ntu.edu.sg/handle/10356/164694' }],
  },
  {
    callsign: 'B.Eng. FYP',
    status: 'landed',
    squawk: '2021',
    edu: 'beng',
    category: 'research',
    types: ['flows'],
    title: 'Flow behavior of confined vortex-rings',
    blurb: 'Computational investigations of vortex-ring-induced wall shear stress and pressure on confined geometry, with experimental validation using dye flow visualization.',
    image: '/research/cvr.png',
    supervisors: ['Prof. Daniel New'],
    tools: ['Fluent', 'Flow visualization', 'Pointwise', 'Tecplot', 'MATLAB'],
    links: [{ label: 'Thesis →', href: 'https://dr.ntu.edu.sg/handle/10356/149350' }],
  },
  {
    callsign: 'UAV Senior Design',
    status: 'landed',
    squawk: '2021',
    edu: 'beng',
    category: 'engineering',
    types: ['builds'],
    title: 'Waffles — Weird Take-Off and Landing (WTOL) UAV',
    blurb: 'Novel quadrotor VTOL concept to improve transition performance using two forward-canted rotors at the front and two outward-canted rotors at the back.',
    image: '/etc/waffles.png',
    team: ['Zi Liang Wong', 'Yong Chun Chua', 'Benjamin Lim', 'Jiacheng Shi', 'Vicki Woo'],
    supervisors: ['Dr. Basman Elhadidi'],
    tools: ['MATLAB', 'Simulink', 'Arduino', 'SolidWorks', 'Datalogging', 'C'],
    links: [{ label: 'Video →', href: 'https://youtu.be/I5h49ASUCJA' }],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2020',
    edu: 'beng',
    category: 'research',
    types: ['other'],
    title: 'Fusing communication skills with engineering knowledge',
    blurb: "Co-teaching program to improve engineering students' communication skills.",
    supervisors: ['Prof. Wai Lee Chan', 'Prof. Jean Lee'],
    tools: ['MATLAB', 'Python', 'Excel'],
    links: [],
  },
  {
    callsign: '',
    status: 'landed',
    squawk: '2019',
    edu: 'beng',
    category: 'engineering',
    types: ['other'],
    title: 'System identification of novel VTOL UAV',
    blurb: 'Determining stability and aerodynamic coefficients from dynamic system response using least-square regression models.',
    image: '/research/sysid.png',
    supervisors: ['Dr. Basman Elhadidi'],
    tools: ['MATLAB', 'Datalogging', 'Arduino'],
    links: [],
  },
  {
    callsign: 'CNYSP Research',
    status: 'landed',
    squawk: '2018',
    edu: 'beng',
    category: 'research',
    types: ['flows'],
    title: 'Flow transitions of vortex-ring collisions with density interfaces',
    blurb: 'Planar laser-induced fluorescence and time-resolved particle-image velocimetry flow visualizations of vortex-rings colliding with free surfaces and oil interfaces. Featured on the cover of the NTU College of Engineering Annual Magazine 2026!',
    image: '/research/vortex.png',
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
    edu: 'beng',
    category: 'engineering',
    types: ['builds'],
    title: 'Mini Delivery Quadcopter',
    blurb: 'Modified racing drone for autonomous package delivery.',
    image: '/etc/charmcube.jpg',
    supervisors: ['Mr. Tony Gan', 'Mr. B Kanesh'],
    team: ['Charmaine Ong', 'Joseph Ang', 'Kai Hong Ong'],
    tools: ['Pixhawk', 'SolidWorks', 'C'],
    links: [{ label: 'Website →', href: 'https://blogs.ntu.edu.sg/ps9888-2018-droneinc' }],
  },
];
