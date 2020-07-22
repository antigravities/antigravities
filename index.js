#!/usr/bin/env node

function pick(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function place(orig, plc, wth){
    console.log()
	return orig.replace(new RegExp("\\{\\{ " + plc.replace(/\./g, "\\.").replace(/\[/g, "\\[").replace(/\]/g, "\\]") + " \\}\\}", "g"), wth);
}

(async () => {
	const fs = require("fs");

	let tmpl = fs.readFileSync("README.md.tmpl").toString();

	// Update Steam
	const fetch = require("node-fetch");

	let rp = (await (await fetch("https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=" + process.env.STEAM + "&steamid=" + process.env.STEAMID64)).json()).response.games
	
	let apps = [];
	while( apps.length < 3 ) apps.push(pick(rp));
	
	for( let i in apps ){
        if( ! apps[i].name || (await (await fetch("https://store.steampowered.com/app/" + apps[i].appid + "/")).text()).indexOf("You must login to see this content.") > -1 ){
            apps[i].appid = 753;
            apps[i].name = "???";
        }

        tmpl = place(tmpl, "apps[" + i + "].appid", apps[i].appid);
        tmpl = place(tmpl, "apps[" + i + "].name", apps[i].name);
    }

    fs.writeFileSync("README.md", tmpl);
})();