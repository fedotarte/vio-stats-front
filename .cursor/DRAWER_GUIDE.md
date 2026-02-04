# Руководство по Drawer компоненту Mantine

## Проблема и решение

### Что было не так?
Drawer открывался медленно и некорректно отображался на мобильных устройствах из-за отсутствия:
1. Оптимизированных transitions (анимаций)
2. Адаптивности для разных размеров экранов
3. Правильных overlay эффектов

### Что добавили?

## 1. Адаптивность для мобильных устройств

```typescript
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const theme = useMantineTheme();
const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
```

**Использование:**
```typescript
<Drawer
  position={isMobile ? 'bottom' : 'right'}
  size={isMobile ? '95%' : '90%'}
/>
```

### Почему это важно?
- На **десктопе** drawer открывается **справа** и занимает **90% ширины**
- На **мобильных** drawer открывается **снизу** и занимает **95% высоты**
- Это соответствует нативным паттернам мобильных приложений

## 2. Плавные переходы (Transitions)

```typescript
<Drawer
  transitionProps={{
    transition: 'slide-left',      // Тип анимации
    duration: 200,                  // Длительность в мс
    timingFunction: 'ease',         // Функция сглаживания
  }}
/>
```

### Доступные типы transition:
- `slide-left` - скольжение слева
- `slide-right` - скольжение справа
- `slide-up` - скольжение снизу вверх
- `slide-down` - скольжение сверху вниз
- `fade` - плавное появление
- `pop` - масштабирование

## 3. Улучшенный Overlay (затемнение фона)

```typescript
<Drawer
  overlayProps={{
    backgroundOpacity: 0.55,        // Прозрачность фона (0-1)
    blur: 3,                        // Размытие фона в px
  }}
/>
```

### Эффект:
- Фон затемняется на **55%**
- Применяется **размытие** для фокуса на drawer
- Улучшает UX и привлекает внимание к форме

## 4. Увеличенная кнопка закрытия

```typescript
<Drawer
  closeButtonProps={{
    size: 'lg',                     // Размер кнопки закрытия
  }}
/>
```

### Почему lg?
- Легче попасть на мобильных устройствах
- Соответствует Apple Human Interface Guidelines
- Минимальный размер тапаемого элемента: 44x44px

## 5. Автоматическая прокрутка для длинного контента

```typescript
import { ScrollArea } from '@mantine/core';

<Drawer
  scrollAreaComponent={ScrollArea.Autosize}
/>
```

### Преимущества:
- Контент автоматически становится прокручиваемым
- Заголовок остается зафиксированным
- Работает корректно на всех устройствах

## 6. Размеры (Size)

### Desktop:
- `sm` - ~30% ширины экрана
- `md` - ~50% ширины экрана
- `lg` - ~70% ширины экрана
- `xl` - ~90% ширины экрана
- `90%` - точное значение 90% ширины
- `600px` - фиксированная ширина

### Mobile:
Для мобильных рекомендуется:
- `90%` - 95%` высоты для position="bottom"
- `100%` для fullscreen режима

## Полный пример оптимизированного Drawer

```typescript
import { 
  Drawer, 
  useMantineTheme, 
  ScrollArea 
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const OptimizedDrawer = ({ opened, onClose, title, children }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Drawer
      // Основные свойства
      opened={opened}
      onClose={onClose}
      title={title}
      
      // Адаптивность
      position={isMobile ? 'bottom' : 'right'}
      size={isMobile ? '95%' : 'xl'}
      
      // Стилизация
      padding="xl"
      
      // Анимация
      transitionProps={{
        transition: 'slide-left',
        duration: 200,
        timingFunction: 'ease',
      }}
      
      // Overlay
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      
      // UI элементы
      closeButtonProps={{
        size: 'lg',
      }}
      
      // Прокрутка
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {children}
    </Drawer>
  );
};
```

## Дополнительные полезные свойства

### withCloseButton
```typescript
<Drawer withCloseButton={false} />
```
Убирает кнопку закрытия (если нужно закрывать только программно)

### lockScroll
```typescript
<Drawer lockScroll={true} />  // по умолчанию
```
Блокирует прокрутку основной страницы, когда drawer открыт

### trapFocus
```typescript
<Drawer trapFocus={true} />  // по умолчанию
```
Фокус остается внутри drawer (accessibility)

### closeOnClickOutside
```typescript
<Drawer closeOnClickOutside={true} />  // по умолчанию
```
Закрывает drawer при клике на overlay

### closeOnEscape
```typescript
<Drawer closeOnEscape={true} />  // по умолчанию
```
Закрывает drawer при нажатии Escape

### withOverlay
```typescript
<Drawer withOverlay={true} />  // по умолчанию
```
Показывает затемненный overlay за drawer

## Breakpoints Mantine

```typescript
const theme = useMantineTheme();

// Стандартные breakpoints:
theme.breakpoints.xs  // 576px
theme.breakpoints.sm  // 768px  (используем для mobile)
theme.breakpoints.md  // 992px
theme.breakpoints.lg  // 1200px
theme.breakpoints.xl  // 1408px
```

## Рекомендации

### Для форм создания/редактирования:
- ✅ **Desktop**: `position="right"`, `size="xl"` или `"90%"`
- ✅ **Mobile**: `position="bottom"`, `size="95%"`

### Для просмотра информации:
- ✅ **Desktop**: `position="right"`, `size="lg"`
- ✅ **Mobile**: `position="bottom"`, `size="80%"`

### Для быстрых действий:
- ✅ **Desktop**: `position="right"`, `size="md"`
- ✅ **Mobile**: `position="bottom"`, `size="60%"`

## Тестирование на мобильных

### В Chrome DevTools:
1. Откройте DevTools (F12)
2. Нажмите Toggle Device Toolbar (Ctrl+Shift+M)
3. Выберите устройство (iPhone, iPad, и т.д.)
4. Протестируйте drawer на разных размерах

### Responsive режим:
- Уменьшите ширину окна браузера до < 768px
- Drawer должен автоматически переключиться в режим "bottom"

## Итог

Все drawer'ы в проекте теперь:
- ✅ Плавно открываются с правильной анимацией
- ✅ Адаптивны для мобильных устройств
- ✅ Имеют красивый overlay с размытием
- ✅ Поддерживают прокрутку длинного контента
- ✅ Удобны для использования на touch устройствах
