//import * as gangAuto from "gangAutomation.js";
//import * as stocks from "StockTrader5.js";
//import * as hacknets from "setup-hacknet.js";
var scanned = [];

var roots = [];

//scan every server recursively

function scanServer(server, ns) {

  scanned.push(server);

  let childs = ns.scan(server);

  for (let id in childs) {

    if (!scanned.includes(childs[id])) {

      scanServer(childs[id], ns);

    }

  }

}

export async function main(ns) {

  scanServer("home", ns);

  ns.enableLog("ALL");

  //check if you got root access on a server and nuke if not

  for (let id in scanned) {

    if (ns.hasRootAccess(scanned[id])) {

      roots.push(scanned[id]);

    } else {

      try {

        ns.brutessh(scanned[id]);

        ns.print("BruteSSH " + scanned[id]);

      } catch { }

      try {

        ns.ftpcrack(scanned[id]);

        ns.print("FTPCrack " + scanned[id]);

      } catch { }

      try {

        ns.httpworm(scanned[id]);

        ns.print("HTTPWorm " + scanned[id]);

      } catch { }

      try {

        ns.relaysmtp(scanned[id]);

        ns.print("RelaySMTP " + scanned[id]);

      } catch { }

      try {

        ns.sqlinject(scanned[id]);

        ns.print("SQLInject " + scanned[id]);

      } catch { }

      try {

        ns.nuke(scanned[id]);

        ns.print("Nuked " + scanned[id]);

        roots.push(scanned[id]);
        //} catch { }

        //try {

        //ns.installBackdoor();

      } catch { continue; }

    }

  }

  var m = {

    id: "null",

    cash: 0,

    cc: 0,

    level: 0

  };

  //get server with the maximum earnings

  for (let id in roots) {

    ns.killall(roots[id], true);

    if (roots[id] != "home") {

      if (ns.getServerMoneyAvailable(roots[id]) > m['cc'] && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(roots[id])) {

        m = {

          id: roots[id],

          cash: ns.getServerMaxMoney(roots[id]),

          cc: ns.getServerMoneyAvailable(roots[id]),

          level: ns.getServerMinSecurityLevel(roots[id]) + 2

        }
        /*ns.print(m[id])
        ns.print("Max Money: " + m[cash])
        ns.print("Current Money: " + m[cc])
        ns.print("Min Security Level: " + m[level])*/
      }

    }

  }

  //try {
  ns.run("gangAutomation.js");
  // } catch { }
  //try {
  ns.run("StockTrader5.js");
  // } catch { }
  //try {
  //ns.exec("setup-hacknet.js");
  // } catch { }

  //run attack scripts (basic.js ^)

  let basicRam = ns.getScriptRam("basic.js");

  for (let id in roots) {

    ns.scp("basic.js", roots[id]);

    let threads = Math.floor((ns.getServerMaxRam(roots[id]) - ns.getServerUsedRam(roots[id])) / basicRam);

    if (threads > 0) {

      ns.exec("basic.js", roots[id], threads, m['id'], m['level'], m['cash']);

    }

  }

  //await ns.sleep(100000); this is for debugging

} 