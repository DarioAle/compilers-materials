/* 
        id      +       *       (       )       $
E     E->TE'                  E->TE'    
E'            E'->TE'                   E'->Ɛ    E'->Ɛ
T     T->FT'                  T->FT'
T'           T'->Ɛ  T'->*FT'            T'->Ɛ    T'->Ɛ
F     F->id                   F->(E)

*/

const predictiveTable = {
    E : {
        a :  ["Ep", "T"],
        opp : ["Ep", "T"]
    },

    Ep : {
        plus : ["Ep", "T", "+"], 
        clp :  ["epsilon"],
        term : ["epsilon"]
    },

    T : {
        a :   ["Tp", "F"],
        opp : ["Tp", "F"]
    },

    Tp : {
        plus :  ["epsilon"],
        times : ["Tp", "F", "*"],
        clp :   ["epsilon"],
        term :  ["epsilon"],
    },

    F : {
        a :   ["a"],
        opp : [")", "E", "("]
    }
}

function transformTerminal(terminal) {
    if(terminal == "+") 
        return "plus"
    if(terminal == "*")
        return "times"
    if(terminal == "(")
        return "opp"
    if(terminal == ")")
        return "clp"
    if(terminal == "$")
        return "term"
    
    return terminal
}

function tableLookup(variable, terminal) {
    // console.log("received variable: " + variable)
    // console.log("received terminal: " + terminal)

    terminal = transformTerminal(terminal);

    if(predictiveTable[variable] == undefined) {
        console.error("table erro: variable " + variable + " not expected");
        return [];
    }

    if(predictiveTable[variable][terminal] == undefined) {
        console.log("table error: terminal " + terminal + " not expected");
        return [];
    }

    return predictiveTable[variable][terminal];
}

function isTerminal(x) {
    return predictiveTable[x] == undefined;
}

function parse(alpha) {
    alpha += "$";
    let i = 0;
    let parsingStack = [];
    parsingStack.push("$");
    parsingStack.push("E");
    
    while (parsingStack.length != 0) {
        let top = parsingStack.pop();
        // console.log("Pop element is " + top + " index is " + i);
        if(isTerminal(top)) {
            // console.log("popped element is terminal");
            if(top == alpha.charAt(i)) {
                i++;
                continue;
            }
            else {
                console.log("parse error: stack terminal " + top + " is not macth with " + alpha.charAt(i));
                return "Rechazada"
            }
        }

        let res = tableLookup(top, alpha.charAt(i));

        if(res.length == 0) {
            console.log("parse error: no production available")
            return "Rechazada"
        }
        res.filter(e => e != "epsilon").forEach(e => parsingStack.push(e));
    }

    return "Aceptada";
}

function main(){
    let readline = require('readline');
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
  
    rl.on('line', function(line){
        console.log(parse(line));
    })
    
}

main();

// console.log(isTerminal("Ep"))

// console.log(tableLookup("F", "a"))