const { CheckoutService } = require('../src/services/CheckoutService.js');
const { CarrinhoBuilder } = require('../builders/CarrinhoBuilder.js');
const { UserMother } = require('../builders/UserMother.js');
const { Pedido } = require('../src/domain/Pedido.js');

describe('quando o pagamento falha', () => {
it('deve retornar null', async () => {
  // Arrange
  const carrinho = new CarrinhoBuilder().build();

  const gatewayStub = {
    cobrar: jest.fn().mockResolvedValue({ success: false })
  };

  const repositoryDummy = {
    salvar: jest.fn()
  };

  const emailServiceDummy = {
    enviarEmail: jest.fn()
  };

  const checkoutService = new CheckoutService(
    gatewayStub,
    repositoryDummy,
    emailServiceDummy
  );

  // Act
  const pedido = await checkoutService.processarPedido(carrinho, '4111111111111111');

  // Assert
  expect(pedido).toBeNull();
});
});

describe('quando um cliente Premium finaliza a compra', () => {
it('deve aplicar desconto e enviar e-mail de confirmação', async () => {
  // Arrange
  const usuarioPremium = UserMother.umUsuarioPremium();

  const itens = [
    { nome: 'Produto X', preco: 100 },
    { nome: 'Produto Y', preco: 100 }
  ];
  const carrinho = new CarrinhoBuilder()
    .comUser(usuarioPremium)
    .comItens(itens)
    .build();

  const gatewayStub = {
    cobrar: jest.fn().mockResolvedValue({ success: true })
  };

  const pedidoSalvo = new Pedido(123, carrinho, 180, 'PROCESSADO');
  const repositoryStub = {
    salvar: jest.fn().mockResolvedValue(pedidoSalvo)
  };

  const emailMock = {
    enviarEmail: jest.fn().mockResolvedValue()
  };

  const checkoutService = new CheckoutService(
    gatewayStub,
    repositoryStub,
    emailMock
  );

  // Act
  const pedido = await checkoutService.processarPedido(carrinho, '4111111111111111');

  // Assert
  expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, '4111111111111111');

  expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
  expect(emailMock.enviarEmail).toHaveBeenCalledWith(
    'maria@teste.com',
    'Seu Pedido foi Aprovado!',
    expect.stringContaining('Pedido 123 no valor de R$180')
  );

  expect(pedido).toEqual(pedidoSalvo);
});
});