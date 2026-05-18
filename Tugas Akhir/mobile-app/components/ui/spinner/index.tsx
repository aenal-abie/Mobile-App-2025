'use client';
import { ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';

cssInterop(ActivityIndicator, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});

const spinnerStyle = tva({});

const Spinner = React.forwardRef<
  React.ComponentRef<typeof ActivityIndicator>,
  React.ComponentProps<typeof ActivityIndicator>
>(function Spinner(
  {
    className,
    color,
    focusable = false,
    'aria-label': ariaLabel = 'loading',
    ...props
  },
  ref
) {
  if (Platform.OS === 'web') {
    return (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        aria-label={ariaLabel}
        className={spinnerStyle({ class: className })}
        style={{
          display: 'inline-block',
          width: 16,
          height: 16,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '9999px',
          animation: 'spin 0.8s linear infinite',
          color: color ?? '#3b82f6',
        }}
        {...props}
      />
    );
  }

  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      {...props}
      color={color}
      className={spinnerStyle({ class: className })}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };
