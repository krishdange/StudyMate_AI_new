// Backend API Client
// Replaces Supabase client

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  detail: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail || 'Request failed');
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return {} as T;
  }

  // Auth endpoints
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.request<{ access_token: string; token_type: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName || '',
        last_name: lastName || '',
      }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // Chat endpoints
  async sendChatMessage(message: string, documentId?: number) {
    return this.request<{
      id: number;
      message: string;
      response: string;
      message_type: string;
      document_id: number | null;
      created_at: string;
    }>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, document_id: documentId }),
    });
  }

  async getChatHistory(limit = 50) {
    return this.request<{ messages: any[] }>(`/chat/history?limit=${limit}`);
  }

  async clearChatHistory() {
    return this.request('/chat/clear', { method: 'DELETE' });
  }

  // Document endpoints
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

  async getDocuments() {
    return this.request<any[]>('/documents/');
  }

  async deleteDocument(id: number) {
    return this.request(`/documents/${id}`, { method: 'DELETE' });
  }

  async askDocumentQuestion(documentId: number, question: string) {
    return this.request<{ question: string; answer: string; document_id: number }>(
      `/documents/${documentId}/ask`,
      {
        method: 'POST',
        body: JSON.stringify({ question }),
      }
    );
  }

  // MCQ endpoints
  async generateMCQ(topic: string, count: number = 5, difficulty: string = 'medium') {
    return this.request<{
      id: number;
      title: string;
      topic: string;
      difficulty: string;
      questions: Array<{
        id: number;
        question: string;
        options: string[];
        correct_answer: number;
        explanation: string;
      }>;
      created_at: string;
    }>('/mcq/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, count, difficulty }),
    });
  }

  async getMCQSets() {
    return this.request<any[]>('/mcq/sets');
  }

  async getMCQSet(id: number) {
    return this.request<any>(`/mcq/sets/${id}`);
  }

  async submitMCQAnswers(setId: number, answers: Record<number, number>) {
    return this.request<{
      score: number;
      total: number;
      percentage: number;
      results: any[];
    }>(`/mcq/sets/${setId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Notes endpoints
  async generateNotes(topic: string, formatType: string = 'bullet') {
    return this.request<{
      id: number;
      title: string;
      topic: string;
      content: string;
      format_type: string;
      created_at: string;
      updated_at: string;
    }>('/notes/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, format_type: formatType }),
    });
  }

  async getNotes() {
    return this.request<any[]>('/notes/');
  }

  async deleteNote(id: number) {
    return this.request(`/notes/${id}`, { method: 'DELETE' });
  }

  // Study Planner endpoints
  async createStudyPlan(subjects: string[], timeline: string, goals: string) {
    return this.request<any>('/planner/create', {
      method: 'POST',
      body: JSON.stringify({ subjects, timeline, goals }),
    });
  }

  async getStudyPlans() {
    return this.request<any[]>('/planner/');
  }

  async updateStudyPlan(id: number, subjects: string[], timeline: string, goals: string) {
    return this.request<any>(`/planner/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ subjects, timeline, goals }),
    });
  }

  // Speech endpoints
  async transcribeAudio(file: File, language?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (language) {
      formData.append('language', language);
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseUrl}/speech/transcribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Transcription failed' }));
      throw new Error(error.detail || 'Transcription failed');
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);

