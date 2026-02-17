
<<<<<<< HEAD

=======
import '@angular/compiler';
>>>>>>> e2e38a68bf032da9f60bece63b838655e15aac5f
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockBackendInterceptor } from './src/interceptors/mock-backend.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([mockBackendInterceptor])) 
  ]
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
