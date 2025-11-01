import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RagService, AskRequest, AskResponse } from './services/rag.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = '📄 Document Q&A Assistant';
  selectedFile?: File;
  uploadedFileName = '';
  question = '';
  answer = '';
  sources: string[] = [];
  uploading = false;
  loading = false;

  constructor(private rag: RagService) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.rag.uploadDocument(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadedFileName = this.selectedFile!.name;
        this.uploading = false;
        alert(`✅ File uploaded successfully! (${res.chunks} chunks created)`);
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploading = false;
        alert('❌ Upload failed!');
      },
    });
  }

  onAsk() {
    if (!this.question) return;
    this.loading = true;

    const req: AskRequest = {
      question: this.question,
      filename: this.uploadedFileName,
      k: 5,
    };

    this.rag.askQuestion(req).subscribe({
      next: (res: AskResponse) => {
        this.answer = res.answer;
        this.sources = res.contexts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ask error:', err);
        this.loading = false;
        this.answer = '❌ Something went wrong while fetching the answer.';
      },
    });
  }
}
