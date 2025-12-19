import express from "express";
import { buscarTodos, buscarUm, criar, deletar, editar, pesquisar } from "../controllers/jogosController.mjs"
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: function (req, file, cb) {
        // Gera um nome único: timestamp atual + extensão original do arquivo
        const extensaoArquivo = path.extname(file.originalname);
        const nomeArquivo = `${Date.now()}${extensaoArquivo}`;
        cb(null, nomeArquivo);
    }
});
const upload = multer({ storage });
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

router.post("/pesquisar", async (req, res) => {
    // #swagger.tags = ['Jogos']
    // #swagger.description = 'Pesquisar registros'
    /* #swagger.responses[200] = {
            description: 'Retorna varios registros',
            schema: [{
                id: 1,
                nome: "nome",
                plataforma_id: 1,
                preco_full: 50.00,
                preco_promo: 25.00
            }]
    } */
    res.json(await pesquisar(req.body));
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



router.post("/", upload.single("imagem"), async (req, res) => {
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
    let dados = req.body;
    dados.plataforma_id = parseInt(dados.plataforma_id);
    dados.preco_full = parseFloat(dados.preco_full);
    dados.preco_promo = parseFloat(dados.preco_promo);
    dados.imagem = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json(await criar(dados));
})

router.put("/:id", upload.single("imagem"), async (req, res) => {
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
   let dados = req.body;
   dados.id = parseInt(req.params.id);
    dados.plataforma_id = parseInt(dados.plataforma_id);
    dados.preco_full = parseFloat(dados.preco_full);
    dados.preco_promo = parseFloat(dados.preco_promo);
    dados.imagem = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json(await editar(dados));
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