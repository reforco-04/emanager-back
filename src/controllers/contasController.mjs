import { prisma } from "../services/index.js";

async function buscarTodos(){
    try {
        const contas = await prisma.contas_digitais.findMany();
        
        // Formatar a data para o padrão brasileiro
        return contas;
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

async function buscarUm(id){
    try {
        const request = await prisma.contas_digitais.findFirst({
            where: {
                id: Number(id)
            }
        });
        if(request){
            // Formatar a data para o padrão brasileiro
            return {
                ...request,
                data_nascimento: request.data_nascimento ? 
                    request.data_nascimento.toLocaleDateString('pt-BR') : null
            };
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
        // Verificar se o cliente existe
        if (dados.cliente_id) {
            const clienteExiste = await prisma.clientes.findUnique({
                where: {
                    id: Number(dados.cliente_id)
                }
            });

            if (!clienteExiste) {
                return {
                    tipo: "error",
                    mensagem: `Cliente com ID ${dados.cliente_id} não encontrado. Por favor, verifique o ID do cliente.`
                };
            }
        }

        // Validar e converter a data de nascimento
        let dataNascimento;
        if (dados.data_nascimento) {
            // Se a data estiver no formato DD/MM/YYYY
            if (dados.data_nascimento.includes('/')) {
                const [dia, mes, ano] = dados.data_nascimento.split('/');
                // Verifica se dia, mês e ano são números válidos
                if (dia === '00' || mes === '00' || ano === '0000') {
                    return {
                        tipo: "error",
                        mensagem: "Data de nascimento inválida. Dia, mês e ano não podem ser zero."
                    };
                }
                dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
            } else {
                // Tenta converter diretamente se estiver em outro formato
                dataNascimento = new Date(dados.data_nascimento);
            }

            // Verifica se a data é válida
            if (isNaN(dataNascimento.getTime())) {
                return {
                    tipo: "error",
                    mensagem: "Data de nascimento inválida. Use o formato DD/MM/YYYY (exemplo: 05/11/2023) ou YYYY-MM-DD (exemplo: 2023-11-05)"
                };
            }
            
            // Verifica se a data está dentro de um intervalo razoável
            const anoAtual = new Date().getFullYear();
            const anoNascimento = dataNascimento.getFullYear();
            if (anoNascimento < 1900 || anoNascimento > anoAtual) {
                return {
                    tipo: "error",
                    mensagem: `O ano de nascimento deve estar entre 1900 e ${anoAtual}`
                };
            }
        }

        // Converter store_id para string e formatar a data corretamente
        const dadosFormatados = {
            ...dados,
            store_id: String(dados.store_id),
            data_nascimento: dataNascimento
        };
        
        const request = await prisma.contas_digitais.create({
            data: dadosFormatados
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
        // Validar e converter a data de nascimento
        let dataNascimento;
        if (dados.data_nascimento) {
            // Se a data estiver no formato DD/MM/YYYY
            if (dados.data_nascimento.includes('/')) {
                const [dia, mes, ano] = dados.data_nascimento.split('/');
                dataNascimento = new Date(ano, mes - 1, dia);
            } else {
                // Tenta converter diretamente se estiver em outro formato
                dataNascimento = new Date(dados.data_nascimento);
            }

            // Verifica se a data é válida
            if (isNaN(dataNascimento.getTime())) {
                return {
                    tipo: "error",
                    mensagem: "Data de nascimento inválida. Use o formato DD/MM/YYYY (exemplo: 13/05/1982) ou YYYY-MM-DD"
                };
            }
        }

        // Formatar os dados para atualização
        const dadosFormatados = {
            ...dados,
            store_id: String(dados.store_id),
            data_nascimento: dataNascimento || dados.data_nascimento
        };

        const request = await prisma.contas_digitais.update({
            data: dadosFormatados,
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
        const request =  await prisma.contas_digitais.delete({
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