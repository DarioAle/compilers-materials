#include <iostream>
#include <cstring>

/*
The following program receives several strings  and 
test the membership of the string to the following grammar

E -> TG
G -> +TG | empty
T -> FH
H -> *FH | empty
F -> (E) | a

The program ends when 0 is given as an input
*/

using namespace std;

const char *input;

bool isTerminal(char c);
bool E();
bool G();
bool T();
bool H();
bool F();

bool isTerminal(char c) 
{
    if(c == '$') return true;

    if(*input != '\0') 
        return *input++ == c;
    else
        return false;
}

bool E() {
    return T() && G();
}

bool G(){
    const char *save = input;
    return (isTerminal('+') && T() && G()) || (input = save, isTerminal('$'));
}

bool T() {
    return F() && H();
}

bool H() {
    const char *save = input;
    return (isTerminal('*') && F() && H()) || (input = save, isTerminal('$'));
}

bool F() {
    const char *save = input;
    return (isTerminal('(') && E() && isTerminal(')')) || (input = save, isTerminal('a'));
}

int main() 
{
    while(true) {
        string s;
        cin >> s;
        char exit[] = "0";
        input = s.c_str();

        if(strcmp(exit, input) == 0) break;

        if(E() && *input == '\0')
            cout << "Aceptada\n";
        else
            cout << "Rechazada\n";
    }

    return 0;



//https://lti.educonnector.io/webex/meetings/1616271/join
}