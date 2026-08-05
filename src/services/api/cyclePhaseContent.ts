import { apiCall } from './httpClient';

// Cycle Phase Content API Types
export interface CyclePhaseContent {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  energyLevel: 'low' | 'rising' | 'high' | 'declining';
  bestFor: string[];
  nutrition: string[];
  movement: string[];
  mindset: string[];
  understanding: string;
  isActive: boolean;
}

export interface CyclePhaseContentResponse {
  success: boolean;
  data: CyclePhaseContent[];
}

export async function getCyclePhaseContent(): Promise<CyclePhaseContentResponse> {
  return apiCall<CyclePhaseContentResponse>('/cycle-phase-content', {
    method: 'GET',
  });
}

// Weekly Updates API Types
export interface WeeklyUpdate {
  title: string;
  message: string;
  iconType:
    | 'energy'
    | 'mental'
    | 'metabolism'
    | 'mood'
    | 'fertility'
    | 'nutrition'
    | 'movement';
  color: string;
  iconColor?: string;
  order: number;
}

export interface WeeklyUpdatesResponse {
  success: boolean;
  data: WeeklyUpdate[];
}

// Did You Know API Types
export interface DidYouKnow {
  fact: string;
  author?: string | null;
}

export interface DidYouKnowResponse {
  success: boolean;
  data: DidYouKnow;
}

// Personalized Insight API Types
export interface PersonalizedInsight {
  insight: string;
}

export interface PersonalizedInsightResponse {
  success: boolean;
  data: PersonalizedInsight | null;
}

// Weekly Updates API Functions
export async function getWeeklyUpdatesByPhase(
  phase: string,
): Promise<WeeklyUpdatesResponse> {
  return apiCall<WeeklyUpdatesResponse>(
    `/cycle-phase-content/${phase}/weekly-updates`,
    {
      method: 'GET',
    },
  );
}

// Did You Know API Functions
export async function getDidYouKnowByPhase(
  phase: string,
): Promise<DidYouKnowResponse> {
  return apiCall<DidYouKnowResponse>(
    `/cycle-phase-content/${phase}/did-you-know`,
    {
      method: 'GET',
    },
  );
}

// Personalized Insight API Functions
export async function getPersonalizedInsight(): Promise<PersonalizedInsightResponse> {
  return apiCall<PersonalizedInsightResponse>(
    '/cycle-phase-content/personalized-insight',
    {
      method: 'GET',
    },
  );
}
