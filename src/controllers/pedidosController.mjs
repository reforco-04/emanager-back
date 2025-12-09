import { prisma } from "../services/index.js";

async function buscarTodos() {
  try {
    return await prisma.pedidos.findMany({
      include: {
        clientes: true,
        pedidos_jogos: true
      },
    });
  } catch (error) {
    return {
      tipo: "error",
      mensagem: error.message,
    };
  }
}

async function buscarUm(id) {
  try {
    const request = await prisma.pedidos.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (request) {
      return request;
    }
    return {
      tipo: "warning",
      mensagem: "Registro não encontrado",
    };
  } catch (error) {
    return {
      tipo: "error",
      mensagem: error.message,
    };
  }
}

async function criar(dados) {
  try {
    
    const consultas = dados.nome_jogo.map((jogo) => {
      return prisma.jogos.findFirst({
        where: {
          nome: {
            contains: jogo.nome,
          },
          licencas: {
            some: {
              status: "Disponível", 
            },
          },
          plataformas: {
            nome: jogo.plataforma,
          },
        },
        include: {
          plataformas: true,

          licencas: {
            where: {
              status: "Disponível", 
            },
          },
        },
      });
    });

    
    const jogos = await Promise.all(consultas);
    await prisma.pedidos
      .create({
        data: {
          cliente_id: dados.cliente_id,
          valor: dados.valor,
        },
      })
      .then(async (pedidoCriado) => {
        const registros = jogos.map((jogo) => {
          return prisma.pedidos_jogos.create({
            data: {
              pedido_id: pedidoCriado.id,
              jogo_id: jogo.id,
            },
          });
        });
        const jogosInseridos = await Promise.all(registros);
        if (jogosInseridos) {
          return {
            tipo: "success",
            mensagem: "Registro criado com sucesso!",
          };
        }
      });

    
  } catch (error) {
    return {
      tipo: "error",
      mensagem: error.message,
    };
  }
}

async function editar(dados, id) {
  try {
    const request = await prisma.pedidos.update({
      data: dados,
      where: {
        id: Number(id),
      },
    });

    if (request) {
      return {
        tipo: "success",
        mensagem: "Registro atualizado com sucesso!",
      };
    }
  } catch (error) {
    return {
      tipo: "error",
      mensagem: error.message,
    };
  }
}

async function deletar(id) {
  try {
    const request = await prisma.pedidos.delete({
      where: {
        id: Number(id),
      },
    });

    if (request) {
      return {
        tipo: "success",
        mensagem: "Registro deletado com sucesso!",
      };
    }
  } catch (error) {
    return {
      tipo: "error",
      mensagem: error.message,
    };
  }
}

export { buscarTodos, buscarUm, criar, editar, deletar };
