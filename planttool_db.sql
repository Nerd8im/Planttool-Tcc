CREATE DATABASE IF NOT EXISTS plantool_db;
USE plantool_db;

CREATE TABLE tb_user(
    user_id VARCHAR (60) PRIMARY KEY UNIQUE,
    user_nome VARCHAR(244),
    user_sobrenome VARCHAR(244),
    user_email VARCHAR(244) UNIQUE,
    user_senha VARCHAR(100),
    user_foto VARCHAR(255)
);

CREATE TABLE tb_classificacao_botanica (
    classificacao_id INT AUTO_INCREMENT PRIMARY KEY,
    classificacao_nome VARCHAR(100) UNIQUE NOT NULL,
    classificacao_descricao TEXT
);


INSERT INTO tb_classificacao_botanica (classificacao_nome, classificacao_descricao) VALUES
('Angiospermas', 'Plantas com flores e sementes envoltas por frutos.'),
('Gimnospermas', 'Plantas com sementes nuas, sem frutos.');


CREATE TABLE tb_plantaEspecie(
    plantaEspecie_id INT AUTO_INCREMENT PRIMARY KEY,
    plantaEspecie_nome VARCHAR(244),
    plantaEspecie_descricao TEXT,
    plantaEspecie_cuidados TEXT,
    plantaEspecie_foto VARCHAR(255),
    plantaEspecie_intervalo_rega_horas INT,
    classificacao_id INT,
    FOREIGN KEY (classificacao_id) REFERENCES tb_classificacao_botanica(classificacao_id)
);


INSERT INTO tb_plantaEspecie (plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, plantaEspecie_foto, plantaEspecie_intervalo_rega_horas, classificacao_id) VALUES
('Ficus lyrata', 'Também conhecida como figueira-lira, ótima para ambientes internos.', 'Requer luz indireta e regas moderadas.', 'publico\\imagem_plantas\\placeholder.jpg', 72, 1),
('Pinus elliottii', 'Espécie de pinheiro comum no sul do Brasil.', 'Prefere solo arenoso e boa iluminação.', 'publico\\imagem_plantas\\placeholder.jpg', 168, 2);


CREATE TABLE tb_guiaCuidado (
    guia_id INT AUTO_INCREMENT PRIMARY KEY,
    plantaEspecie_id INT,
    titulo VARCHAR(244),
    conteudo TEXT,
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);


INSERT INTO tb_guiaCuidado (plantaEspecie_id, titulo, conteudo) VALUES
(1, 'Cuidados com Ficus lyrata', 'Regue duas vezes por semana e mantenha próximo a janelas.'),
(2, 'Guia para Pinus elliottii', 'Evite solo encharcado. Adube a cada 3 meses.');


CREATE TABLE tb_userPlanta (
    userPlanta_id VARCHAR(60) PRIMARY KEY,
    user_id VARCHAR(60),
    plantaEspecie_id INT,
    userPlanta_nome VARCHAR(244),
    userPlanta_foto varchar(244),
    data_plantio DATE,
    ultima_rega DATE,
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);

CREATE TABLE tb_cuidadoNotificacao (
    notificacao_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    frequencia_dias INT NOT NULL,
    data_proxima DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id) ON DELETE CASCADE
);


CREATE TABLE tb_calculoNutriente (
    calculo_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60),
    data_calculo DATETIME,
    resultado_texto TEXT,
    quantidade_sugerida VARCHAR(100),
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id) ON DELETE CASCADE
);

-- CONSULTAS (JOINS) --

-- Consulta 1: Usuários e suas plantas
SELECT 
    u.user_nome,
    u.user_sobrenome,
    u.user_email,
    p.userPlanta_nome,
    p.data_plantio
FROM tb_user u
INNER JOIN tb_userPlanta p ON u.user_id = p.user_id;

-- Consulta 2: Plantas do usuário e detalhes da espécie
SELECT 
    up.userPlanta_nome,
    up.data_plantio,
    pe.plantaEspecie_nome,
    pe.plantaEspecie_descricao
FROM tb_userPlanta up
INNER JOIN tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id;

-- Consulta 3: Espécies de plantas e sua classificação botânica
SELECT 
    pe.plantaEspecie_nome,
    pe.plantaEspecie_descricao,
    cb.classificacao_nome,
    cb.classificacao_descricao
FROM tb_plantaEspecie pe
INNER JOIN tb_classificacao_botanica cb ON pe.classificacao_id = cb.classificacao_id;

-- Consulta 4: Junção completa de usuário, planta do usuário, espécie e classificação
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

SELECT
    up.userPlanta_id,
    up.userPlanta_nome,
    up.userPlanta_foto,
    up.data_plantio,
    up.ultimaRega,
    pe.plantaEspecie_nome,
    pe.plantaEspecie_descricao,
    gc.titulo,
    gc.conteudo
FROM
    tb_userPlanta up
INNER JOIN
    tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id
LEFT JOIN
    tb_guiaCuidado gc ON pe.plantaEspecie_id = gc.plantaEspecie_id;