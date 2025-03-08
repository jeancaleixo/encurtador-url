FROM node:22.14

WORKDIR /encurtador-url

# Instalar dependências do sistema e cliente PostgreSQL
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências do Node
RUN npm install

# Copiar arquivos do Prisma
COPY prisma ./prisma

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar resto do código
COPY . .

# Construir aplicação
RUN npm run build

# Expor porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]