import * as extend from 'extend'
import EasyLessOptions = require("./EasyLessOptions");

const SUPPORTED_PER_FILE_OPTS = {
    "main": true,
    "out": true,
    "sourceMap": true,
    "compress": true,
};

const ARRAY_OPTS = {
    "main": true,
};

export function parse(line: string, defaults: EasyLessOptions): EasyLessOptions
{
    // does line start with a comment?: //
    let commentMatch: RegExpExecArray = /^\s*\/\/\s*(.+)/.exec(line);
    if (!commentMatch)
    {
        return defaults;
    }

    let options: EasyLessOptions = extend({}, defaults);
    let optionLine: string = commentMatch[1];
    let seenKeys: Object = {};
    for (let item of optionLine.split(',')) // string[]
    {
        let i: number = item.indexOf(':');
        if (i < 0)
        {
            continue;
        }
        let key: string = item.substr(0, i).trim();
        if (!SUPPORTED_PER_FILE_OPTS.hasOwnProperty(key))
        {
            continue;
        }

        let value: string = item.substr(i + 1).trim();
        if (value.match(/^(true|false|undefined|null|[0-9]+)$/))
        {
            value = eval(value);
        }

        if (seenKeys[key] === true && ARRAY_OPTS[key])
        {
            let existingValue: any = options[key];
            if (!Array.isArray(existingValue))
            {
                existingValue = options[key] = [existingValue];
            }
            existingValue.push(value);
        }
        else
        {
            options[key] = value;
            seenKeys[key] = true;
        }
    }
    
    return options;
}