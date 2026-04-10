// src/__tests__/TrivoxCoreLanding.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TrivoxCoreLanding from '../TrivoxCoreLanding'

function renderWithUser() {
  const user = userEvent.setup()
  return { user, ...render(<TrivoxCoreLanding />) }
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
    expect(screen.getByRole('heading', { name: 'Запросить аудит' })).toBeInTheDocument()
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
      const { user } = renderWithUser()
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Введите корректный номер телефона.')).toBeInTheDocument()
    })

    it('показывает ошибку при неверном email', async () => {
      const { user } = renderWithUser()
      const phoneInput = screen.getByPlaceholderText('Номер телефона')
      await user.type(phoneInput, '7771234567')
      const emailInput = screen.getByPlaceholderText('Email (необязательно)')
      await user.type(emailInput, 'not-an-email')
      const submitBtn = screen.getByRole('button', { name: /Отправить заявку/i })
      await user.click(submitBtn)
      expect(await screen.findByText('Проверьте формат email.')).toBeInTheDocument()
    })
  })

  describe('отправка формы', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('показывает success-сообщение при успешной отправке', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response)
      const { user } = renderWithUser()
      await user.type(screen.getByPlaceholderText('Номер телефона'), '7771234567')
      await user.click(screen.getByRole('button', { name: /Отправить заявку/i }))
      expect(await screen.findByText('Отлично! Мы свяжемся с вами в течение 24-48 часов.')).toBeInTheDocument()
    })

    it('показывает ошибку при ответе сервера не ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)
      const { user } = renderWithUser()
      await user.type(screen.getByPlaceholderText('Номер телефона'), '7771234567')
      await user.click(screen.getByRole('button', { name: /Отправить заявку/i }))
      expect(await screen.findByText('Ошибка отправки. Попробуйте позже.')).toBeInTheDocument()
    })

    it('показывает ошибку при сетевом сбое', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
      const { user } = renderWithUser()
      await user.type(screen.getByPlaceholderText('Номер телефона'), '7771234567')
      await user.click(screen.getByRole('button', { name: /Отправить заявку/i }))
      expect(await screen.findByText('Ошибка сети. Попробуйте позже.')).toBeInTheDocument()
    })
  })
})
