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
