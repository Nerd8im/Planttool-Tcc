create database plantool_db;
use plantool_db;


CREATE TABLE tb_user(
	user_id VARCHAR (60) PRIMARY KEY UNIQUE,
	user_nome VARCHAR(244),
    user_sobrenome VARCHAR(244),
    user_email VARCHAR(244) UNIQUE,
    user_senha VARCHAR(100),
    user_foto LONGBLOB
);

INSERT INTO tb_user (user_id, user_nome, user_sobrenome, user_email, user_senha, user_foto) VALUES
('b96f0f89-0137-4f62-b80e-cd80210c6902', 'Lucas', 'Almeida', 'lucas.almeida@email.com', 'senha123', NULL),
('3e1e9d57-23e9-4b4d-a730-fd3d08d5ce70', 'Marina', 'Souza', 'marina.souza@email.com', 'senha456', NULL);


CREATE TABLE tb_classificacao_botanica (
    classificacao_id VARCHAR(60) PRIMARY KEY,
    classificacao_nome VARCHAR(100) UNIQUE NOT NULL,
    classificacao_descricao TEXT
);

INSERT INTO tb_classificacao_botanica (classificacao_id, classificacao_nome, classificacao_descricao) VALUES
('7e6d6fbb-f9c2-42f8-8d49-66e2df22c0a0', 'Angiospermas', 'Plantas com flores e sementes envoltas por frutos.'),
('a491c305-ea46-44c3-b3ae-0c8fd5737b60', 'Gimnospermas', 'Plantas com sementes nuas, sem frutos.');


CREATE TABLE tb_plantaEspecie(
plantaEspecie_id VARCHAR(60) PRIMARY KEY UNIQUE,
    plantaEspecie_nome VARCHAR(244),
    plantaEspecie_descricao TEXT,
    plantaEspecie_cuidados TEXT,
    classificacao_id VARCHAR(60),
    FOREIGN KEY (classificacao_id) REFERENCES tb_classificacao_botanica(classificacao_id)
);

INSERT INTO tb_plantaEspecie (plantaEspecie_id, plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, classificacao_id) VALUES
('4e216bb3-b82f-463f-9091-f399e9a4cf88', 'Ficus lyrata', 'Também conhecida como figueira-lira, ótima para ambientes internos.', 'Requer luz indireta e regas moderadas.', '7e6d6fbb-f9c2-42f8-8d49-66e2df22c0a0'),
('6cb87482-769c-4ed7-b8c9-504eaf9fd132', 'Pinus elliottii', 'Espécie de pinheiro comum no sul do Brasil.', 'Prefere solo arenoso e boa iluminação.', 'a491c305-ea46-44c3-b3ae-0c8fd5737b60');



CREATE TABLE tb_guiaCuidado (
    guia_id VARCHAR(60) PRIMARY KEY,
    plantaEspecie_id VARCHAR(60),
    titulo VARCHAR(244),
    conteudo TEXT,
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);

INSERT INTO tb_guiaCuidado (guia_id, plantaEspecie_id, titulo, conteudo) VALUES
('e4638230-4a2e-4a3c-9d0f-87210cf0db1b', '4e216bb3-b82f-463f-9091-f399e9a4cf88', 'Cuidados com Ficus lyrata', 'Regue duas vezes por semana e mantenha próximo a janelas.'),
('a6b0b6ed-f98c-4d3d-bcd2-bdb5e4c13a45', '6cb87482-769c-4ed7-b8c9-504eaf9fd132', 'Guia para Pinus elliottii', 'Evite solo encharcado. Adube a cada 3 meses.');


CREATE TABLE tb_userPlanta (
    userPlanta_id VARCHAR(60) PRIMARY KEY,
    user_id VARCHAR(60),
    plantaEspecie_id VARCHAR(60),
    userPlanta_nome VARCHAR(244),
    userPlanta_foto LONGBLOB,
    data_plantio DATE,
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);

INSERT INTO tb_userPlanta (userPlanta_id, user_id, plantaEspecie_id, userPlanta_nome, userPlanta_foto, data_plantio) VALUES
('c87cda25-4de3-453b-b5fd-4db6f2348ae2', 'b96f0f89-0137-4f62-b80e-cd80210c6902', '4e216bb3-b82f-463f-9091-f399e9a4cf88', 'Figueira do Lucas', NULL, '2025-05-10'),
('5fd712e5-0be2-42b4-88a5-f406b173f37d', '3e1e9d57-23e9-4b4d-a730-fd3d08d5ce70', '6cb87482-769c-4ed7-b8c9-504eaf9fd132', 'Pinheiro da Marina', NULL, '2025-04-22');


CREATE TABLE tb_cuidadoNotificacao (
    notificacao_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    frequencia_dias INT NOT NULL,
    data_proxima DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id)
);

INSERT INTO tb_cuidadoNotificacao (notificacao_id, userPlanta_id, descricao, frequencia_dias, data_proxima, tipo) VALUES
('71c2e0f9-3c65-4c95-a632-20785f1c89cf', 'c87cda25-4de3-453b-b5fd-4db6f2348ae2', 'Regar a Figueira', 3, '2025-06-12', 'Rega'),
('d7baf1ea-90c2-487c-9b4c-848cce91eb88', '5fd712e5-0be2-42b4-88a5-f406b173f37d', 'Adubar o Pinheiro', 90, '2025-07-22', 'Adubação');


CREATE TABLE tb_calculoNutriente (
    calculo_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60),
    data_calculo DATETIME,
    resultado_texto TEXT,
    quantidade_sugerida VARCHAR(100),
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id)
);

INSERT INTO tb_calculoNutriente (calculo_id, userPlanta_id, data_calculo, resultado_texto, quantidade_sugerida) VALUES
('2a16cc0f-8f5d-4096-9bd6-1a5a71eb68cb', 'c87cda25-4de3-453b-b5fd-4db6f2348ae2', '2025-06-01 10:00:00', 'Necessita 20g de NPK 10-10-10', '20g'),
('b8a27f74-d71e-4e9e-8801-f556e944a4f4', '5fd712e5-0be2-42b4-88a5-f406b173f37d', '2025-06-05 09:30:00', 'Adicionar 15g de composto orgânico', '15g');

-- Join tables para fins de consulta --

SELECT 
    u.user_nome,
    u.user_sobrenome,
    u.user_email,
    p.userPlanta_nome,
    p.data_plantio
FROM tb_user u
INNER JOIN tb_userPlanta p ON u.user_id = p.user_id;

SELECT 
    up.userPlanta_nome,
    up.data_plantio,
    pe.plantaEspecie_nome,
    pe.plantaEspecie_descricao
FROM tb_userPlanta up;

SELECT 
    pe.plantaEspecie_nome,
    pe.plantaEspecie_descricao,
    cb.classificacao_nome,
    cb.classificacao_descricao
FROM tb_plantaEspecie pe
INNER JOIN tb_classificacao_botanica cb ON pe.classificacao_id = cb.classificacao_id;

SELECT 
    u.user_nome,
    u.user_sobrenome,
    up.userPlanta_nome,
    pe.plantaEspecie_nome,
    cb.classificacao_nome
FROM tb_user u
INNER JOIN tb_userPlanta up ON u.user_id = up.user_id
INNER JOIN tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id
INNER JOIN tb_classificacao_botanica cb ON pe.classificacao_id = cb.classificacao_id;
