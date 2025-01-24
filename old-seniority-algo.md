// Что делать с мульти-сениорити
// Подход 0: пытаться понять сениорити роли
// Невыполнима без NLP и даже там невыполнима (см. примеры ambiguous bios)
//
// Подход I: назначать старшую сениорити
// senior frontend junior backend => Senior [Frontend Engineer, Backend Engineer]
// ПОИСК "Backend Engineer", "Senior+" -> False Positive
// ПОИСК "Frontend Engineer", "Senior+" -> True Positive
// ПОИСК "Frontend Engineer", "Junior-" -> True Negative
// ПОИСК "Backend Engineer", "Junior-" -> False Negative
// ПОИСК "Backend Engineer", "Junior-Senior" -> True Positive
// ПОИСК "Frontend Engineer", "Junior-Senior" -> True Positive
//
// Подход II: назначать младшую сениорити
// senior frontend junior backend => senior [frontend, backend]
// аналогично примеру выше, только FP и FN по-другому распределятся...
//
// Подход III: не назнавать сениорити
// FN по всем поискам с сениорити
//
// Подход IV: полагаться на выведенную сениорити
// Будут серьёзные ошибки. Основной характер: FP для новой специальности (завышенная сениорити)
//
// ---
//
// Если мы отказываемся от назначения Seniority это НЕ защитит от смены специальности
// Например, у человека был прокачанный профиль Backend
// Дальше он заменил титул на Frontend
// Мы отнесём его к Senior. Но он де-факто Junior
// Можем ли мы исправить это учитывая в ML только данные, РЕЛЕВАНТНЫЕ СПЕЦИАЛЬНОСТИ?
// Кол-во фолловеров останется, что отражает общий уровень и это нормально.
// Но мы парсим только малую часть звёзд и репозиториев чтобы учитывать релевантные.
// Похоже что ответ НЕТ. Нужно или отказываться от Seniority или педалировать что это не
// Seniority (конкретной или новой) специальности. Наша схема, увы работает только для определённых сценариев.
// И принципиально не работает для других, более редких, но реалистичных сценариев.

// import {A} from "lib/belt"
// import {SPECIALIZATION_TREE} from "./interpretSpecializations"
// import {Claims} from "./utils"
//
// // interpretSeniorityV1
// export function interpretSeniorityV1(groups: Claims[]): string | undefined {
//   // [
//   //   {seniorities: ["junior", "middle"], ...},
//   //   {seniorities: ["middle", "senior"], ...},
//   // ]
//   // => ["junior"]
//   //
//   // [] => undefined
//   return groups.find(claims => claims.seniorities.length).seniorities[0]
//   //////////////////////////////////////////////////////////////////////////////////////////////////
//   // Simplified logic that simply takes the first claimed seniority
//   //////////////////////////////////////////////////////////////////////////////////////////////////
// }
//
// // interpretSeniorityV2
// const SENIORITY_RELATED_ROLES = ["Student", ...Object.keys(SPECIALIZATION_TREE)]
//
// function interpretSeniorityV2(groups: Claims[]): [string | undefined, number] {
//   const seniorityClaims = groups.filter(claims => (
//     // (claims.seniorities.length > 0 && areSupportedClaims(claims)) || // or maybe `areSupportedClaims` is redundant in that place in code...
//     A.intersection(claims.roles, SENIORITY_RELATED_ROLES).length > 0
//   ))
//
//   let confusionScore = Math.max(0, (seniorityClaims.length - 1) * 0.5) // multiple seniority claims add to confusion
//   const seniorities = A.uniq(seniorityClaims.flatMap(claims => {
//     // TODO currently (mistakenly) takes into account "former student"s
//     confusionScore += Math.max(0, (claims.roles.length - 1) / 2)       // each role after the first adds to confusion
//     confusionScore += Math.max(0, (claims.seniorities.length - 1) / 2) // each seniority after the first adds to confusion
//     if (claims.roles.includes("Student")) {                            // student role adds extra confusion
//       confusionScore += 0.5
//     }
//
//     if (claims.roles.includes("Student")) {
//       return []
//     } else if (claims.seniorities.length) {
//       return claims.seniorities
//     } else if (claims.roles.includes("Software Architect")) {
//       return ["Principal"]
//     } else if (claims.roles.includes("Lead")) {
//       return ["Senior"]
//     } else {
//       return []
//     }
//   }))
//   if (confusionScore <= 1) {
//     return [getHighestSeniority(seniorities), confusionScore]
//   } else {
//     return [undefined, confusionScore]
//   }
// }
//
// function getHighestSeniority(seniorities: string[]): string | undefined {
//   if (seniorities.includes("Principal")) {
//     return "Principal"
//   } else if (seniorities.includes("Senior")) {
//     return "Senior"
//   } else if (seniorities.includes("Middle")) {
//     return "Middle"
//   } else if (seniorities.includes("Junior")) {
//     return "Junior"
//   } else {
//     return undefined
//   }
// }
//
// export const interpretSeniority = interpretSeniorityV2
//
// TODO "Chapter Leader"
