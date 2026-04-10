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
})
