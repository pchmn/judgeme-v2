const writeFileSync = require('fs').writeFileSync;

function main() {
  writeFileSync('/tmp/serviceAccountKey.json', process.argv[2]);
}

main();
