/**
 * Lunara API client barrel (REF-005).
 *
 * Module map:
 * - httpClient.ts          — fetch wrapper, tokens, session type, 401 handling
 * - auth.ts                — signup/login/reset/google, /me, profile
 * - partner.ts             — partner code connect/status/logout
 * - periods.ts             — periods, pregnancy, cycle symptoms
 * - sleep.ts               — sleep logs + analytics
 * - journals.ts            — journals CRUD
 * - nutrition.ts           — meal plans, grocery, weekly planning
 * - workouts.ts            — workout plans/logs/library + movement helpers
 * - fasting.ts             — fasting protocols/sessions
 * - cyclePhaseContent.ts   — CMS phase content, weekly updates, insights
 * - challenges.ts          — challenge catalog + instance flows
 * - rituals.ts             — ritual catalog, preferences, day toggle
 *
 * App code imports from `services/api` (thin shim → this barrel).
 */

export type { ApiError, SessionType } from './httpClient';
export {
  clearSessionType,
  clearToken,
  getStoredSessionType,
  getStoredToken,
  storeAuthSession,
  storeSessionType,
  storeToken,
} from './httpClient';
export type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  GoogleAuthRequest,
  GoogleAuthResponse,
  DietaryRestrictions,
  PrimaryGoal,
  CycleHistorySummary,
  OwnerMeUser,
  PartnerMeUser,
  MeUser,
  User,
  GetMeResponse,
  ProfileUpdateRequest,
} from './auth';
export {
  signup,
  login,
  forgotPassword,
  resetPassword,
  googleAuth,
  isOwnerMeUser,
  isPartnerMeUser,
  getMe,
  getMeForBootstrap,
  updateProfile,
} from './auth';
export type {
  PartnerStatusResponse,
  GeneratePartnerCodeResponse,
  ConnectPartnerCodeResponse,
} from './partner';
export {
  generatePartnerCode,
  getPartnerStatus,
  disconnectPartner,
  connectWithPartnerCode,
  partnerLogout,
} from './partner';

export type {
  Period,
  CreatePeriodRequest,
  UpdatePeriodRequest,
  PeriodsResponse,
  PeriodResponse,
  CycleStatusResponse,
  PeriodFilters,
  PeriodAnalyticsResponse,
  PeriodStatisticsResponse,
  PregnancySymptom,
  BabyDevelopmentInfo,
  TrimesterInsights,
  PregnancyStatusResponse,
  UpdatePregnancyInfoRequest,
  UpdatePregnancyInfoResponse,
  LogPregnancySymptomRequest,
  LogPregnancySymptomResponse,
  PregnancyHistoryResponse,
  TransitionToPostpartumRequest,
  TransitionToPostpartumResponse,
  CycleSymptom,
  LogCycleSymptomRequest,
  CycleSymptomResponse,
  CycleSymptomsResponse,
  CycleSymptomPattern,
  CycleSymptomPatternsResponse,
  CycleSymptomHistoryItem,
  CycleSymptomHistoryResponse,
  UpdateCycleSymptomRequest,
} from './periods';
export {
  createPeriod,
  getPeriods,
  getPeriod,
  getCurrentCycleStatus,
  updatePeriod,
  deletePeriod,
  getPeriodAnalytics,
  getPeriodStatistics,
  getPregnancyStatus,
  updatePregnancyInfo,
  logPregnancySymptom,
  getPregnancyHistory,
  transitionToPostpartum,
  logCycleSymptom,
  getCycleSymptoms,
  getCycleSymptomPatterns,
  getCycleSymptomHistory,
  getCycleSymptom,
  updateCycleSymptom,
  deleteCycleSymptom,
} from './periods';
export type {
  Sleep,
  LogSleepRequest,
  SleepResponse,
  SleepsResponse,
  SleepStatisticsResponse,
  SleepPhasePattern,
  SleepPatternsResponse,
  SleepInsightsResponse,
  UpdateSleepRequest,
  SleepFilters,
  AnalyticsDateRange,
} from './sleep';
export {
  logSleep,
  SLEEP_ANALYTICS_DEFAULT_DAYS,
  getDefaultAnalyticsDateRange,
  getSleepLogs,
  getSleepStatistics,
  getSleepPatternsByPhase,
  getSleepInsights,
  getSleep,
  updateSleep,
  deleteSleep,
} from './sleep';
export type {
  Journal,
  JournalsResponse,
  JournalResponse,
  CreateJournalRequest,
  UpdateJournalRequest,
  JournalListParams,
} from './journals';
export {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} from './journals';

export type {
  CyclePhaseContent,
  CyclePhaseContentResponse,
  WeeklyUpdate,
  WeeklyUpdatesResponse,
  DidYouKnow,
  DidYouKnowResponse,
  PersonalizedInsight,
  PersonalizedInsightResponse,
} from './cyclePhaseContent';
export {
  getCyclePhaseContent,
  getWeeklyUpdatesByPhase,
  getDidYouKnowByPhase,
  getPersonalizedInsight,
} from './cyclePhaseContent';

export type {
  MealOption,
  NutritionTimeSlot,
  DailyMealPlan,
  DailyMealPlanResponse,
  WeeklyMealPlanResponse,
  SwapMealResponse,
  SetMealCompletedResponse,
  Meal,
  MealDetailResponse,
  WeeklyMealStructure,
  WeeklyMealPlanDay,
  WeeklyMealPlanning,
  WeeklyPlanningResponse,
  WeeklyPlanningGenerateResponse,
  GroceryListItem,
  WeeklyGroceryList,
  WeeklyGroceryListResponse,
} from './nutrition';
export {
  getDailyNutritionPlan,
  getWeeklyNutritionPlan,
  regenerateNutritionPlan,
  swapMealOptionApi,
  setMealCompletedApi,
  getMealDetail,
  getWeeklyPlanning,
  generateWeeklyPlanning,
  skipWeeklyPlanning,
  getWeeklyGroceryList,
  regenerateWeeklyGroceryList,
  addWeeklyGroceryItem,
  deleteWeeklyGroceryItem,
  updateWeeklyGroceryItem,
} from './nutrition';
export type {
  WorkoutOption,
  LoggedWorkout,
  DailyWorkoutPlan,
  DailyWorkoutPlanResponse,
  LogWorkoutRequest,
  LogWorkoutResponse,
  WorkoutLibraryResponse,
  CreateCustomWorkoutRequest,
  CreateCustomWorkoutResponse,
  UpdateCustomWorkoutRequest,
  UpdateCustomWorkoutResponse,
  DeleteCustomWorkoutResponse,
  PersonalizedMovementContent,
  PersonalizedMovementContentResponse,
  CycleMovementMapPhase,
  CycleMovementMapResponse,
  MovementScienceItem,
  MovementScienceResponse,
  PhaseInfo,
  PhaseInfoResponse,
  Workout,
  WorkoutDetailResponse,
} from './workouts';
export {
  getDailyWorkoutPlan,
  regenerateWorkoutPlan,
  logWorkoutApi,
  getWorkoutLibrary,
  createCustomWorkoutApi,
  updateCustomWorkoutApi,
  deleteCustomWorkoutApi,
  getPersonalizedMovementContent,
  getCycleMovementMap,
  getMovementScience,
  getPhaseInfo,
  getWorkoutDetail,
} from './workouts';
export type {
  FastingProtocol,
  FastingSession,
  FastingInsights,
  GetFastingProtocolsResponse,
  GetFastingCurrentResponse,
  GetFastingHistoryResponse,
  GetFastingInsightsResponse,
  CreateFastingProtocolRequest,
  UpdateFastingProtocolRequest,
  StartFastingSessionRequest,
  EndFastingSessionRequest,
  UpdateFastingSessionRequest,
  GetFastingHistoryParams,
} from './fasting';
export {
  getFastingProtocols,
  createFastingProtocol,
  updateFastingProtocol,
  deleteFastingProtocolApi,
  getFastingCurrent,
  startFastingSession,
  endFastingSession,
  cancelFastingSession,
  updateFastingSession,
  getFastingHistory,
  getFastingInsights,
} from './fasting';

export type {
  ChallengePhase,
  ChallengePathway,
  ChallengeStackTimingInfo,
  ChallengeStackPhase,
  ChallengeStackContent,
  ChallengeFeatures,
  Challenge,
  ChallengeInstanceSummary,
  ChallengeListItem,
  GetAllChallengesResponse,
  GetChallengeDetailResponse,
  StartChallengeResponse,
  ChallengeTaskType,
  ChallengeTask,
  ChallengeDay,
  GetChallengeTodayResponse,
  CompleteChallengeTaskResponse,
  GetChallengeStackContentResponse,
  ChallengePathwayWithProgress,
  GetChallengePathwaysResponse,
  ChallengeHabitTask,
  ChallengePhaseHabits,
  GetChallengeHabitsResponse,
  GetChallengeProgressResponse,
} from './challenges';
export {
  getAllChallenges,
  getChallengeDetail,
  startChallenge,
  getChallengeToday,
  completeChallengeTask,
  getChallengeStackContent,
  getChallengePathways,
  getChallengeHabits,
  getChallengeProgress,
} from './challenges';

export type {
  RitualSection,
  RitualInteraction,
  RitualDefinitionDto,
  UserRitualPreferenceDto,
  RitualDefinitionsResponse,
  CreateCustomRitualRequest,
  CreateCustomRitualResponse,
  RitualPreferencesResponse,
  RitualCompletionsResponse,
} from './rituals';
export {
  getRitualDefinitions,
  postCustomRitual,
  deleteCustomRitual,
  getRitualPreferences,
  putRitualPreferences,
  getRitualCompletions,
  postRitualDayToggle,
} from './rituals';
