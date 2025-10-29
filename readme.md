# Savepoint emanager

## iniciando o projeto

no terminal rode o comando: npm init -y
baixar os pacotes com: npm i express nodemon cors prisma @prisma/client

criar e configurar o index.js

## configurando o prisma

### inicializar

no terminal rode o comando: npx prisma init

### configurar o acesso

no arquivo .env: DATABASE_URL="mysql://usuario:senha@host:porta/banco"
no arquivo prisma/schema.prisma: provider = "mysql"
com o banco criado, no terminal rode o comando: npx prisma db pull

### gerar o prisma client

no terminal rode o comando: npx prisma generate
obs: rodar esse comando novamente sempre que fizer alterações no arquivo prisma/schema.prisma


## gerando documentação

### pacotes necessários

no terminal rode: npm i swagger-autogen swagger-ui-express