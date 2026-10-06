/**
 * @file component.tsx
 * @description Composite FormSection component wrapping form inputs with token-driven card framing and footer controls.
 * @module AuraComposite/FormSection/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { FormSectionProps } from './types';

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  footerActions,
  isLoading = false,
  className,
}) => {
  return (
    <Card className={cn('relative w-full', className)}>
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--color-bg)]/60 backdrop-blur-xs rounded-2xl">
          <Spinner size="md" color="accent" />
        </div>
      )}

      <CardHeader title={title} subtitle={description} />

      <CardBody className="space-y-4">{children}</CardBody>

      {footerActions && <CardFooter className="justify-end gap-2">{footerActions}</CardFooter>}
    </Card>
  );
};
