import { prisma } from "../services/index.js";

async function buscarTodos(){
    try {
        return await prisma.niveis.findMany();
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function buscarUm(id){
    try {
        const request = await prisma.niveis.findFirst({
            where: {
                id: Number(id)
            }
        });
        if(request){
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

async function criar(dados){
    try {
        const request = await prisma.niveis.create({
            data: dados
        });

        if(request){
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

async function editar(dados, id){
    try {
        const request =  await prisma.niveis.update({
            data: dados,
            where: {
                id: Number(id)
            }
        });

        if(request){
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

async function deletar(id){
    try {
        const request =  await prisma.niveis.delete({
            where: {
                id: Number(id)
            }
        });

        if(request){
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
    deletar
}