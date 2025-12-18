import { prisma } from "../services/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function buscarTodos() {
    try {
        return await prisma.usuarios.findMany({
            omit: {
                senha: true
            },
            include: {
                niveis: true
            }
        });
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function buscarUm(id) {
    try {
        const request = await prisma.usuarios.findFirst({
            where: {
                id: Number(id)
            },
            omit: {
                senha: true
            }
        });
        if (request) {
            return request;
        }
        return {
            tipo: "warning",
            mensagem: "Registro não encontrado"
        }

    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function criar(dados) {
    try {
        dados = {
            ...dados,
            senha: await bcrypt.hash(dados.senha, 10)
        }
        const request = await prisma.usuarios.create({
            data: dados
        });

        if (request) {
            return {
                tipo: "success",
                mensagem: "Registro criado com sucesso!"
            }
        }
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function editar(dados, id) {
    try {
        dados = {
            ...dados,
            senha: await bcrypt.hash(dados.senha, 10)
        }
        const request = await prisma.usuarios.update({
            data: dados,
            where: {
                id: Number(id)
            }
        });

        if (request) {
            return {
                tipo: "success",
                mensagem: "Registro atualizado com sucesso!"
            }
        }
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function deletar(id) {
    try {
        const request = await prisma.usuarios.delete({
            where: {
                id: Number(id)
            }
        });

        if (request) {
            return {
                tipo: "success",
                mensagem: "Registro deletado com sucesso!"
            }
        }
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function login(dados) {
    try {
        const usuario = await prisma.usuarios.findFirst({
            where: {
                email: dados.email
            },
            include: {
                niveis: true
            }
        });
        if (!usuario) {
            return {
                tipo: "warning",
                mensagem: "Usuário não encontrado!"
            }
        }
        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
        if (!senhaValida) {
            return {
                tipo: "warning",
                mensagem: "Usuário ou Senha inválida!"
            }
        }
        delete usuario.senha;
        const token = jwt.sign({ data: usuario.id }, process.env.SEGREDO, { expiresIn: '1h' });

        return {
            usuario,
            token
        }

    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function dadosDashboard() {
    try {
        const pedidos = await prisma.pedidos.findMany({
            where: {
                status: {
                    equals: "Pagamento Aprovado"
                }
            },
            orderBy: {
                data: "asc"
            }
        });

        const contas = await prisma.contas_digitais.count();
        const licencas = await prisma.licencas.count();
        const licencasAlugadas = await prisma.licencas.count({
            where: {
                status: {
                    equals: "Locada"
                }
            }
        });
        const licencasLivres = await prisma.licencas.count({
            where: {
                status: {
                    not: "Locada"
                }
            }
        });
        // const top10 = await prisma.licencas.groupBy({
        //     by: ['jogo_id'],
        //     where: {
        //         status: 'Locada',
        //     },
        //     _count: {
        //         id: true,
        //     },
        //     orderBy: {
        //         _count: {
        //             id: 'desc',
        //         },
        //     },
        //     take: 10
        // });

        // const top10Jogos = top10.map(jogo => {
        //     return prisma.jogos.findFirst({
        //         where: {
        //             id: jogo.id
        //         }
        //     })
        // })

        const top10 = await prisma.$queryRaw`
            SELECT 
                j.nome AS jogo,
                p.nome AS plataforma,
                CAST(COUNT(l.id) AS UNSIGNED) AS total
            FROM licencas l
            INNER JOIN jogos j ON j.id = l.jogo_id
            INNER JOIN plataformas p ON p.id = j.plataforma_id
            WHERE l.status = 'Locada'
            GROUP BY j.id
            ORDER BY total DESC
            LIMIT 10
        `;
        const top10Formatado = top10.map(item => ({
            ...item,
            total: Number(item.total)
        }));

        let datas = [];
        let valores = [];

        pedidos.map(pedido => {
            let data = pedido.data.toLocaleDateString("pt-BR");
            if (!datas.includes(data)) {
                datas.push(data);
                valores.push(Number(pedido.valor));
                return;
            } else {
                datas.map((d, index) => {
                    if (d == data) {
                        valores[index] += Number(pedido.valor);
                    }
                });
            }
            return;
        })
        return {
            datas,
            valores,
            quantidade: pedidos.length,
            total: valores.reduce((total, valor) => total + valor, 0),
            contas,
            licencas,
            licencasAlugadas,
            licencasLivres,
            taxaOcupacao: (licencasAlugadas / licencas) * 100,
            top10: top10Formatado
        };
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}



export {
    buscarTodos,
    buscarUm,
    criar,
    editar,
    deletar,
    login,
    dadosDashboard
}

