var nh_cart = {
    show_modal: true,
    init: function () {
        var self = this;

        // event add to cart on list
        $(document).on('click', '.btn-shop-cart', function () {

            var item_id = $(this).attr('item-id');
            if (item_id == null) item_id = 0;
            var data_post = {
                item_id: item_id,
                quantity: 1,
            };

            self.addToCart(data_post);
            loadCartNumber();

            fbq('trackCustom', 'AddToCart', {product: '' + item_id});
        })

        // event add to cart in detail page
        $(document).on('click', '.btn-add-cart-two', function (event) {
            var item_id = $(this).attr('item-id');
            if (item_id == null) item_id = 0;
            var quantity = parseInt($.trim($('.num-quantity').val()));
            if (quantity > 0) {
                var data_post = {
                    item_id: item_id,
                    quantity: quantity,
                };
                self.addToCart(data_post);
                loadCartNumber();

                fbq('trackCustom', 'AddToCart', {product: '' + item_id});
            } else {
                var message = global_lang.messages_please_select_quantity;
                nh_functions.showAlertGritter('error', message);
                return false;
            }
        });

        // event change quantity in order
        $(document).on('change', '.input-cart', function () {
            var item_id = $(this).attr('item-id');
            if (item_id == null) {
                return
            }
            console.log('change cart ', item_id)
            var quantity = parseInt($.trim($(this).val()));

            const data_post = {
                item_id: item_id,
                quantity: quantity > 0? quantity : 1,
                change_quantity: true,
            }
            // not show modal
            self.show_modal = false;

            self.addToCart(data_post);
        });

        // delete item in order
        $(document).on('click', '.delete-order', function (event) {
            const product_id = $(this).attr('product-id')
            console.log('call delete-order ', product_id)

            var cartStorage = window.localStorage.getItem("cart");
            if (cartStorage != undefined && cartStorage != null) {
                var cartStorageJson = JSON.parse(cartStorage)

                for (let i = 0; i < cartStorageJson.length; i++) {
                    if (cartStorageJson[i].item_id == product_id) {
                        cartStorageJson.splice(i, 1)
                    }
                }
            }

            window.localStorage.setItem("cart", JSON.stringify(cartStorageJson));
            loadCart();
        });
    },
    addToCart: function (data_post) {
        console.log('call addToCart', data_post)
        var self = this;
        nh_functions.showLoadingPage();

        var objReturn = []

        var cartStorage = window.localStorage.getItem("cart");
        if (cartStorage != undefined && cartStorage != null) {
            var cartStorageJson = JSON.parse(cartStorage)

            let isProductAdded = false
            for (let i = 0; i < cartStorageJson.length; i++) {
                const objCart = cartStorageJson[i]
                if (objCart.item_id == data_post.item_id) {
                    //da co sp
                    if(data_post.change_quantity){
                        objCart.quantity = data_post.quantity
                    }else {
                        objCart.quantity += data_post.quantity
                    }
                    isProductAdded = true
                }
            }
            if (isProductAdded) {
                objReturn = cartStorageJson
            } else {
                //chua co sp do trong cart
                objReturn = [...cartStorageJson, data_post]
            }
        } else {
            objReturn = [data_post]
        }

        window.localStorage.setItem("cart", JSON.stringify(objReturn));

        //lấy detail product
        let productDetail = null
        for (let i = 0; i < listProduct.length; i++) {
            if (listProduct[i].id == data_post.item_id) {
                productDetail = listProduct[i]
            }
        }

        if (productDetail == null) {
            nh_functions.hiddenLoadingPage();
            console.log('Khong lay dc chi tiet sp ', data_post.item_id)
            return
        }

        nh_functions.hiddenLoadingPage();
        if (self.show_modal) {
            self.showModalProductAddToCart(productDetail);
        } else {
            window.location = window.location.href;
        }
    },

    showModalProductAddToCart: function (item_add) {
        var self = this;
        var modal = $('#add-cart-modal')

        // show info add to cart
        if (!$.isEmptyObject(item_add)) {

            console.log(item_add)
            modal.find('.product-name-modal').text(item_add.name);
            // modal.find('.price-modal').text(nh_functions.formatMoney(item_add.price));
            // modal.find('.price-sale-modal').toggleClass('hidden', item_add.price_sale == 0 ? true : false).text(nh_functions.formatMoney(item_add.price_sale));
            modal.find('.price-modal').text(nh_functions.formatMoney(item_add.price));
            modal.find('.price-sale-modal')
                .toggleClass('hidden', item_add.price_sale == 0 ? true : false)
                .text(nh_functions.formatMoney(item_add.price_sale));
            modal.find('.image-cart-modal a').attr('href', item_add.url);
            modal.find('.image-cart-modal img').attr('src', item_add.thumb);
        }

        // show modal
        modal.modal('show');

    },
}
