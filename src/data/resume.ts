// Source of truth for the About / Résumé pages.
// Public site: no phone number. Keep wording at résumé level of detail.

export const person = {
  name: 'Jacob Winick',
  location: 'Seattle, WA',
  email: 'winickjm@gmail.com',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jacobwinick/' },
    { label: 'GitHub', href: 'https://github.com/realjwin' },
  ],
  headline: 'Engineering manager & wireless systems engineer',
  summary:
    'Joined Amazon Leo (formerly Project Kuiper) as one of its first 100 employees and carried its custom modem silicon from MATLAB simulation through seven chip iterations to production firmware operating on orbit. Now leading a seven-person modem embedded firmware team and building AI-first agentic test infrastructure. Machine learning research background at UT Austin and Intel Labs, and internships across Apple, Microsoft, MIT Lincoln Laboratory, and Astranis.',
  seeking:
    'Looking to help bring frontier AI to people the way satellite internet reached them: from early prototype to product at scale.',
};

export type Role = { title: string; dates: string; bullets: string[] };

export const leo = {
  org: 'Amazon Leo',
  aka: 'formerly Project Kuiper',
  place: 'Seattle, WA',
  dates: 'Mar 2020 – present',
  roles: [
    {
      title: 'Engineering Manager, Modem Systems Embedded Firmware',
      dates: 'May 2026 – present',
      bullets: [
        'Lead a team of 7 engineers plus interns and contractors across four charters: AI-first agentic test infrastructure, pre-silicon modem firmware validation in emulation, MIMO feature bring-up on gen-1 production hardware, and the on-orbit PHY data analysis pipeline.',
        'Hands-on owner of gateway MIMO: validated the existing implementation, fixed channel-estimate message processing, found and fixed a missed-detection bug, and enabled gateway downlink MIMO and SISO-to-MIMO switching on production hardware.',
        'Found several gen-1 silicon bugs through on-orbit and lab analysis; drove fixes into gen-2 and validated them in emulation ahead of tapeout.',
        'Delivered on-orbit uplink BLER analysis to VP-level leadership to guide link performance decisions.',
        'Grew the team from 3 to 7 engineers plus 2 interns in one quarter; hired contractors through two agencies; ran the intern program and turned around a struggling internship with AI tooling and object-oriented practices.',
        'Drive AI-tool adoption across the team (Claude Code, a team LLM wiki) for test generation, log analysis, and firmware development.',
      ],
    },
    {
      title: 'Senior Wireless Communication Systems Engineer',
      dates: 'Jun 2025 – May 2026',
      bullets: [
        'Owned customer-terminal downlink PHY: feature development, bring-up, and production code.',
        'Delivered a full refactor of the customer-terminal downlink PHY firmware from bring-up code to production quality, adding telemetry, failure handling, and silicon errata workarounds.',
        'Partnered with systems, MAC software, and RF antenna teams to validate full-stack satellite and terminal software for maximum uptime and throughput.',
        'Led on-orbit PHY data analysis: built a layer-1 analysis tool and triaged daily on-orbit failures across PHY lockup, raster scan, beam pointing, and satellite anomalies.',
      ],
    },
    {
      title: 'Wireless Communication Systems Engineer',
      dates: 'Mar 2020 – Jun 2025',
      bullets: [
        'Designed and developed the MATLAB modem simulation for Leo’s proprietary waveform, including a refactor to a multi-TTI architecture.',
        'Architected modem verification infrastructure and data pipelines from scratch in Python, MATLAB, and AWS: test-suite framework, testpoint data pipeline, register configuration infrastructure, lab waveform injection toolchain, and cloud regression. Partnered with ASIC RTL and pre-silicon verification teams on satellite downlink, terminal receive, and gateway.',
        'Led post-silicon PHY bring-up for the modem team across seven iterations of custom modem silicon; built lab test infrastructure from scratch and integrated with custom digital beamforming chips.',
        'Implemented and validated modem firmware algorithms and controls for the satellite downlink and customer terminals, including emulation-based testing.',
        'Early employee (<100) through the full lifecycle from concept to an operating constellation; watched the first prototype satellites launch on Atlas V at Cape Canaveral.',
      ],
    },
  ] as Role[],
};

// The arc on the home page: one line per stage, real milestones only.
export const arc = [
  { stage: 'SIM', label: 'MATLAB modem simulation', note: 'Proprietary waveform, multi-TTI' },
  { stage: 'PRE-Si', label: 'Verification infrastructure', note: 'Python · MATLAB · AWS regression' },
  { stage: 'POST-Si', label: 'PHY bring-up', note: '7 silicon iterations' },
  { stage: 'FW', label: 'Production firmware', note: 'Terminal DL PHY · gateway MIMO' },
  { stage: 'ORBIT', label: 'On-orbit operation', note: 'Daily PHY triage · BLER analysis' },
];

export const education = [
  {
    school: 'University of Texas at Austin',
    degree: 'M.S. Electrical Engineering',
    dates: 'Dec 2019',
    gpa: '3.88',
    note: 'Research toward a PhD in machine learning for wireless communications; left to join Project Kuiper early. Thesis work on ML-assisted LDPC decoding using belief propagation and deep neural networks.',
    coursework: 'Reinforcement Learning, Information Theory, Convex Optimization, Estimation Theory, Wireless Communications',
  },
  {
    school: 'University of Michigan',
    degree: 'B.S. Electrical Engineering, Physics minor',
    dates: 'Dec 2016',
    gpa: '3.90',
    note: 'Class of 1931E Scholarship, Eta Kappa Nu.',
    coursework: 'Machine Learning, Digital Communications, Digital Signal Processing',
  },
];

export const earlier = [
  { org: 'Intel Labs', role: 'Machine Learning Intern', dates: 'Summer 2019', place: 'Hillsboro, OR', note: 'Deep-learning model for IP traffic classification to improve power savings on wireless chipsets, with a semi-automated packet extraction and data-cleaning pipeline.' },
  { org: 'Astranis', role: 'Wireless Communications Intern', dates: 'Summer 2017', place: 'San Francisco, CA', note: 'Software-defined-radio payload and an end-to-end spread-spectrum telemetry link for a cube-satellite MVP (launched by ISRO, 2017) at a <10-person YC-backed startup.' },
  { org: 'Michigan eXploration Laboratory', role: 'Electronics Lead, TBEx CubeSat', dates: '2016 – 2017', place: 'Ann Arbor, MI', note: 'Launched on the first commercial Falcon Heavy.' },
  { org: 'Apple', role: 'Wireless Project Manager / Antenna Test Intern', dates: '2015', place: 'Cupertino, CA' },
  { org: 'Microsoft', role: 'Developer Engagement Program Manager Intern', dates: 'Summer 2014', place: 'Redmond, WA' },
  { org: 'MIT Lincoln Laboratory', role: 'Satellite Communications Intern', dates: 'Summer 2013', place: 'Lexington, MA' },
];

export const skills = [
  { k: 'Languages', v: 'Python, C/C++, MATLAB' },
  { k: 'Systems', v: 'Embedded firmware on custom silicon, pre-silicon emulation, post-silicon bring-up, PHY/modem design, MIMO, LDPC' },
  { k: 'Infrastructure', v: 'AWS, SQL, test & regression infrastructure, data pipelines' },
  { k: 'AI tooling', v: 'Claude Code, agentic test workflows, LLM knowledge bases' },
  { k: 'ML foundations', v: 'Deep neural networks, belief propagation, reinforcement learning, information theory' },
  { k: 'Leadership', v: 'Hiring, intern & contractor programs, mentoring, coordination across ASIC, systems, MAC, and RF' },
];

// Drawn as "general notes" on the About sheet.
export const interests = [
  'Backcountry skiing',
  'Bikepacking',
  'Sailing',
  'Film photography',
  'Violin and saxophone',
  'Building out a camper van',
];

export const revisions = [
  { rev: 'A', date: '2026-11-09', desc: 'Initial release. Supersedes jacobwinick.com (2019).' },
];
