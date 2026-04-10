// e2e/form.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#contacts').scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name: 'Запросить аудит' })).toBeVisible()
  })

  test('показывает ошибку при отправке с пустым телефоном', async ({ page }) => {
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(page.getByText('Введите корректный номер телефона.')).toBeVisible()
  })

  test('показывает ошибку при неверном email', async ({ page }) => {
    await page.locator('.phone-input-wrap input').fill('7771234567')
    await page.getByPlaceholder('Email (необязательно)').fill('not-an-email')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(page.getByText('Проверьте формат email.')).toBeVisible()
  })

  test('успешно отправляет форму и показывает success-сообщение', async ({ page }) => {
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    )
    await page.getByPlaceholder('Ваше имя').fill('Тест Тестов')
    await page.locator('.phone-input-wrap input').fill('7771234567')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(
      page.getByText('Отлично! Мы свяжемся с вами в течение 24-48 часов.')
    ).toBeVisible({ timeout: 5000 })
  })

  test('показывает ошибку при сбое сервера', async ({ page }) => {
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({ status: 500, body: '' })
    )
    await page.locator('.phone-input-wrap input').fill('7771234567')
    await page.getByRole('button', { name: /Отправить заявку/i }).click()
    await expect(
      page.getByText('Ошибка отправки. Попробуйте позже.')
    ).toBeVisible({ timeout: 5000 })
  })
})
