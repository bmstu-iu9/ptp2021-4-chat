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


* **Если проект уже существует**, то синхронизуйте локальную ветку main с удаленной

  `git fetch --all`

  `git checkout main`

  `git reset --hard origin/main`

* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))

* Скачайте и поместите в папку с проектом (`ptp2021-4-chat`) `.env`-файл

* Соберите и запустите контейнер с базой данных

  `docker-compose up --build`


* Установите все зависимости и запустите сервер

  `npm i`

  `npm run server`


* Для разработки фронтенда установите и запустите Gulp

  `npm i -g gulp`

  `gulp`

Для деплоя на сервер:

* Скопируйте репозиторий и перейдите в папку с проектом

  `git clone https://github.com/bmstu-iu9/ptp2021-4-chat.git`

  `cd ptp2021-4-chat`


* **Если проект уже существует**, то синхронизуйте локальную ветку main с удаленной

  `git fetch --all`

  `git checkout main`

  `git reset --hard origin/main`
  
* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))

* Скачайте и поместите в папку с проектом (`ptp2021-4-chat`) `.env`-файл

* Соберите и запустите **production**-контейнеры

  `docker-compose -f docker-compose.prod.yml up --build`
  