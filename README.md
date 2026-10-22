# PracticeProjectAngular

Фронтенд системы заявок (tickets) на Angular + Angular Material.

- **Manager** (`/pages/manager`): создание заявок, выбор категорий и сотрудников
- **Admin** (`/pages/admin`): управление сотрудниками и категориями
- **Employees** (`/pages/employees`): принятие/отклонение/завершение заявок сотрудником
- **Services** (`/core/services`): все сервисы для работы с backend
- **Models** (`/core/models`): все модели данных
- **Shared**: Единственный pipe для получения имен по id

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

- Адрес API задан в `src/app/core/services/api.ts` (`API_URL`). Если backend работает на другом порту, поменяй их там

## Features
- [ ] (employees page) Диалоговое окно для просмотра полной информации заявок 
- [ ] (all pages) snack bar для действий удаления/отклонения

## Будущие правки
- [ ] (all) сделать удаление элементов
- [ ] (manager page) одинаковый размер `create card` и `tickets`
- [ ] (admin page) поправить оступы от `icon` до `card title`
- [ ] (admin page) поправить `field` в `create category card`
- [ ] (employees page) добавить в css `status cancelled`
