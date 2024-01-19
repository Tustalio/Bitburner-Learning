/** @param {NS} ns */
export async function main(ns) {
  const args = ns.flags([['help', false]]);
  const hostname = args._[0];
  while (true) {
    await ns.hack(hostname);
  }
}