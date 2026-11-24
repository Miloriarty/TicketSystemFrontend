# TicketSystemFrontend

Фронтенд системы заявок (tickets) на Angular + Angular Material.

- **Manager** (`/pages/manager`): создание заявок, выбор категорий и сотрудников
- **Admin** (`/pages/admin`): управление сотрудниками и категориями
- **Employees** (`/pages/employees`): принятие/отклонение/завершение заявок сотрудником
- **Services** (`/core/services`): все сервисы для работы с API
- **Models** (`/core/models`): все модели данных
- **Shared**: Единственный pipe для получения имен по id

## Требования

- Node.js и npm

## Запуск

```bash
npm install
npm start
```

Приложение будет доступно на http://localhost:4200.

## Настройка API

Адрес API задаётся константой `API_URL` в `src/app/core/api.ts` (по умолчанию `http://localhost:5042/api`).
Чтобы подключиться к другому серверу, поменяй её там.
