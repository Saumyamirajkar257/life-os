/**
 * Ecosystem Integration Placeholders (Notion, Apple Reminders, Todoist, Google Calendar)
 */

export interface ExternalPlatformIntegration {
  id: string;
  name: string;
  category: string;
  icon: string;
  supportedFormats: string[];
  status: 'available' | 'placeholder_ready' | 'oauth_required';
  description: string;
}

export const ECOSYSTEM_INTEGRATIONS: ExternalPlatformIntegration[] = [
  {
    id: 'notion',
    name: 'Notion Workspace',
    category: 'Productivity & Notes',
    icon: 'FileText',
    supportedFormats: ['Markdown', 'CSV', 'JSON Database Export'],
    status: 'placeholder_ready',
    description: 'Import Notion databases, pages, and relational task boards directly into Aura.',
  },
  {
    id: 'apple_reminders',
    name: 'Apple Reminders',
    category: 'Task Lists',
    icon: 'CheckCircle2',
    supportedFormats: ['ICS Calendar', 'CSV', 'iCloud Export'],
    status: 'placeholder_ready',
    description: 'Sync Apple Reminders lists, due dates, and flag statuses into Aura Tasks.',
  },
  {
    id: 'todoist',
    name: 'Todoist',
    category: 'Task Management',
    icon: 'ListTodo',
    supportedFormats: ['CSV Export', 'API Token Sync'],
    status: 'placeholder_ready',
    description: 'Import Todoist projects, subtasks, priorities, and tags into Aura Productivity OS.',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'Calendar & Scheduling',
    icon: 'Calendar',
    supportedFormats: ['iCal (.ics)', 'OAuth API'],
    status: 'placeholder_ready',
    description: 'Bi-directional event scheduling and event sync between Google Calendar and Aura Planner.',
  },
];
