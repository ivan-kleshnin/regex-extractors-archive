type Row = {
  pattern: string
}

export const rawCompanyTable: Dict<Row> = {
  "Adobe": {pattern: "adobe"},
  "Amazon": {pattern: "amazon"},
  "Apple": {pattern: "apple"},
  "Appsters": {pattern: "appsters"},
  "Biomedia": {pattern: "biomedia"},
  "Canadian Space Agency": {pattern: "asc=csa, csa=asc"},
  "Dataspark Analytics": {pattern: "datasparkanalytics"},
  "DeepMind": {pattern: "deepmind"},
  "Docusaurus": {pattern: "docusaurus"},
  "Grab": {pattern: "grab"},
  "Medieinstitutet": {pattern: "medieinstitutet"},
  "Meta": {pattern: "facebook, meta"}, // TODO do we need additionally disambiguate Meta
  "Gab": {pattern: "gab=ai, gab"},
  "GitHub": {pattern: "github"},
  "GitLab": {pattern: "gitlab"},
  "Google": {pattern: "google"},
  "Johnson & Johnson": {pattern: "johnson=&=johnson, johnson=and=johnson, j=&=j, jnj"},
  "LoyaltyOne": {pattern: "loyaltyone"},
  "Lyft": {pattern: "lyft"},
  "New York Times": {pattern: "nytimes"},
  "Northwestern University": {pattern: "northwestern university"},
  "Microsoft": {pattern: "micro=soft"},
  "Mintlify": {pattern: "mintlify"},
  "Ozon": {pattern: "ozon=ru, ozon"},
  "Pebble": {pattern: "pebble"},
  "Pinterest": {pattern: "pinterest"},
  "Salesforce": {pattern: "sales=force"}, // "salesforce.com" is captured as well
  "Square": {pattern: "square"},
  "Spotify": {pattern: "spotify"},
  "Stitchfix": {pattern: "stitchfix"},
  "Stripe": {pattern: "stripe"},
  "TC39": {pattern: "tc39"},
  "Todesktop": {pattern: "todesktop"},
  "Twitter": {pattern: "twitter"},
  "Twosigma": {pattern: "twosigma"},
  "University of Waterloo": {pattern: "university of waterloo"},
  "Yandex": {pattern: "yandex"},
  "Y Combinator": {pattern: "ycombinator"},
}

// TODO we don't yet differentiate between `education` and `prevCompanies`
// case-1: "PhD in Brain Graph Analysis and Machine Learning @BioMedIA"
// case-2: "former intern @appsters and student @Medieinstitutet"
// case-3: "4th year systems design engineering student at the University of Waterloo"
// case-4: "SWE @correlation-one , M.S. & B.A. in CS @ColumbiaUniversity, previously @Twitter @sassoftware"
// [student/phd/m.s/b.a] ... [at] [company] [hard_sep]
