
import { Component, ChangeDetectionStrategy, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4 max-w-3xl">
        <h2 class="text-3xl font-bold font-tech text-center mb-10">Dúvidas Frequentes</h2>

        <div class="space-y-4">
          @for (item of faqItems; track $index) {
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <button (click)="toggle($index)" class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                <span class="font-bold text-gray-900">{{ item.question }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300" [class.rotate-180]="isOpen($index)"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              @if (isOpen($index)) {
                <div class="p-4 bg-white text-gray-600 text-sm leading-relaxed animate-fade-in">
                  {{ item.answer }}
                </div>
              }
            </div>
          }
        </div>

        <!-- Trust Badges -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 pt-12">
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
             </div>
             <span class="text-xs font-bold text-gray-600">Entrega Rápida</span>
           </div>
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             </div>
             <span class="text-xs font-bold text-gray-600">Site Seguro</span>
           </div>
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
             </div>
             <span class="text-xs font-bold text-gray-600">Satisfação Garantida</span>
           </div>
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
             </div>
             <span class="text-xs font-bold text-gray-600">Devolução Grátis</span>
           </div>
        </div>

        <!-- Final CTA -->
        <div class="mt-16 bg-[#0A0A0A] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-[#FF007F] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <h2 class="text-3xl text-white font-tech font-bold mb-4">Pronta para transformar seu treino?</h2>
          <p class="text-gray-400 mb-8">Aproveite o preço promocional antes que o estoque acabe.</p>
          <button (click)="buyClicked.emit()" 
                  class="bg-[#FF007F] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,0,127,0.5)] transition-all transform hover:scale-105">
            GARANTIR MEU KIT COM DESCONTO
          </button>
        </div>

      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent {
  openIndex = signal<number | null>(0);
  buyClicked = output<void>();

  faqItems = [
    { question: 'O kit vem com cores repetidas?', answer: 'Não! O kit é fixo e enviado com 1 unidade de cada cor: Preto, Cinza, Vermelho, Azul e Bege, totalizando 5 peças.' },
    { question: 'O tecido marca celulite?', answer: 'Nossas leggings possuem tecido texturizado com tecnologia que disfarça imperfeições da pele e não marca celulite.' },
    { question: 'Qual o prazo de entrega?', answer: 'O prazo médio é de 7 a 12 dias úteis, dependendo da sua região. Você receberá o código de rastreio em até 48h.' },
    { question: 'Como funciona a troca?', answer: 'A primeira troca é gratuita. Se o tamanho não servir, você tem até 7 dias após o recebimento para solicitar a troca.' },
    { question: 'Quais as formas de pagamento?', answer: 'Aceitamos Cartão de Crédito em até 12x, PIX com aprovação imediata e Boleto Bancário.' }
  ];

  isOpen(index: number) {
    return this.openIndex() === index;
  }

  toggle(index: number) {
    this.openIndex.update(current => current === index ? null : index);
  }
}
