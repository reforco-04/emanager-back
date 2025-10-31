import express from "express";
import { buscarTodos, buscarUm, criar, deletar, editar } from "../controllers/jogosController.mjs"

const router = express.Router();

router.get("/", async (req, res) => {
    // #swagger.tags = ['Jogos']
    // #swagger.description = 'Retorna todos os registros'
    /* #swagger.responses[200] = {
            description: 'Retorna todos os registros',
            schema: [{
                id: 1,
                nome: "nome",
                plataforma_id: 1,
                preco_full: 50.00,
                preco_promo: 25.00
            }]
    } */
    res.json(await buscarTodos());
})

router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Jogos']
    // #swagger.description = 'Retorna um registro'
    /* #swagger.responses[200] = {
            description: 'Retorna um registro',
            schema: {
                id: 1,
                nome: "nome",
                plataforma_id: 1,
                preco_full: 50.00,
                preco_promo: 25.00
            }
    } */
    res.json(await buscarUm(req.params.id));
})

router.post("/", async (req, res) => {
    // #swagger.tags = ['Jogos']
    // #swagger.description = "Cria um registro"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $nome: "Nome",
                    $plataforma_id: 1,
                    $preco_full: 50.00,
                    $preco_promo: 25.00
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
    // #swagger.tags = ['Jogos']
    // #swagger.description = "Atualiza um registro"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $id: 1,
                    $nome: "Nome",
                    $plataforma_id: 1,
                    $preco_full: 50.00,
                    $preco_promo: 25.00
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
    // #swagger.tags = ['Jogos']
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