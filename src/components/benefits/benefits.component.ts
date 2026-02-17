
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-[#0A0A0A] text-white relative overflow-hidden">
      <!-- Decorator -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-[#FF007F] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="container mx-auto px-4">
        
        <div class="text-center mb-12">
           <h2 class="text-3xl md:text-4xl font-bold font-tech mb-4">Tecnologia do Futuro</h2>
           <p class="text-gray-400 max-w-2xl mx-auto">Desenvolvida com engenharia têxtil avançada para proporcionar o máximo de performance.</p>
        </div>

        <!-- Cards Grid -->
        <div class="grid md:grid-cols-3 gap-6 mb-16">
          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
             <div class="w-12 h-12 bg-[#FF007F]/20 rounded-lg flex items-center justify-center text-[#FF007F] mb-4 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
             </div>
             <h3 class="font-bold text-xl mb-2">Modelagem Sem Costura</h3>
             <p class="text-sm text-gray-400 leading-relaxed">Design seamless que não marca o corpo e elimina pontos de atrito, garantindo liberdade total de movimento.</p>
          </div>

          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
             <div class="w-12 h-12 bg-[#FF007F]/20 rounded-lg flex items-center justify-center text-[#FF007F] mb-4 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
             </div>
             <h3 class="font-bold text-xl mb-2">Seamless Dry</h3>
             <p class="text-sm text-gray-400 leading-relaxed">Tecnologia de gerenciamento térmico que absorve o suor e mantém a pele seca durante treinos intensos.</p>
          </div>

          <div class="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
             <div class="w-12 h-12 bg-[#FF007F]/20 rounded-lg flex items-center justify-center text-[#FF007F] mb-4 group-hover:scale-110 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
             </div>
             <h3 class="font-bold text-xl mb-2">Cós Anatômico</h3>
             <p class="text-sm text-gray-400 leading-relaxed">Sistema de alta sustentação com silicone interno que impede a peça de descer durante agachamentos.</p>
          </div>
        </div>

        <!-- Tech Specs -->
        <div class="bg-white text-black rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row gap-12 items-center">
           <div class="flex-1 space-y-6">
              <h3 class="text-2xl font-bold font-tech">Especificações Técnicas</h3>
              
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                   <span class="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                   <div>
                     <span class="font-bold block">Composição Premium</span>
                     <span class="text-gray-600 text-sm">96% Poliamida, 4% Elastano para máxima durabilidade.</span>
                   </div>
                </li>
                <li class="flex items-start gap-3">
                   <span class="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                   <div>
                     <span class="font-bold block">Fio Texturizado</span>
                     <span class="text-gray-600 text-sm">Toque suave semelhante ao algodão, mas com a resistência do sintético.</span>
                   </div>
                </li>
                <li class="flex items-start gap-3">
                   <span class="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                   <div>
                     <span class="font-bold block">Kit Completo</span>
                     <span class="text-gray-600 text-sm">5 Unidades: Preto, Cinza, Vermelho, Azul e Bege.</span>
                   </div>
                </li>
              </ul>
           </div>
           
           <div class="flex-1 w-full relative">
              <div class="aspect-video rounded-xl bg-gray-100 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
              </div>
           </div>
        </div>

      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BenefitsComponent {}
