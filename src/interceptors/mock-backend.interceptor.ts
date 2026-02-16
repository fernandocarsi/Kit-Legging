
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

// Simulation state
let currentTxid = '';
let creationTime = 0;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept calls to our simulated internal backend
  if (!req.url.includes('/api/pix')) {
    return next(req);
  }

  console.log(`[Backend Proxy] ${req.method} ${req.url}`);

  // 1. Mock Create PIX Endpoint
  if (req.url.includes('/create') && req.method === 'POST') {
    const body = req.body as any;

    if (!body.cpf || !body.amount) {
      return throwError(() => ({ status: 400, message: 'Dados inválidos' }));
    }

    currentTxid = 'evt_' + Math.random().toString(36).substr(2, 9);
    creationTime = Date.now();

    // ⚠️ REALISTIC MOCK DATA
    const response = new HttpResponse({
      status: 200,
      body: {
        txid: currentTxid,
        status: 'pending',
        // Realistic PIX Copy and Paste Code
        pix_code: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865406123.455802BR5913Max Fitness6008Sao Paulo62070503***6304E2CA',
        // Valid Base64 QR Code Image (Generates a scannable "Test" QR)
        qrcode: 'iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAACFI5MzAAAA2klEQVR42u3YQQqEMBAEwP7/oz2E3IIQyO7s7hSC0ySEtI5jGqY4+6yUUkop/y2W66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657qrrunuunueq66657q9eSiml/I4bF6F/aT62v4sAAAAASUVORK5CYII='
      }
    });

    return of(response).pipe(delay(1500)); 
  }

  // 2. Mock Status Check Endpoint
  if (req.url.includes('/status') && req.method === 'POST') {
    // Simulate payment approval after 10 seconds
    const isPaid = (Date.now() - creationTime) > 10000; 

    const response = new HttpResponse({
      status: 200,
      body: {
        txid: currentTxid,
        status: isPaid ? 'paid' : 'pending'
      }
    });

    return of(response).pipe(delay(500));
  }

  return next(req);
};
