
import { Component, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { FaqComponent } from './components/faq/faq.component';
import { FooterComponent } from './components/footer/footer.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    BenefitsComponent,
    ReviewsComponent,
    FaqComponent,
    FooterComponent,
    CheckoutComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  city = signal<string>('sua região');
  currentView = signal<'landing' | 'checkout'>('landing');
  selectedSize = signal<string>('M');

  constructor() {
    this.detectLocation();
  }

  detectLocation() {
    // Mock location detection for privacy/simplicity in this demo
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Brasília'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    this.city.set(randomCity);
  }

  toggleCheckout() {
    this.currentView.set('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goHome() {
    this.currentView.set('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
