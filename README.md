Я учавствую в хакатоне и делаю LMS. Рекомендуемый функционал:
    Модель learn-2-earn (или любой другой формат токенизации процесса онлайн обучения) 
    Интеграция больших языковых моделей (LLM) 
    Тестирования, домашние задачния, квести и квизы. 
    Элементы геймификации 
    Аналитика прогресса обучения 

Я хочу создать платформу на основе miniapp в telegram в которой пользователь сможет создавать свой курс самостоятельно с помощью нейросетей, а потом наша LMS будет помогать ему в изучении выбраной темы.

Мне нужно написать вебапп на Next JS + Postgresql и захостить все на vercel, смогу ли я захостить постгрес бд для теста на постгрес или стоит использовать другой вариант?

Потом мне нужно написать маленького тг-бота который будет давать кнопку на открытие мини аппа, а так же уведомлять пользователя о грядущих занятиях. 

Функционал который я хочу сделать: 
1. Создание курса самим пользователем:
1.1 При входже в приложение пользователя спрашивают что он хочет выучить, а так же выбирает уровень погружения в тему: Поверхностно (1 день), Среднее (1-3дня), Полное (курс на 7-14 дней)
1.2 После ввода пользователем темы для изучения - с помощью АПИ Gemini создается список подтем для изучения конкретной темы, так же учитывая сложность курса выбранную юзером. (легкий уровень - 5 подтем, средний - 15 подтем, сложный - 30 подтем)
1.3 После создания списка подтем к курсу пользователя они начинают наполняться контентом, то есть с помощью Gemini API  генерируется обучающий материал по этой подтеме и квиз для закрепления знаний и все это записывается в бд для дальнейшего переиспользования. (квиз это 5-10 вопросов по обучающему материалу, гемини апи должна возврщать квизх в формате 10 вопросов - каждый по 4 варианта ответа - 1 из них правильный и его нужно помечать в бд как правильный)
2. При прохождении курса пользователь получает EXP на его профиль при правилоьных ответах на вопросы
3. Лидерборд по EXP

Помоги мне сделать это всего за 7 часов, верстка используя shadcn/ui + tailwindcss, апи пиши с помощью Next API. Главное что бы потом это легко хостилось на Vercel. Я работаю на маке. Если что мне не нужно объяснять что ты пишешь просто пиши код и все. Мне нужно что бы все было краасиво на фронтенде поэтому сразу гнужено верстать красивые ложные много классовые компоненты в стиле Duolingo компонентов. верстать надо Mobile first , потому что мы будем запускать это как миниапп на телефонах в телеграме. Авторизация самая простая с помощью JWT или телеграма. Главное что бы была синхронизация с телеграммом так как при входе юзера в миниапп, что бы миниапп знал что за пользователь зашел в него.


Сделай приветственный экран приложения (онбординг) что бы пользователь был по приветствован если он еще не заходил в приложение, так же у него спросили как его зовут и таким обпразом он зашел в систему, то есть просто как то запомнить его, установи ему бесконечный куки или еще что запомни, но вообще надо запоминать его телеграм айди что бы при следцющем открытии вебаппа приложение знало кто зашел, какие у него курсы и прогресс. 

Нужно сделать авторизацию по телеграму, что бы приложение можно было открыть из телеграма и буджет известен айди пользователя и можно будет использовать это для входа# LMS
