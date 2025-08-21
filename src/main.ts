import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
		provideAnimations(),
		provideHttpClient()
	]
}).catch((err: unknown) => console.error(err)); 