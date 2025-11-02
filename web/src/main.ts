// Ponto de entrada do Angular
// Comentários simples para entendimento
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ModuloAplicativo } from './app/modulo-aplicativo';

platformBrowserDynamic()
  .bootstrapModule(ModuloAplicativo)
  .catch(err => console.error(err));
