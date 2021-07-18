
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

* Скопируйте репозиторий
  
  `git clone https://github.com/bmstu-iu9/ptp2021-4-chat.git`
  
* Перейдите в папку с проектом
  
  `cd ptp2021-4-chat`
  
* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))

* Скачайте и поместите в папку `ptp2021-4-chat/` файл с переменными окружения (`.env`)

* Соберите и запустите контейнеры
  
    `docker-compose up`
  
* Для разработки фронтенда запустите Gulp

    `gulp`

**Важно!** Во время разработки бэкенда и изменении содержимого папки `node_modules` для применения этих изменений нужно _пересобрать_ контейнеры

Для деплоя на сервер:

* Скопируйте репозиторий
  
  `git clone https://github.com/bmstu-iu9/ptp2021-4-chat.git`
  
* Перейдите в папку с проектом
  
  `cd ptp2021-4-chat`
  
* Скачайте и поместите в папку `ptp2021-4-chat/` файл с переменными окружения (`.env`)

* Скачайте и установите Docker ([https://www.docker.com/](https://www.docker.com/))

* Соберите и запустите **production**-контейнеры командой
  
    `docker-compose -f docker-compose.prod.yml up`