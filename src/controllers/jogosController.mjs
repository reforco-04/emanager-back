import { prisma } from "../services/index.js";

async function buscarTodos() {
    try {
        return await prisma.jogos.findMany({
            include: {
                plataformas: true,
                licencas: true
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
        const request = await prisma.jogos.findFirst({
            where: {
                id: Number(id)
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

async function pesquisar(dados) {
    try {
        const request = await prisma.jogos.findMany({
            where: {
                nome: {
                    contains: dados.nome
                },
                plataformas: {
                    nome: {
                        contains: dados.plataforma
                    }
                },
                licencas: {
                    some: {
                        status: "Disponível",
                        tipo: dados.tipo
                    }
                }
            },
            include: {
                plataformas: true,
                licencas: {
                    where: {
                        status: "Disponível",
                        tipo: dados.tipo
                    },
                    take: 1,
                    orderBy: {
                        id: "asc"
                    }
                }
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
        const request = await prisma.jogos.create({
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
        const request = await prisma.jogos.update({
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
        const request = await prisma.jogos.delete({
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

export {
    buscarTodos,
    buscarUm,
    criar,
    editar,
    deletar,
    pesquisar
}