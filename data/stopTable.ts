type Row = {
  pattern: string
}

export const rawStopTable: Dict<Row> = {
  // "Designer": {pattern: "designer, artist"},
  "Recruiter": {pattern: "recruiter, hiring"}, // False positives for `open to... hiring`
  // "Manager": {pattern: "manager"},          // False positives for `open to... hiring`
}

// Note: affects only user texts @_@
// TODO consider HR managers
// TODO consider to not drop STOPPED profiles, but save them (our potential customers!)
