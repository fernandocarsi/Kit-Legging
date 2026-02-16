
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <!-- Announcement Bar -->
      <div class="bg-[#0A0A0A] text-white text-xs py-2 px-4 text-center tracking-wide overflow-hidden relative">
        <div class="flex items-center justify-center gap-4 animate-pulse">
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF007F]"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            Frete Grátis para {{ city() }}
          </span>
          <span class="hidden md:inline text-gray-500">|</span>
          <span class="flex items-center gap-1 font-bold text-[#FF007F]">
             Promoção Ativa Hoje
          </span>
          <span class="hidden md:inline text-gray-500">|</span>
          <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Pagamento 100% Seguro
          </span>
        </div>
      </div>

      <!-- Main Header -->
      <div class="glass-dark border-b border-white/5 shadow-lg">
        <div class="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2 group cursor-pointer">
            <div class="w-8 h-8 bg-[#FF007F] rounded flex items-center justify-center text-white font-bold text-lg font-tech group-hover:neon-glow transition-all">M</div>
            <span class="text-white font-tech font-bold text-xl tracking-tighter">MAX<span class="text-[#FF007F]">FITNESS</span></span>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#" class="hover:text-white hover:text-[#FF007F] transition-colors">Início</a>
            <a href="#offer-section" class="hover:text-white hover:text-[#FF007F] transition-colors">Loja</a>
            <a href="#reviews" class="hover:text-white hover:text-[#FF007F] transition-colors">Avaliações</a>
            <a href="#contact" class="hover:text-white hover:text-[#FF007F] transition-colors">Contato</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-4">
             <button class="relative p-2 text-white hover:text-[#FF007F] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="absolute top-0 right-0 w-4 h-4 bg-[#FF007F] rounded-full text-[10px] flex items-center justify-center text-white font-bold">0</span>
             </button>
             <button class="md:hidden text-white" (click)="toggleMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu Dropdown -->
      @if (menuOpen) {
        <div class="md:hidden glass-dark border-t border-white/10 absolute w-full p-4 flex flex-col gap-4 text-gray-300 font-medium animate-fade-in-down">
            <a href="#" (click)="toggleMenu()" class="block py-2 border-b border-white/5">Início</a>
            <a href="#offer-section" (click)="toggleMenu()" class="block py-2 border-b border-white/5">Loja</a>
            <a href="#reviews" (click)="toggleMenu()" class="block py-2 border-b border-white/5">Avaliações</a>
            <a href="#contact" (click)="toggleMenu()" class="block py-2">Contato</a>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  city = input.required<string>();
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
