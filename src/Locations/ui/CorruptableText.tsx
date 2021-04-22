import React, { useEffect } from "react";
import { SpecialServerIps } from "../../Server/SpecialServerIps";
import { getServer } from "../../Server/ServerHelpers";

function replace(str: string, i: number, char: string): string {
    return str.substring(0, i) + char + str.substring(i + 1);
}

type IProps = {
    content: string
}

function randomize(char: string): string {

    function randFrom(str: string): string {
        return str[Math.floor(Math.random()*str.length)];
    }

    const classes = [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "1234567890",
        " _",
        "()[]{}<>",
    ];
    const other = `!@#$%^&*()_+|\\';"/.,?\`~`;
    for(const c of classes) {
        if (c.includes(char)) return randFrom(c);
    }

    return randFrom(other);
}

export function CorruptibleText(props: IProps) {
    const [content, setContent] = React.useState(props.content);

    const corruptText = () => {
        let counter = 5;
        const id = setInterval(() => {
            counter--;
            if (counter > 0)
                return;
            counter = Math.random() * 5;
            const index = Math.random() * content.length;
            const letter = content.charAt(index);
            setContent(replace(content, index, randomize(letter)));
            setTimeout(() => {
                setContent(content);
            }, 50);
        }, 100);
    
        return () => {
            clearInterval(id);
        };
    }

    useEffect(() => {
        const ip = SpecialServerIps.getIp(content);
        const server = getServer(ip);
        if(!server || !server.hasOwnProperty('backdoorInstalled')) return;
        corruptText();
    }, []);

    return <span>{content}</span>
}