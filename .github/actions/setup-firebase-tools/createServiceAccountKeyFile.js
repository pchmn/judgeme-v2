const writeFileSync = require('fs').writeFileSync;

function main() {
  writeFileSync('/tmp/serviceAccountKey.json', process.env.ACCOUNT_KEY);
}

main();
