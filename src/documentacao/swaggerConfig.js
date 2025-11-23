import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const porta = 3000
const rota = '/planttool/v1';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlantTool API Documentation',
            version: '1.0.0',
            description: 'Documentação completa da API do PlantTool, que gerencia usuários, espécies e plantas, além de integrar serviços de IA e Clima.',
        },
        servers: [
            {
                url: `http://localhost:${porta}${rota}`,
                description: 'Servidor Local de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT de autenticação para rotas privadas.'
                }
            },
            schemas: {
                UsuarioRegistro: {
                    type: 'object',
                    required: ['nome', 'email', 'senha'],
                    properties: {
                        nome: { type: 'string', example: 'João da Silva', description: 'Corresponde a tb_user.user_nome.' },
                        sobrenome: { type: 'string', example: 'Santos', description: 'Corresponde a tb_user.user_sobrenome.' },
                        email: { type: 'string', format: 'email', example: 'joao.silva@exemplo.com', description: 'Corresponde a tb_user.user_email.' },
                        senha: { type: 'string', format: 'password', example: 'senha_segura123', description: 'Será hasheada e armazenada como tb_user.user_senha.' },
                    }
                },
                CredenciaisLogin: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'joao.silva@exemplo.com' },
                        senha: { type: 'string', format: 'password', example: 'senha_segura123' },
                    }
                },
                Especie: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1, description: 'Corresponde a tb_plantaEspecie.plantaEspecie_id.' },
                        nome: { type: 'string', example: 'Monstera deliciosa (Nome Científico)', description: 'Corresponde a tb_plantaEspecie.plantaEspecie_nome.' },
                        descricao: { type: 'string', example: 'Planta ornamental tropical...', description: 'Corresponde a tb_plantaEspecie.plantaEspecie_descricao.' },
                        cuidados: { type: 'string', example: 'Luz indireta, alta umidade.', description: 'Corresponde a tb_plantaEspecie.plantaEspecie_cuidados.' },
                        classificacao: { type: 'string', example: 'Araceae', description: 'Nome da Classificação Botânica. Corresponde a tb_classificacao_botanica.classificacao_nome.' },
                        rega: { type: 'string', example: '2 vezes por semana', description: 'Intervalo de rega (o DB armazena em horas: tb_plantaEspecie.plantaEspecie_intervalo_rega_horas).' },
                        imagemUrl: { type: 'string', format: 'url', example: '/planttool/v1/especies/imagem/1', description: 'URL para o arquivo de imagem (baseado em tb_plantaEspecie.plantaEspecie_foto).' }
                    }
                },
                PlantaUsuario: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID da planta do usuário (tb_userPlanta.userPlanta_id), tipo VARCHAR/UUID no DB.' },
                        usuarioId: { type: 'string', format: 'uuid', example: '5a5b5c5d-6e6f-7890-1111-222233334444', description: 'ID do usuário proprietário (tb_userPlanta.user_id), tipo VARCHAR/UUID no DB.' },
                        nome: { type: 'string', example: 'Minha Monstrinha', description: 'Nome dado pelo usuário. Corresponde a tb_userPlanta.userPlanta_nome.' },
                        especieId: { type: 'integer', example: 1, description: 'ID da espécie do catálogo. Corresponde a tb_userPlanta.plantaEspecie_id.' },
                        dataPlantio: { type: 'string', format: 'date-time', description: 'Corresponde a tb_userPlanta.data_plantio.' },
                        ultimaRega: { type: 'string', format: 'date-time', description: 'Corresponde a tb_userPlanta.ultima_rega.' },
                        userPlanta_foto: { type: 'string', example: 'uploads/plantas/101_foto.jpg', nullable: true, description: 'Caminho do arquivo de foto da planta (tb_userPlanta.userPlanta_foto).' },
                    }
                },
                ClimaResposta: {
                    type: 'object',
                    properties: {
                        temperatura: { type: 'number', example: 25.5 },
                        unidade: { type: 'string', example: 'C' },
                        umidade: { type: 'number', example: 75 },
                        condicao: { type: 'string', example: 'Parcialmente nublado' }
                    }
                },
                ErroGenerico: {
                    type: 'object',
                    properties: {
                        erro: { type: 'string', example: 'Mensagem de erro detalhada.' }
                    }
                }
            }
        },
    },
    
    // Onde o swagger-jsdoc buscar as anotações
    apis: ['./src/documentacao/documentacaoAPI.yaml'], 
};

const specs = swaggerJsdoc(swaggerOptions)
// Função para ser importada no server.js
export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}