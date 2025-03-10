

## Documentação e guia do encurtador de URL

Este é o projeto referente ao desafio técnico para vaga de Desenvolvedor BackEnd.Utilizei Nest,
pois ele é totalmente voltado para escalonamento vertical, por usar arquitetura modular e baseada
em controller, services e modules. usei prisma como ORM para facilitar o manejo com banco de dados.
Tentei seguir o padrão de desenvolvimento SOLID, principalmente separando as responsabilidades 
dos services.
obs: é notável que em alguns arquivos tem comentários na primeira linha que se referem ao eslint,
são apenas para erros de tipagem.

Diferenciais:
- Usei o Docker Compose para subir o ambiente( Perante qualquer erro, rode localmente )
- Escrevi testes unitários para cada service, se encontram na pasta test na raiz do projeto
- Usei o Swagger para fazer um mapeamento de rotas, acese em localhost:3006/api
- Pontos de melhoria para o sistema: Validar se a URL encurtada está no ar.

## Primeiro Passo

```bash
$ npm install
```

Variaveis de ambiente:
- POSTGRES_USER="seu user"
- POSTGRES_PASSWORD="sua senha"
- POSTGRES_DB=encurtador_url_db
- DATABASE_URL=postgresql://postgres:postgres@postgres:5432/encurtador_url_db
- SHADOW_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/encurtador_url_db_shadow
- JWT_SECRET="key do jwt"
- JWT_EXPIRE=1d
- BASE_URL=http://localhost:3006

obs: a jwt secret pode ser feita no https://www.md5hashgenerator.com/ inserindo qualquer palavra

## Compilar e rodar

```bash
# containers
$ docker-compose up -d

```
## Compilar e rodar Localmente

```bash
# esquemas prisma
$ npx prisma generate

# migracao
$ npx prisma migrate dev

# run
$ npm run start:dev

```


