
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="reviews" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        
        <div class="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
           <div>
             <h2 class="text-3xl font-bold font-tech mb-2">Quem comprou, aprovou</h2>
             <div class="flex items-center gap-2">
               <span class="text-2xl font-bold">4.8</span>
               <div class="flex text-[#FF007F]">
                 <svg *ngFor="let i of [1,2,3,4,5]" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
               </div>
               <span class="text-gray-500">(1.248 avaliações)</span>
             </div>
           </div>
           <button class="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all">Ver todas</button>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          @for (review of reviews; track review.name) {
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div class="flex items-center gap-4 mb-4">
                 <img [src]="review.avatar" class="w-10 h-10 rounded-full object-cover">
                 <div>
                   <h4 class="font-bold text-sm">{{ review.name }}</h4>
                   <div class="flex text-[#FF007F] text-xs">
                     <svg *ngFor="let i of [1,2,3,4,5]" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                   </div>
                 </div>
               </div>
               <p class="text-gray-600 text-sm leading-relaxed mb-4">"{{ review.text }}"</p>
               <div class="text-xs text-gray-400 flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 Comprador verificado
               </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent {
  reviews = [
    {
      name: 'Ana Cláudia Silva',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      text: 'Simplesmente amei! O tecido é super confortável e não fica transparente nem no agachamento. Peguei o tamanho M e serviu perfeitamente. A entrega foi super rápida aqui pro Rio.'
    },
    {
      name: 'Juliana Mendes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      text: 'O custo benefício é imbatível. 5 leggings por esse preço e com essa qualidade é difícil achar. Uso para crossfit e elas aguentam super bem o tranco.'
    },
    {
      name: 'Carla Dias',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      text: 'Estava com receio do tecido marcar celulite, mas a textura disfarça tudo! A cintura alta segura bem a barriga sem apertar. Vou comprar outro kit.'
    }
  ];
}
