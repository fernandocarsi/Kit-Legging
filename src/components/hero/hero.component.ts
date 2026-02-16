
import { Component, ChangeDetectionStrategy, input, signal, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="offer-section" class="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        <!-- Gallery -->
        <div class="flex flex-col gap-4">
          <div class="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square group bg-gray-100 shadow-2xl">
            <!-- Main Image -->
            <img [src]="images[currentImage()]" 
                 alt="Legging Max Fitness" 
                 class="w-full h-full object-cover transition-transform duration-700 hover:scale-110 cursor-zoom-in">
            
            <!-- Badge -->
            <div class="absolute top-4 left-4 bg-[#FF007F] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg z-10 font-tech">
              Mais Vendido
            </div>
            
            <!-- Navigation -->
            <button (click)="prevImage()" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-all text-black z-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button (click)="nextImage()" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-all text-black z-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            @for (img of images; track $index) {
              <button (click)="setImage($index)" 
                      [class.ring-2]="currentImage() === $index"
                      [class.ring-[#FF007F]]="currentImage() === $index"
                      class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 transition-all opacity-80 hover:opacity-100">
                <img [src]="img" class="w-full h-full object-cover">
              </button>
            }
          </div>
        </div>

        <!-- Product Details -->
        <div class="flex flex-col gap-6 pt-4">
          
          <div>
            <div class="flex items-center gap-2 mb-2">
               <div class="flex text-[#FF007F]">
                 <svg *ngFor="let i of [1,2,3,4,5]" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               </div>
               <span class="text-sm text-gray-500 font-medium">(1.248 avaliações)</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold font-tech text-[#0A0A0A] leading-tight">
              Kit 5 Unidades Calça Legging Max Fitness
            </h1>
            <p class="text-gray-500 mt-2 text-lg">Tecnologia Seamless Dry para conforto extremo e zero transparência.</p>
          </div>

          <!-- Price -->
          <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="flex items-end gap-3 mb-1">
              <span class="text-gray-400 line-through text-lg font-medium">R$ 178,00</span>
              <span class="text-4xl font-black text-[#0A0A0A] font-tech">R$ 99,00</span>
            </div>
            <p class="text-[#FF007F] font-bold text-sm tracking-wide bg-[#FF007F]/10 inline-block px-2 py-1 rounded">
              ECONOMIZE R$ 79,00 HOJE
            </p>
          </div>

          <!-- Selectors -->
          <div class="space-y-4">
            <div>
              <h3 class="font-bold text-sm uppercase tracking-wide text-gray-900 mb-3">Kit Fixo (5 Cores)</h3>
              <div class="flex gap-2">
                <div class="w-8 h-8 rounded-full bg-black border-2 border-gray-200" title="Preto"></div>
                <div class="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-200" title="Cinza"></div>
                <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-gray-200" title="Vermelho"></div>
                <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-gray-200" title="Azul"></div>
                <div class="w-8 h-8 rounded-full bg-[#E1C699] border-2 border-gray-200" title="Bege"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-3">
                 <h3 class="font-bold text-sm uppercase tracking-wide text-gray-900">Selecione o Tamanho</h3>
                 <button class="text-xs text-gray-500 underline">Guia de medidas</button>
              </div>
              <div class="grid grid-cols-5 gap-2">
                @for (size of sizes; track size.label) {
                  <button (click)="selectSize(size.label)"
                          [class.bg-black]="selectedSize() === size.label"
                          [class.text-white]="selectedSize() === size.label"
                          [class.border-black]="selectedSize() === size.label"
                          class="border border-gray-300 rounded-lg py-3 flex flex-col items-center justify-center hover:border-black transition-all group">
                    <span class="font-bold text-sm">{{ size.label }}</span>
                    <span class="text-[10px] text-gray-500 group-hover:text-gray-800" 
                          [class.text-gray-400]="selectedSize() === size.label">{{ size.range }}</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-4">
            <button (click)="buyClicked.emit()" class="w-full bg-[#FF007F] hover:bg-[#D9006C] text-white text-xl font-bold font-tech py-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,0,127,0.39)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3">
              <span>QUERO MEU KIT AGORA</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <p class="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Entrega garantida para {{ city() }} em até 12 dias
            </p>
          </div>

          <!-- Benefits List -->
          <div class="grid grid-cols-2 gap-3 mt-4">
             <div class="flex items-center gap-2 text-sm text-gray-700">
               <div class="w-1 h-1 bg-[#FF007F] rounded-full"></div>
               Conforto extremo
             </div>
             <div class="flex items-center gap-2 text-sm text-gray-700">
               <div class="w-1 h-1 bg-[#FF007F] rounded-full"></div>
               Alta compressão
             </div>
             <div class="flex items-center gap-2 text-sm text-gray-700">
               <div class="w-1 h-1 bg-[#FF007F] rounded-full"></div>
               Secagem rápida
             </div>
             <div class="flex items-center gap-2 text-sm text-gray-700">
               <div class="w-1 h-1 bg-[#FF007F] rounded-full"></div>
               Zero transparência
             </div>
          </div>

        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  city = input.required<string>();
  buyClicked = output<void>();
  
  images = [
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/ImagemPrincipalKitLupo.png?w=1024&h=1024',
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/Design%20sem%20nome%20(20).png',
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/Design%20sem%20nome%20(18).png',
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/Design%20sem%20nome%20(19).png',
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/D_NQ_NP_2X_858841-MLB92376045635_092025-F-calca-legging-feminina-lupo-max-kit-c-2-academia-fitness.webp',
    'https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/D_NQ_NP_2X_795944-MLB91417428628_092025-F-calca-legging-feminina-lupo-max-kit-c-2-academia-fitness.webp'
  ];

  sizes = [
    { label: 'P', range: '36-38' },
    { label: 'M', range: '40-42' },
    { label: 'G', range: '44-46' },
    { label: 'GG', range: '48-50' },
    { label: 'XG', range: '50-52' }
  ];

  // Changed to model for two-way binding with parent
  selectedSize = model<string>('M');
  
  currentImage = signal(0);

  selectSize(size: string) {
    this.selectedSize.set(size);
  }

  setImage(index: number) {
    this.currentImage.set(index);
  }

  nextImage() {
    this.currentImage.update(i => (i + 1) % this.images.length);
  }

  prevImage() {
    this.currentImage.update(i => (i - 1 + this.images.length) % this.images.length);
  }
}
