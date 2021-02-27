function main(){
  let readline = require('readline');
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', function(line){
      console.log(DFA(line));
  })
  
}

let tokenArr = [];

function pushError(c){
  tokenArr.push({valor : c, tipo : 'error'})
}

function DFA(w){
    tokenArr = []
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
                }else {
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

main();
