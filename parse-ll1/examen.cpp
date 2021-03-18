#include <iostream>
#include <cstring>

/*
The following program receives several strings  and 
test the membership of the string to the following grammar


The program ends when 0 is given as an input
*/

using namespace std;

const char *input;


bool S();
bool A();
bool B();

bool S() {
    if(*input == 'b' || *input == 'f') {
        return A() && B();
    }
    return false;
}

bool A(){
    if(*input ==  'b') {
        input++;
        if(*input == 'b') {
            input++;
            if(B()) {
                return *input++ == 'd';
            }
        }
    } else if(*input == 'f') {
        input++;
        if(S()) {
            return *input++ == 'f';
        }
    } 

    return false;
}


bool B() {
    if(*input ==  'c') {
        input++;
        return  true;
    } else if(*input == 'd' || *input == 'f' || *input == '\0') {
        return true;
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

        if(S())
            cout << "Aceptada\n";
        else
            cout << "Rechazada\n";
    }

    return 0;
}
