"use strict"

class CNFGrammar {

    constructor() {
        this.productions = [];
    }

    getProductions() {
        return this.productions;
    }

    deleteProductions() {
        this.productions = [];
    }

    addProduction(production) {
        this.productions.push(production);
    }

    toString() {
        let grammarString = "";
        for (let i = 0; i < this.productions.length; i++) {
            let productionString = "";
            productionString += this.productions[i].getGenerator() + " -> ";
            productionString += this.productions[i].getProduct() + "<br>";
            grammarString += productionString;
        }
        return grammarString;
    }

    isValid(word) {
        let matrix = this.cyk(word);
        let cell = matrix[0][matrix[0].length - 1];
        let root = null;
        for (let i = 0; i < cell.length; i++) {
            if (cell[i].getValue() == "S") {
                root = cell[i];
            }
        }
        if (root != null) {
            let tree = new GrammarTree(root);
            let derivationList = tree.getDerivation();
            let derivation = "";
            for (let i = 0; i < derivationList.length; i++) {
                for (let j = 0; j < derivationList[i].length; j++) {
                    derivation += derivationList[i][j].getValue();
                }
                derivation += " => "
            }
            console.log(derivation.substring(0,derivation.length-4));
            return true;
        }
        return false;

    }

    cyk(word) {
        let grid = [];
        for (let i = 0; i < word.length; i++) {
            let generators = this.whatProduces(word[i], new Node(word[i]), null);
            grid.push([generators]);
        }

        for (let i = 0; i < word.length - 1; i++) {
            for (let j = 0; j < word.length - 1 - i; j++) {
                let secondToCombine = [];
                let l = j + 1;
                for (let k = 0, m = i; k < i + 1; k++, m--) {
                    secondToCombine.push(grid[l][m]);
                    l++;
                }
                grid[j].push(this.cykCombination(grid[j], secondToCombine));
            }
        }
        console.log(grid);
        return grid;
    }

    whatProduces(word, lNode, rNode) {
        let productions = [];
        for (let i = 0; i < this.productions.length; i++) {
            if (this.productions[i].getProduct() == word) {
                let node = new Node(this.productions[i].getGenerator());
                node.setLNode(lNode);
                node.setrNode(rNode);
                productions.push(node);
            }
        }
        return productions;
    }

    cykCombination(a, b) {
        let combinations = [];

        for (let i = 0; i < a.length; i++) {
            let c = [];
            if (a[i].length != 0 && b[i].length != 0) {
                for (let j = 0; j < a[i].length; j++) {
                    for (let k = 0; k < b[i].length; k++) {
                        let product = a[i][j].getValue() + b[i][k].getValue();
                        let generators = this.whatProduces(product, a[i][j], b[i][k]);
                        for (let l = 0; l < generators.length; l++) {
                            c.push(generators[l]);
                        }

                    }
                }
            }

            if (c.length == 0) {
                continue;
            }
            for (let j = 0; j < c.length; j++) {
                if (!this.contains(combinations, c[j])) {
                    combinations.push(c[j]);
                }
            }
        }
        return combinations;
    }

    contains(lst, node) {
        for (let i = 0; i < lst.length; i++) {
            if (lst[i].getValue() == node.getValue()) {
                return true;
            }
        }
        return false;
    }
}

class Production {
    constructor(generator, product) {
        this.generator = generator;
        this.product = product;
    }

    getGenerator() {
        return this.generator;
    }

    getProduct() {
        return this.product;
    }
}

class Node {
    constructor(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    setLNode(node) {
        this.lNode = node;
    }

    getLNode() {
        return this.lNode;
    }

    setrNode(node) {
        this.rNode = node;
    }

    getRNode() {
        return this.rNode;
    }

    isLeaf() {
        if (this.lNode == null && this.rNode == null) {
            return true;
        }
        return false;
    }

    getChildren() {
        let children = [];
        if (this.lNode != null) {
            children.push(this.lNode);
        }
        if (this.rNode != null) {
            children.push(this.rNode);
        }
        return children;
    }
}

class GrammarTree {
    constructor(root) {
        this.root = root;
    }

    getDerivation() {
        let toReturn = [
            [this.root]
        ];
        let i = 0;
        while (this.hasGenerators(toReturn[i])) {
            let toPush = [];
            let allowGenerator = true;
            for (let j = 0; j < toReturn[i].length; j++) {
                if (toReturn[i][j].isLeaf()) {
                    toPush.push(toReturn[i][j]);
                } else if (allowGenerator) {
                    let toPushx2 = toReturn[i][j].getChildren();
                    for (let k = 0; k < toPushx2.length; k++) {
                        toPush.push(toPushx2[k]);
                    }
                    allowGenerator = false;
                } else {
                    toPush.push(toReturn[i][j]);
                }
            }
            toReturn.push(toPush);
            i++;
        }
        return toReturn;
    }

    hasGenerators(lst) {
        for (let i = 0; i < lst.length; i++) {
            if (lst[i].getLNode() != null || lst[i].getRNode() != null) {
                return true;
            }
        }
        return false;
    }
}