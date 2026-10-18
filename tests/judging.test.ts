import { describe, it, expect } from 'vitest';
import { EventRepository } from '../src/lib/db/repository';

describe('Judging System & Scoring Integrity', () => {
  it('enforces that judging criteria weights must total 100%', async () => {
    const invalidCriteria = [
      { id: 'c1', name: 'Crit 1', weight_percentage: 40, max_score: 10, sort_order: 1 },
      { id: 'c2', name: 'Crit 2', weight_percentage: 40, max_score: 10, sort_order: 2 },
      // Sum = 80%, not 100%
    ];

    await expect(
      EventRepository.updateJudgingCriteria(invalidCriteria, 'admin_test')
    ).rejects.toThrow(/Total criteria weights must equal 100%/);
  });

  it('accepts criteria updates when weights sum precisely to 100%', async () => {
    const validCriteria = [
      { id: 'crit-innovation', name: 'Innovation', weight_percentage: 30, max_score: 10, sort_order: 1 },
      { id: 'crit-technical', name: 'Technical', weight_percentage: 30, max_score: 10, sort_order: 2 },
      { id: 'crit-relevance', name: 'Impact', weight_percentage: 20, max_score: 10, sort_order: 3 },
      { id: 'crit-design', name: 'Design', weight_percentage: 10, max_score: 10, sort_order: 4 },
      { id: 'crit-presentation', name: 'Presentation', weight_percentage: 10, max_score: 10, sort_order: 5 },
    ];

    const result = await EventRepository.updateJudgingCriteria(validCriteria, 'admin_test');
    const total = result.reduce((s, c) => s + c.weight_percentage, 0);
    expect(total).toBe(100);
  });

  it('enforces score locking preventing post-submission modifications', async () => {
    const asgnId = `asgn_lock_test_${Date.now()}`;
    const judgeId = 'judge_lead';

    // Mock an assignment in file store
    const store = (EventRepository as any).store.getState();
    store.judgeAssignments.push({
      id: asgnId,
      judge_id: judgeId,
      submission_id: 'sub_dummy',
      status: 'assigned',
      conflict_of_interest: false,
      created_at: new Date().toISOString(),
    });

    // 1. Submit final locked score
    await EventRepository.saveJudgeScore({
      assignmentId: asgnId,
      judgeId,
      scores: [{ criterionId: 'crit-innovation', score: 9 }],
      feedback: 'Outstanding technical demo.',
      isLocked: true,
    });

    // 2. Attempt modification on locked assignment
    await expect(
      EventRepository.saveJudgeScore({
        assignmentId: asgnId,
        judgeId,
        scores: [{ criterionId: 'crit-innovation', score: 5 }], // Attempt tampering
        isLocked: false,
      })
    ).rejects.toThrow(/Scores for this project have already been finalized and locked/);
  });
});
