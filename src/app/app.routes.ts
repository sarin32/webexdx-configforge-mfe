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
];
