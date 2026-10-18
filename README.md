# PracticeProjectAngular

Фронтенд системы заявок (tickets) на Angular + Angular Material.

- **Manager** (`/manager`): создание заявок, выбор категорий и сотрудников
- **Admin** (`/admin`): управление сотрудниками и категориями
- **Services** (`/services`): все сервисы для работы с backend
## Требования
- Node.js и npm
- .NET SDK (для backend)

## Запуск

### 1. Backend

Backend написан на .NET и лежит в отдельном репозитории: `https://github.com/Miloriarty/TicketSystem`.
Запусти его по инструкции из его README. Фронтенд ожидает API по адресу
`http://localhost:5042/api`.

### 2. Frontend

```bash
npm install
npm start
```

Приложение будет доступно на http://localhost:4200.

## Примечания

- Адреса API заданы в `src/app/services/*.ts` (`apiUrl`). Если backend работает на другом порту, поменяй их там
