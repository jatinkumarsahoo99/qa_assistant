import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  status: string;
  chunks: number;
}

export interface AskRequest {
  question: string;
  filename: string;
  k?: number;
}

export interface AskResponse {
  answer: string;
  contexts: string[];
}

@Injectable({ providedIn: 'root' })
export class RagService {
  private baseUrl = 'http://localhost:8000'; // Your FastAPI backend

  constructor(private http: HttpClient) {}

  uploadDocument(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }

  askQuestion(request: AskRequest): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/ask`, request);
  }
}
