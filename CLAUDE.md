# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

```bash
npm run dev        # Запустить Vite dev сервер (http://localhost:5173)
npm run build      # Проверка типов (tsc -b) + production сборка
npm run lint       # ESLint по всем TypeScript файлам
npm run preview    # Превью production сборки локально
```

## Тестирование

```bash
# Установить зависимости для тестов
pip install -r requirements-test.txt

# Запустить все тесты
pytest tests/ -q

# Запустить один файл
pytest tests/test_database.py -v

# Запустить один тест
pytest tests/test_database.py::TestOrders::test_create_order -v

# С отчётом покрытия
pytest tests/ --cov=. --cov-report=term-missing
```

`pytest.ini` задаёт `asyncio_mode = auto` — все `async def test_*` функции запускаются автоматически без декоратора `@pytest.mark.asyncio`.

Тесты используют временную SQLite БД (`tmp_path/test.db`) через фикстуру `test_db` в `tests/conftest.py`. `init_db()` вызывает `_invalidate_caches()`, поэтому каждый тест видит свежие данные без остатков кэша.

| Файл | Что тестирует |
|------|---------------|
| `tests/test_normalize_phone.py` | `normalize_phone()` — все форматы номеров |
| `tests/test_constants.py` | Корректность значений в `constants.py` |
| `tests/test_pricing.py` | `calculate_order_price()` и `format_order_card()` |
| `tests/test_database.py` | CRUD операции: пользователи, заказы, окна, цены, бренды |
| `tests/test_cache.py` | TTL-кэш `get_prices()` / `get_profile_brands()`, инвалидация |

## Архитектура

**Одностраничное приложение (SPA)** — почти вся логика находится в `src/TrivoxCoreLanding.tsx` (~1900 строк). Это маркетинговый лендинг, задеплоенный на Vercel.

Поток запуска: `index.html` → `src/main.tsx` → `src/TrivoxCoreLanding.tsx`.

`src/App.tsx` — стандартная заглушка Vite-шаблона, **не используется** основным приложением.

### Ключевые паттерны

- **Массивы данных как константы** — сервисы, преимущества, шаги процесса, стеки технологий — объявлены как типизированные константные массивы в начале файла компонента. Для добавления/удаления элементов — редактировать эти массивы.
- **Кастомные SVG иконки** — иконки соцсетей (LinkedIn, WhatsApp, Instagram, Telegram) определены как инлайн React-компоненты в том же файле.
- **Ввод телефона** — используется `react-phone-number-input` с кастомным селектором страны, в котором страны СНГ вынесены отдельно.
- **Без роутинга** — одна страница; `vercel.json` перенаправляет все пути на `index.html`.
- **Без бэкенда** — статичный сайт; обработка формы обратной связи — на клиенте.

### Язык контента

Весь видимый текстовый контент — на **русском языке**. Новый текст писать на русском, если явно не указано иное.

### Деплой

Задеплоен на Vercel. Правило SPA-перезаписи в `vercel.json` должно оставаться — иначе прямые URL работать не будут.

### SEO-ресурсы

`index.html` содержит вручную поддерживаемые мета-теги, Open Graph, Twitter Card и JSON-LD (схемы Organization, WebSite, Service). `public/sitemap.xml` и `public/robots.txt` поддерживаются вручную.

## TypeScript

Включён строгий режим (`strict: true`, `noUnusedLocals`, `noUnusedParameters`). Сборка упадёт при неиспользуемых импортах или параметрах — чистить перед коммитом.

---

## Автозапуск MCP плагинов, навыков и инструментов

> **КРИТИЧЕСКИ ВАЖНО**: Все правила в этом разделе — **обязательны** и применяются **без напоминания пользователя**. Пропустить шаг нельзя даже для "простых" задач. Нет исключений. Если есть хотя бы 1% вероятность, что навык применим — вызвать его **до** любого другого действия.

### MCP плагины — когда запускать автоматически

| Плагин | Триггеры для автозапуска |
|--------|--------------------------|
| **context7** | Любая работа с внешней библиотекой или фреймворком (React, Vite, Tailwind, aiogram, pytest, aiosqlite и др.) — ВСЕГДА перед написанием кода. Сначала `resolve-library-id`, затем `query-docs` |
| **playwright** | Тестирование веб-интерфейсов, webhook'ов, браузерная автоматизация |
| **figma** | figma.com URL в сообщении, задача с дизайном или UI-макетами |
| **supabase** | Любая работа с Supabase БД |
| **github** | Работа с GitHub: создание issues/PR, code review, поиск по репозиториям, GitHub API |
| **claude-mem** | Начало сессии (восстановить контекст), запоминание фактов, поиск по прошлым сессиям |
| **security-guidance** | **Хук** (не навык) — запускается автоматически при каждом `Edit`/`Write`/`MultiEdit`. Ручной вызов не нужен. |

### Навыки (Skills) — полная таблица автозапуска

#### Планирование и архитектура

| Ситуация | Навык(и) |
|----------|----------|
| Нужен план до начала разработки | `claude-mem:make-plan` |
| Новая фича или функциональность — мозговой штурм | `superpowers:brainstorming` → `feature-dev:feature-dev` |
| Полный авто-пайплайн: CEO + design + eng review плана | `autoplan` |
| Обзор плана с точки зрения CEO/фаундера | `plan-ceo-review` |
| Обзор плана инженерным менеджером | `plan-eng-review` |
| Обзор плана с точки зрения дизайна | `plan-design-review` |
| Обзор плана с точки зрения DX (developer experience) | `plan-devex-review` |
| Есть готовый план — выполнить его | `superpowers:executing-plans` |
| Нужно написать план реализации | `superpowers:writing-plans` |

#### Разработка

| Ситуация | Навык(и) |
|----------|----------|
| Бэкенд-задача (хендлеры, FSM, роутеры) | `feature-dev:feature-dev` |
| Проектирование API, БД-архитектура, масштабируемые системы | `backend-architect:backend-architect` |
| Работа с базой данных | `feature-dev:feature-dev` |
| Глубокий анализ кодовой базы (трассировка, зависимости) | `feature-dev:code-explorer` |
| Проектирование архитектуры новой фичи (файлы, потоки данных) | `feature-dev:code-architect` |
| UI/Frontend задача | `frontend-design:frontend-design` + `ui-ux-pro-max:ui-ux-pro-max` |
| 2+ независимых задачи можно делать параллельно | `superpowers:dispatching-parallel-agents` |
| Выполнение плана через независимые субагенты | `superpowers:subagent-driven-development` или `claude-mem:do` |
| Работа в изолированной ветке/worktree | `superpowers:using-git-worktrees` |
| Работа с Claude API или Anthropic SDK | `claude-api` |

#### Тесты

| Ситуация | Навык(и) |
|----------|----------|
| Написание или запуск тестов | `superpowers:test-driven-development` |

#### Отладка и качество кода

| Ситуация | Навык(и) |
|----------|----------|
| Баг, неожиданное поведение, падающий тест | `superpowers:systematic-debugging` или `investigate` |
| Рефакторинг или упрощение кода | `code-simplifier:code-simplifier` |
| Упрощение только что написанного кода | `simplify` |
| Проверка качества кода (типизация, линтинг, покрытие) | `health` |
| Завершение реализации перед коммитом | `superpowers:verification-before-completion` |

#### Code Review

| Ситуация | Навык(и) |
|----------|----------|
| Запрос code review от пользователя | `superpowers:requesting-code-review` |
| Получение замечаний code review | `superpowers:receiving-code-review` |
| Провести code review PR перед merge | `review` или `code-review:code-review` |
| Ревью кода на баги, уязвимости, качество (субагент) | `feature-dev:code-reviewer` |
| Аудит всего проекта | `audit-project:audit-project` |

#### Git, деплой и релизы

| Ситуация | Навык(и) |
|----------|----------|
| Реализация завершена, готов к merge/PR | `superpowers:finishing-a-development-branch` |
| Ship: тесты + review + merge + деплой одной командой | `ship` |
| Merge PR + ждать CI + задеплоить | `land-and-deploy` |
| Настроить параметры деплоя | `setup-deploy` |
| Семантическое версионирование и релиз | `claude-mem:version-bump` |

#### QA и браузер

| Ситуация | Навык(и) |
|----------|----------|
| QA-тестирование веб-приложения с исправлением багов | `qa` |
| QA-тестирование только для отчёта (без исправлений) | `qa-only` |
| Быстрый headless браузер для проверки сайта | `browse` или `gstack` |
| Мониторинг приложения после деплоя | `canary` |
| Аудит DX в живом приложении | `devex-review` |
| Нужны куки из реального браузера в headless | `setup-browser-cookies` |
| Запустить GStack Browser с AI-сайдбаром | `open-gstack-browser` |

#### Дизайн и Figma

| Ситуация | Навык(и) |
|----------|----------|
| Любая задача с Figma или figma.com URL | `figma:figma-use` (ОБЯЗАТЕЛЬНО первым) |
| Реализация Figma-дизайна в коде | `figma:figma-implement-design` |
| Перевод требований в Figma-дизайн | `figma:figma-generate-design` |
| Построить/обновить дизайн-систему в Figma | `figma:figma-generate-library` |
| Создать правила дизайн-системы для кодовой базы | `figma:figma-create-design-system-rules` |
| Настроить Code Connect (Figma ↔ код) | `figma:figma-code-connect` |
| Создать новый файл в Figma | `figma:figma-create-new-file` |
| Дизайн-консультация по продукту | `design-consultation` |
| Генерация нескольких вариантов дизайна | `design-shotgun` |
| Финальный production HTML-дизайн | `design-html` |
| Дизайнерский QA-аудит готового интерфейса | `design-review` |

#### Документация и обучение

| Ситуация | Навык(и) |
|----------|----------|
| Обновить документацию после релиза | `document-release` |
| Управление накопленными знаниями проекта | `learn` |
| Еженедельная ретроспектива по коммитам | `retro` |
| YC Office Hours — форсирующие вопросы по продукту | `office-hours` |

#### Безопасность

| Ситуация | Навык(и) |
|----------|----------|
| Аудит безопасности инфраструктуры и кода | `cso` |
| Включить предупреждения перед деструктивными командами | `careful` |
| Полный режим безопасности (деструктивные команды + ограничение директорий) | `guard` |

#### Память и контекст

| Ситуация | Навык(и) / Действие |
|----------|---------------------|
| Поиск по прошлым сессиям | `claude-mem:mem-search` |
| Токен-оптимизированный поиск по коду через AST | `claude-mem:smart-explore` |
| Построить AI базу знаний из наблюдений | `claude-mem:knowledge-agent` |
| Создать нарратив-отчёт о работе над проектом | `claude-mem:timeline-report` |
| Важная информация между сессиями | Сохранить в memory систему (`~/.claude/projects/…/memory/`) |

#### Автоматизация и расписание

| Ситуация | Навык(и) |
|----------|----------|
| Запускать команду/навык по интервалу | `loop` |
| Создать/управлять расписанием удалённых агентов | `schedule` |
| Сохранить/восстановить рабочее состояние (git + todo) | `checkpoint` |
| Заблокировать редактирование файлов вне директории | `freeze` / `unfreeze` |

#### Настройка и инструменты

| Ситуация | Навык(и) |
|----------|----------|
| Настройка хуков и поведения Claude Code (settings.json) | `update-config` |
| Создание или изменение навыков (skills) | `skill-creator:skill-creator` |
| Написание нового навыка | `superpowers:writing-skills` |
| Настройка горячих клавиш | `keybindings-help` |
| Benchmark: замер производительности и регрессий | `benchmark` |
| AI агент + браузер (pair programming) | `pair-agent` |

### Запрещённые отмазки

| Мысль | Реальность |
|-------|------------|
| «Это простой вопрос» | Вопросы — это задачи. Проверить навыки. |
| «Нужно сначала изучить код» | Навыки говорят КАК изучать. Сначала проверить. |
| «Навык избыточен для этого» | Если навык существует — использовать его. |
| «Я помню этот навык» | Навыки меняются. Читать актуальную версию через Skill tool. |
| «Сделаю сначала это одно» | Проверить ПЕРЕД любым действием. |
| «Нет подходящего навыка» | Проверить весь список — вероятно, что-то подходит. |

---

## Язык общения

Всегда использовать **русский язык** для всех ответов, объяснений, вопросов, комментариев в коде, коммит-сообщений и любого другого текстового вывода.
