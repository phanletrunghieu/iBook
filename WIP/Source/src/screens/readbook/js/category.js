
$(document).ready(function() {

  $(".panel-heading").click(function(){
    $("#filter_group").toggle();
});

  $(".widget_links a h4").click(function(){
  	var group = $(this).attr("class");
    $("#filter_" + group).toggle();
    $("#filter_" + group).removeClass("filter_list");
  });

  var amountProduct = $(".product").size();
  	$('#amount_product').text("Có " + amountProduct + " sản phẩm");
  });

  function sortby(id_menu){
	var id_menu = id_menu;
	var sortby = $(".sort").val();  
	window.location.replace("category.php?id="+ id_menu + "&sortby="+ sortby);
  }
var body = $("html, body");
body.stop().animate({scrollTop:500}, 500, 'swing', function() { });