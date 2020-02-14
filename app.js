var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override");
var express=require("express");
var app=express();

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true, useUnifiedTopology:true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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


app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Server is listening");
});