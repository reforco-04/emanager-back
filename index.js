import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import docJson from "./src/docs/documentacao.json" with {type: "json"}

import niveisRoute from "./src/routes/niveisRoute.mjs";
import plataformaRoute from "./src/routes/plataformaRoutes.mjs";
import clientesRoute from "./src/routes/clientesRoute.mjs";
import jogosRoute from "./src/routes/jogosRoute.mjs";
import usuariosRoute from "./src/routes/usuariosRoute.mjs";
import contasRoute from "./src/routes/contasRoute.mjs";
import { login } from "./src/controllers/usuarioController.mjs";
import licencasRoute from "./src/routes/licencasRoute.mjs";
import contasDigitaisJogosRoute from "./src/routes/contasDigitaisJogosRoute.mjs";
import { rotaProtegida } from "./src/utils/index.mjs";
import pedidosRoute from "./src/routes/pedidosRoutes.mjs";


const app = express();

// Middleware - interceptores
app.use(cors()); //libera requisições externas
app.use(express.json()); //transforma o corpo da requisição em javascript
app.use('/docs', swaggerUi.serve, swaggerUi.setup(docJson));

// Rotas

app.get("/", (req, res) => {
    res.redirect("/docs");
})
app.post("/login", async (req, res) => {
    // #swagger.tags = ['Usuarios']
    // #swagger.description = "Realiza o login do usuário"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $email: "email", 
                    $senha: "senha"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Login realizado',
            schema: {
                usuario: 'Dados do usuário'
                
            }
    } */
    res.json(await login(req.body));
});
app.use("/niveis", niveisRoute);
app.use("/plataformas", rotaProtegida, plataformaRoute);
app.use("/clientes", rotaProtegida, clientesRoute);
app.use("/jogos", rotaProtegida, jogosRoute);
app.use("/usuarios", rotaProtegida, usuariosRoute);
app.use("/licencas", rotaProtegida, licencasRoute);
app.use("/contas", rotaProtegida, contasRoute);
app.use("/contas-digitais", rotaProtegida, contasDigitaisJogosRoute);
app.use("/pedidos", rotaProtegida, pedidosRoute);

app.listen(8000, () => {
    console.log(`Servidor on: http://localhost:8000`);
})