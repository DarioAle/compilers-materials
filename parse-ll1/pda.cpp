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

bool E() {
    if(*input == 'a' || *input == '(') {
        return T() && G();
    }
    return false;
}

bool G(){
    if(*input ==  '+') {
        input++;
        return T() && G(); 
    } else if(*input == ')' || *input == '\0') {
        return true;
    } 

    return false;
}

bool T() {
    if(*input == 'a' || *input == '(') {
        return F() && H();
    }
    return false;
}

bool H() {
    if(*input ==  '*') {
        input++;
        return F() && H(); 
    } else if(*input == '+' || *input == ')' || *input == '\0') {
        return true;
    } 

    return false;
}

bool F() {
    if(*input == 'a') {
        input++;
        return true;
    } else if(*input == '(') {
        input++;
        if(E()) {
            return *input++ == ')';
        }
    }
    return false;
    
}

int main() 
{
    while(true) {
        string s;
        cin >> s;
        char exit[] = "0";
        input = s.c_str();

        if(strcmp(exit, input) == 0) break;

        if(E())
            cout << "Aceptada\n";
        else
            cout << "Rechazada\n";
    }

    return 0;
}
