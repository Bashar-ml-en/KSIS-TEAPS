import api from './api';

export interface Evaluation {
    id: number;
    teacher_id: number;
    evaluator_id: number;
    type: 'classroom_observation' | 'annual_appraisal' | 'peer_review';
    status: 'draft' | 'submitted' | 'reviewed' | 'approved';
    score?: number;
    comments?: string;
    created_at: string;
    updated_at: string;
}

export interface ClassroomObservation {
    id: number;
    teacher_id: number;
    observer_id: number;
    observation_date: string;
    subject: string;
    class_name: string;
    teaching_effectiveness: number;
    classroom_management: number;
    student_engagement: number;
    comments?: string;
    recommendations?: string;
    status: 'scheduled' | 'completed' | 'reviewed';
    created_at: string;
    updated_at: string;
}

export interface AnnualAppraisal {
    id: number;
    teacher_id: number;
    reviewer_id: number;
    academic_year: string;
    overall_score: number;
    strengths?: string;
    areas_for_improvement?: string;
    goals_for_next_year?: string;
    status: 'draft' | 'submitted' | 'reviewed' | 'approved';
    created_at: string;
    updated_at: string;
}

export interface Feedback {
    id: number;
    teacher_id: number;
    source: 'student' | 'peer' | 'principal' | 'self';
    rating: number;
    comment: string;
    is_anonymous: boolean;
    created_at: string;
}

export interface ReEvaluationRequest {
    id: number;
    evaluation_id: number;
    teacher_id: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewer_notes?: string;
    created_at: string;
    updated_at: string;
}

class EvaluationService {
    // Classroom Observations
    async getClassroomObservations(): Promise<ClassroomObservation[]> {
        const response = await api.get<{ observations: ClassroomObservation[] }>('/classroom-observations');
        return response.data.observations;
    }

    async createClassroomObservation(data: Partial<ClassroomObservation>): Promise<ClassroomObservation> {
        const response = await api.post<{ observation: ClassroomObservation }>('/classroom-observations', data);
        return response.data.observation;
    }

    // Annual Appraisals
    async getAnnualAppraisals(): Promise<AnnualAppraisal[]> {
        const response = await api.get<{ appraisals: AnnualAppraisal[] }>('/annual-appraisals');
        return response.data.appraisals;
    }

    async createAnnualAppraisal(data: Partial<AnnualAppraisal>): Promise<AnnualAppraisal> {
        const response = await api.post<{ appraisal: AnnualAppraisal }>('/annual-appraisals', data);
        return response.data.appraisal;
    }

    // Feedback
    async getFeedback(): Promise<Feedback[]> {
        const response = await api.get<{ feedback: Feedback[] }>('/feedback');
        return response.data.feedback;
    }

    async submitFeedback(data: Partial<Feedback>): Promise<Feedback> {
        const response = await api.post<{ feedback: Feedback }>('/feedback', data);
        return response.data.feedback;
    }

    // Re-evaluation Requests
    async getReEvaluationRequests(): Promise<ReEvaluationRequest[]> {
        const response = await api.get<{ requests: ReEvaluationRequest[] }>('/re-evaluation-requests');
        return response.data.requests;
    }

    async createReEvaluationRequest(data: { evaluation_id: number; reason: string }): Promise<ReEvaluationRequest> {
        const response = await api.post<{ request: ReEvaluationRequest }>('/re-evaluation-requests', data);
        return response.data.request;
    }

    async respondToReEvaluationRequest(id: number, data: { status: 'approved' | 'rejected'; notes?: string }): Promise<ReEvaluationRequest> {
        const response = await api.put<{ request: ReEvaluationRequest }>(`/re-evaluation-requests/${id}`, data);
        return response.data.request;
    }
}

export const evaluationService = new EvaluationService();
export default evaluationService;
