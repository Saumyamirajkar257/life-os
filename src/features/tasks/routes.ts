/**
 * @file routes.ts
 * @description Route definition for Milestone 12 Tasks Module.
 * @module Features/Tasks/Routes
 */

import { RouteRegistration } from '../../sdk/interfaces/module';
import { TasksPage } from './pages/TasksPage';

export const taskRoutes: RouteRegistration[] = [
  {
    path: '/tasks',
    component: TasksPage,
    title: 'Tasks — Aura Life OS',
    protected: true,
  },
];

