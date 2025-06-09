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

CREATE TABLE tb_classificacao_botanica (
    classificacao_id VARCHAR(60) PRIMARY KEY,
    classificacao_nome VARCHAR(100) UNIQUE NOT NULL,
    classificacao_descricao TEXT
);

CREATE TABLE tb_plantaEspecie(
plantaEspecie_id VARCHAR(60) PRIMARY KEY UNIQUE,
    plantaEspecie_nome VARCHAR(244),
    plantaEspecie_descricao TEXT,
    plantaEspecie_cuidados TEXT,
    classificacao_id VARCHAR(60),
    FOREIGN KEY (classificacao_id) REFERENCES tb_classificacao_botanica(classificacao_id)
);



CREATE TABLE tb_guiaCuidado (
    guia_id VARCHAR(60) PRIMARY KEY,
    plantaEspecie_id VARCHAR(60),
    titulo VARCHAR(244),
    conteudo TEXT,
    FOREIGN KEY (plantaEspecie_id) REFERENCES tb_plantaEspecie(plantaEspecie_id)
);


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

CREATE TABLE tb_cuidadoNotificacao (
    notificacao_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    frequencia_dias INT NOT NULL,
    data_proxima DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id)
);

CREATE TABLE tb_calculoNutriente (
    calculo_id VARCHAR(60) PRIMARY KEY,
    userPlanta_id VARCHAR(60),
    data_calculo DATETIME,
    resultado_texto TEXT,
    quantidade_sugerida VARCHAR(100),
    FOREIGN KEY (userPlanta_id) REFERENCES tb_userPlanta(userPlanta_id)
);