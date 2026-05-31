export interface TrajectoryProjection {
  timeline: number; // months ahead
  health: number; // 0-100
  wealth: number;
  knowledge: number;
  overall: number;
  description: string;
}

export function generateProjections(currentHabits: any[], currentTasks: any[]): TrajectoryProjection[] {
  // This would normally use AI/ML based on actual user data.
  // We simulate a compounding growth curve based on their current momentum.
  
  const baseHealth = 65;
  const baseWealth = 40;
  const baseKnowledge = 55;
  const baseOverall = 50;

  return [
    { 
      timeline: 1, 
      health: baseHealth + 5, 
      wealth: baseWealth + 2, 
      knowledge: baseKnowledge + 10, 
      overall: baseOverall + 8,
      description: "Neural pathways are rewiring. Consistency is establishing a new baseline. Early signs of cognitive enhancement and physical adaptation." 
    },
    { 
      timeline: 6, 
      health: baseHealth + 20, 
      wealth: baseWealth + 30, 
      knowledge: baseKnowledge + 45, 
      overall: baseOverall + 35,
      description: "Compounding returns activate. You've acquired high-leverage skills. Energy levels are peaking, allowing for sustained deep work sessions." 
    },
    { 
      timeline: 12, 
      health: baseHealth + 30, 
      wealth: baseWealth + 50, 
      knowledge: baseKnowledge + 80, 
      overall: baseOverall + 60,
      description: "Trajectory divergence complete. You are operating at an elite level. Your future self is unrecognizable from 12 months ago." 
    },
  ];
}
