type Row = {
  pattern: string
}

export const rawSeniorityTable: Dict<Row> = {
  "Aspiring": {pattern: "aspiring"},
  "Junior": {pattern: "junior, !jun, !jr"},
  "Junior-Middle": {pattern: "junior/=middle"},
  "Middle": {pattern: "middle, intermediate, !mid"},
  "Middle-Senior": {pattern: "middle/=senior, mid/=senior"},
  "Senior": {pattern: "senior, !sen, !sr"},
  "Principal": {pattern: "principal"},
}
