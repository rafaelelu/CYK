const bAddProduction = document.getElementById("bAddProduction");
const bResetGrammar = document.getElementById("bResetGrammar");
const bTestIfValid = document.getElementById("bTestIfValid");

const generatorInput = document.getElementById("generator");
const productInput = document.getElementById("product");
const wordInput = document.getElementById("word");
const grammar = document.getElementById("grammar");

const img = document.getElementById("img");

var cnfGrammar = new CNFGrammar([]);
cnfGrammar.addProduction(new Production('S',"AB"));
cnfGrammar.addProduction(new Production('S',"SS"));
cnfGrammar.addProduction(new Production('S',"AC"));
cnfGrammar.addProduction(new Production('S',"BD"));
cnfGrammar.addProduction(new Production('S',"BA"));
cnfGrammar.addProduction(new Production('A','a'));
cnfGrammar.addProduction(new Production('B','b'));
cnfGrammar.addProduction(new Production('C',"SB"));
cnfGrammar.addProduction(new Production('D',"SA"));
grammar.innerHTML = cnfGrammar.toString();


bAddProduction.addEventListener("click", function(){
    let generator = generatorInput.value;
    generatorInput.value = "";
    let product = productInput.value;
    productInput.value = "";
    cnfGrammar.addProduction(new Production(generator,product));
    generatorInput.placeholder = "";
    productInput.placeholder = "";
    grammar.innerHTML = cnfGrammar.toString();
});

bResetGrammar.addEventListener("click", function(){
    cnfGrammar.productions = [];
    grammar.innerHTML = "";
});

bTestIfValid.addEventListener("click", function(){
    let word = wordInput.value;
    wordInput.value = "";
    wordInput.placeholder = "";
    if(cnfGrammar.isValid(word)){
        img.src="accepted.jpg";
    } else {
        img.src="rejected.jpg";
    }
});