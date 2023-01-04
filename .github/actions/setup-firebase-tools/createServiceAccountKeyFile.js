const writeFileSync = require('fs').writeFileSync;

function main() {
  console.log(process.env.ACCOUNT_KEY, JSON.parse(process.env.ACCOUNT_KEY))
  writeFileSync('/tmp/serviceAccountKey.json', process.env.ACCOUNT_KEY);
}

main();
