# ptp2021-4-chat

Web-чат

Участники команды:

* Козочкин Михаил (капитан) - https://github.com/postlog
* Павлов Игорь - https://github.com/boomb0om
* Бермишев Владислав - https://github.com/vladbermishev
* Константинова Полина - https://github.com/pollykon
* Суханов Андрей - https://github.com/pug-coder
* Рыков Игорь - https://github.com/notops
* Герман Владимир - https://github.com/gervva
* Мягких Елисей - https://github.com/eliseysoft

Для начала работы с проектом:

* Скопируйте репозиторий и перейдите в папку с проектом

  `git clone https://github.com/bmstu-iu9/ptp2021-4-chat.git`

  `cd ptp2021-4-chat`


* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))


* Скачайте и поместите в папку с проектом (`ptp2021-4-chat/`) `.env`-файл


* Запустите базу данных

  `npm run database`


* Установите зависимости и произведите миграции

  `npm install`

  `npm run migrate-force`


* Запустите сервер

  `npm run server`


* Для разработки фронтенда

  `npm run frontend`

Для деплоя:

* Скопируйте репозиторий и перейдите в папку с проектом

  `git clone https://github.com/bmstu-iu9/ptp2021-4-chat.git`

  `cd ptp2021-4-chat`


* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))


* Скачайте и поместите в папку с проектом (`ptp2021-4-chat/`) `.env`-файл


* Запустите проект

  `npm run deploy`
  