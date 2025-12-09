import { prisma } from "../services/index.js";

async function buscarTodos() {
  try {
    return await prisma.pedidos.findMany({
      include: {
        clientes: true,
        pedidos_jogos: {
          include: {
            licencas: {
              include: {
                jogos: true,
                contas_digitais: true
              }
            }
          }
        }

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
    const pedidoCriado = await prisma.pedidos.create({
      data: {
        cliente_id: dados.cliente_id,
        valor: dados.valor,
      },
    });

    const registros = dados.licencas.map((licenca) => {
      return prisma.pedidos_jogos.create({
        data: {
          pedido_id: pedidoCriado.id,
          licenca_id: licenca,
        },
      });
    });

    const licencasInseridos = await Promise.all(registros);
    let mudarStatus = [];

    if (licencasInseridos.length > 0) {
      mudarStatus = dados.licencas.map((licenca) => {
        return prisma.licencas.update({
          where: {
            id: Number(licenca)
          },
          data: {
            status: "Locada"
          },
        });
      });
    }

    const statusAlterados = await Promise.all(mudarStatus)
    
    if (statusAlterados.length > 0) {
      return {
        tipo: "success",
        mensagem: "Registro criado com sucesso!",
      };
    }
    return {
      tipo: "error",
      mensagem: "Não foi possível inserir as licenças.",
    };



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

    await prisma.pedidos_jogos.deleteMany({
      where: {
        pedido_id: Number(id)
      }
    })

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
