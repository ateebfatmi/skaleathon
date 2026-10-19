import React from 'react';
import { getCurrentSession } from '@/lib/auth/session';
import { EventRepository } from '@/lib/db/repository';
import StagesScrollJourney from '@/components/dashboard/StagesScrollJourney';

export const revalidate = 0;

export default async function DashboardStagesPage() {
  const session = await getCurrentSession();
  const team = session?.teamId ? await EventRepository.getTeam(session.teamId) : null;
  const submission = team ? await EventRepository.getSubmissionByTeam(team.id) : null;

  const stages = [
    {
      number: '01',
      title: 'Online Technical Quiz',
      subtitle: 'Foundational Computer Science & Algorithmic Screening',
      category: 'Screening',
      categoryColor: 'border-[#c19a88]/30 bg-[#c19a88]/10 text-[#c19a88]',
      description:
        'A comprehensive online multiple-choice screening assessment evaluating foundational computer science principles, data structures, algorithms, and track-specific problem-solving aptitude. Scores determine tournament seeding and qualification for the blueprint round.',
      format: 'Timed Online Assessment (30–45 mins)',
      schedule: 'Dates announced via official broadcast',
      weightage: 'Elimination & Seeding Round',
      criteria: 'Algorithmic correctness, computational complexity, speed & domain logic',
      deliverables: [
        'Interactive Online Exam',
        'CS Fundamental MCQs',
        'Track-Specific Domain Questions',
      ],
      status: team?.status === 'paid' ? 'Registered & Verified' : 'Locked (Payment Required)',
      statusType: team?.status === 'paid' ? ('registered' as const) : ('locked' as const),
    },
    {
      number: '02',
      title: 'Idea & Architecture PPT',
      subtitle: 'System Blueprint, Schema Design & Feasibility Deck',
      category: 'Blueprint',
      categoryColor: 'border-[#e8c5b4]/30 bg-[#e8c5b4]/10 text-[#e8c5b4]',
      description:
        'Submit a structured pitch deck (max 10 slides) detailing your proposed problem statement, system architecture, database schema, AI/API integrations, and target user persona. This blueprint serves as the engineering foundation for your live build.',
      format: 'PDF Slide Deck Upload (Max 10 Slides)',
      schedule: 'Mid-Hackathon Checkpoint',
      weightage: 'Architectural Feasibility & Viability',
      criteria: 'Architecture depth, scalability, API integration planning, problem-solution fit',
      deliverables: [
        '10-Slide Structured PDF Deck',
        'High-Level Architecture Diagram',
        'Database Entity Relationship Blueprint',
      ],
      status: team ? 'Eligible for Submission' : 'Requires Team',
      statusType: team ? ('eligible' as const) : ('locked' as const),
      actionHref: '/dashboard/submission',
      actionLabel: 'Open Submission Portal',
    },
    {
      number: '03',
      title: 'Codebase & Demo (Build Sprint)',
      subtitle: '10-Day Deep Engineering Sprint & Cloud Deployment',
      category: 'Build Phase',
      categoryColor: 'border-[#c19a88]/40 bg-[#c19a88]/15 text-[#e8c5b4]',
      description:
        'The primary development sprint. Deliver a production-grade codebase in a public GitHub repository and a live deployed URL on cloud hosting. A 2–3 minute video walkthrough is not strictly necessary, but will give your team a distinct evaluation advantage.',
      format: 'GitHub + Live Demo URL (Video Link Optional Advantage)',
      schedule: 'Hard Deadline (See countdown)',
      weightage: 'Primary Evaluation (60% Weight)',
      criteria: 'Code cleanliness, architecture resilience, live functionality, UX finish, cloud deployment',
      deliverables: [
        'Public GitHub Repository',
        'Live Cloud Deployed URL',
        'Comprehensive README Documentation',
        '2–3 Min Video Walkthrough (Optional Advantage)',
      ],
      status: submission?.status === 'submitted' ? 'Submitted & Locked' : 'In Progress (Active Sprint)',
      statusType: submission?.status === 'submitted' ? ('submitted' as const) : ('in_progress' as const),
      actionHref: '/dashboard/submission',
      actionLabel: submission ? 'View / Edit Submission' : 'Open Submission Portal',
    },
    {
      number: '04',
      title: 'Grand Finale Live Q&A',
      subtitle: 'Panel Defense, Technical Interrogation & National Finals',
      category: 'Grand Finale',
      categoryColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      description:
        'Top finalist teams are invited to present their solution live before an esteemed jury panel composed of SkaleKraft leaders, senior engineers, and industry venture scouts. Teams defend their architecture and respond to live judge inquiries.',
      format: 'Live Video Presentation & Judge Q&A (10 mins)',
      schedule: 'Final Day of Skaleathon',
      weightage: 'Determines ₹35,000 Prize Distribution',
      criteria: 'Live demonstration efficacy, technical depth under questioning, commercial readiness',
      deliverables: [
        'Live Screen-Share Demonstration',
        'Technical Architecture Defense',
        'Interactive Judge Q&A',
      ],
      status: 'Reserved for Top 25 Finalists',
      statusType: 'reserved' as const,
    },
  ];

  return <StagesScrollJourney stages={stages} />;
}
