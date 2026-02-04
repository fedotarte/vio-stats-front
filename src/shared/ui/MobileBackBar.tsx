import type { CSSProperties } from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface MobileBackBarProps {
  /** Куда ведёт кнопка "Назад" */
  to: string;
  /** Текст кнопки на бара (короткий для мобилы) */
  label?: string;
  /** Если true — бар фиксируется внизу экрана (для страниц без flex-лейаута) */
  fixed?: boolean;
}

/**
 * Нижний бар с кнопкой "Назад" для мобильной версии.
 * Рендерится только на мобильной версии (до sm breakpoint).
 * На десктопе не показывается — там используется обычная кнопка "Назад" сверху.
 * По умолчанию размещайте как последний дочерний элемент в flex-контейнере (flexShrink: 0).
 * Для страниц ошибок используйте fixed={true}.
 */
export const MobileBackBar = ({ to, label = 'Назад', fixed = false }: MobileBackBarProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const navigate = useNavigate();

  if (!isMobile) return null;

  const barContentHeight = 56;
  const safeBottom = 'env(safe-area-inset-bottom, 0px)';

  const baseStyles: CSSProperties = {
    minHeight: barContentHeight,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    paddingBottom: `max(${theme.spacing.xs}px, ${safeBottom})`,
    boxSizing: 'content-box',
    backgroundColor: 'var(--mantine-color-body)',
    borderTop: '1px solid var(--mantine-color-default-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
  };

  const wrapperStyle: CSSProperties = fixed
    ? { ...baseStyles, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }
    : baseStyles;

  return (
    <Box style={wrapperStyle}>
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={20} />}
        onClick={() => navigate(to)}
        style={{ width: '30%', minWidth: 100, maxWidth: 160, flexShrink: 0 }}
      >
        {label}
      </Button>
    </Box>
  );
};
