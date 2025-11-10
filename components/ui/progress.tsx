'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const safeMax = typeof max === 'number' && max > 0 ? max : 100;
    const safeValue = typeof value === 'number' ? value : 0;
    const percent = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));

    return (
      <div
        ref={ref}
        className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
