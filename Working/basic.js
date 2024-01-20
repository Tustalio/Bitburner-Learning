export async function main(ns) {
	while(true) {
		await ns.hack(ns.args[0]);
    if(ns.getServerSecurityLevel(ns.args[0]) > ns.args[1]){
      await ns.weaken(ns.args[0]);
    }
    if(ns.getServerMoneyAvailable(ns.args[0]) <= ns.args[2]){
      await ns.grow(ns.args[0]);
    }
    else
    {
      await ns.hack(ns.args[0]);
    }
	}
}