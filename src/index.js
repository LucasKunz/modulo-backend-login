import express from 'express'
const crypto = require('node:crypto');

const app = express()

app.use(express.json())

app.listen(8080, () => {
  console.log('Servidor iniciado 🚀')
})

app.get('/', (request, response) => {
  return response.json('OK')
})

const listaUsuarios = []

app.post('/user', (request, response) => {
  const dados = request.body

  //Considerando que já validamos os dados

  const novoUsuario = {
    // id: new Date().getTime(),
    id: crypto.randomUUID(),
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    logado: false,
  }

  listaUsuarios.push(novoUsuario)

  return response.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: novoUsuario
  })
})

app.post('/login', (request, response) => {
  const dadosDoUsuario = request.body

  const emailCorreto = listaUsuarios.some((user) => user.email === dadosDoUsuario.email)

  const senhaCorreta = listaUsuarios.some((user) => user.senha === dadosDoUsuario.senha)

  if (!emailCorreto || !senhaCorreta) {
    return response.status(400).json({
      success: false,
      message: 'Email ou senha estao incorretos',
      data: {}
    })
  }

  listaUsuarios.forEach(usuario => usuario.logado = false)

  const user = listaUsuarios.find((user) => user.email === dadosDoUsuario.email)

  user.logado = true

  return response.json({
    success: true,
    message: 'Usuário logado com sucesso',
    data: {}
  })
})

const listaRecados = [

]

app.post('/recados', (request, response) => {
  const dados = request.body

  const usuario = listaUsuarios.find(user => user.logado === true)

  if (!usuario) {
    return response.status(400).json({
      success: false,
      message: 'Necessario fazer login para criar um post',
      data: {}
    })
  }

  //Fazer validacao dos dados do recado

  const novoRecado = {
    id: crypto.randomUUID(),
    titulo: dados.titulo,
    descricao: dados.descricao,
    autor: usuario
  }

  listaRecados.push(novoRecado)

  console.log(listaRecados)

  return response.status(201).json({
    success: true,
    message: 'Recado criado com sucesso',
    data: novoRecado
  })
})

// Path Params ou Route Params
app.delete('/recados/:id', (request, response) => {
  const params = request.params

  const recadoExiste = listaRecados.findIndex(recado => recado.id === params.id)

  if (recadoExiste < 0) {
    return response.status(400).json('recado nao encontrado')
  }

  listaRecados.splice(recadoExiste, 1)

  console.log(listaRecados)

  return response.json('ok')
})

