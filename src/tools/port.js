const MaxPort = 65535;
const MinPort = 20;
const argv = process.argv.reverse();

let port = 6200;

if (argv.length <= 3) {
  for (let i = 0; i < argv.length; i++) {
    const n = Number(argv[i]);
    if (n && n > MinPort && n < MaxPort) {
      port = n;
      break;
    }
  }
}

export default port;
