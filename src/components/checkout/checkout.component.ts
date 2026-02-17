
import { Component, ChangeDetectionStrategy, input, signal, computed, output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayEvoService, PixChargeResponse } from '../../services/payevo.service';
import { Subject, interval, takeUntil, switchMap, filter, take, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 text-[#0A0A0A] font-sans pb-20 md:pb-0">
      
      <!-- 1) Trust Bar -->
      <div class="bg-[#0A0A0A] text-white text-[10px] md:text-xs py-2 px-4 text-center tracking-wide border-b border-white/10 z-50 relative">
        <div class="container mx-auto flex justify-center md:justify-between items-center">
          <div class="hidden md:flex items-center gap-2 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             Ambiente Criptografado 256-bit
          </div>
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1 text-[#FF007F] font-bold animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Pagamento 100% Seguro
            </span>
            <span class="text-gray-600">|</span>
            <span class="flex items-center gap-1 text-gray-300">
               Frete Grátis para <strong class="text-white">{{ city() }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- 2) Header Simplificado -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          
          <div class="flex items-center gap-4">
            <!-- Back Button -->
            <button (click)="backClicked.emit()" class="text-gray-400 hover:text-[#FF007F] transition-colors p-1" aria-label="Voltar para a loja">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>

            <!-- Logo -->
            <div class="flex items-center gap-2">
               <div class="w-8 h-8 bg-[#FF007F] rounded flex items-center justify-center text-white font-bold font-tech text-lg shadow-[0_0_10px_rgba(255,0,127,0.5)]">M</div>
               <div class="flex flex-col">
                 <span class="font-tech font-bold text-lg leading-none tracking-tighter">MAX<span class="text-[#FF007F]">FITNESS</span></span>
                 <span class="text-[9px] text-gray-400 uppercase tracking-widest leading-none">Checkout Seguro</span>
               </div>
            </div>
          </div>

          <!-- Steps -->
          <div class="flex items-center gap-2 md:gap-4 text-xs font-medium">
            <div class="flex items-center gap-2" [class.text-[#FF007F]]="step() === 1" [class.text-gray-400]="step() !== 1">
              <div class="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold">1</div>
              <span class="hidden md:inline">Dados</span>
            </div>
            <div class="w-4 h-[1px] bg-gray-300"></div>
            <div class="flex items-center gap-2" [class.text-[#FF007F]]="step() === 2" [class.text-gray-400]="step() !== 2">
              <div class="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold">2</div>
              <span class="hidden md:inline">Pagamento</span>
            </div>
            <div class="w-4 h-[1px] bg-gray-300"></div>
            <div class="flex items-center gap-2" [class.text-gray-400]="!paymentSuccess()" [class.text-[#FF007F]]="paymentSuccess()">
              <div class="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold">3</div>
              <span class="hidden md:inline">Fim</span>
            </div>
          </div>
        </div>
      </header>

      @if (orderCompleted()) {
        <!-- 6) Fluxo PIX / Confirmação -->
        <div class="container mx-auto px-4 py-12 max-w-lg animate-fade-in-up">
           <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center p-8 relative">
              
              <!-- Loading Overlay -->
              @if (isProcessing()) {
                <div class="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                  <div class="w-12 h-12 border-4 border-[#FF007F] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p class="font-tech font-bold text-[#FF007F] animate-pulse">Gerando QR Code Seguro...</p>
                </div>
              }

              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF007F] to-purple-600"></div>
              
              @if (paymentSuccess()) {
                <!-- SUCCESS STATE -->
                <div class="animate-scale-in">
                   <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                   <h2 class="text-3xl font-tech font-bold mb-2 text-gray-900">Pagamento Aprovado!</h2>
                   <p class="text-gray-500 mb-8">Seu kit já está sendo separado para envio. Verifique seu e-mail para mais detalhes.</p>
                   <button (click)="backClicked.emit()" class="w-full bg-[#0A0A0A] text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all">
                      VOLTAR PARA LOJA
                   </button>
                </div>
              } @else {
                <!-- PENDING / PIX STATE -->
                <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>

                <h2 class="text-2xl font-tech font-bold mb-2">Pedido Criado!</h2>
                <p class="text-gray-500 mb-6">Finalize o pagamento para liberar seu pedido.</p>

                @if (pixData(); as pix) {
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                     <div class="flex justify-between items-center mb-4">
                       <span class="text-xs font-bold uppercase text-gray-400">Expira em</span>
                       <span class="text-[#FF007F] font-mono font-bold">{{ timerDisplay() }}</span>
                     </div>
                     
                     <!-- QR Code Display -->
                     <div class="bg-white mx-auto mb-4 p-4 shadow-inner rounded-lg border border-gray-200 flex items-center justify-center w-full max-w-[240px] aspect-square">
                        <!-- Displays the base64 string directly from PayEvo -->
                       <img [src]="'data:image/png;base64,' + pix.qrcode" alt="QR Code PIX" class="w-full h-full object-contain opacity-90">
                     </div>

                     <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4 bg-yellow-50 py-2 rounded border border-yellow-100">
                        <span class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        Aguardando pagamento...
                     </div>

                     <!-- Copy and Paste Code -->
                     <div class="relative group">
                        <textarea readonly class="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-[10px] text-gray-500 mb-2 focus:outline-none h-16 resize-none font-mono" (click)="copyPixCode(pix.pix_code)">{{ pix.pix_code }}</textarea>
                        
                        <button (click)="copyPixCode(pix.pix_code)" 
                                class="w-full bg-[#FF007F] hover:bg-[#D9006C] text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                           {{ copied() ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX' }}
                        </button>
                     </div>
                  </div>
                }

                <!-- Payment Status Indicator -->
                <div class="text-xs text-gray-400">
                  <p class="flex items-center justify-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                     Confirmação automática em segundos
                  </p>
                </div>
              }
           </div>
        </div>
      } @else {
        <!-- Checkout Flow -->
        <div class="container mx-auto px-4 py-8 lg:py-12">
          <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()" class="grid lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left Column: Forms -->
            <div class="lg:col-span-7 space-y-8">
              
              <!-- 4) Personal Data -->
              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden group">
                 <div class="absolute left-0 top-0 w-1 h-full bg-[#FF007F] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <h3 class="font-tech font-bold text-lg mb-6 flex items-center gap-2">
                   <span class="w-6 h-6 rounded-full bg-gray-100 text-[#FF007F] flex items-center justify-center text-xs">1</span>
                   Dados Pessoais
                 </h3>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div class="md:col-span-2">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Nome Completo</label>
                     <input type="text" formControlName="name" placeholder="Digite seu nome completo" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                     @if (touchedAndInvalid('name')) { <span class="text-red-500 text-[10px] mt-1">Nome é obrigatório</span> }
                   </div>
                   
                   <div>
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">CPF</label>
                     <input type="text" formControlName="cpf" (input)="maskCPF($event)" placeholder="000.000.000-00" maxlength="14" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                      @if (touchedAndInvalid('cpf')) { <span class="text-red-500 text-[10px] mt-1">CPF inválido</span> }
                   </div>

                   <div>
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Celular (WhatsApp)</label>
                     <input type="text" formControlName="phone" (input)="maskPhone($event)" placeholder="(00) 00000-0000" maxlength="15" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                      @if (touchedAndInvalid('phone')) { <span class="text-red-500 text-[10px] mt-1">Telefone obrigatório</span> }
                   </div>

                   <div class="md:col-span-2">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">E-mail</label>
                     <input type="email" formControlName="email" placeholder="seu@email.com" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                      @if (touchedAndInvalid('email')) { <span class="text-red-500 text-[10px] mt-1">E-mail inválido</span> }
                   </div>
                 </div>
              </section>

              <!-- Address -->
              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden group">
                 <div class="absolute left-0 top-0 w-1 h-full bg-[#FF007F] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <h3 class="font-tech font-bold text-lg mb-6 flex items-center gap-2">
                   <span class="w-6 h-6 rounded-full bg-gray-100 text-[#FF007F] flex items-center justify-center text-xs">2</span>
                   Endereço de Entrega
                 </h3>

                 <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div class="md:col-span-2">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">CEP</label>
                     <div class="relative">
                        <input type="text" formControlName="zip" (blur)="fetchAddress()" (input)="maskZip($event)" placeholder="00000-000" maxlength="9" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                        @if (loadingAddress()) {
                          <div class="absolute right-3 top-3 w-4 h-4 border-2 border-[#FF007F] border-t-transparent rounded-full animate-spin"></div>
                        }
                     </div>
                      @if (touchedAndInvalid('zip')) { <span class="text-red-500 text-[10px] mt-1">CEP obrigatório</span> }
                   </div>
                   
                   <div class="md:col-span-2 self-end pb-3 text-xs text-gray-500">
                     <a href="#" class="text-[#FF007F] hover:underline">Não sei meu CEP</a>
                   </div>

                   <div class="md:col-span-3">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Rua</label>
                     <input type="text" formControlName="street" class="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none cursor-not-allowed" readonly>
                   </div>

                   <div class="md:col-span-1">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Número</label>
                     <input type="text" formControlName="number" placeholder="123" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#FF007F] focus:ring-1 focus:ring-[#FF007F] transition-all">
                      @if (touchedAndInvalid('number')) { <span class="text-red-500 text-[10px] mt-1">*</span> }
                   </div>

                   <div class="md:col-span-2">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Bairro</label>
                     <input type="text" formControlName="neighborhood" class="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none cursor-not-allowed" readonly>
                   </div>

                   <div class="md:col-span-2">
                     <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Cidade</label>
                     <input type="text" formControlName="city" class="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none cursor-not-allowed" readonly>
                   </div>
                 </div>
              </section>

              <!-- 5) Payment (ONLY PIX) -->
              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden group">
                 <div class="absolute left-0 top-0 w-1 h-full bg-[#FF007F] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <h3 class="font-tech font-bold text-lg mb-6 flex items-center gap-2">
                   <span class="w-6 h-6 rounded-full bg-gray-100 text-[#FF007F] flex items-center justify-center text-xs">3</span>
                   Pagamento
                 </h3>

                 <!-- Tabs (Just PIX now) -->
                 <div class="grid grid-cols-1 gap-4 mb-6">
                    <div class="relative border border-[#FF007F] bg-[#FF007F]/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                       <div class="absolute top-2 right-2 w-4 h-4 bg-[#FF007F] rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                       <span class="font-bold text-gray-800">PIX</span>
                       <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">-5% OFF</span>
                    </div>
                 </div>

                 <!-- Payment Contents -->
                 <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fade-in">
                    <div class="flex items-start gap-3">
                       <div class="w-8 h-8 rounded-full bg-[#FF007F]/10 flex-shrink-0 flex items-center justify-center text-[#FF007F]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                       </div>
                       <div>
                          <p class="font-bold text-sm text-gray-900">Pagamento Instantâneo</p>
                          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
                             Aproveite <strong>5% de desconto</strong> pagando via PIX. 
                             Seu pedido será aprovado imediatamente.
                          </p>
                       </div>
                    </div>
                 </div>

              </section>

            </div>

            <!-- Right Column: Summary (Sticky) -->
            <div class="lg:col-span-5 lg:sticky lg:top-24">
               
               <!-- 3) Resumo do Pedido -->
               <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                     <h3 class="font-tech font-bold text-gray-900">Resumo do Pedido</h3>
                     <span class="text-xs text-gray-500">1 item</span>
                  </div>

                  <div class="p-6">
                     <div class="flex gap-4 mb-6">
                        <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                           <img src="https://6993a54e681c79fa0bced9e2.imgix.net/kitlup/ImagemPrincipalKitLupo.png?w=1024&h=1024" class="w-full h-full object-cover">
                        </div>
                        <div>
                           <h4 class="font-bold text-sm text-gray-900">Kit 5 Leggings Max Fitness</h4>
                           <p class="text-xs text-gray-500 mt-1">Tamanho: <span class="font-bold">{{ size() }}</span></p>
                           <p class="text-xs text-gray-500">Cor: <span class="font-bold">Kit Fixo</span></p>
                        </div>
                     </div>

                     <div class="space-y-3 border-t border-gray-100 pt-4 text-sm">
                        <div class="flex justify-between text-gray-500">
                           <span>Subtotal</span>
                           <span>R$ 178,00</span>
                        </div>
                        <div class="flex justify-between text-green-600">
                           <span>Desconto Promocional</span>
                           <span>- R$ 79,00</span>
                        </div>
                        <div class="flex justify-between text-[#FF007F]">
                           <span>Desconto PIX (5%)</span>
                           <span>- R$ 4,95</span>
                        </div>
                        <div class="flex justify-between text-gray-500">
                           <span>Frete</span>
                           <span class="text-green-600 font-bold uppercase">Grátis</span>
                        </div>
                     </div>

                     <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between items-end">
                        <span class="font-bold text-gray-900">Total</span>
                        <div class="text-right">
                           <span class="text-xs text-gray-400 line-through block">R$ 178,00</span>
                           <span class="text-2xl font-black font-tech text-[#0A0A0A]">
                             {{ totalValue() }}
                           </span>
                        </div>
                     </div>
                     
                     <div class="bg-blue-50 text-blue-800 text-[10px] p-2 rounded mt-4 text-center">
                        Entrega estimada para <strong>{{ city() }}</strong> em até 12 dias
                     </div>
                  </div>

                  <!-- 9) Terms Checkbox -->
                  <div class="p-4 bg-gray-50 border-t border-gray-200">
                     <label class="flex items-start gap-3 cursor-pointer group">
                        <div class="relative flex items-center">
                           <input type="checkbox" formControlName="terms" class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-[#FF007F] checked:bg-[#FF007F] transition-all">
                           <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span class="text-xs text-gray-500 leading-tight group-hover:text-gray-700 transition-colors">
                           Li e concordo com os <a href="#" class="underline decoration-gray-300 underline-offset-2">Termos de Uso</a> e <a href="#" class="underline decoration-gray-300 underline-offset-2">Política de Privacidade</a>.
                        </span>
                     </label>
                      @if (touchedAndInvalid('terms')) { <div class="text-red-500 text-[10px] ml-7 mt-1">Você precisa aceitar os termos</div> }
                  </div>

                  <!-- 5) CTA Button -->
                  <div class="p-4 bg-white">
                     <button type="submit" 
                             [disabled]="isProcessing()"
                             class="w-full bg-[#FF007F] hover:bg-[#D9006C] disabled:bg-gray-400 text-white text-lg font-bold font-tech py-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,0,127,0.39)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group">
                        @if (isProcessing()) {
                           <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        } @else {
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                           GERAR PIX
                        }
                     </button>
                     
                     <!-- 7) Reliability Elements -->
                     <div class="mt-4 flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div class="flex items-center gap-1 text-[10px] text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                           Compra Segura
                        </div>
                        <div class="flex items-center gap-1 text-[10px] text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                           Dados Protegidos
                        </div>
                     </div>
                  </div>
               </div>

               <!-- 8) Social Proof (Small) -->
               <div class="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div class="flex -space-x-2">
                     <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="">
                     <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="">
                     <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="">
                  </div>
                  <div>
                     <p class="text-xs font-bold text-gray-800">+12.000 clientes satisfeitas</p>
                     <div class="flex text-[#FF007F] text-[10px]">
                        ★★★★★
                     </div>
                  </div>
               </div>

            </div>
          </form>
        </div>

        <!-- 10) Footer Simplificado -->
        <footer class="bg-[#0A0A0A] text-gray-500 py-8 text-center text-xs mt-12 border-t border-white/10">
           <div class="container mx-auto px-4">
              <p class="mb-4">Max Fitness Ltda - CNPJ: 00.000.000/0001-00</p>
              <div class="flex justify-center gap-4 mb-4">
                 <a href="#" class="hover:text-white transition-colors">Política de Privacidade</a>
                 <a href="#" class="hover:text-white transition-colors">Termos de Uso</a>
                 <a href="#" class="hover:text-white transition-colors">Envio e Entrega</a>
              </div>
              <p>&copy; 2026 Todos os direitos reservados.</p>
           </div>
        </footer>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnDestroy {
  city = input.required<string>();
  size = input.required<string>();
  backClicked = output<void>();
  
  private payEvoService = inject(PayEvoService);
  private destroy$ = new Subject<void>();
  
  fb = new FormBuilder();
  checkoutForm: FormGroup;
  
  paymentMethod = signal<'pix'>('pix');
  step = signal<number>(1);
  loadingAddress = signal<boolean>(false);
  orderCompleted = signal<boolean>(false);
  isProcessing = signal<boolean>(false);
  
  // PIX Data
  pixData = signal<PixChargeResponse | null>(null);
  copied = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);
  
  timer = signal<number>(600); // 10 minutes

  constructor() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      phone: ['', [Validators.required, Validators.minLength(14)]],
      email: ['', [Validators.required, Validators.email]],
      zip: ['', [Validators.required, Validators.minLength(9)]],
      street: [''],
      number: ['', Validators.required],
      neighborhood: [''],
      city: [''],
      terms: [false, Validators.requiredTrue]
    });

    setInterval(() => {
      if (this.timer() > 0) this.timer.update(v => v - 1);
    }, 1000);
  }

  totalValue = computed(() => {
    return 'R$ 94,05';
  });

  timerDisplay = computed(() => {
    const minutes = Math.floor(this.timer() / 60);
    const seconds = this.timer() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  touchedAndInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  maskCPF(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    event.target.value = value;
    this.checkoutForm.get('cpf')?.setValue(value);
  }

  maskPhone(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    event.target.value = value;
    this.checkoutForm.get('phone')?.setValue(value);
  }

  maskZip(event: any) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    event.target.value = value;
    this.checkoutForm.get('zip')?.setValue(value);
  }

  fetchAddress() {
    const zip = this.checkoutForm.get('zip')?.value?.replace(/\D/g, '');
    if (zip && zip.length === 8) {
      this.loadingAddress.set(true);
      setTimeout(() => {
        this.checkoutForm.patchValue({
          street: 'Avenida Paulista',
          neighborhood: 'Bela Vista',
          city: this.city() 
        });
        this.loadingAddress.set(false);
      }, 1000);
    }
  }

  submitOrder() {
    if (this.checkoutForm.valid) {
       this.processPixPayment();
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  processPixPayment() {
    this.isProcessing.set(true);
    const form = this.checkoutForm.getRawValue();
    
    // Call PayEvo Service
    this.payEvoService.createPixCharge({
       name: form.name,
       cpf: form.cpf,
       phone: form.phone,
       email: form.email,
       amount: 9405, // Send as cents (9405 = R$94,05)
       description: 'MaxFitness Kit Legging'
    }).subscribe({
       next: (res) => {
         this.pixData.set(res);
         this.orderCompleted.set(true);
         this.step.set(3);
         this.isProcessing.set(false);
         window.scrollTo({ top: 0, behavior: 'smooth' });
         
         // Start Polling with the returned TXID
         this.startPolling(res.txid);
       },
       error: (err) => {
         console.error('Erro ao gerar PIX', err);
         this.isProcessing.set(false);
         alert('Erro ao gerar PIX. Verifique seus dados.');
       }
    });
  }

  startPolling(txid: string) {
    interval(3000)
      .pipe(
        takeUntil(this.destroy$),
        take(100), // Max attempts
        switchMap(() => this.payEvoService.checkPixStatus(txid)),
        filter(res => res.status === 'paid'),
        take(1) // Stop after success
      )
      .subscribe({
        next: (res) => {
           this.paymentSuccess.set(true);
        }
      });
  }

  copyPixCode(code: string) {
    navigator.clipboard.writeText(code);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 3000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
