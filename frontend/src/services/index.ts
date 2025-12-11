// Export all services from a single entry point
export { default as api } from './api';
export type { User, LoginResponse, ApiError } from './api';

export { default as authService } from './authService';
export type { LoginCredentials, RegisterData } from './authService';

export { default as teacherService } from './teacherService';
export type { Teacher, Department, CreateTeacherData } from './teacherService';

export { default as kpiService } from './kpiService';
export type { KPI, CreateKPIData, UpdateProgressData } from './kpiService';

export { default as evaluationService } from './evaluationService';
export type {
    Evaluation,
    ClassroomObservation,
    AnnualAppraisal,
    Feedback,
    ReEvaluationRequest
} from './evaluationService';
