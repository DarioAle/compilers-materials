/* 
        id      +       *       (       )       $
E     E->TE'                  E->TE'    
E'            E'->TE'                   E'->Ɛ    E'->Ɛ
T     T->FT'                  T->FT'
T'           T'->Ɛ  T'->*FT'            T'->Ɛ    T'->Ɛ
F     F->id                   F->(E)

*/

let tokenArr = [];

function pushError(c){
    tokenArr.push({valor : c, tipo : 'error'})
  }
  
function DFA(w){
    tokenArr = [];
    // w = w.trim();
    w = w + ' ';
    // console.log(w);
    let i = 0;
    let sbstrBegin = 0;
    let state = 0;
    let token = {'valor' : '0', 'tipo' : 'default'};
    //token.valor = '0', token.tipo = 'default';

    for(i = 0; i < w.length; i++){
        let temp = w.charAt(i);
        // console.log('char: ' + temp + ' i: ' + i + ' state ' + state);
        switch(state){
            case 0:
                if(isDigit(temp)){
                    state = 1;
                }
                else if(temp === ' '){
                  sbstrBegin++;
                  break;
                }else if(temp == "+") {
                  state = 0;
                  sbstrBegin++;
                  tokenArr.push({valor : "+", tipo : "plus"});
                } else if(temp == "*") {
                  state = 0;
                  sbstrBegin++;
                  tokenArr.push({valor : "*", tipo : "times"});

                } else if(temp == "(") {state = 0;
                    sbstrBegin++;
                    tokenArr.push({valor : "(", tipo : "opp"});
                    
                } else if(temp == ")") {
                  state = 0;
                  sbstrBegin++;
                  tokenArr.push({valor : ")", tipo : "clp"});

                } else {
                  state = 0;
                  sbstrBegin++;
                  pushError(temp);
                }
            break;

            case 1:
                token.valor = w.substring(sbstrBegin, i);
                token.tipo = 'entero'
                if(isDigit(temp)){
                    state = 1;
                }
                else if(temp === '.'){
                    state = 2;
                }
                else if(temp === 'E'){
                    state = 4;
                }else{
                    tokenArr.push({valor : token.valor, tipo : token.tipo});
                    sbstrBegin = i;
                    state = 0;
                    i--;
                }
            break;

            case 2:
                if(isDigit(temp)){
                    state = 3;
                }else {
                    tokenArr.push({valor : token.valor, tipo : token.tipo});
                    state = 0;
                    sbstrBegin = i - 1; // the pattern that brought us here is one step behind
                    i-=2;
                }
            break;

            case 3:
                token.valor = w.substring(sbstrBegin, i);
                token.tipo = 'flotante';
                if(isDigit(temp)){
                    state = 3;
                }else if(temp === 'E'){
                    state = 4;
                }else {
                  tokenArr.push({valor : token.valor, tipo : token.tipo});
                  sbstrBegin = i;
                  state = 0;
                  i--;
                }
            break;

            case 4:
                if(temp === '+' || temp === '-'){
                    state = 5;
                }
                else if(isDigit(temp)){
                    state = 6;
                } else {
                  tokenArr.push({valor : token.valor, tipo : token.tipo});
                  sbstrBegin = i - 1;
                  state = 0;
                  i -= 2; // the pattern that brought us here is one step behind
                }
            break;

            case 5:
                if(isDigit(temp)){
                    state = 6;
                }else {
                  tokenArr.push({valor : token.valor, tipo : token.tipo});
                  state = 0;
                  sbstrBegin = i - 2;
                  i -= 3; // the pattern that brought us here is two steps behind.
                }
            break;

            case 6:
                token.valor = w.substring(sbstrBegin, i);
                token.tipo = 'exponente';
                if(isDigit(temp)){
                    state = 6;
                } else{
                    tokenArr.push({valor : token.valor, tipo : token.tipo});
                    sbstrBegin = i;
                    state = 0;
                    i--;
                }
            break;

        }
    }
    // console.log('*' + ' ' + '*' + ' ' + state);

    return tokenArr;
}

function isDigit(s){
    return s >= '0' && s <= '9';
}
  
//      
const predictiveTable = {
    E : {
        entero    : ["Ep", "T"],
        flotante  : ["Ep", "T"],
        exponente : ["Ep", "T"],
        opp :       ["Ep", "T"]
    },

    Ep : {
        plus : ["Ep", "T", "plus"], 
        clp :  ["epsilon"],
        term : ["epsilon"]
    },

    T : {
        entero :    ["Tp", "F"],
        flotante :  ["Tp", "F"],
        exponente : ["Tp", "F"],
        opp : ["Tp", "F"]
    },

    Tp : {
        plus :  ["epsilon"],
        times : ["Tp", "F", "times"],
        clp :   ["epsilon"],
        term :  ["epsilon"],
    },

    F : {
        entero :    ["entero"],
        flotante :  ["flotante"],
        exponente : ["exponente"],
        opp : ["clp", "E", "opp"]
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
    alpha.push({valor : '$', tipo : 'term'});
    let i = 0;
    let parsingStack = [];
    parsingStack.push("term");
    parsingStack.push("E");
    
    while (parsingStack.length != 0) {
        let top = parsingStack.pop();
        // console.log("Pop element is " + top + " index is " + i);
        if(isTerminal(top)) {
            // console.log("popped element is terminal");
            if(top == alpha[i].tipo) {
                i++;
                continue;
            }
            else {
                console.log("parse error: stack terminal " + top + " is not macth with " + alpha[i].tipo);
                return "Rechazada"
            }
        }

        // let token = DFA();
        let res = tableLookup(top, alpha[i].tipo);

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
        let tokenizedInput = DFA(line);
        console.log(parse(tokenizedInput));
    })
    
}

main();

// console.log(isTerminal("Ep"))

// console.log(tableLookup("F", "a"))