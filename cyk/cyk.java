import java.util.LinkedHashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;

class cyk {
    // membership test of string on a grammar throught the cyk algorithm
    public static void printGrammar(LinkedHashMap<String, LinkedList<String>> g) {
        Iterator hmIt = g.entrySet().iterator();

        while(hmIt.hasNext()) {
            Map.Entry mapElement = (Map.Entry) hmIt.next();
            LinkedList<String> prod = (LinkedList<String>) mapElement.getValue();
            System.out.print((String)mapElement.getKey() + " -> ");
            for(String s : prod) {
                System.out.print(s + " ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        LinkedHashMap<String, LinkedList<String>> grammar = new LinkedHashMap<>();
        LinkedList<String> productionRule = new LinkedList<>();
        productionRule.add("AB");
        productionRule.add("BB");

        grammar.put("S", productionRule);

        LinkedList<String> prod2 = new LinkedList<>();

        prod2.add("CC");
        prod2.add("AB");
        prod2.add("a");

        grammar.put("A", prod2);

        printGrammar(grammar);
    }

}