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
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#services')).toBeVisible()
    await expect(page.locator('#process')).toBeVisible()
    await expect(page.locator('#stack')).toBeVisible()
    await expect(page.locator('#contacts')).toBeVisible()
  })

  test('кнопка CTA скроллит к форме', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Запросить бесплатный аудит/i }).first().click()
    await page.waitForTimeout(800)
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
