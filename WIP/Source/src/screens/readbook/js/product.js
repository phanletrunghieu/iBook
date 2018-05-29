$(document).ready(function() {
 	changeImage();
 	changeNumber();
 	var addSelectedColor = $(".color ul li");
 	var addSelectedSize = $(".size ul li");
 	addSelected(addSelectedColor);
 	addSelected(addSelectedSize);

 	$('.buynow').click(function (){
		var id_product = $('.id_product').text();
		var color_choose= $('.color ul li[class=selected] span').text();
		var size_choose = $('.size ul li[class=selected] span').text();
		var amount =$(".qty").val();
		var price =$(".product-price ins").attr("itemprop");
	    $.ajax({
	        url : "add-cart.php",
	        type : 'post',
	        dataType : 'text',
	        data : {
	            "id_product"  	: id_product,
	            "color_choose" 	: color_choose,
	            "size_choose"	: size_choose,
	            "amount"		: amount,
	            "price"		: price
	        },
	        success : function(result) {
	        	alert(result);
	        	window.location.replace("cart.php");
	  		}
	    });
	});

});
function changeImage(){
	$(".ega-product-img").click(function(){
		var src = $(this).attr("src");
		$("img[itemprop='photos']").attr("src",src);
	});
}
function changeNumber(){
	$(".plus").click(function(){
		var number =  $("#product_quantity").attr("value");
		var plus =  parseInt(number,10) + 1;
		$("#product_quantity").attr("value",plus);
	});
	$(".minus").click(function(){
		var number =  $("#product_quantity").attr("value");
		var minus =  parseInt(number,10) - 1;
		if(minus < 1){
			minus = 1;
		}
		$("#product_quantity").attr("value",minus);
	});
}
function removeSelected(element){
	element.removeClass("selected");
}
function addSelected(element){
	element.click(function(){
		removeSelected(element);
	 	$(this).addClass("selected");
	});
}
