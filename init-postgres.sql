-- Criação do banco de dados shadow (se não existir)
CREATE DATABASE encurtador_url_db_shadow;

-- Garante privilégios para o usuário postgres (opcional, pois o usuário postgres já tem todos os privilégios)
-- GRANT ALL PRIVILEGES ON DATABASE encurtador_url_db TO postgres;
-- GRANT ALL PRIVILEGES ON DATABASE encurtador_url_db_shadow TO postgres;