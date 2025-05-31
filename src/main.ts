import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { appRouting } from './app/app.routes'
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    appRouting,
    provideHttpClient()
  ]
});