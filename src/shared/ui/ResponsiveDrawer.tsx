import { Drawer, type DrawerProps } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';

interface ResponsiveDrawerProps extends DrawerProps {
  mobileSize?: DrawerProps['size'];
  desktopSize?: DrawerProps['size'];
  mobilePadding?: DrawerProps['padding'];
  desktopPadding?: DrawerProps['padding'];
  mobileTransitionProps?: DrawerProps['transitionProps'];
  desktopTransitionProps?: DrawerProps['transitionProps'];
  withMobileStyles?: boolean;
}

const defaultMobileStyles: NonNullable<DrawerProps['styles']> = {
  inner: {
    height: 'auto',
  },
  content: {
    height: 'fit-content',
    maxHeight: '90vh',
  },
};

export const ResponsiveDrawer = ({
  mobileSize,
  desktopSize,
  mobilePadding,
  desktopPadding,
  mobileTransitionProps,
  desktopTransitionProps,
  withMobileStyles = true,
  position,
  size,
  padding,
  transitionProps,
  overlayProps,
  closeButtonProps,
  styles,
  ...props
}: ResponsiveDrawerProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const resolvedPosition = position ?? (isMobile ? 'bottom' : 'right');
  const resolvedSize = size ?? (isMobile ? mobileSize ?? '70%' : desktopSize ?? 'md');
  const resolvedPadding = padding ?? (isMobile ? mobilePadding ?? 'lg' : desktopPadding ?? 'md');
  const resolvedTransitionProps =
    transitionProps ??
    (isMobile
      ? mobileTransitionProps ?? { transition: 'slide-up', duration: 200, timingFunction: 'ease' }
      : desktopTransitionProps ?? { transition: 'slide-left', duration: 200, timingFunction: 'ease' });

  return (
    <Drawer
      position={resolvedPosition}
      size={resolvedSize}
      padding={resolvedPadding}
      transitionProps={resolvedTransitionProps}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3, ...overlayProps }}
      closeButtonProps={{ size: 'lg', ...closeButtonProps }}
      styles={styles ?? (isMobile && withMobileStyles ? defaultMobileStyles : undefined)}
      {...props}
    />
  );
};
