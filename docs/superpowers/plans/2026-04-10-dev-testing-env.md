# Dev Testing Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Настроить полную dev-среду тестирования с нуля — Vitest + RTL для компонентных тестов и Playwright для E2E.

**Architecture:** Vitest интегрируется напрямую с Vite (шарит плагины), jsdom эмулирует DOM для RTL-тестов. Playwright запускает dev-сервер (`npm run dev`) и тестирует в реальном Chromium. fetch глобально мокается в RTL-тестах через `vi.fn()`.

**Tech Stack:** Vitest 3, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, @playwright/test

---

## Карта файлов

| Действие | Файл | Назначение |
|----------|------|------------|
| Создать | `vitest.config.ts` | Конфиг Vitest (jsdom, setup file) |
| Создать | `vitest.setup.ts` | Глобальные моки (jest-dom, IntersectionObserver) |
| Создать | `playwright.config.ts` | Конфиг Playwright (baseURL, webServer) |
| Создать | `src/__tests__/TrivoxCoreLanding.test.tsx` | Smoke + форма + успех/ошибка |
| Создать | `e2e/landing.spec.ts` | E2E: секции, навигация, mobile viewport |
| Создать | `e2e/form.spec.ts` | E2E: заполнение формы, результат сабмита |
| Изменить | `package.json` | Добавить скрипты test, test:e2e, coverage |
| Изменить | `.gitignore` | Исключить coverage/, playwright-report/, test-results/ |

---

## Task 1: Установить Vitest + RTL и создать базовый конфиг

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `.gitignore`

- [ ] **Шаг 1: Установить зависимости**

```bash
cd "trivox-landing"
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Ожидаемый вывод: `added N packages` без ошибок.

- [ ] **Шаг 2: Создать `vitest.config.ts`**

```ts
// vitest.config.ts
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

- [ ] **Шаг 3: Создать `vitest.setup.ts`**

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'

// IntersectionObserver не существует в jsdom — мокаем глобально
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// window.scrollY не существует в jsdom
Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0,
})
```

- [ ] **Шаг 4: Добавить скрипты в `package.json`**

Открыть `package.json` и добавить в `"scripts"`:

```json
"test":        "vitest run",
"test:watch":  "vitest",
"test:ui":     "vitest --ui",
"coverage":    "vitest run --coverage"
```

Итоговый блок `"scripts"` должен выглядеть:

```json
"scripts": {
  "dev":        "vite",
  "build":      "tsc -b && vite build",
  "lint":       "eslint .",
  "preview":    "vite preview",
  "test":       "vitest run",
  "test:watch": "vitest",
  "test:ui":    "vitest --ui",
  "coverage":   "vitest run --coverage"
}
```

- [ ] **Шаг 5: Обновить `tsconfig.app.json` — добавить типы Vitest**

Vitest с `globals: true` экспортирует глобальные `vi`, `describe`, `expect` — TypeScript должен о них знать.

В `tsconfig.app.json` изменить строку `"types"`:

```json
"types": ["vite/client", "vitest/globals"]
```

Также добавить `src/__tests__` в `include`:

```json
"include": ["src"]
```

Остаётся без изменений — `src/__tests__/` уже входит в `src`.

- [ ] **Шаг 6: Обновить `.gitignore`**

Добавить в конец файла:

```
# Test artifacts
coverage/
playwright-report/
test-results/
```

- [ ] **Шаг 7: Коммит**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json tsconfig.app.json .gitignore
git commit -m "chore: add Vitest + RTL testing infrastructure"
```

---

## Task 2: Установить Playwright и создать конфиг

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`

- [ ] **Шаг 1: Установить @playwright/test**

```bash
npm install -D @playwright/test
```

Ожидаемый вывод: `added N packages` без ошибок.

- [ ] **Шаг 2: Установить браузеры Playwright**

```bash
npx playwright install chromium
```

Ожидаемый вывод: `Chromium N.N downloaded to ...`

- [ ] **Шаг 3: Создать `playwright.config.ts`**

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Шаг 4: Добавить скрипт в `package.json`**

В блок `"scripts"` добавить:

```json
"test:e2e": "playwright test"
```

- [ ] **Шаг 5: Создать директорию `e2e/`**

```bash
mkdir e2e
```

- [ ] **Шаг 6: Коммит**

```bash
git add playwright.config.ts package.json package-lock.json e2e/
git commit -m "chore: add Playwright E2E testing infrastructure"
```

---

## Task 3: Smoke-тесты компонента (RTL)

**Files:**
- Create: `src/__tests__/TrivoxCoreLanding.test.tsx`

- [ ] **Шаг 1: Создать файл теста**

```bash
mkdir -p src/__tests__
```

- [ ] **Шаг 2: Написать провальный тест (ожидаем, что файл не существует)**

```bash
npm test
```

Ожидаемый вывод: `No test files found` или `0 tests`.

- [ ] **Шаг 3: Создать `src/__tests__/TrivoxCoreLanding.test.tsx`**

```tsx
// src/__tests__/TrivoxCoreLanding.test.tsx
import { render, screen } from '@testing-library/react'
import TrivoxCoreLanding from '../TrivoxCoreLanding'

describe('TrivoxCoreLanding', () => {
  it('рендерится без краша', () => {
    render(<TrivoxCoreLanding />)
  })

  it('показывает заголовок hero-секции', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByRole('heading', { name: /IT-аутсорсинг/i })).toBeInTheDocument()
  })

  it('показывает форму "Запросить аудит"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByText('Запросить аудит')).toBeInTheDocument()
  })

  it('показывает кнопку "Отправить заявку"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByRole('button', { name: /Отправить заявку/i })).toBeInTheDocument()
  })

  it('показывает поле "Ваше имя"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByPlaceholderText('Ваше имя')).toBeInTheDocument()
  })
})
```

- [ ] **Шаг 4: Запустить тесты и убедиться что они проходят**

```bash
npm test
```

Ожидаемый вывод: `5 tests passed`.

- [ ] **Шаг 5: Коммит**

```bash
git add src/__tests__/TrivoxCoreLanding.test.tsx
git commit -m "test: add smoke tests for TrivoxCoreLanding component"
```

---

## Task 4: Тесты валидации формы (RTL)

**Files:**
- Modify: `src/__tests__/TrivoxCoreLanding.test.tsx`

- [ ] **Шаг 1: Написать провальные тесты валидации**

Добавить в конец `describe('TrivoxCoreLanding', ...)` в `src/__tests__/TrivoxCoreLanding.test.tsx`:

```tsx
  describe('валидация формы', () => {
    it('показывает ошибку при отправке с пустым телефоном', async () => {
      const { user } = renderWithUser(<TrivoxCoreLanding />)
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Введите корректный номер телефона.')).toBeInTheDocument()
    })

    it('показывает ошибку при неверном email', async () => {
      const { user } = renderWithUser(<TrivoxCoreLanding />)
      // Вводим номер телефона (10+ цифр) через скрытый input
      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')
      // Вводим неверный email
      const emailInput = screen.getByPlaceholderText('Email (необязательно)')
      await user.type(emailInput, 'not-an-email')
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Проверьте формат email.')).toBeInTheDocument()
    })
  })
```

- [ ] **Шаг 2: Добавить helper `renderWithUser` в начало файла**

В начало `src/__tests__/TrivoxCoreLanding.test.tsx` (после импортов) добавить:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrivoxCoreLanding from '../TrivoxCoreLanding'

function renderWithUser(ui: React.ReactElement) {
  const user = userEvent.setup()
  return { user, ...render(ui) }
}
```

Полный файл после изменений:

```tsx
// src/__tests__/TrivoxCoreLanding.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrivoxCoreLanding from '../TrivoxCoreLanding'

function renderWithUser(ui: React.ReactElement) {
  const user = userEvent.setup()
  return { user, ...render(ui) }
}

describe('TrivoxCoreLanding', () => {
  it('рендерится без краша', () => {
    render(<TrivoxCoreLanding />)
  })

  it('показывает заголовок hero-секции', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByRole('heading', { name: /IT-аутсорсинг/i })).toBeInTheDocument()
  })

  it('показывает форму "Запросить аудит"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByText('Запросить аудит')).toBeInTheDocument()
  })

  it('показывает кнопку "Отправить заявку"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByRole('button', { name: /Отправить заявку/i })).toBeInTheDocument()
  })

  it('показывает поле "Ваше имя"', () => {
    render(<TrivoxCoreLanding />)
    expect(screen.getByPlaceholderText('Ваше имя')).toBeInTheDocument()
  })

  describe('валидация формы', () => {
    it('показывает ошибку при отправке с пустым телефоном', async () => {
      const { user } = renderWithUser(<TrivoxCoreLanding />)
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Введите корректный номер телефона.')).toBeInTheDocument()
    })

    it('показывает ошибку при неверном email', async () => {
      const { user } = renderWithUser(<TrivoxCoreLanding />)
      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')
      const emailInput = screen.getByPlaceholderText('Email (необязательно)')
      await user.type(emailInput, 'not-an-email')
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Проверьте формат email.')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Шаг 3: Запустить тесты**

```bash
npm test
```

Ожидаемый вывод: `7 tests passed`.

- [ ] **Шаг 4: Коммит**

```bash
git add src/__tests__/TrivoxCoreLanding.test.tsx
git commit -m "test: add form validation tests"
```

---

## Task 5: Тесты успешной отправки и ошибок сети (RTL + mock fetch)

**Files:**
- Modify: `src/__tests__/TrivoxCoreLanding.test.tsx`

- [ ] **Шаг 1: Добавить describe-блок с моком fetch**

Добавить в конец основного `describe` в `src/__tests__/TrivoxCoreLanding.test.tsx`:

```tsx
  describe('отправка формы', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('показывает success-сообщение при успешной отправке', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response)
      const { user } = renderWithUser(<TrivoxCoreLanding />)

      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')

      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)

      expect(await screen.findByText('Отлично! Мы свяжемся с вами в течение 24-48 часов.')).toBeInTheDocument()
    })

    it('показывает ошибку при ответе сервера не ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)
      const { user } = renderWithUser(<TrivoxCoreLanding />)

      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')

      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)

      expect(await screen.findByText('Ошибка отправки. Попробуйте позже.')).toBeInTheDocument()
    })

    it('показывает ошибку при сетевом сбое', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
      const { user } = renderWithUser(<TrivoxCoreLanding />)

      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')

      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)

      expect(await screen.findByText('Ошибка сети. Попробуйте позже.')).toBeInTheDocument()
    })
  })
```

- [ ] **Шаг 2: Запустить тесты**

```bash
npm test
```

Ожидаемый вывод: `10 tests passed`.

- [ ] **Шаг 3: Коммит**

```bash
git add src/__tests__/TrivoxCoreLanding.test.tsx
git commit -m "test: add form submission tests with mocked fetch"
```

---

## Task 6: E2E тесты — лендинг (Playwright)

**Files:**
- Create: `e2e/landing.spec.ts`

- [ ] **Шаг 1: Написать провальный тест**

```bash
npm run test:e2e -- --list
```

Ожидаемый вывод: `No tests found`.

- [ ] **Шаг 2: Создать `e2e/landing.spec.ts`**

```ts
// e2e/landing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('загружается без консольных ошибок', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    expect(errors).toHaveLength(0)
  })

  test('показывает hero-заголовок', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /IT-аутсорсинг/i })).toBeVisible()
  })

  test('показывает все ключевые секции', async ({ page }) => {
    await page.goto('/')
    // Секции по id
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('#process')).toBeVisible()
    await expect(page.locator('#stack')).toBeVisible()
    await expect(page.locator('#contacts')).toBeVisible()
  })

  test('кнопка CTA скроллит к форме', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Запросить бесплатный аудит/i }).click()
    await expect(page.locator('#contacts')).toBeInViewport()
  })
})

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('страница не сломана на мобильном', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /IT-аутсорсинг/i })).toBeVisible()
    await expect(page.locator('#contacts')).toBeVisible()
  })
})
```

- [ ] **Шаг 3: Запустить E2E тесты**

```bash
npm run test:e2e
```

Ожидаемый вывод: `5 passed` (chromium + mobile проекты).

Если тест `загружается без консольных ошибок` падает из-за предупреждений React — проверить сообщение. Предупреждения (warnings) — ок, ошибки (errors) — нужно исправить.

- [ ] **Шаг 4: Коммит**

```bash
git add e2e/landing.spec.ts
git commit -m "test: add E2E tests for landing page sections and navigation"
```

---

## Task 7: E2E тесты — форма (Playwright)

**Files:**
- Create: `e2e/form.spec.ts`

- [ ] **Шаг 1: Создать `e2e/form.spec.ts`**

```ts
// e2e/form.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contacts')
    // Ждём появления формы
    await expect(page.getByText('Запросить аудит')).toBeVisible()
  })

  test('показывает ошибку при отправке с пустым телефоном', async ({ page }) => {
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(page.getByText('Введите корректный номер телефона.')).toBeVisible()
  })

  test('показывает ошибку при неверном email', async ({ page }) => {
    await page.getByPlaceholder('Номер телефона').fill('7771234567')
    await page.getByPlaceholder('Email (необязательно)').fill('not-an-email')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(page.getByText('Проверьте формат email.')).toBeVisible()
  })

  test('успешно отправляет форму и показывает success-сообщение', async ({ page }) => {
    // Мокаем formspree endpoint
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    )

    await page.getByPlaceholder('Ваше имя').fill('Тест Тестов')
    await page.getByPlaceholder('Номер телефона').fill('7771234567')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()

    await expect(
      page.getByText('Отлично! Мы свяжемся с вами в течение 24-48 часов.')
    ).toBeVisible({ timeout: 5000 })
  })

  test('показывает ошибку при сбое сервера', async ({ page }) => {
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({ status: 500, body: '' })
    )

    await page.getByPlaceholder('Номер телефона').fill('7771234567')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()

    await expect(page.getByText('Ошибка отправки. Попробуйте позже.')).toBeVisible({ timeout: 5000 })
  })
})
```

- [ ] **Шаг 2: Запустить E2E тесты**

```bash
npm run test:e2e
```

Ожидаемый вывод: все тесты `passed`.

- [ ] **Шаг 3: Запустить все тесты финально**

```bash
npm test && npm run test:e2e
```

Ожидаемый вывод:
- Vitest: `10 tests passed`
- Playwright: все тесты `passed`

- [ ] **Шаг 4: Коммит**

```bash
git add e2e/form.spec.ts
git commit -m "test: add E2E tests for contact form validation and submission"
```

---

## Критерии готовности

- [ ] `npm test` — все 10 Vitest-тестов зелёные
- [ ] `npm run test:e2e` — все Playwright-тесты зелёные
- [ ] `npm run coverage` — генерирует отчёт в `coverage/`
- [ ] Нет зависимостей от внешних сервисов в тестах (fetch замокан)
