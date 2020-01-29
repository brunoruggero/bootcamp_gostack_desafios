//SOLUÇÃO DO DESAFIO 1 DO BOOTCAMP
/* Sobre o desafio
Crie uma aplicação para armazenar projetos e suas tarefas do zero utilizando Express.

Rotas
POST /projects: A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte 
formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato 
string com aspas duplas.

GET /projects: Rota que lista todos projetos e suas tarefas;

PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;

DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;

POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico 
escolhido através do id presente nos parâmetros da rota;

Exemplo
Se eu chamar a rota POST /projects repassando { id: 1, title: 'Novo projeto' } e a rota POST /projects/1/tasks 
com { title: 'Nova tarefa' }, meu array de projetos deve ficar assim:

[
  {
    id: "1",
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
];
Middlewares
Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto 
com aquele ID existe. Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente;

Crie um middleware global chamado em todas requisições que imprime (console.log) uma contagem de quantas requisições foram feitas 
na aplicação até então;
*/
const express = require('express');
const server = express();

server.use(express.json());


const projetos = [];

//Middleware para verificar se existe o projeto
function checaProjetosExistentes(req, res, next){
  const { id } = req.params;
  const proj = projetos.find(p => p.id == id); // users[req.params.index];
  
  if(!proj){
    return res.status(400).json({ error: 'Projeto não encontrado' });
  }

  return next();
}

//Número de requesições.
function contaRequesicao(req, res, next){
  console.count("Total de requisições.")
  return next();
}
server.use(contaRequesicao);


//retorno todos os projetos
server.get('/projetos', (req, res) => {
  return res.json(projetos);
})

//cadastrar novo projeto
server.post('/projetos', (req, res) => {
  const { id, titulo } = req.body;
  
  const proj = {
    id,
    titulo,
    tarefas: []
  };

  projetos.push(proj);
  
  return res.json(proj);
});

//alterar o titulo com id no parametro da rota
server.put('/projetos/:id', checaProjetosExistentes, (req,res) => {
  const { id } = req.params;
  const { titulo } = req.body;
  
  const proj = projetos.find(p => p.id == id);

  proj.titulo = titulo;

  return res.json(proj);
});

//deletar projeto com o id no parametro da rota
server.delete('/projetos/:id', checaProjetosExistentes, (req, res) =>{
  const { id } = req.params;

  const projetosIndex = projetos.findIndex(p => p.id == id);

  projetos.splice(projetosIndex, 1);

  return res.send();
});

//adicionar nova tarefa em projeto
server.put('/projetos/:id/tarefas', checaProjetosExistentes, (req,res) => {
  const { id } = req.params;
  const { titulo } = req.body;
  
  const proj = projetos.find(p => p.id == id);

  proj.titulo.push(titulo);

  return res.json(proj);
});

//chamada da porta de acesso ao servidor
server.listen(4000);
