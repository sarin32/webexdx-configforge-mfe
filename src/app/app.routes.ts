import type { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'project',
        pathMatch: 'full',
    },
    {
        path: 'project',
        loadComponent: () => import('./features/project/project-list/project-list').then(m => m.ProjectList),
    },
    {
        path: 'project/:id',
        loadComponent: () => import('./features/project/project-detail/project-detail').then(m => m.ProjectDetail),
    },
    {
        path: 'project/:id/tokens',
        loadComponent: () => import('./features/project/project-tokens/project-tokens').then(m => m.ProjectTokens),
    },
];
