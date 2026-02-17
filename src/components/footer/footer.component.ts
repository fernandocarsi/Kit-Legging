
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer id="contact" class="bg-[#0A0A0A] text-white border-t border-white/10 pt-16 pb-24 md:pb-8">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 mb-12">
          
          <!-- Brand -->
          <div class="col-span-1 md:col-span-1">
             <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-[#FF007F] rounded flex items-center justify-center text-white font-bold font-tech">M</div>
                <span class="text-white font-tech font-bold text-xl">MAX<span class="text-[#FF007F]">FITNESS</span></span>
             </div>
             <p class="text-gray-500 text-sm leading-relaxed">
               Moda fitness com tecnologia de ponta para mulheres que buscam performance e estilo.
             </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-bold text-sm uppercase tracking-wider mb-4 text-gray-400">Institucional</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li><a href="#" class="hover:text-[#FF007F] transition-colors">Sobre Nós</a></li>
              <li><a href="#" class="hover:text-[#FF007F] transition-colors">Política de Privacidade</a></li>
              <li><a href="#" class="hover:text-[#FF007F] transition-colors">Termos de Uso</a></li>
              <li><a href="#" class="hover:text-[#FF007F] transition-colors">Trocas e Devoluções</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-bold text-sm uppercase tracking-wider mb-4 text-gray-400">Atendimento</h4>
            <ul class="space-y-2 text-sm text-gray-500">
              <li class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                (11) 99999-9999
              </li>
              <li class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                suporte&#64;maxfitness.com
              </li>
              <li class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Seg à Sex, 9h às 18h
              </li>
            </ul>
          </div>

          <!-- Payment -->
          <div>
            <h4 class="font-bold text-sm uppercase tracking-wider mb-4 text-gray-400">Pagamento Seguro</h4>
            <div class="flex flex-wrap gap-2">
               <div class="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black border border-gray-600">VISA</div>
               <div class="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black border border-gray-600">MASTER</div>
               <div class="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black border border-gray-600">PIX</div>
               <div class="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black border border-gray-600">ELO</div>
            </div>
             <div class="mt-4 flex items-center gap-2 text-xs text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
               Ambiente 256-bit SSL Encrypted
             </div>
          </div>

        </div>
        
        <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
           <p>&copy; 2026 Max Fitness. Todos os direitos reservados.</p>
           <p>CNPJ: 00.000.000/0001-00 | Rua Exemplo, 123, São Paulo - SP</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {}
