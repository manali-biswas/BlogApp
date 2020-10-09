const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const expressSanitizer=require("express-sanitizer");
const expressSession=require('express-session');
const methodOverride=require("method-override");
const express=require("express");
const app=express();
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./public/user');
const atlas='mongodb+srv://manali:c7qb6g7aEBZ9PFt@cluster0-crogt.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGODB_URL||atlas,{useNewUrlParser:true, useUnifiedTopology:true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.use(expressSession({
	secret:"Manali",
	resave:false,
	saveUninitialized:false
	}));
	
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

var blogSchema= new mongoose.Schema({
	title : String,
	image : String,
	body : String,
	created : {type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);



app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/about",function(req,res){
	res.render("home");
});

app.get("/login",function(req,res){
	res.render('login');
});

app.post("/login",
	passport.authenticate("local",{
		successRedirect:"/blogs",
		failureRedirect:"/blogs"
	}));

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/blogs');
})

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});	
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog)
				 {
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:blog});
		}
	});
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:blog});
		}
	});	
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

app.post("/blogs",function(req,res){	
	var blog=req.body.blog;
	blog.body=req.sanitize(blog.body);
	Blog.create(blog,function(err,blog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/<%=req.params.id%>");
		}
	});
});
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
});


app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server is listening");
});