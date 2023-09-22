import * as React from 'react';

import {cn} from '../lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn(
      'divide-y divide-gray-200 overflow-hidden rounded-lg bg-white border border-gray-200 shadow',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn('px-4 py-5 sm:px-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, children, ...props}, ref) => (
  <h3
    ref={ref}
    className={cn(
      'truncate text-lg font-medium text-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
  <p
    ref={ref}
    className={cn('truncate text-sm text-gray-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div ref={ref} className={cn('px-4 py-5 sm:p-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn('px-4 py-4 sm:px-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent};
