import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { T3 } from "@/data/lessons";

export type Lang = "ru" | "kk" | "en";

export const languages: { code: Lang; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const dict = {
  appName: { ru: "QorgAI Kids", kk: "QorgAI Kids", en: "QorgAI Kids" },
  tagline: {
    ru: "Учимся безопасности вместе с котёнком Qorgau",
    kk: "Qorgau мысығымен бірге қауіпсіздікті үйренеміз",
    en: "Learning safety with Qorgau the kitten",
  },
  home: { ru: "Главная", kk: "Басты бет", en: "Home" },
  lessons: { ru: "Уроки", kk: "Сабақтар", en: "Lessons" },
  parents: { ru: "Родителям", kk: "Ата-анаға", en: "Parents" },
  todayLesson: { ru: "Урок дня", kk: "Күн сабағы", en: "Today's lesson" },
  start: { ru: "Начать урок", kk: "Сабақты бастау", en: "Start lesson" },
  continue: { ru: "Продолжить", kk: "Жалғастыру", en: "Continue" },
  replay: { ru: "Повторить", kk: "Қайталау", en: "Replay" },
  stars: { ru: "Звёзды", kk: "Жұлдыздар", en: "Stars" },
  coins: { ru: "Монеты", kk: "Монеталар", en: "Coins" },
  streak: { ru: "Серия дней", kk: "Күндер сериясы", en: "Day streak" },
  safetyScore: { ru: "Индекс безопасности", kk: "Қауіпсіздік индексі", en: "Safety Score" },
  progress: { ru: "Прогресс", kk: "Прогресс", en: "Progress" },
  achievements: { ru: "Достижения", kk: "Жетістіктер", en: "Achievements" },
  nextLevel: { ru: "Следующий уровень", kk: "Келесі деңгей", en: "Next level" },
  level: { ru: "Уровень", kk: "Деңгей", en: "Level" },
  dailyQuest: { ru: "Ежедневное задание", kk: "Күнделікті тапсырма", en: "Daily quest" },
  questText: {
    ru: "Пройди один урок сегодня и получи +20 монет",
    kk: "Бүгін бір сабақтан өт және +20 монета ал",
    en: "Finish one lesson today and get +20 coins",
  },
  questDone: { ru: "Задание выполнено! 🎉", kk: "Тапсырма орындалды! 🎉", en: "Quest completed! 🎉" },
  online: { ru: "Онлайн-безопасность", kk: "Онлайн қауіпсіздік", en: "Online safety" },
  real: { ru: "Безопасность в жизни", kk: "Өмірдегі қауіпсіздік", en: "Real-life safety" },
  lesson: { ru: "Урок", kk: "Сабақ", en: "Lesson" },
  story: { ru: "История", kk: "Оқиға", en: "Story" },
  dialogue: { ru: "Диалог", kk: "Диалог", en: "Dialogue" },
  situation: { ru: "Ситуация", kk: "Жағдай", en: "Situation" },
  chooseAnswer: { ru: "Выбери ответ", kk: "Жауапты таңда", en: "Choose an answer" },
  next: { ru: "Дальше", kk: "Әрі қарай", en: "Next" },
  finish: { ru: "Завершить урок", kk: "Сабақты аяқтау", en: "Finish lesson" },
  ruleOfDay: { ru: "Правило безопасности дня", kk: "Күннің қауіпсіздік ережесі", en: "Safety rule of the day" },
  correct: { ru: "Отличный выбор!", kk: "Тамаша таңдау!", en: "Great choice!" },
  wrong: { ru: "Так делать опасно", kk: "Бұлай істеу қауіпті", en: "That's a risky move" },
  lessonDone: { ru: "Урок пройден!", kk: "Сабақ аяқталды!", en: "Lesson complete!" },
  tryAgain: { ru: "Попробовать ещё раз", kk: "Қайта көру", en: "Try again" },
  thinkAgain: { ru: "Ничего страшного! Подумай ещё раз 💚", kk: "Ештеңе етпейді! Тағы ойлан 💚", en: "No worries! Think again 💚" },
  earned: { ru: "Ты заработал", kk: "Сен таптың", en: "You earned" },
  newBadge: { ru: "Новый значок", kk: "Жаңа белгі", en: "New badge" },
  nextLesson: { ru: "Следующий урок", kk: "Келесі сабақ", en: "Next lesson" },
  toHome: { ru: "На главную", kk: "Басты бетке", en: "Go home" },
  allLessons: { ru: "Все уроки", kk: "Барлық сабақ", en: "All lessons" },
  locked: { ru: "Скоро откроется", kk: "Жақында ашылады", en: "Opens soon" },
  done: { ru: "Пройден", kk: "Өтілді", en: "Done" },
  parentTitle: { ru: "Кабинет родителя", kk: "Ата-ана кабинеті", en: "Parent dashboard" },
  lessonsDone: { ru: "Пройдено уроков", kk: "Өтілген сабақтар", en: "Lessons completed" },
  strengths: { ru: "Сильные стороны", kk: "Күшті жақтары", en: "Strengths" },
  weaknesses: { ru: "Слабые стороны", kk: "Әлсіз жақтары", en: "Needs work" },
  recommendations: { ru: "Рекомендации", kk: "Ұсыныстар", en: "Recommendations" },
  recommendText: {
    ru: "Повторите вместе эти темы и обсудите правило дня за ужином.",
    kk: "Осы тақырыптарды бірге қайталаңыз және күн ережесін кешкі ас кезінде талқылаңыз.",
    en: "Review these topics together and discuss the rule of the day at dinner.",
  },
  noWeak: {
    ru: "Слабых тем пока нет — отличная работа!",
    kk: "Әзірге әлсіз тақырып жоқ — керемет!",
    en: "No weak topics yet — great job!",
  },
  noStrong: {
    ru: "Пройдите первые уроки, чтобы увидеть сильные стороны.",
    kk: "Күшті жақтарын көру үшін алғашқы сабақтардан өтіңіз.",
    en: "Complete the first lessons to reveal strengths.",
  },
  accuracy: { ru: "Точность ответов", kk: "Жауап дәлдігі", en: "Answer accuracy" },
  reset: { ru: "Сбросить прогресс", kk: "Прогресті тастау", en: "Reset progress" },
  greeting: {
    ru: "Привет, герой! Я Qorgau. Сегодня научу тебя быть в безопасности!",
    kk: "Сәлем, батыр! Мен Qorgau. Бүгін сені қауіпсіз болуға үйретемін!",
    en: "Hi, hero! I'm Qorgau. Today I'll teach you how to stay safe!",
  },
  praise: {
    ru: "Ты молодец! Я горжусь тобой.",
    kk: "Жарайсың! Мен сені мақтан тұтамын.",
    en: "Awesome! I'm proud of you.",
  },
  of: { ru: "из", kk: "/", en: "of" },
} satisfies Record<string, T3>;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string; tr: (v: T3) => string };
const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("qorgai-lang") as Lang | null;
    if (saved && ["ru", "kk", "en"].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("qorgai-lang", l);
  };

  const value: Ctx = {
    lang,
    setLang,
    t: (k) => dict[k][lang],
    tr: (v) => v[lang],
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
