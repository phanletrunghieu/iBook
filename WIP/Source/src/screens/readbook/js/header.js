$(document).ready(function() {

  $(".category li a").click(function(){
    var id_menu =  $(this).attr("itemprop");
    var sort = "default"
    $(this).attr('href', 'category.php?id=' + id_menu + '&sortby='+ sort);
  })

  $(".cart").click(function(){
    window.location.replace("cart.php");
  })

  $("button[data-role='addtocart']").click(function(){
    var amount_cart =  $(".top_cart_qty").text();
    amount_cart = parseInt(amount_cart) + 1;
    $(".top_cart_qty").text(amount_cart);
  })

});
