const { Carrinho } = require('../src/domain/Carrinho.js');
const { UserMother } = require('./UserMother.js');

class CarrinhoBuilder {
constructor() {
    // Valores padrão
    this.user = UserMother.umUsuarioPadrao();
    this.itens = [
        { nome: 'Item Padrão', preco: 100 }
    ];
}

comUser(user) {
    this.user = user;
    return this; // método fluente
}

comItens(itens) {
    this.itens = itens;
    return this;
}

vazio() {
    this.itens = [];
    return this;
}

build() {
    return new Carrinho(this.user, this.itens);
}
}

module.exports = { CarrinhoBuilder };