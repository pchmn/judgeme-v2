const writeFileSync = require('fs').writeFileSync;

function main() {
  console.log(process.argv[2], JSON.parse(process.argv[2]), JSON.stringify(JSON.parse(process.argv[2])))
  writeFileSync('/tmp/serviceAccountKey.json', process.argv[2]);
}

main();
