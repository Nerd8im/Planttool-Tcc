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

SELECT * from tb_user;

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
select * from tb_plantaEspecie;


INSERT INTO tb_plantaEspecie (plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, plantaEspecie_foto, plantaEspecie_intervalo_rega_horas, classificacao_id) VALUES 
('Tomate', 'Legume muito cultivado em hortas e quintais.', 'Gosta de sol pleno e regas regulares.', 'publico\\imagem_plantas\\tomate.jpg', 48, 1),
('Alface', 'Hortaliça de folhas verdes e cultivo rápido.', 'Precisa de solo úmido e sol moderado.', 'publico\\imagem_plantas\\alface.jpg', 24, 1),
('Cebolinha', 'Temperinho comum em hortas caseiras.', 'Prefere sol e regas frequentes.', 'publico\\imagem_plantas\\cebolinha.jpg', 36, 1),
('Salsinha', 'Erva usada em diversas receitas.', 'Gosta de meia-sombra e solo úmido.', 'publico\\imagem_plantas\\salsinha.jpg', 36, 1),
('Coentro', 'Temperinho popular em pratos regionais.', 'Gosta de sol direto e regas frequentes.', 'publico\\imagem_plantas\\coentro.jpg', 24, 1),
('Manjericão', 'Erva aromática muito usada em molhos.', 'Precisa de sol e regas leves diárias.', 'publico\\imagem_plantas\\manjericao.jpg', 24, 1),
('Hortelã', 'Usada em chás e temperos.', 'Prefere meia-sombra e solo úmido.', 'publico\\imagem_plantas\\hortela.jpg', 36, 1),
('Cenoura', 'Raiz comestível fácil de cultivar.', 'Gosta de sol e solo bem drenado.', 'publico\\imagem_plantas\\cenoura.jpg', 72, 1),
('Beterraba', 'Raiz nutritiva e de cor intensa.', 'Prefere sol pleno e solo fofo.', 'publico\\imagem_plantas\\beterraba.jpg', 72, 1),
('Pimenta', 'Planta produtiva e fácil de manter.', 'Gosta de sol direto e regas moderadas.', 'publico\\imagem_plantas\\pimenta.jpg', 48, 1),
('Morango', 'Fruta pequena e doce, ótima para vasos.', 'Prefere sol leve e regas constantes.', 'publico\\imagem_plantas\\morango.jpg', 36, 1),
('Feijão', 'Grão tradicional e muito cultivado no Brasil.', 'Gosta de sol pleno e solo bem drenado.', 'publico\\imagem_plantas\\feijao.jpg', 72, 1);


CREATE TABLE tb_guiaCuidado (
    guia_id INT NOT NULL PRIMARY KEY,
    plantaEspecie_id INT,
    titulo VARCHAR(244),
    conteudo TEXT,
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);


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
select * from tb_userPlanta;

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