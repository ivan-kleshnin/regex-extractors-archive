export {}

// import {A} from "lib/belt"
// import {COMPANY as _COMPANY, ROLE} from "./data"
// import {normalizeStr} from "./normalize"
// import {companyCanonicalizer} from "./taxonomy"
// import {_AT, _HARD_SEP, _SOFT_SEP, LB, RB} from "./utils"
//
// // export const CLB = "(?<![./\\w])" // disallowed to match "www.facebook"-like, "//facebook"-like
// export const CRB = "(?![\\w])"    // allowed to match "facebook.com"-like
//
// const COMPANY = `(the |(?<=[- ]@?))` + _COMPANY + RB
// // ^ stricter version of LB, e.g. disallowing "foo@bar"

/*
 - Bla-Bla. Frontend Lead at Amazon, previously a Senior Frontend Engineer @Facebook. Bla-bla.
 - Currently @Amazon.
 - @Amazon.
 - Former Facebook intern.

 ALGORITHM (refer to ClaimExtractor)
 1. Look for companies (similar to how we look for roles)
 2. If there's more than one company – split by the next sep
 3. Otherwise: detect if it's Current or Previous with extra matches.

 EXAMPLES
 "coder at twitter, formerly a lead @facebook"
   1. Two companies found in the input
   2. <coder at twitter>, <formerly a lead @facebook>
   3. One company found in each part: the first is current, the second is previous

 "coder @twitter (ex-lead @jnj) doing something useful"
   1. Two companies found in the input
   2. <coder @twitter doing something useful>, <ex-lead @jnj>
   3. One company found in each part: the first is current, the second is previous

 NOTES
 - Can't use `TermExtractor` in its current version, have to customize @ handling.
*/
//
// const COMPANY_SEQ = `(${COMPANY}(${_SOFT_SEP} ?${COMPANY})*)`
// const CURRENT_COMPANY = `(${_AT}|current(ly)?:?) ?(${COMPANY_SEQ})|${ROLE}( ?, ?| of )(${COMPANY})${CRB}`
// // TODO (Level-2) is it possible to remove branching (to avoid term repetitions)?
//
// const PREVIOUSLY = `${LB}(worked|previously:?${RB}|formerly:?${RB}|former:?${RB}|ex[- ])` // |former:?${RB}|prev[.:]?${RB} -- need stricter input to avoid false positives, like required @ or smth...
// const NPS = `[^()]*`
// export const PREVIOUS_COMPANY = PREVIOUSLY + `((${NPS}?\\(${NPS}\\)${NPS}?)*|.+?)` + `(${_HARD_SEP}|(?=\\)))`
//
// function parseCompanies(str: string): string[] {
//   return Array.from(str.matchAll(new RegExp(COMPANY, "ig"))).flatMap(match => {
//     const company = companyCanonicalizer.canonicalize(match[0].replace(/^([- @]|the)/g, ""))
//     return company ? [company] : []
//   })
// }
//
// export function extractPreviousCompanies(str: string): string[] {
//   const regex = new RegExp(PREVIOUS_COMPANY, "ig")
//   return A.uniq(Array.from(normalizeStr(str).matchAll(regex)).flatMap(match => {
//     return parseCompanies(match[0])
//   }))
// }
//
// export function extractCurrentCompanies(str: string): string[] {
//   const regex = new RegExp(CURRENT_COMPANY, "ig")
//   return A.uniq(Array.from(normalizeStr(str).matchAll(regex)).flatMap(match => {
//     // console.log("match:", match[0])
//     return parseCompanies(match[0])
//   }))
// }
//
// export function extractCompanies(str: string): {currentCompanies: string[], previousCompanies: string[]} {
//   const currentCompanies = extractCurrentCompanies(str) // matches prev. companies as well
//   const previousCompanies = extractPreviousCompanies(str)
//   // Takes an unsafe assumption that very few people have bios like:
//   // "Currently a manager @Google. Previously a coder @Google"
//   // ^ assumingly they would deduplicate like "Currently a manager @Google. Formerly a coder".
//   //
//   // This limitation can be lifted in the future by `replace(PREV_COMPANIES, "")` locally
//   // in `extractCurrentCompanies` or differently. It's not the same as supported clean `output`.
//   return {
//     currentCompanies: A.difference(currentCompanies, previousCompanies),
//     previousCompanies,
//   }
// }
//
