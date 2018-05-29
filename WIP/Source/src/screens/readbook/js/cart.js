$(document).ready(function() {
        $(".cart-product-remove a").click(function(){
          var id_remove = $(".remove").attr("itemprop");
          $.ajax({
            url : "remove-cart.php",
            type : 'post',
            dataType : 'text',
            data : {
                "id_remove"    : id_remove
            },
            success : function(result) {
              alert(result);
            }
          });
        });

        $(".cart-product-thumbnail a").click(function(){
          var image_id =  $(this).attr("itemprop");
          $(this).attr('href', 'product.php?id=' + image_id);
        })
        $(".cart-product-name a").click(function(){
          var image_id =  $(this).attr("itemprop");
          $(this).attr('href', 'product.php?id=' + image_id);
        })

      });