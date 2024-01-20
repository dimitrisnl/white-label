import * as React from 'react';

import {cn} from './utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden rounded-xl border border-gray-100 bg-white shadow',
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
  <div ref={ref} className={cn('px-4 pt-5 sm:px-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, children, ...props}, ref) => (
  <h3
    ref={ref}
    className={cn('truncate text-lg font-medium text-gray-900', className)}
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
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div ref={ref} className="bg-gray-100">
    <div
      className={cn(
        'rounded-bl-xl rounded-br-xl border-b border-b-gray-200 bg-white px-4 py-5 sm:p-6',
        className
      )}
      {...props}
    ></div>
  </div>
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn('bg-gray-100 px-4 py-2 sm:px-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent};
