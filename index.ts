import axios, { AxiosResponse } from 'axios';
import { parse } from 'node-html-parser';
import * as fs from 'fs';

import { fields, regex } from './mappings';
import Element from './element';


const he = require('he');

let url = "https://en.wikipedia.org/wiki/Element_";

let head: string;
let body: string;
let obj: Element[] = [];

for (var i = 1; i <= 118; i++) {
    requestData(i).then(s => fs.appendFile("test.json", JSON.stringify(s), function(err) {
        if(err) throw err;
    }));
}

function decode(input: string | undefined): string {
    return he.decode(input).replace(/(<([^>]+)>)/gi, "").trim();
}

async function requestData(i: number): Promise<Element> {
    var data = await axios.get(url + i).then(res => res.data);
    var element = new Element();

    const root = parse(data);
    var infobox = root.querySelector("table.infobox");
    var caption = infobox.querySelector("caption");
    var captionParts = caption.rawText.split(",&#160;");

    element.Name = captionParts[0];
    element.Symbol = captionParts[1].replace(/\d*/, "")

    var tbody = infobox.querySelector("tbody");
    tbody.childNodes.forEach(s => {
        var tr = (s as any) as HTMLElement;
        if (tr.querySelector("th")?.hasAttribute("scope")) {
            var td = tr.querySelector("td");
            var th = tr.querySelector("th");
            head = decode(th?.innerHTML)
            body = decode(td?.innerHTML);
            if (head.includes("Standard atomic weight")) head = "Standard atomic weight";
            if (fields.has(head)) {
                head = fields.get(head) as string;
                body = regex.get(head)?.exec(body)?.toString() as string;
                (element as any)[head] = body;
            }
        }
    });
    return element;
}

