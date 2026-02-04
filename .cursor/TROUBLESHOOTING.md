# Устранение проблем

## Проблема: Drawer не виден (показывается только overlay)

### Симптомы:
- ✅ Overlay (затемнение) отображается
- ❌ Drawer (боковая панель) не виден
- ✅ Drawer присутствует в DOM
- ❌ Визуально drawer не отображается

### Причина:

**1. Конфликт глобальных CSS стилей**

В стандартном `index.css` от Vite были проблемные стили:

```css
body {
  margin: 0;
  display: flex;          /* ← ПРОБЛЕМА! */
  place-items: center;    /* ← ПРОБЛЕМА! */
  min-width: 320px;
  min-height: 100vh;
}

button {
  /* Глобальные стили для button конфликтуют с Mantine */
}
```

**Почему это ломает Drawer?**
- `display: flex` на body меняет поток документа
- Portal компоненты (Drawer, Modal) рендерятся как дети body
- Flex-контейнер центрирует детей, что ломает абсолютное позиционирование Drawer
- Drawer появляется, но его position рассчитывается неправильно

**2. Неправильный порядок импорта CSS**

```typescript
// ❌ НЕПРАВИЛЬНО:
import '@mantine/core/styles.css';
import './index.css';  // Перезаписывает стили Mantine

// ✅ ПРАВИЛЬНО:
import './index.css';
import '@mantine/core/styles.css';  // Mantine стили имеют приоритет
```

### Решение:

**1. Упростить index.css**

Убрали все проблемные стили:

```css
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  background-color: #f8f9fa;
}

#root {
  min-height: 100vh;
}
```

**Что изменилось:**
- ✅ Убрали `display: flex` с body
- ✅ Убрали `place-items: center`
- ✅ Убрали глобальные стили для button
- ✅ Оставили только необходимые reset стили
- ✅ Добавили нейтральный фоновый цвет

**2. Изменить порядок импорта в main.tsx**

```typescript
// Правильный порядок:
import './index.css';                      // 1. Базовые стили
import '@mantine/core/styles.css';         // 2. Стили Mantine
import '@mantine/notifications/styles.css'; // 3. Стили уведомлений
```

### Дополнительные проблемы, которые могут возникнуть:

#### Проблема: Drawer виден, но не на всю высоту

**Решение:** Добавить `scrollAreaComponent`

```typescript
<Drawer
  scrollAreaComponent={ScrollArea.Autosize}
/>
```

#### Проблема: Drawer перекрывается другими элементами

**Решение:** Проверить z-index стили

```typescript
<Drawer
  zIndex={1000}  // По умолчанию 400
/>
```

#### Проблема: Drawer не закрывается по клику на overlay

**Решение:** Проверить prop

```typescript
<Drawer
  closeOnClickOutside={true}  // По умолчанию true
  closeOnEscape={true}         // По умолчанию true
/>
```

#### Проблема: Анимация Drawer тормозит

**Решение:** Упростить transition

```typescript
<Drawer
  transitionProps={{
    transition: 'fade',  // Попробуйте fade вместо slide
    duration: 150,       // Уменьшите duration
  }}
/>
```

### Проверка работы Drawer

После исправлений проверьте:

1. **Откройте DevTools** (F12)
2. **Откройте Drawer** в приложении
3. **Проверьте Elements tab:**
   - Drawer должен быть внутри `div.mantine-Portal`
   - Position должен быть `fixed` или `absolute`
   - Transform должен применяться корректно

4. **Проверьте Computed styles:**
   ```
   position: fixed
   top: 0
   right: 0 (или left: 0 для position="left")
   width: <рассчитанная ширина>
   height: 100%
   z-index: 400 (или ваше значение)
   ```

### Best Practices для Portal компонентов

1. **Минимум глобальных стилей**
   - Избегайте `display: flex` на body
   - Избегайте глобальных стилей для базовых элементов (button, input, etc.)

2. **Правильный порядок импорта**
   - Ваши стили → Библиотечные стили
   - Это позволяет библиотеке перезаписать ваши базовые стили

3. **Используйте CSS Modules**
   - Для кастомных стилей используйте CSS Modules
   - Это избегает конфликтов с глобальными стилями

4. **Тестируйте Portal компоненты**
   - Modal
   - Drawer
   - Popover
   - Tooltip
   - Select (выпадающий список в portal)

### Полезные ссылки

- [Mantine Drawer Documentation](https://mantine.dev/core/drawer/)
- [Mantine Portal Documentation](https://mantine.dev/core/portal/)
- [CSS Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

## Общие проблемы с Mantine

### Стили не применяются

**Причина:** Не импортированы CSS файлы

**Решение:**
```typescript
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';      // Если используете DatePicker
import '@mantine/notifications/styles.css'; // Если используете Notifications
import '@mantine/code-highlight/styles.css'; // Если используете CodeHighlight
```

### Компоненты не работают на touch устройствах

**Причина:** Не установлен `@mantine/hooks`

**Решение:**
```bash
npm install @mantine/hooks
```

### Form не валидирует

**Причина:** Не установлен `@mantine/form`

**Решение:**
```bash
npm install @mantine/form
```

## Итог

✅ Drawer теперь работает корректно  
✅ Все Portal компоненты работают  
✅ Нет конфликтов стилей  
✅ Правильный порядок импорта CSS  

Если проблема осталась - проверьте:
1. Консоль браузера на ошибки
2. Network tab - загружаются ли CSS файлы
3. Elements tab - есть ли Drawer в DOM
4. Computed styles - правильно ли рассчитываются стили
