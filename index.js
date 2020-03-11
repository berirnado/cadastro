const express    = require('express')
var app          = express()
var bodyparser   = require('body-parser')
var Aluno        = require('./model/aluno')
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash        = require('req-flash');

app.use(cookieParser());
app.use(session({ 
    secret: '123',
    resave: true,
    saveUninitialized: true 
}));
app.use(flash());
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
        res.render('listar.ejs',{ listaAlunos: docs, msg:req.flash('msg')})
    })    
})

//read post
app.post('/',function(req,res){
    Aluno.find(
        {
            nome: new RegExp(req.body.pesquisa, 'g')
        },
        function(err,docs){
            res.render('listar.ejs',{listaAlunos: docs, msg:""})
        }
    )
})

//update get/
app.get('/edit/:id',function(req,res){
    Aluno.findById(req.params.id,function(err,docs){
        res.render('editar.ejs',{aluno:docs})
    })
    
})

//update post
app.post('/edit/:id',function(req,res){
    Aluno.findByIdAndUpdate(
        req.body.id,
        {
            nome:req.body.nome,
            endereco:req.body.endereco,
            telefone:req.body.telefone
        },
        function(err,docs){
            if(err){
                req.flash('msg','Problema ao alterar!')
                res.redirect('/')
            }else{
                req.flash('msg','Alterado com sucesso!')
                res.redirect('/')
            }            
        }
    )    
})

//delete get
app.get('/del/:id',function(req,res){
    Aluno.findByIdAndDelete(req.params.id,function(err){
        if(err){
            req.flash('msg','Problema ao excluir!')
            res.redirect('/')
        }else{
            req.flash('msg','Excluido com sucesso!')
            res.redirect('/')
        }
    });
})

app.listen(3001,function(){
    console.log("Estou escutando na porta 3001!!")
})