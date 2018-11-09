# eslint-rules-playground

Fixed eslint-rules-playground

# How to extract eslint rules?

```
const airbnb = require('eslint-config-airbnb-base')
const merge = require('lodash/merge')

const all = {}
airbnb.extends.map((rules) => {
  const rule = require(rules)
  merge(all, rule)
})
console.log(JSON.stringify(all, null, 2))
```