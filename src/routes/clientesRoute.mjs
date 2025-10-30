import express from "express";
import { buscarTodos, buscarUm, criar, deletar, editar } from "../controllers/clientesController.mjs"

const router = express.Router();

router.get("/", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Retorna todos os registros'
    /* #swagger.responses[200] = {
            description: 'Retorna todos os registros',
            schema: [{
                id: 1,
                nome: "nome",
                email: "email",
                whatsapp: "whatsapp"
            }]
    } */
    res.json(await buscarTodos());
})

router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = 'Retorna um registro'
    /* #swagger.responses[200] = {
            description: 'Retorna um registro',
            schema: {
                id: 1,
                nome: "nome",
                email: "email",
                whatsapp: "whatsapp"
            }
    } */
    res.json(await buscarUm(req.params.id));
})

router.post("/", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = "Cria um registro"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $nome: "Nome",
                    $email: "Email",
                    $whatsapp: "Whatsapp"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */
    res.json(await criar(req.body));
})

router.put("/:id", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = "Atualiza um registro"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $id: 1,
                    $nome: "Nome",
                    $email: "Email",
                    $whatsapp: "Whatsapp"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    res.json(await editar(req.body, req.params.id));
})

router.delete("/:id", async (req, res) => {
    // #swagger.tags = ['Clientes']
    // #swagger.description = "Deleta um registro"
    /* #swagger.responses[200] = {
            description: 'Registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */
    res.json(await deletar(req.params.id));
})

export default router;