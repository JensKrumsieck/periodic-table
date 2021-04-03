import axios from 'axios';
import { parse } from 'node-html-parser';
import * as fs from 'fs';

import { fields, regex } from './mappings';
import Element from './element';

import he from 'he';

const url = "https://en.wikipedia.org/wiki/Element_";

let head: string;
let body: string;

if (fs.existsSync("result/")) fs.rmdirSync("result/", { recursive: true });

fs.mkdir("result/", err => {
    if (err) throw err;
});

getData().then(s =>
    fs.writeFile("result/elements.json", JSON.stringify(s.sort(j => j.AtomicNumber), null, 4), err => {
        if (err) throw err;
    })
);

async function getData(): Promise<Element[]> {
    const obj: Element[] = []
    for (let i = 1; i <= 118; i++) {
        obj.push(await requestData(i));
    }
    return obj;
}

function decode(input: string | undefined): string {
    return he.decode(input).replace(/(<([^>]+)>)/gi, "").trim();
}

async function requestData(i: number): Promise<Element> {
    const data = await axios.get(url + i).then(res => res.data);
    const element = new Element();

    const root = parse(data);
    const infobox = root.querySelector("table.infobox");
    const caption = infobox.querySelector("caption");
    const captionParts = caption.rawText.split(",&#160;");

    element.Name = captionParts[0];
    element.Symbol = captionParts[1].replace(/\d*/, "")
    element.AtomicNumber = i;

    const tbody = infobox.querySelector("tbody");
    tbody.childNodes.forEach(s => {
        const tr = (s as any) as HTMLElement;
        if (tr.querySelector("th")?.hasAttribute("scope")) {

            const td = tr.querySelector("td");
            const th = tr.querySelector("th");
            head = decode(th?.innerHTML)
            body = decode(td?.innerHTML);

            if (head.includes("atomic weight") || head.includes("Mass number")) head = "AtomicWeight";
            if (fields.has(head)) {
                head = fields.get(head) as string;
                body = body.match(regex.get(head) != null ? regex.get(head) as RegExp : /.+/g)?.values().next().value as string;

                (element as any)[head] = (isNaN(+body) ? body : Number.parseFloat(body));
            }
        }
    });
    return element;
}

