const { User } = require('../src/domain/User.js');

class UserMother {
static umUsuarioPadrao() {
    return new User(
        1,
        'Fulano de Tal',
        'fulano@teste.com',
        'PADRAO'
    );
}

static umUsuarioPremium() {
    return new User(
        2,
        'Maria Premium',
        'maria@teste.com',
        'PREMIUM'
    );
}
}

module.exports = { UserMother };