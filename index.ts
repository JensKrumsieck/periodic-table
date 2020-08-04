import axios, { AxiosResponse } from 'axios';
import { parse } from 'node-html-parser';
const he = require('he');

let url = "https://en.wikipedia.org/wiki/Element_";

axios.get(url + 1).then(function (response: AxiosResponse<string>) {
    const root = parse(response.data);
    var infobox = root.querySelector("table.infobox");
    var tbody = infobox.querySelector("tbody");
    tbody.childNodes.forEach(s => {
        var tr = (s as any) as HTMLElement;
        if(tr.querySelector("th")?.hasAttribute("scope")){
            var td = tr.querySelector("td");
            var th = tr.querySelector("th");        
            var head = th?.innerHTML.replace(/(<([^>]+)>)/gi, "");
            var body = td?.innerHTML.replace(/(<([^>]+)>)/gi, "");
            console.log(he.decode(head) + ": " + he.decode(body));
        }
    });
});
