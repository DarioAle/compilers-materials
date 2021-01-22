#include <iostream>

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
    return (isTerminal('+') && T() && G()) || (input = save, *input == '\0');
}

bool T() {
    return F() && H();
}

bool H() {
    const char *save = input;
    return (isTerminal('*') && F() && H()) || (input = save, *input == '\0');
}

bool F() {
    const char *save = input;
    return (isTerminal('(') && E() && isTerminal(')')) || (input = save, isTerminal('a'));
}

int main() 
{
    string s;
    cin >> s;


    input = s.c_str();
    if(E() && *input == '\0')
        cout << "Aceptada\n";
    else
        cout << "Rechazada\n";
    return 0;
}