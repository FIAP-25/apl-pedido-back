# apl-pedido-back

Repositório do microserviço de pedido.

## Rodando Localmente

Para rodar a aplicação localmente siga as etapas abaixo:

Clone o projeto

```bash
  git clone https://github.com/FIAP-25/apl-pedido-back.git
```

Instale a versão do Node:

```bash
  Node 18.17.1
```

Instale as dependências:

```bash
  npm install --legacy-peer-deps
```

Criar um arquivo .env a partir do .env-example (no arquivo .env-example estão as configurações padrões do projeto)

```bash
  Criar arquivo .env
```

Rodar o comando para inicialização

```bash
  npm run start
```

O swagger da aplicação pode ser visualizado pelo endereço:

```bash
  http://localhost:3000/api
```

## Rodando com o Kubernetes

Para subir os containers do Kubernetes executar o comando

```bash
  npm run k8:create
```

Para derrubar os containers executar o comando

```bash
  npm run k8:delete
```

## Mais Informações

As collections de exemplo, podem ser visualizadas pelo postman:

```bash
  https://www.postman.com/crimson-trinity-772896/workspace/fiap/documentation/28408712-7c8d89db-fa3c-4998-86f2-6c49c0fcb2bf
```

O Miro com a linguagem ubíqua + event storming pode ser acessado pelo link:

```bash
  https://miro.com/app/board/uXjVMK9Y4Zw=/
```

## Diagrama de Entidades e Relacionamentos - MYSQL

![diagrama-banco](https://github.com/FIAP-25/apl-nest-fiap/assets/39955568/4320329f-42a2-47b9-84eb-d22e0493e049)

## Autores

-   Eduardo Vinicius Rodrigues Lima - RM430119
-   Leonardo Covelo da Paz - RM350311
-   Luik de Castro da Silva - RM348546
-   Ricardo Souza Reis - RM348610
