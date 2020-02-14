//function myclick(){
$(".bt").on("click",function(event){
	var s=$(this).attr('href');
	var t=$(this);
	console.log(s);
	console.log(typeof(s));
	var target=$(s);
	var t2=$(".show");
	
	t2.removeClass("show");
	t2.addClass("disable");
	target.removeClass("disable");
	target.addClass("show");
	$(".active").removeClass("active");
	t.addClass("active");
	event.stopPropagation();
})//};