
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PixChargeRequest {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  amount: number; // Value in cents
  description: string;
}

export interface PixChargeResponse {
  txid: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  qrcode: string;   // Base64 image string for the <img> tag
  pix_code: string; // The "Copy and Paste" string
}

export interface PixStatusResponse {
  txid: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
}

@Injectable({
  providedIn: 'root'
})
export class PayEvoService {
  private http: HttpClient = inject(HttpClient);
  
  // Points to the Node.js backend. 
  // In development (preview), this is intercepted by mock-backend.interceptor.ts
  // In production, this points to your deployed server URL.
  private apiUrl = '/api/pix'; 

  createPixCharge(data: PixChargeRequest): Observable<PixChargeResponse> {
    return this.http.post<PixChargeResponse>(`${this.apiUrl}/create`, data);
  }

  checkPixStatus(txid: string): Observable<PixStatusResponse> {
    return this.http.post<PixStatusResponse>(`${this.apiUrl}/status`, { txid });
  }
}
