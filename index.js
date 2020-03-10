const express = require('express')
var app = express()
var bodyparser = require('body-parser')
var Aluno = require('./model/aluno')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.set('view engine','ejs')


//ROUTES
//create get (OK)
app.get('/add',function(req,res){
    res.render('adicionar.ejs',{msg:''})
})

//create post (OK)
app.post('/add',function(req,res){
    var aluno = new Aluno({
        nome: req.body.nome,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    })
    aluno.save(function(err){
        if(err){
            res.render("adicionar.ejs",{msg: err})
        }else{
            res.render('adicionar.ejs',{msg: "Adicionado com sucesso!"})
        }
    })
})

//read get (OK)
app.get('/',function(req,res){
    Aluno.find({}).exec(function(err,docs){
        res.render('listar.ejs',{ listaAlunos: docs, msg:"" })
    })    
})

//read post
app.post('/',function(req,res){
    res.render('listar.ejs',{})
})

//update get/
app.get('/edit/:id',function(req,res){
    res.render('editar.ejs',{})
})

//update post
app.post('/edit/:id',function(req,res){
    res.render('editar.ejs',{
        Aluno.findByIdAndUpdate(
            req.body.i,{
                nome: req.body.nome,
                endereco: req.body.endereco,
                telefone: req.body.telefone
            },
        )
})

//delete get
app.get('/del/:id',function(req,res){
    Aluno.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    });
})


app.listen(3000,function(){
    console.log("Estou escutando na porta 3000!!")
})
