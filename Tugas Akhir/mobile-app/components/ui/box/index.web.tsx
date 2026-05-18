import React from 'react';
import { boxStyle } from './styles';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IBoxProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function Box(
  { className, style, ...props },
  ref
) {
  const resolvedStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;

  return (
    <div
      ref={ref}
      className={boxStyle({ class: className })}
      {...props}
      style={resolvedStyle}
    />
  );
});

Box.displayName = 'Box';
export { Box };
