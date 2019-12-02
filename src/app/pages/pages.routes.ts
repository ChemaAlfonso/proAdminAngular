import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';


// Guards
import { LoginGuardGuard } from '../services/guards/login-guard.guard';
import { ProfileComponent } from './profile/profile.component';



const pageRoutes: Routes = [
    {
      path: '',
      component: PagesComponent,
      canActivate: [ LoginGuardGuard ],
      children: [
        {path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
        {path: 'progress', component: ProgressComponent, data: { titulo: 'Progreso' } },
        {path: 'graficas', component: Graficas1Component, data: { titulo: 'Graficas' } },
        {path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
        {path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
        {path: 'accountSettings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del tema' } },
        {path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de usuario' } },
        {path: '', redirectTo: '/dashboard', pathMatch: 'full'}
      ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pageRoutes);