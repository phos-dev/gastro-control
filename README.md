## Sobre este projeto
#### O projeto foca em resolver o problema na compra e verificação de fichas de um refeitório. 

O caso de uso básico seria onde um usuário comum queira comprar uma refeição, ele abre o sistema, entra na fila e pode efetuar o pagamento da refeição antes de chegar a vez dele. 

Quando chega a vez dele, caso ele precise pagar ficará um contador de 1:30min aguardando o pagamento, após o pagamento o pedido fica na lista de pago e aguardando retirada (no balcão), quando ele entra no balcão e mostra o código ou QRCode gerado ao funcionário, o funcionário dá o prato, copo e talher para o usuário e a retirada é confirmada. Assim, finalizando o processo.

## Arquitetura

![Foto da arquitetura](https://github.com/phos-dev/gastro-control/blob/master/chart.drawio.png?raw=true)

## Tech stacks

### Web 
Next.js (Typescript)
### Microserviços

#### API para receber pagamentos
  - Descrição: Irá fazer todo o controle de pagamento utilizando alguma lib de terceiro, como **Stripe**.
  - Framework: Sprint Boot (Java)
  - Banco: NoSQL
#### API para controlar a fila:
  - Descrição: Irá fazer o controle da fila para o pagamento/entrada no estabelecimento.
  - Framework: RabbitMQ
#### API para gerir o pedido
  - Descrição: O caso de uso base seria que após a confirmação do pagamento irá gerar o QRCode para o usuário. Quando o funcionário que entrega prato for ler o QRCode deve ser confirmado e finalizado o processo
  - Framework: C# (.NET)
  - Banco: SQL
#### API Gateway
  - Framework: Kong
