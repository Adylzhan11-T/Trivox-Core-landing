# Dev Testing Environment — Design Spec

**Date:** 2026-04-10
**Project:** trivox-landing
**Status:** Approved

## Контекст

Проект не имеет тестовой инфраструктуры: нет скрипта `test`, нет тестовых библиотек. Стек: React 19 + Vite 8 + TypeScript 5.9. Основной компонент — монолитный `TrivoxCoreLanding.tsx` (1905 строк) с кастомным `CountrySelect` и формой обратной связи (`onSubmitEmail` — заглушка).

## Цель

Создать полную dev-среду для тестирования с нуля: unit/component тесты (Vitest + RTL) + E2E тесты (Playwright).

---

## Секция 1: Архитектура и инструменты

### Зависимости

```
devDependencies:
  vitest                          — тест-раннер, нативная интеграция с Vite
  @vitest/coverage-v8             — покрытие через V8 (нативный для Node)
  @testing-library/react          — рендер React-компонентов
  @testing-library/user-event     — симуляция пользовательских событий
  @testing-library/jest-dom       — расширенные матчеры DOM
  jsdom                           — виртуальный DOM для Vitest

  @playwright/test                — E2E тесты в реальном Chromium
```

### Структура файлов

```
trivox-landing/
├── src/
│   └── __tests__/
│       ├── TrivoxCoreLanding.test.tsx   — unit + component (RTL)
│       └── CountrySelect.test.tsx       — кастомный селектор стран
├── e2e/
│   ├── landing.spec.ts                 — полный сценарий лендинга
│   └── form.spec.ts                    — форма обратной связи
├── vitest.config.ts                    — конфиг Vitest (отдельный от vite.config.ts)
├── vitest.setup.ts                     — глобальные моки и jest-dom
└── playwright.config.ts                — конфиг Playwright
```

### Скрипты в package.json

```json
{
  "test":       "vitest run",
  "test:watch": "vitest",
  "test:ui":    "vitest --ui",
  "test:e2e":   "playwright test",
  "coverage":   "vitest run --coverage"
}
```

---

## Секция 2: Что тестируем

### Vitest + RTL (`src/__tests__/`)

| Файл | Тесты |
|------|-------|
| `TrivoxCoreLanding.test.tsx` | Рендерится без краша |
| `TrivoxCoreLanding.test.tsx` | Все ключевые секции видны: Hero, Services, Stack, Funnel, Form |
| `TrivoxCoreLanding.test.tsx` | Форма: пустой телефон → показ ошибки |
| `TrivoxCoreLanding.test.tsx` | Форма: заполненный телефон → переход в success-состояние |
| `CountrySelect.test.tsx` | Открывается по клику |
| `CountrySelect.test.tsx` | Поиск фильтрует список стран |
| `CountrySelect.test.tsx` | CIS-страны идут первыми в списке |
| `CountrySelect.test.tsx` | Выбор страны вызывает onChange |

### Playwright E2E (`e2e/`)

| Файл | Сценарий |
|------|----------|
| `landing.spec.ts` | Загрузка страницы — нет консольных ошибок |
| `landing.spec.ts` | Все секции видны при скролле |
| `landing.spec.ts` | Якорные ссылки навигации прыгают к секции |
| `landing.spec.ts` | Mobile viewport (375×812) — секции не сломаны |
| `form.spec.ts` | Ввод телефона → выбор страны → клик "Отправить" → success/error |

### Что НЕ тестируем (YAGNI)

- SVG иконки и `HeroIllustration` — визуальные артефакты
- Статичные массивы данных (services, advantages, steps) — нет логики
- CSS/анимации — вне scope юнит-тестов

---

## Секция 3: Моки и окружение

### vitest.setup.ts

```ts
import '@testing-library/jest-dom'
```

### Мок формы (заглушка)

Форма не делает реальных запросов. В тестах:

```ts
vi.spyOn(console, 'log').mockImplementation(() => {})
// Если появится fetch:
global.fetch = vi.fn().mockResolvedValue({ ok: true })
```

### vitest.config.ts

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
})
```

### playwright.config.ts

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
})
```

### .gitignore additions

```
coverage/
playwright-report/
test-results/
```

---

## Критерии готовности

- [ ] `npm test` запускает Vitest и все тесты зелёные
- [ ] `npm run test:e2e` запускает Playwright и все тесты зелёные
- [ ] `npm run coverage` генерирует отчёт покрытия
- [ ] CI-ready: тесты не зависят от внешних сервисов
