export type T3 = { ru: string; kk: string; en: string };
export const t3 = (ru: string, kk: string, en: string): T3 => ({ ru, kk, en });

export type Option = {
  text: T3;
  safe: boolean;
  best?: boolean;
  explain: T3;
};

export type Scene = {
  question: T3;
  options: Option[];
};

export type Lesson = {
  id: number;
  slug: string;
  emoji: string;
  track: "online" | "real";
  title: T3;
  story: T3;
  dialogue: { who: T3; text: T3; hero?: boolean }[];
  scenes: Scene[];
  rule: T3;
  badge: T3;
};

const o = (
  ru: string,
  kk: string,
  en: string,
  safe: boolean,
  eru: string,
  ekk: string,
  een: string,
  best = false,
): Option => ({ text: t3(ru, kk, en), safe, best, explain: t3(eru, ekk, een) });

export const lessons: Lesson[] = [
  {
    id: 1,
    slug: "phishing",
    emoji: "🎣",
    track: "online",
    title: t3("Фишинговые ссылки", "Фишинг сілтемелер", "Phishing links"),
    story: t3(
      "Айгерим играла в игру на планшете. Вдруг пришло сообщение: «Ты выиграл 10 000 монет! Нажми на ссылку и введи пароль от аккаунта».",
      "Айгерім планшетте ойын ойнап отырды. Кенет хабарлама келді: «Сен 10 000 монета ұттың! Сілтемені бас та, аккаунт құпиясөзін енгіз».",
      "Aigerim was playing a game on her tablet. Suddenly a message popped up: “You won 10,000 coins! Tap the link and enter your account password.”",
    ),
    dialogue: [
      {
        who: t3("Сообщение", "Хабарлама", "Message"),
        text: t3(
          "Срочно! Ссылка работает только 5 минут!",
          "Жедел! Сілтеме тек 5 минут жұмыс істейді!",
          "Hurry! The link works for only 5 minutes!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Стоп! Когда тебя торопят и просят пароль — это ловушка. Она называется фишинг.",
          "Тоқта! Сені асықтырып, құпиясөз сұраса — бұл тұзақ. Оны фишинг дейді.",
          "Stop! When someone rushes you and asks for a password — that's a trap called phishing.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что сделает Айгерим?", "Айгерім не істейді?", "What should Aigerim do?"),
        options: [
          o(
            "Нажать на ссылку и ввести пароль",
            "Сілтемені басып, құпиясөзді енгізу",
            "Tap the link and enter the password",
            false,
            "Опасно! Пароль — это ключ от твоего дома в интернете. Мошенники украдут аккаунт и все монеты.",
            "Қауіпті! Құпиясөз — интернеттегі үйіңнің кілті. Алаяқтар аккаунтты да, монеталарды да ұрлап кетеді.",
            "Dangerous! A password is the key to your online home. Scammers would steal the account and every coin.",
          ),
          o(
            "Закрыть сообщение и рассказать взрослым",
            "Хабарламаны жауып, ересектерге айту",
            "Close the message and tell an adult",
            true,
            "Отлично! Закрыть и рассказать — самый безопасный ход. Взрослый поможет пожаловаться на мошенника.",
            "Тамаша! Жауып, айту — ең қауіпсіз қадам. Ересек адам алаяққа шағым жасауға көмектеседі.",
            "Great! Closing it and telling an adult is the safest move. They can help report the scammer.",
            true,
          ),
          o(
            "Переслать ссылку друзьям — вдруг им повезёт",
            "Сілтемені достарға жіберу — кенет оларға бақ қонар",
            "Forward the link to friends, maybe they'll be lucky",
            false,
            "Так ловушка попадёт и к друзьям. Не пересылай подозрительные ссылки — предупреди друзей словами.",
            "Сонда тұзақ достарыңа да жетеді. Күмәнді сілтемені жіберме — достарыңды сөзбен ескерт.",
            "Then the trap reaches your friends too. Never forward suspicious links — warn friends with words instead.",
          ),
        ],
      },
      {
        question: t3(
          "Как узнать фишинговую ссылку?",
          "Фишинг сілтемені қалай тануға болады?",
          "How do you spot a phishing link?",
        ),
        options: [
          o(
            "Она обещает подарок и просит пароль",
            "Ол сыйлық уәде етіп, құпиясөз сұрайды",
            "It promises a prize and asks for a password",
            true,
            "Верно! Подарок + срочность + пароль = фишинг. Настоящие игры никогда не спрашивают пароль в сообщении.",
            "Дұрыс! Сыйлық + асығыстық + құпиясөз = фишинг. Нағыз ойындар хабарламада құпиясөз сұрамайды.",
            "Correct! Prize + urgency + password = phishing. Real games never ask for your password in a message.",
            true,
          ),
          o(
            "Она написана красивыми буквами",
            "Ол әдемі әріптермен жазылған",
            "It is written in pretty letters",
            false,
            "Красивый вид ничего не доказывает. Мошенники специально делают красивые страницы-копии.",
            "Әдемі көрініс ештеңе дәлелдемейді. Алаяқтар әдейі әдемі көшірме беттер жасайды.",
            "Looks prove nothing. Scammers make beautiful copycat pages on purpose.",
          ),
          o(
            "У неё много друзей в комментариях",
            "Оның пікірлерінде достары көп",
            "It has lots of friends in the comments",
            false,
            "Комментарии тоже подделывают роботы. Смотри не на комментарии, а на то, что у тебя просят.",
            "Пікірлерді де боттар жазады. Пікірге емес, сенен не сұрап тұрғанына қара.",
            "Comments can be faked by bots. Look at what they ask you for, not at the comments.",
          ),
        ],
      },
    ],
    rule: t3(
      "Никогда не вводи пароль по ссылке из сообщения, даже если обещают подарок.",
      "Хабарламадағы сілтеме арқылы ешқашан құпиясөз енгізбе, сыйлық уәде етсе де.",
      "Never enter your password through a link from a message, even if a prize is promised.",
    ),
    badge: t3("Охотник на фишинг", "Фишинг аңшысы", "Phishing Hunter"),
  },
  {
    id: 2,
    slug: "scammers",
    emoji: "🕵️",
    track: "online",
    title: t3("Интернет-мошенники", "Интернет алаяқтары", "Internet scammers"),
    story: t3(
      "Данияру написал незнакомец: «Привет! Я работаю в банке. Твоя мама попросила прислать код из СМС. Скинь быстро!»",
      "Даниярға бейтаныс жазды: «Сәлем! Мен банкте істеймін. Анаң SMS кодын жіберуді өтінді. Тез жібер!»",
      "A stranger wrote to Daniyar: “Hi! I work at a bank. Your mum asked you to send the SMS code. Quick!”",
    ),
    dialogue: [
      {
        who: t3("Незнакомец", "Бейтаныс", "Stranger"),
        text: t3(
          "Только не говори маме, это сюрприз для неё.",
          "Тек анаңа айтпа, бұл оған сюрприз.",
          "Just don't tell your mum, it's a surprise for her.",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Слышишь? «Не говори маме» — это красный флаг. Настоящие банки не пишут детям.",
          "Естіп тұрсың ба? «Анаңа айтпа» — қызыл ту. Нағыз банктер балаларға жазбайды.",
          "Hear that? “Don't tell mum” is a red flag. Real banks never message children.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что ответить?", "Не деп жауап беру керек?", "What should he reply?"),
        options: [
          o(
            "Отправить код — вдруг это правда",
            "Кодты жіберу — кенет рас болса",
            "Send the code, maybe it's true",
            false,
            "Код из СМС — как ключ от сейфа. Отдав его, семья может потерять деньги.",
            "SMS коды — сейф кілті сияқты. Оны берсең, отбасы ақшасынан айырылуы мүмкін.",
            "An SMS code is like a safe key. Giving it away can cost the family their money.",
          ),
          o(
            "Ничего не отвечать и показать маме переписку",
            "Жауап бермей, жазысуды анаға көрсету",
            "Reply nothing and show mum the chat",
            true,
            "Именно так! Молчание + взрослый = мошенник проиграл. Ещё можно заблокировать номер.",
            "Дәл солай! Үнсіздік + ересек = алаяқ жеңілді. Нөмірді бұғаттауға да болады.",
            "Exactly! Silence + an adult = the scammer loses. You can also block the number.",
            true,
          ),
          o(
            "Спросить у него, из какого он банка",
            "Одан қай банктен екенін сұрау",
            "Ask him which bank he is from",
            false,
            "Мошенник просто соврёт. Разговор только затянет тебя в ловушку — лучше сразу выйти из чата.",
            "Алаяқ жай өтірік айтады. Әңгіме сені тұзаққа тартады — чаттан бірден шыққан дұрыс.",
            "The scammer will simply lie. Talking pulls you deeper — better to leave the chat at once.",
          ),
        ],
      },
      {
        question: t3(
          "Главный признак мошенника в сети:",
          "Желідегі алаяқтың басты белгісі:",
          "The main sign of an online scammer:",
        ),
        options: [
          o(
            "Просит секрет, код или деньги и торопит",
            "Құпия, код не ақша сұрап, асықтырады",
            "Asks for a secret, code or money and rushes you",
            true,
            "Да! Спешка и секретность — любимые инструменты мошенников.",
            "Иә! Асығыстық пен құпия — алаяқтардың сүйікті құралы.",
            "Yes! Hurry and secrecy are a scammer's favourite tools.",
            true,
          ),
          o(
            "У него смешная аватарка",
            "Оның аватары күлкілі",
            "He has a funny avatar",
            false,
            "Аватарку можно взять любую. Смотри на просьбу, а не на картинку.",
            "Аватарды кез келгенін алуға болады. Суретке емес, өтінішіне қара.",
            "Any picture can be an avatar. Judge the request, not the image.",
          ),
          o(
            "Он пишет с ошибками",
            "Ол қатемен жазады",
            "He writes with mistakes",
            false,
            "Иногда мошенники пишут грамотно. Ошибки — не главный признак.",
            "Кейде алаяқтар сауатты жазады. Қате — басты белгі емес.",
            "Some scammers write perfectly. Typos are not the main sign.",
          ),
        ],
      },
    ],
    rule: t3(
      "Никогда не отправляй коды из СМС и не храни секреты от родителей.",
      "SMS кодтарын ешқашан жіберме және ата-анаңнан құпия сақтама.",
      "Never send SMS codes and never keep secrets from your parents.",
    ),
    badge: t3("Детектив сети", "Желі детективі", "Net Detective"),
  },
  {
    id: 3,
    slug: "fake-shops",
    emoji: "🛒",
    track: "online",
    title: t3("Поддельные интернет-магазины", "Жалған интернет-дүкендер", "Fake online shops"),
    story: t3(
      "Алина нашла сайт: новый телефон за 500 тенге! Оплата только переводом на карту незнакомому человеку.",
      "Алина сайт тапты: жаңа телефон 500 теңге! Төлем тек бейтаныс адамның картасына аудару арқылы.",
      "Alina found a site: a new phone for 500 tenge! Payment only by transfer to a stranger's card.",
    ),
    dialogue: [
      {
        who: t3("Сайт", "Сайт", "The site"),
        text: t3(
          "Осталось 2 штуки! Переведите деньги прямо сейчас.",
          "2 дана қалды! Ақшаны дәл қазір аударыңыз.",
          "Only 2 left! Transfer the money right now.",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Если цена слишком хорошая — товара, скорее всего, не существует.",
          "Баға тым жақсы болса — тауар мүлде жоқ болуы мүмкін.",
          "If the price is too good, the product probably doesn't exist.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Как поступить Алине?", "Алина не істеуі керек?", "What should Alina do?"),
        options: [
          o(
            "Попросить у папы карту и оплатить",
            "Әкесінен картаны сұрап, төлеу",
            "Ask dad for his card and pay",
            false,
            "Деньги уйдут, а телефон не придёт. Перевод физлицу вернуть почти невозможно.",
            "Ақша кетеді, телефон келмейді. Жеке адамға аударымды қайтару мүмкін емес дерлік.",
            "The money disappears and no phone arrives. Transfers to a private person are nearly impossible to refund.",
          ),
          o(
            "Показать сайт родителям и проверить отзывы",
            "Сайтты ата-анаға көрсетіп, пікірлерді тексеру",
            "Show the site to parents and check reviews",
            true,
            "Правильно! Проверка адреса сайта, отзывов и способа оплаты защищает от подделок.",
            "Дұрыс! Сайт мекенжайын, пікірлерді, төлем тәсілін тексеру жалғаннан қорғайды.",
            "Right! Checking the address, reviews and payment method protects you from fakes.",
            true,
          ),
          o(
            "Заказать сразу два — вдруг подорожает",
            "Бірден екеуін тапсырыс беру — қымбаттап кетер",
            "Order two before the price rises",
            false,
            "Так ты потеряешь вдвое больше денег. Спешка — часть обмана.",
            "Сонда екі есе көп ақша жоғалтасың. Асығыстық — алдаудың бөлігі.",
            "You'd lose twice as much money. The rush is part of the trick.",
          ),
        ],
      },
      {
        question: t3(
          "Какой магазин безопаснее?",
          "Қай дүкен қауіпсіз?",
          "Which shop is safer?",
        ),
        options: [
          o(
            "Известный магазин с оплатой на сайте и чеком",
            "Сайтта төлем және чегі бар танымал дүкен",
            "A known shop that pays on site and gives a receipt",
            true,
            "Да! Чек и официальная оплата позволяют вернуть деньги, если что-то не так.",
            "Иә! Чек пен ресми төлем ақшаны қайтаруға мүмкіндік береді.",
            "Yes! A receipt and official payment let you get money back if something goes wrong.",
            true,
          ),
          o(
            "Тот, где просят перевод на личную карту",
            "Жеке картаға аударым сұрайтыны",
            "The one asking for a transfer to a personal card",
            false,
            "Это главный признак подделки: нет чека — нет защиты.",
            "Бұл жалғандықтың басты белгісі: чек жоқ — қорғау жоқ.",
            "That's the top sign of a fake: no receipt means no protection.",
          ),
          o(
            "Тот, у которого ярче реклама",
            "Жарнамасы жарқыраған дүкен",
            "The one with the flashiest ads",
            false,
            "Реклама ничего не гарантирует, её может купить любой мошенник.",
            "Жарнама ештеңе кепілдемейді, оны кез келген алаяқ сатып ала алады.",
            "Ads guarantee nothing; any scammer can buy them.",
          ),
        ],
      },
    ],
    rule: t3(
      "Покупки в интернете — только вместе со взрослыми и без переводов незнакомцам.",
      "Интернеттен сатып алу — тек ересектермен және бейтаныстарға аударымсыз.",
      "Shop online only together with an adult and never transfer money to strangers.",
    ),
    badge: t3("Умный покупатель", "Ақылды сатып алушы", "Smart Shopper"),
  },
  {
    id: 4,
    slug: "social",
    emoji: "📱",
    track: "online",
    title: t3("Опасности в социальных сетях", "Әлеуметтік желідегі қауіп", "Dangers in social media"),
    story: t3(
      "Тимуру написала «девочка Аяна, 10 лет»: «Давай дружить! Скажи, в какой школе учишься и когда бываешь один дома?»",
      "Тимурға «Аяна, 10 жаста» деген жазды: «Дос болайық! Қай мектепте оқисың, үйде қашан жалғыз боласың?»",
      "“Ayana, 10 years old” messaged Timur: “Let's be friends! Which school do you go to and when are you home alone?”",
    ),
    dialogue: [
      {
        who: t3("Аяна", "Аяна", "Ayana"),
        text: t3(
          "И пришли фото своего двора, интересно посмотреть!",
          "Ауланың суретін де жібер, көргім келеді!",
          "Also send a photo of your yard, I'd love to see it!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "В интернете любой может назваться кем угодно. Адрес, школа и время дома — это личные данные.",
          "Интернетте кез келген адам басқа болып көріне алады. Мекенжай, мектеп, үйдегі уақыт — жеке дерек.",
          "Online anyone can pretend to be anyone. Your address, school and alone-time are private data.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что делать Тимуру?", "Тимур не істеуі керек?", "What should Timur do?"),
        options: [
          o(
            "Рассказать всё — она же ровесница",
            "Бәрін айту — ол құрдасы ғой",
            "Tell everything, she's the same age",
            false,
            "За аккаунтом может быть взрослый. Личные данные нельзя отдавать даже «ровесникам» из сети.",
            "Аккаунттың артында ересек тұруы мүмкін. Жеке деректі желідегі «құрдасқа» да беруге болмайды.",
            "An adult may be behind that account. Never give private data to online “peers”.",
          ),
          o(
            "Не отвечать, закрыть профиль и сказать родителям",
            "Жауап бермей, профильді жабу және ата-анаға айту",
            "Not answer, make the profile private, tell parents",
            true,
            "Супер! Закрытый профиль и разговор с родителями — лучшая защита от незнакомцев в сети.",
            "Керемет! Жабық профиль мен ата-анамен әңгіме — желідегі бейтаныстардан ең жақсы қорғаныс.",
            "Super! A private profile plus telling parents is the best shield from online strangers.",
            true,
          ),
          o(
            "Сказать неправду и продолжить общение",
            "Өтірік айтып, әңгімені жалғастыру",
            "Lie and keep chatting",
            false,
            "Общение продолжится, и однажды можно проговориться. Лучше прекратить разговор совсем.",
            "Әңгіме жалғасады да, бір күні шындықты айтып қоюың мүмкін. Мүлде тоқтатқан дұрыс.",
            "The chat continues and one day you may slip. Better to stop talking entirely.",
          ),
        ],
      },
      {
        question: t3(
          "Что нельзя публиковать в сети?",
          "Желіге нені жариялауға болмайды?",
          "What should never be posted online?",
        ),
        options: [
          o(
            "Адрес, школу, номер телефона, фото документов",
            "Мекенжай, мектеп, телефон нөмірі, құжат суреті",
            "Address, school, phone number, photos of documents",
            true,
            "Верно! Это личные данные — они помогают чужим людям тебя найти.",
            "Дұрыс! Бұл — жеке дерек, бөгде адамдар сені табуға пайдаланады.",
            "Correct! This is private data that helps strangers find you.",
            true,
          ),
          o(
            "Рисунок, который ты нарисовал",
            "Өзің салған сурет",
            "A drawing you made",
            false,
            "Рисунок публиковать можно. Опасны именно личные данные.",
            "Суретті жариялауға болады. Қауіпті — жеке деректер.",
            "A drawing is fine to share. Private data is what's risky.",
          ),
          o(
            "Поздравление другу с днём рождения",
            "Досыңды туған күнмен құттықтау",
            "A birthday greeting for a friend",
            false,
            "Это безопасно, если не указываешь адрес праздника.",
            "Мереке мекенжайын жазбасаң, бұл қауіпсіз.",
            "That's safe as long as you don't post the party address.",
          ),
        ],
      },
    ],
    rule: t3(
      "Личные данные — только для семьи. В сети их не публикуют и не отправляют.",
      "Жеке дерек — тек отбасына. Оны желіде жарияламайды және жібермейді.",
      "Private data is for family only — never post it or send it online.",
    ),
    badge: t3("Хранитель тайн", "Құпия сақшысы", "Secret Keeper"),
  },
  {
    id: 5,
    slug: "games",
    emoji: "🎮",
    track: "online",
    title: t3("Мошенничество в онлайн-играх", "Онлайн ойындағы алаяқтық", "Scams in online games"),
    story: t3(
      "В игре к Санжару подошёл игрок: «Дам легендарный скин бесплатно! Просто скинь логин и пароль, я зайду и подарю».",
      "Ойында Санжарға ойыншы келді: «Легендарлы скинді тегін беремін! Логин мен құпиясөзді жібер, кіріп сыйлаймын».",
      "In the game a player told Sanzhar: “Free legendary skin! Just send your login and password, I'll log in and gift it.”",
    ),
    dialogue: [
      {
        who: t3("Игрок", "Ойыншы", "Player"),
        text: t3(
          "Я так уже 100 людям подарил, честно!",
          "Мен 100 адамға сыйладым, шыным!",
          "I've done this for 100 people, honest!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Настоящие подарки в играх дарят внутри игры и никогда не требуют пароль.",
          "Ойындағы нағыз сыйлықтар ойын ішінде беріледі, құпиясөз ешқашан сұралмайды.",
          "Real in-game gifts are sent inside the game and never need your password.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Как ответить игроку?", "Ойыншыға не деу керек?", "How should he answer?"),
        options: [
          o(
            "Дать логин и пароль ради скина",
            "Скин үшін логин мен құпиясөз беру",
            "Give the login and password for the skin",
            false,
            "Аккаунт украдут вместе со всеми покупками, а скин не придёт.",
            "Аккаунт барлық сатып алулармен ұрланады, скин келмейді.",
            "The account gets stolen with all purchases and no skin arrives.",
          ),
          o(
            "Отказаться и пожаловаться на игрока",
            "Бас тартып, ойыншыға шағым жасау",
            "Refuse and report the player",
            true,
            "Отлично! Кнопка «пожаловаться» есть почти в каждой игре — так ты защищаешь и других детей.",
            "Тамаша! Кез келген ойында «шағым» түймесі бар — сен басқа балаларды да қорғайсың.",
            "Great! Almost every game has a report button — you protect other kids too.",
            true,
          ),
          o(
            "Дать только логин, пароль не давать",
            "Тек логинді беру, құпиясөзді бермеу",
            "Give only the login, not the password",
            false,
            "Даже логин помогает мошеннику подбирать пароль и писать тебе. Не давай ничего.",
            "Логиннің өзі алаяққа құпиясөз таңдауға көмектеседі. Ештеңе берме.",
            "Even a login helps a scammer guess your password. Give nothing.",
          ),
        ],
      },
      {
        question: t3(
          "Друг просит купить ему донат за деньги родителей. Что делать?",
          "Дос ата-ана ақшасына донат сатып алуды сұрайды. Не істейсің?",
          "A friend asks you to buy him game credit with your parents' money. What now?",
        ),
        options: [
          o(
            "Спросить разрешение у родителей",
            "Ата-анадан рұқсат сұрау",
            "Ask your parents first",
            true,
            "Правильно! Любые траты в играх — только с разрешения взрослых.",
            "Дұрыс! Ойындағы кез келген шығын — тек ересектің рұқсатымен.",
            "Right! Any spending in games happens only with adult permission.",
            true,
          ),
          o(
            "Купить тайком, потом расскажу",
            "Жасырын сатып алып, кейін айту",
            "Buy it secretly and tell them later",
            false,
            "Тайные траты — это обман и потеря доверия. Плюс так часто крадут деньги семьи.",
            "Жасырын шығын — алдау және сенімнен айырылу. Сол арқылы отбасы ақшасы жиі ұрланады.",
            "Secret spending breaks trust — and it's how family money often disappears.",
          ),
          o(
            "Дать другу карту родителей",
            "Досқа ата-ананың картасын беру",
            "Give your friend the parents' card",
            false,
            "Карта — не игрушка. Её нельзя давать никому, даже друзьям.",
            "Карта — ойыншық емес. Оны ешкімге, тіпті досқа да беруге болмайды.",
            "A bank card is not a toy. Never hand it to anyone, even friends.",
          ),
        ],
      },
    ],
    rule: t3(
      "Пароль от игры не знает никто, кроме тебя и родителей.",
      "Ойын құпиясөзін сенен және ата-анаңнан басқа ешкім білмеуі керек.",
      "Nobody knows your game password except you and your parents.",
    ),
    badge: t3("Честный геймер", "Адал геймер", "Fair Gamer"),
  },
  {
    id: 6,
    slug: "giveaways",
    emoji: "🎁",
    track: "online",
    title: t3("Фальшивые розыгрыши", "Жалған ұтыс ойындары", "Fake giveaways"),
    story: t3(
      "В видео блогер обещает: «Разыгрываю 10 телефонов! Чтобы получить, отправь 1000 тенге за доставку».",
      "Видеода блогер уәде етеді: «10 телефон ұтыс ойнатамын! Алу үшін жеткізуге 1000 теңге жібер».",
      "A video says: “I'm giving away 10 phones! To receive yours, send 1000 tenge for delivery.”",
    ),
    dialogue: [
      {
        who: t3("Блогер", "Блогер", "Blogger"),
        text: t3(
          "Ты уже в списке победителей, осталось оплатить!",
          "Сен жеңімпаздар тізіміндесің, төлеу ғана қалды!",
          "You're already on the winners list, just pay!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Запомни: за настоящий приз никогда не платят вперёд.",
          "Есіңде болсын: нағыз жүлде үшін алдын ала төлемейді.",
          "Remember: you never pay upfront for a real prize.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что это такое?", "Бұл не?", "What is this?"),
        options: [
          o(
            "Обычный розыгрыш, надо платить",
            "Кәдімгі ұтыс, төлеу керек",
            "A normal giveaway, you must pay",
            false,
            "Нет. Просьба «оплатить доставку приза» — классическая схема обмана.",
            "Жоқ. «Жүлде жеткізуін төле» деген — классикалық алдау сызбасы.",
            "No. “Pay for prize delivery” is a classic scam pattern.",
          ),
          o(
            "Обман: приза не существует",
            "Алдау: жүлде жоқ",
            "A scam: the prize doesn't exist",
            true,
            "Точно! Деньги заберут и исчезнут. Расскажи об этом взрослым и друзьям.",
            "Дәл солай! Ақшаны алып, жоғалып кетеді. Бұл туралы ересектерге және достарға айт.",
            "Exactly! They take the money and vanish. Tell adults and friends about it.",
            true,
          ),
          o(
            "Проверю, отправив маленькую сумму",
            "Аз ақша жіберіп тексеремін",
            "I'll test it with a small amount",
            false,
            "Даже маленькая сумма — победа мошенника, дальше попросят больше.",
            "Аз сома да — алаяқтың жеңісі, кейін көбірек сұрайды.",
            "Even a small amount is a win for them; next they'll ask for more.",
          ),
        ],
      },
      {
        question: t3(
          "Настоящий конкурс выглядит так:",
          "Нағыз байқау былай көрінеді:",
          "A real contest looks like this:",
        ),
        options: [
          o(
            "Правила открыты, оплата не нужна, есть организатор",
            "Ережелері ашық, төлем қажет емес, ұйымдастырушысы бар",
            "Open rules, no payment, a known organiser",
            true,
            "Да! Прозрачные правила и отсутствие оплаты — признак честного конкурса.",
            "Иә! Ашық ереже мен төлемнің болмауы — адал байқаудың белгісі.",
            "Yes! Clear rules and no payment mean an honest contest.",
            true,
          ),
          o(
            "Пишут в личку «ты победил» и торопят",
            "Жеке хатта «жеңдің» деп асықтырады",
            "A DM says “you won” and rushes you",
            false,
            "Личные сообщения о выигрыше почти всегда обман.",
            "Жеңіс туралы жеке хабарлама әрдайым дерлік алдау.",
            "Private “you won” messages are almost always fake.",
          ),
          o(
            "Просят данные карты для «перевода приза»",
            "«Жүлдені аудару үшін» карта дерегін сұрайды",
            "They ask for card details to “send the prize”",
            false,
            "Чтобы получить деньги, данные карты не нужны. Это кража.",
            "Ақша алу үшін карта дерегі керек емес. Бұл — ұрлық.",
            "You don't need card details to receive money. That's theft.",
          ),
        ],
      },
    ],
    rule: t3(
      "Настоящий приз не требует оплаты вперёд.",
      "Нағыз жүлде алдын ала төлем талап етпейді.",
      "A real prize never asks for money upfront.",
    ),
    badge: t3("Ловец обмана", "Алдауды аңдушы", "Trick Catcher"),
  },
  {
    id: 7,
    slug: "ai-scam",
    emoji: "🤖",
    track: "online",
    title: t3("AI-мошенничество", "AI-алаяқтық", "AI scams"),
    story: t3(
      "Мадине позвонили. Голос точно как у мамы: «Я потеряла карту, срочно продиктуй код из СМС!» Но номер незнакомый.",
      "Мәдинаға қоңырау шалды. Дауыс дәл анасыныкіндей: «Картамды жоғалттым, SMS кодын жедел айт!» Бірақ нөмір бөтен.",
      "Madina got a call. The voice sounded exactly like her mum: “I lost my card, read me the SMS code!” But the number was unknown.",
    ),
    dialogue: [
      {
        who: t3("Голос «мамы»", "«Ана» дауысы", "“Mum's” voice"),
        text: t3(
          "Быстрее, у меня мало времени!",
          "Тезірек, уақытым аз!",
          "Hurry, I have no time!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Сегодня искусственный интеллект умеет копировать голос и лицо. Проверяй звонком на настоящий номер.",
          "Бүгін жасанды интеллект дауыс пен бет-әлпетті көшіре алады. Нағыз нөмірге қоңырау шалып тексер.",
          "AI today can copy a voice and a face. Always check by calling the real number back.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что сделает Мадина?", "Мәдина не істейді?", "What should Madina do?"),
        options: [
          o(
            "Продиктует код — голос ведь мамин",
            "Кодты айтады — дауыс анасыныкі ғой",
            "Read out the code, it's mum's voice",
            false,
            "Голос можно подделать нейросетью за минуту. Код называть нельзя никогда.",
            "Дауысты нейрожелі бір минутта жасай алады. Кодты ешқашан айтуға болмайды.",
            "AI can fake a voice in a minute. Never read a code aloud.",
          ),
          o(
            "Положит трубку и перезвонит маме сама",
            "Тұтқаны қойып, анасына өзі қоңырау шалады",
            "Hang up and call mum back herself",
            true,
            "Идеально! Обратный звонок на сохранённый номер разоблачает подделку за секунды.",
            "Тамаша! Сақталған нөмірге қайта қоңырау жалғанды бірден әшкерелейді.",
            "Perfect! Calling back the saved number exposes the fake instantly.",
            true,
          ),
          o(
            "Отправит код в сообщении, а не голосом",
            "Кодты дауыспен емес, хабарламамен жібереді",
            "Send the code as a text instead",
            false,
            "Способ отправки не важен — важно, что код попадёт мошеннику.",
            "Жіберу тәсілі маңызды емес — код алаяққа түседі.",
            "The channel doesn't matter — the code still reaches the scammer.",
          ),
        ],
      },
      {
        question: t3(
          "Как проверить подозрительное фото или видео?",
          "Күмәнді фото мен видеоны қалай тексеруге болады?",
          "How can you check a suspicious photo or video?",
        ),
        options: [
          o(
            "Показать взрослому и проверить источник",
            "Ересекке көрсетіп, дереккөзін тексеру",
            "Show an adult and check the source",
            true,
            "Верно! Взрослый поможет найти первоисточник, а AI-подделки часто выдают странные руки, уши и голос без пауз.",
            "Дұрыс! Ересек түпнұсқаны табуға көмектеседі, ал AI-жалғанды оғаш қол, құлақ пен үзіліссіз дауыс әшкерелейді.",
            "Right! An adult helps find the original, and AI fakes often show odd hands, ears and pause-free speech.",
            true,
          ),
          o(
            "Поверить, если картинка чёткая",
            "Сурет анық болса, сену",
            "Believe it if the picture is sharp",
            false,
            "Чёткость не доказывает правду: нейросети делают очень качественные подделки.",
            "Анықтық шындықты дәлелдемейді: нейрожелілер сапалы жалған жасайды.",
            "Sharpness proves nothing: AI makes very high-quality fakes.",
          ),
          o(
            "Переслать всем, пусть решают",
            "Барлығына жіберіп, өздері шешсін",
            "Forward it to everyone and let them decide",
            false,
            "Так распространяется фейк. Сначала проверь, потом делись.",
            "Осылай фейк тарайды. Алдымен тексер, содан кейін бөліс.",
            "That's how fakes spread. Verify first, share later.",
          ),
        ],
      },
    ],
    rule: t3(
      "Голос и фото можно подделать. Всегда перезванивай родным на знакомый номер.",
      "Дауыс пен фотоны жасауға болады. Туысқа әрдайым таныс нөмірге қайта қоңырау шал.",
      "Voices and photos can be faked — always call your family back on a number you know.",
    ),
    badge: t3("Эксперт по дипфейкам", "Дипфейк сарапшысы", "Deepfake Expert"),
  },
  {
    id: 8,
    slug: "stranger-help",
    emoji: "🚗",
    track: "real",
    title: t3("Незнакомец предлагает помощь", "Бейтаныс көмек ұсынады", "A stranger offers help"),
    story: t3(
      "Арман вышел из школы. К нему подошёл мужчина: «Я друг твоей мамы. Она попросила забрать тебя, садись в машину».",
      "Арман мектептен шықты. Бір ер адам келді: «Мен анаңның досымын. Ол сені алып кетуімді өтінді, көлікке отыр».",
      "Arman left school. A man came up: “I'm a friend of your mum. She asked me to pick you up, get in the car.”",
    ),
    dialogue: [
      {
        who: t3("Мужчина", "Ер адам", "The man"),
        text: t3(
          "Я знаю, что тебя зовут Арман, значит, мне можно верить!",
          "Атыңның Арман екенін білемін, сондықтан маған сенуге болады!",
          "I know your name is Arman, so you can trust me!",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Имя можно узнать из рюкзака или соцсетей. Это не доказательство!",
          "Атыңды рюкзактан не әлеуметтік желіден білуге болады. Бұл дәлел емес!",
          "A name can be read off a backpack or social media. That proves nothing!",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что сделает Арман?", "Арман не істейді?", "What should Arman do?"),
        options: [
          o(
            "Сядет в машину — мужчина знает его имя",
            "Көлікке отырады — ер адам атын біледі",
            "Get in the car, the man knows his name",
            false,
            "Очень опасно! Никогда не садись в машину к незнакомцу, даже если он знает твоё имя и имя мамы.",
            "Өте қауіпті! Бейтаныстың көлігіне ешқашан отырма, атыңды білсе де.",
            "Very dangerous! Never get into a stranger's car, even if he knows your name.",
          ),
          o(
            "Отойдёт к охраннику школы и позвонит маме",
            "Мектеп күзетшісіне барып, анасына қоңырау шалады",
            "Step back to the school guard and call mum",
            true,
            "Отлично! Отойти к взрослому в форме и позвонить родителям — самый безопасный план.",
            "Тамаша! Формадағы ересекке барып, ата-анаға қоңырау шалу — ең қауіпсіз жоспар.",
            "Excellent! Going to a uniformed adult and calling parents is the safest plan.",
            true,
          ),
          o(
            "Пойдёт пешком с ним, но не сядет в машину",
            "Онымен жаяу барады, бірақ көлікке отырмайды",
            "Walk with him but not get in the car",
            false,
            "Всё равно опасно: нельзя уходить с незнакомцем ни пешком, ни в машине.",
            "Бәрібір қауіпті: бейтаныспен жаяу да, көлікпен де кетуге болмайды.",
            "Still dangerous: never go anywhere with a stranger, on foot or by car.",
          ),
        ],
      },
      {
        question: t3(
          "Если незнакомец идёт следом — что делать?",
          "Бейтаныс соңыңнан ерсе — не істейсің?",
          "If a stranger follows you, what do you do?",
        ),
        options: [
          o(
            "Идти в людное место и громко звать на помощь",
            "Адам көп жерге барып, қатты айқайлап көмек сұрау",
            "Head to a crowded place and shout for help",
            true,
            "Да! Люди, магазины, охрана — твои союзники. Кричи: «Я его не знаю!»",
            "Иә! Адамдар, дүкендер, күзет — сенің одақтасың. «Мен оны танымаймын!» деп айқайла.",
            "Yes! People, shops and guards are your allies. Shout: “I don't know him!”",
            true,
          ),
          o(
            "Спрятаться в тихом дворе",
            "Тыныш ауладан тығылу",
            "Hide in a quiet yard",
            false,
            "В пустом месте помочь некому. Безопасность там, где много людей.",
            "Бос жерде көмектесетін ешкім жоқ. Қауіпсіздік — адам көп жерде.",
            "In an empty place nobody can help. Safety is where people are.",
          ),
          o(
            "Побежать домой коротким путём через пустырь",
            "Бос алаң арқылы үйге қысқа жолмен жүгіру",
            "Run home the short way across empty land",
            false,
            "Короткий путь через пустырь опасен. Выбирай светлые людные улицы.",
            "Бос алаң арқылы қысқа жол қауіпті. Жарық, адам көп көшені таңда.",
            "Shortcuts through empty areas are risky. Choose bright, busy streets.",
          ),
        ],
      },
    ],
    rule: t3(
      "Никогда не уходи с незнакомым человеком, даже если он говорит, что знает твоих родителей.",
      "Ата-анаңды танимын десе де, бейтаныс адаммен ешқашан кетпе.",
      "Never go with a stranger, even if they say they know your parents.",
    ),
    badge: t3("Смелое сердце", "Батыл жүрек", "Brave Heart"),
  },
  {
    id: 9,
    slug: "stranger-gift",
    emoji: "🍬",
    track: "real",
    title: t3("Незнакомец предлагает подарок", "Бейтаныс сыйлық ұсынады", "A stranger offers a gift"),
    story: t3(
      "Во дворе к Асель подошла женщина: «Какая ты милая! У меня для тебя щенок и конфеты, пойдём, покажу — тут рядом».",
      "Ауладa Әселге бір әйел келді: «Қандай сүйкімдісің! Саған күшік пен кәмпит бар, жүр, көрсетемін — осы жақта».",
      "In the yard a woman told Asel: “You're so sweet! I have a puppy and sweets for you, come, it's just nearby.”",
    ),
    dialogue: [
      {
        who: t3("Женщина", "Әйел", "The woman"),
        text: t3(
          "Это займёт всего минутку, мама даже не заметит.",
          "Бір-ақ минут кетеді, анаң байқамайды да.",
          "It'll take one minute, your mum won't even notice.",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Взрослому, которому нужна помощь, помогает другой взрослый — не ребёнок.",
          "Көмек керек ересекке басқа ересек көмектеседі — бала емес.",
          "An adult who needs help asks another adult — never a child.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Как поступит Асель?", "Әсел не істейді?", "What should Asel do?"),
        options: [
          o(
            "Пойдёт посмотреть щенка — это же быстро",
            "Күшікті көруге барады — тез ғой",
            "Go see the puppy, it's quick",
            false,
            "Щенки, котята и конфеты — самая частая приманка. Уходить нельзя ни на минуту.",
            "Күшік, мысық, кәмпит — ең жиі қолданылатын жем. Бір минутқа да кетуге болмайды.",
            "Puppies, kittens and sweets are the most common bait. Don't go, not even for a minute.",
          ),
          o(
            "Скажет «нет» и вернётся к взрослым",
            "«Жоқ» деп, ересектерге қайтады",
            "Say “no” and go back to adults",
            true,
            "Молодец! Ты имеешь право отказать любому взрослому, если тебе некомфортно.",
            "Жарайсың! Өзіңді ыңғайсыз сезінсең, кез келген ересекке бас тартуға хақың бар.",
            "Well done! You have the right to say no to any adult when you feel uneasy.",
            true,
          ),
          o(
            "Возьмёт конфеты, но не пойдёт",
            "Кәмпитті алады, бірақ бармайды",
            "Take the sweets but not go",
            false,
            "Подарок — начало разговора и доверия. Ничего не бери у незнакомцев.",
            "Сыйлық — әңгіме мен сенімнің басы. Бейтаныстан ештеңе алма.",
            "A gift starts a bond of trust. Take nothing from strangers.",
          ),
        ],
      },
      {
        question: t3(
          "Незнакомец просит помочь найти собаку. Что делать?",
          "Бейтаныс итін іздеуге көмектесуді сұрайды. Не істейсің?",
          "A stranger asks you to help find a dog. What do you do?",
        ),
        options: [
          o(
            "Отказаться и позвать своего взрослого",
            "Бас тартып, өз ересегіңді шақыру",
            "Refuse and call your own adult",
            true,
            "Правильно! Пусть поможет взрослый — ты остаёшься в безопасности.",
            "Дұрыс! Ересек көмектессін — сен қауіпсіз қаласың.",
            "Correct! Let an adult help — you stay safe.",
            true,
          ),
          o(
            "Помочь, ведь собачку жалко",
            "Көмектесу, ит аяулы ғой",
            "Help, the poor dog",
            false,
            "Именно на жалость и рассчитывает обманщик. Помощь взрослому — не твоя задача.",
            "Алдамшы дәл аяушылыққа сенеді. Ересекке көмектесу — сенің міндетің емес.",
            "That pity is exactly what a trickster counts on. Helping adults isn't your job.",
          ),
          o(
            "Пойти, но взять с собой друга",
            "Досыңды ертіп бару",
            "Go, but take a friend along",
            false,
            "Вдвоём тоже опасно. Дети не уходят с незнакомцами ни по одному, ни группой.",
            "Екеу де қауіпті. Балалар бейтаныспен жалғыз да, топпен де кетпейді.",
            "Two kids are still at risk. Children never go off with strangers, alone or in a group.",
          ),
        ],
      },
    ],
    rule: t3(
      "Не бери подарки у незнакомцев и никуда с ними не иди.",
      "Бейтаныстан сыйлық алма және олармен еш жаққа барма.",
      "Never take gifts from strangers and never go anywhere with them.",
    ),
    badge: t3("Твёрдое «нет»", "Мықты «жоқ»", "Strong No"),
  },
  {
    id: 10,
    slug: "secret",
    emoji: "🤫",
    track: "real",
    title: t3("Незнакомец просит сохранить секрет", "Бейтаныс құпия сақтауды сұрайды", "A stranger asks to keep a secret"),
    story: t3(
      "Знакомый взрослый сказал Ерлану: «Давай это будет наш секрет. Родителям говорить не нужно, они рассердятся».",
      "Таныс ересек Ерланға айтты: «Бұл біздің құпиямыз болсын. Ата-анаңа айтпа, олар ашуланады».",
      "An adult Yerlan knows said: “Let this be our secret. Don't tell your parents, they'll be angry.”",
    ),
    dialogue: [
      {
        who: t3("Взрослый", "Ересек", "The adult"),
        text: t3(
          "Ты же большой, умеешь хранить секреты?",
          "Сен үлкенсің ғой, құпия сақтай аласың ба?",
          "You're big now, you can keep a secret, right?",
        ),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Бывают весёлые секреты — подарок на день рождения. А секреты, от которых тревожно, нужно рассказывать сразу.",
          "Көңілді құпия болады — туған күнге сыйлық. Ал мазасыз ететін құпияны бірден айту керек.",
          "Some secrets are happy, like a birthday gift. Secrets that make you uneasy must be told right away.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что делать Ерлану?", "Ерлан не істеуі керек?", "What should Yerlan do?"),
        options: [
          o(
            "Сохранить секрет, чтобы никто не ругался",
            "Ешкім ұрыспас үшін құпияны сақтау",
            "Keep the secret so nobody gets angry",
            false,
            "Опасно. «Не говори родителям» — сигнал тревоги. Родители не будут ругать за правду.",
            "Қауіпті. «Ата-анаңа айтпа» — дабыл белгісі. Ата-ана шындық үшін ұрыспайды.",
            "Risky. “Don't tell your parents” is an alarm. Parents won't punish you for the truth.",
          ),
          o(
            "Рассказать родителям в тот же день",
            "Сол күні ата-анасына айту",
            "Tell his parents the same day",
            true,
            "Верно! Ты никогда не виноват, что рассказал. Взрослый, который просит молчать, поступает неправильно.",
            "Дұрыс! Айтқаның үшін сен ешқашан кінәлі емессің. Үндеме деген ересек қате істеп тұр.",
            "Right! Telling is never your fault. The adult asking for silence is the one doing wrong.",
            true,
          ),
          o(
            "Рассказать только другу",
            "Тек досқа айту",
            "Tell only a friend",
            false,
            "Друг не сможет защитить. Нужен взрослый из твоего круга доверия.",
            "Дос қорғай алмайды. Сенім шеңберіндегі ересек қажет.",
            "A friend can't protect you. You need a trusted adult.",
          ),
        ],
      },
      {
        question: t3(
          "Какой секрет — плохой?",
          "Қандай құпия жаман?",
          "Which secret is a bad one?",
        ),
        options: [
          o(
            "Тот, из-за которого страшно или стыдно",
            "Қорқыныш пен ұят тудыратыны",
            "One that makes you scared or ashamed",
            true,
            "Точно! Тревога в животе — знак, что нужно рассказать взрослому.",
            "Дәл солай! Іштегі мазасыздық — ересекке айту керектігінің белгісі.",
            "Exactly! That uneasy feeling means it's time to tell an adult.",
            true,
          ),
          o(
            "Секрет про подарок бабушке",
            "Әжеге сыйлық туралы құпия",
            "A secret about grandma's gift",
            false,
            "Это добрый секрет-сюрприз, он никому не вредит.",
            "Бұл — жақсы сюрприз-құпия, ешкімге зиян тигізбейді.",
            "That's a happy surprise secret and harms nobody.",
          ),
          o(
            "Секрет про сюрприз для класса",
            "Сынып үшін сюрприз құпиясы",
            "A secret about a class surprise",
            false,
            "Тоже безопасный секрет: о нём знают и взрослые в школе.",
            "Бұл да қауіпсіз құпия: мектептегі ересектер біледі.",
            "Also safe: teachers know about it too.",
          ),
        ],
      },
    ],
    rule: t3(
      "Никаких секретов от родителей, если из-за них тебе тревожно.",
      "Мазасыз ететін құпияны ата-анадан жасырма.",
      "No secrets from parents when a secret makes you uneasy.",
    ),
    badge: t3("Голос правды", "Шындық дауысы", "Voice of Truth"),
  },
  {
    id: 11,
    slug: "trusted-adults",
    emoji: "🤝",
    track: "real",
    title: t3("К каким взрослым можно обращаться", "Қай ересектерге жүгінуге болады", "Which adults you can turn to"),
    story: t3(
      "Камиле стало страшно в торговом центре: она не видит маму. Вокруг много взрослых — к кому подойти?",
      "Камила сауда орталығында қорықты: анасын көрмейді. Айналада ересек көп — кімге барады?",
      "Kamila got scared in the mall: she can't see her mum. Many adults around — whom should she approach?",
    ),
    dialogue: [
      {
        who: t3("Камила", "Камила", "Kamila"),
        text: t3("Мне страшно, я не знаю никого вокруг…", "Қорқып тұрмын, ешкімді танымаймын…", "I'm scared, I don't know anyone here…"),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Ищи взрослого в форме, продавца за кассой или маму с детьми. Это «безопасные взрослые».",
          "Формадағы ересекті, кассадағы сатушыны немесе балалыananы тап. Бұлар — «қауіпсіз ересектер».",
          "Look for a uniformed adult, a cashier, or a parent with children. Those are “safe adults”.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("К кому подойти?", "Кімге бару керек?", "Whom should she approach?"),
        options: [
          o(
            "К охраннику или продавцу за кассой",
            "Күзетшіге немесе кассадағы сатушыға",
            "The security guard or the cashier",
            true,
            "Верно! Они на рабочем месте, их легко найти, и они обучены помогать.",
            "Дұрыс! Олар жұмыс орнында, оңай табылады және көмектесуге үйретілген.",
            "Right! They stay at their post, are easy to find and are trained to help.",
            true,
          ),
          o(
            "К любому, кто первым предложит помощь",
            "Бірінші көмек ұсынған кез келгенге",
            "Anyone who offers help first",
            false,
            "Выбирай сама, а не тот, кто подошёл первым. Инициатива должна быть твоей.",
            "Өзің таңда, бірінші келгенді емес. Бастама сенікі болсын.",
            "Choose yourself instead of whoever approaches first. The initiative should be yours.",
          ),
          o(
            "Ни к кому, ждать молча",
            "Ешкімге бармай, үнсіз күту",
            "Nobody, just wait silently",
            false,
            "Ждать молча долго и страшно. Быстрее и безопаснее попросить помощь.",
            "Үнсіз күту ұзақ әрі қорқынышты. Көмек сұраған тез әрі қауіпсіз.",
            "Waiting silently takes long and feels scary. Asking for help is faster and safer.",
          ),
        ],
      },
      {
        question: t3(
          "Круг доверия — это…",
          "Сенім шеңбері — бұл…",
          "Your circle of trust is…",
        ),
        options: [
          o(
            "3–5 взрослых, которых знает твоя семья",
            "Отбасың білетін 3–5 ересек",
            "3–5 adults your family knows",
            true,
            "Да! Родители, бабушка, учитель, тренер. Их номера стоит выучить наизусть.",
            "Иә! Ата-ана, әже, мұғалім, жаттықтырушы. Нөмірлерін жаттап алған дұрыс.",
            "Yes! Parents, grandma, teacher, coach. Learn their numbers by heart.",
            true,
          ),
          o(
            "Все взрослые подряд",
            "Барлық ересектер",
            "All adults everywhere",
            false,
            "Не все взрослые безопасны. Круг доверия небольшой и известен семье.",
            "Барлық ересек қауіпсіз емес. Сенім шеңбері шағын әрі отбасыға таныс.",
            "Not every adult is safe. The circle is small and known to your family.",
          ),
          o(
            "Друзья из интернета",
            "Интернеттегі достар",
            "Friends from the internet",
            false,
            "Онлайн-знакомые не входят в круг доверия: ты не знаешь, кто они на самом деле.",
            "Онлайн таныстар сенім шеңберіне кірмейді: олардың кім екенін білмейсің.",
            "Online contacts aren't in the circle: you don't know who they really are.",
          ),
        ],
      },
    ],
    rule: t3(
      "Помощь проси у взрослого в форме, продавца или мамы с ребёнком.",
      "Көмекті формадағы ересектен, сатушыдан немесе балалы анадан сұра.",
      "Ask for help from a uniformed adult, a shop worker or a parent with a child.",
    ),
    badge: t3("Круг доверия", "Сенім шеңбері", "Circle of Trust"),
  },
  {
    id: 12,
    slug: "lost",
    emoji: "🧭",
    track: "real",
    title: t3("Что делать, если потерялся", "Адасып қалсаң не істейсің", "What to do if you get lost"),
    story: t3(
      "На большом базаре Нурислам отвлёкся на игрушки и потерял папу из виду. Вокруг шумно и много людей.",
      "Үлкен базарда Нұрислам ойыншыққа алаңдап, әкесін көзден жоғалтты. Айнала шулы, адам көп.",
      "At a big bazaar Nurislam looked at toys and lost sight of his dad. It's noisy and crowded.",
    ),
    dialogue: [
      {
        who: t3("Нурислам", "Нұрислам", "Nurislam"),
        text: t3("Папы нигде нет! Что делать?", "Әкем еш жерде жоқ! Не істеймін?", "Dad is nowhere! What do I do?"),
      },
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Правило трёх шагов: стой на месте, зови взрослого в форме, называй имя родителя.",
          "Үш қадам ережесі: орныңда тұр, формадағы ересекті шақыр, ата-анаңның атын айт.",
          "Three steps: stay put, call a uniformed adult, say your parent's name.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Первый шаг Нурислама:", "Нұрисламның бірінші қадамы:", "Nurislam's first step:"),
        options: [
          o(
            "Бегать по базару и искать папу",
            "Базарды аралап әкесін іздеу",
            "Run around the bazaar looking for dad",
            false,
            "Так вы будете двигаться друг за другом и не встретитесь. Ещё легко выйти на дорогу.",
            "Сонда бір-біріңнің соңынан жүріп, кездеспейсіңдер. Жолға шығып кету қаупі де бар.",
            "You'd keep chasing each other and never meet — and you might step onto a road.",
          ),
          o(
            "Остановиться и остаться на видном месте",
            "Тоқтап, көрінетін жерде тұру",
            "Stop and stay in a visible spot",
            true,
            "Да! Родители возвращаются туда, где потеряли тебя. Стоять на месте — самый быстрый способ найтись.",
            "Иә! Ата-ана сені жоғалтқан жерге қайтады. Орында тұру — ең тез табысу жолы.",
            "Yes! Parents come back to where they lost you. Staying put reunites you fastest.",
            true,
          ),
          o(
            "Выйти на улицу и ждать там",
            "Көшеге шығып, сонда күту",
            "Go outside and wait there",
            false,
            "Уходить с места опасно: там больше машин и меньше охраны.",
            "Орыннан кету қауіпті: онда көлік көп, күзет аз.",
            "Leaving is risky: more traffic and fewer guards outside.",
          ),
        ],
      },
      {
        question: t3(
          "Что нужно знать наизусть?",
          "Нені жатқа білу керек?",
          "What should you know by heart?",
        ),
        options: [
          o(
            "Имя и фамилию родителя и его номер телефона",
            "Ата-ананың аты-жөні мен телефон нөмірі",
            "Your parent's full name and phone number",
            true,
            "Верно! С этими данными взрослый быстро позвонит и вызовет родителей.",
            "Дұрыс! Бұл деректермен ересек тез қоңырау шалып, ата-анаңды шақырады.",
            "Right! With that info an adult can call your parents at once.",
            true,
          ),
          o(
            "Название любимого мультфильма",
            "Сүйікті мультфильм атауы",
            "Your favourite cartoon",
            false,
            "Приятно, но не поможет найтись. Учи телефон родителей.",
            "Жақсы, бірақ табысуға көмектеспейді. Ата-ана телефонын жатта.",
            "Nice, but it won't help. Learn your parents' number.",
          ),
          o(
            "Пароль от планшета",
            "Планшет құпиясөзі",
            "Your tablet password",
            false,
            "Пароль наоборот никому не называют. Нужны имя и телефон родителя.",
            "Құпиясөзді керісінше ешкімге айтпайды. Ата-ананың аты мен телефоны керек.",
            "Passwords are never shared. You need your parent's name and number.",
          ),
        ],
      },
    ],
    rule: t3(
      "Потерялся — стой на месте и проси помощи у взрослого в форме.",
      "Адассаң — орныңда тұр және формадағы ересектен көмек сұра.",
      "If you're lost, stay where you are and ask a uniformed adult for help.",
    ),
    badge: t3("Компас", "Компас", "Compass"),
  },
  {
    id: 13,
    slug: "emergency",
    emoji: "🚨",
    track: "real",
    title: t3("Экстренные службы и номера", "Төтенше қызметтер мен нөмірлер", "Emergency services and numbers"),
    story: t3(
      "Дома Дана почувствовала запах дыма из кухни. Взрослых рядом нет. Нужно действовать правильно.",
      "Үйде Дана ас үйден түтін иісін сезді. Қасында ересек жоқ. Дұрыс әрекет ету керек.",
      "At home Dana smelled smoke from the kitchen. No adults nearby. She must act correctly.",
    ),
    dialogue: [
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Единый номер в Казахстане — 112. Пожарные — 101, полиция — 102, скорая — 103.",
          "Қазақстандағы бірыңғай нөмір — 112. Өрт сөндіру — 101, полиция — 102, жедел жәрдем — 103.",
          "The single emergency number in Kazakhstan is 112. Fire 101, police 102, ambulance 103.",
        ),
      },
      {
        who: t3("Диспетчер", "Диспетчер", "Dispatcher"),
        text: t3(
          "Назови имя, адрес и что случилось. Не клади трубку первым.",
          "Атыңды, мекенжайыңды және не болғанын айт. Тұтқаны бірінші қойма.",
          "Say your name, address and what happened. Don't hang up first.",
        ),
      },
    ],
    scenes: [
      {
        question: t3("Что делает Дана?", "Дана не істейді?", "What does Dana do?"),
        options: [
          o(
            "Выходит из квартиры и звонит 112",
            "Пәтерден шығып, 112-ге қоңырау шалады",
            "Leaves the flat and calls 112",
            true,
            "Правильно! Сначала выйти в безопасное место, потом звонить и назвать адрес.",
            "Дұрыс! Алдымен қауіпсіз жерге шығу, сосын қоңырау шалып, мекенжайды айту.",
            "Correct! First get to safety, then call and give the address.",
            true,
          ),
          o(
            "Прячется под кровать",
            "Кереует астына тығылады",
            "Hides under the bed",
            false,
            "Прятаться при дыме очень опасно: спасателям трудно тебя найти.",
            "Түтін кезінде тығылу өте қауіпті: құтқарушылар таба алмайды.",
            "Hiding in smoke is very dangerous: rescuers can't find you.",
          ),
          o(
            "Сама тушит водой",
            "Өзі сумен сөндіреді",
            "Tries to put it out with water",
            false,
            "Тушить огонь — работа взрослых и пожарных. Дети сразу уходят и зовут помощь.",
            "Өрт сөндіру — ересектер мен өрт сөндірушілердің ісі. Балалар бірден шығып, көмек шақырады.",
            "Fighting fire is a job for adults and firefighters. Kids leave and call for help.",
          ),
        ],
      },
      {
        question: t3(
          "Куда звонить, если человеку плохо?",
          "Адамға жағдай нашар болса, қайда қоңырау шаласың?",
          "Whom do you call if someone feels very ill?",
        ),
        options: [
          o("103 или 112", "103 немесе 112", "103 or 112", true,
            "Верно! 103 — скорая помощь, 112 работает для любой беды.",
            "Дұрыс! 103 — жедел жәрдем, 112 кез келген жағдайда жұмыс істейді.",
            "Right! 103 is the ambulance and 112 works for any emergency.", true),
          o("Другу в чат", "Досқа чатқа", "Message a friend", false,
            "Друг не привезёт врача. Сначала звони 103, потом сообщай взрослым.",
            "Дос дәрігер әкелмейді. Алдымен 103-ке қоңырау шал, сосын ересектерге хабарла.",
            "A friend can't bring a doctor. Call 103 first, then tell adults."),
          o("Никому, подождать", "Ешкімге, күте тұру", "Nobody, just wait", false,
            "Ждать нельзя: в экстренной ситуации важна каждая минута.",
            "Күтуге болмайды: төтенше жағдайда әр минут маңызды.",
            "Waiting is not an option: every minute counts in an emergency."),
        ],
      },
    ],
    rule: t3(
      "Запомни номера: 112 — единый, 101 — пожарные, 102 — полиция, 103 — скорая.",
      "Нөмірлерді жатта: 112 — бірыңғай, 101 — өрт, 102 — полиция, 103 — жедел жәрдем.",
      "Learn the numbers: 112 general, 101 fire, 102 police, 103 ambulance.",
    ),
    badge: t3("Спасатель", "Құтқарушы", "Rescuer"),
  },
  {
    id: 14,
    slug: "final",
    emoji: "🏆",
    track: "real",
    title: t3("Финальное испытание по безопасности", "Қауіпсіздік бойынша финалдық сынақ", "Final safety challenge"),
    story: t3(
      "Настоящий день героя: сообщение с призом, звонок «от мамы» и незнакомец у школы. Помоги пройти всё правильно!",
      "Нағыз батыр күні: жүлде туралы хабарлама, «анадан» қоңырау және мектеп жанындағы бейтаныс. Бәрін дұрыс өтуге көмектес!",
      "A real hero's day: a prize message, a call “from mum” and a stranger by the school. Get everything right!",
    ),
    dialogue: [
      {
        who: t3("Qorgau", "Qorgau", "Qorgau"),
        hero: true,
        text: t3(
          "Ты прошёл 13 уроков. Покажи всё, чему научился — и станешь Защитником!",
          "Сен 13 сабақтан өттің. Үйренгеніңді көрсет — Қорғаушы атанасың!",
          "You finished 13 lessons. Show what you learned and become a Protector!",
        ),
      },
    ],
    scenes: [
      {
        question: t3(
          "Сообщение: «Твой аккаунт заблокируют через 10 минут, введи пароль тут».",
          "Хабарлама: «Аккаунтың 10 минуттан кейін бұғатталады, құпиясөзді осында енгіз».",
          "Message: “Your account will be blocked in 10 minutes, enter your password here.”",
        ),
        options: [
          o("Ввести пароль", "Құпиясөзді енгізу", "Enter the password", false,
            "Это фишинг: угроза + срочность + пароль. Никогда не вводи пароль по ссылке.",
            "Бұл — фишинг: қорқыту + асығыстық + құпиясөз. Сілтеме арқылы құпиясөз енгізбе.",
            "That's phishing: threat + urgency + password. Never enter a password via a link."),
          o("Показать родителям и удалить", "Ата-анаға көрсетіп, өшіру", "Show parents and delete", true,
            "Отлично! Ты узнал фишинг и позвал взрослого — идеальная реакция.",
            "Тамаша! Фишингті танып, ересекті шақырдың — мінсіз әрекет.",
            "Excellent! You spotted phishing and involved an adult — perfect.", true),
          o("Спросить в чате у незнакомца", "Бейтаныстан чатта сұрау", "Ask the stranger in chat", false,
            "Разговор с мошенником только вредит. Выходи из чата.",
            "Алаяқпен әңгіме зиян ғана. Чаттан шық.",
            "Talking to a scammer only hurts. Leave the chat."),
        ],
      },
      {
        question: t3(
          "Звонок незнакомого номера голосом мамы: «Скажи код из СМС».",
          "Бейтаныс нөмірден ана дауысымен: «SMS кодын айт».",
          "A call from an unknown number in mum's voice: “Tell me the SMS code.”",
        ),
        options: [
          o("Перезвонить маме на её номер", "Анаға өз нөміріне қайта қоңырау шалу", "Call mum back on her own number", true,
            "Верно! Так ты проверяешь AI-подделку голоса за 10 секунд.",
            "Дұрыс! Осылай AI жасаған дауысты 10 секундта тексересің.",
            "Right! That checks an AI voice fake in ten seconds.", true),
          o("Назвать код", "Кодты айту", "Say the code", false,
            "Код — ключ от денег семьи, его нельзя называть даже «маме» по чужому номеру.",
            "Код — отбасы ақшасының кілті, бөтен нөмірдегі «анаға» да айтуға болмайды.",
            "The code is the family's money key — not even for “mum” on an unknown number."),
          o("Отправить код в СМС", "Кодты SMS-пен жіберу", "Send the code by SMS", false,
            "Тот же обман, другой способ. Код не передают никому.",
            "Сол алдау, басқа тәсіл. Кодты ешкімге бермейді.",
            "Same scam, different channel. Never pass a code to anyone."),
        ],
      },
      {
        question: t3(
          "У школы: «Мама попала в больницу, я отвезу тебя к ней».",
          "Мектеп жанында: «Анаң ауруханада, мен сені апарамын».",
          "By the school: “Your mum is in hospital, I'll drive you to her.”",
        ),
        options: [
          o("Сесть в машину", "Көлікке отыру", "Get in the car", false,
            "Страх — оружие обманщика. Никогда не садись в машину к незнакомцу.",
            "Қорқыныш — алдамшының қаруы. Бейтаныстың көлігіне отырма.",
            "Fear is the trickster's weapon. Never get into a stranger's car."),
          o("Идти к учителю и позвонить родителям", "Мұғалімге барып, ата-анаға қоңырау шалу", "Go to the teacher and call parents", true,
            "Идеально! Взрослый из круга доверия + звонок = ты в безопасности.",
            "Мінсіз! Сенім шеңберіндегі ересек + қоңырау = сен қауіпсізсің.",
            "Perfect! A trusted adult plus a phone call keeps you safe.", true),
          o("Попросить его позвонить папе", "Одан әкеме қоңырау шалуын сұрау", "Ask him to call your dad", false,
            "Он может позвонить сообщнику. Звони сам или через учителя.",
            "Ол сыбайласына қоңырау шалуы мүмкін. Өзің немесе мұғалім арқылы қоңырау шал.",
            "He might call an accomplice. Call yourself or through a teacher."),
        ],
      },
    ],
    rule: t3(
      "Стоп — подумай — спроси взрослого. Три шага, которые защищают всегда.",
      "Тоқта — ойлан — ересектен сұра. Әрқашан қорғайтын үш қадам.",
      "Stop — think — ask an adult. Three steps that always protect you.",
    ),
    badge: t3("Защитник Qorgau", "Qorgau Қорғаушысы", "Qorgau Protector"),
  },
];

export const getLesson = (id: number) => lessons.find((l) => l.id === id);
