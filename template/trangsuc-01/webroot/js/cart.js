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
        })

        // event add to cart in detail page
        $(document).on('click', '.btn-add-cart-two,.btn-installment', function (event) {
            var item_id = $(this).attr('item-id');
            if (item_id == null) item_id = 0;
            var quantity = parseInt($.trim($('.num-quantity').val()));
            var installment = typeof ($(this).data('installment')) != 'undefined' ? $(this).data('installment') : '';
            if (quantity > 0) {
                var data_post = {
                    item_id: item_id,
                    quantity: quantity,
                    installment: installment
                };
                self.addToCart(data_post);
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


var payment_installment = {
    data: {
        payment_code: '',
        bank_code: '',
        card: '',
        month: ''
    },
    label: {
        month: 'tháng'
    },
    info_installment: {},
    init: function (option) {
        var self = this;

        if (typeof (option.payment_code) != 'undefined') {
            self.data.payment_code = option.payment_code;
        }

        if (typeof (option.label) != 'undefined') {
            self.label = option.label;
        }
        // select bank
        $(document).on('click', '#list-banks-installment li', function (event) {
            $('#list-banks-installment li').removeClass('active');
            $('#list-cards-installment li').removeClass('active');
            $('#list-month-installment li').removeClass('active');

            $(this).addClass('active');
            var str_cards = typeof ($(this).data('card')) != 'undefined' ? $(this).data('card') : '';
            var bank_code = typeof ($(this).data('code')) != 'undefined' ? $(this).data('code') : '';
            self.data.bank_code = bank_code;
            self.showCards(str_cards);
        });

        // select card
        $(document).on('click', '#list-cards-installment li', function (event) {
            $('#list-cards-installment li').removeClass('active');
            $('#list-month-installment li').removeClass('active');
            $(this).addClass('active');
            var card = typeof ($(this).data('card')) != 'undefined' ? $(this).data('card') : '';
            self.data.card = card;
            self.loadInfoInstallment(self.data);
        });

        // select month
        $(document).on('click', '#list-month-installment li', function (event) {
            $('#list-month-installment li').removeClass('active');
            $(this).addClass('active');
            var month = typeof ($(this).data('month')) != 'undefined' ? $(this).data('month') : '';
            self.data.month = month;
            var data = typeof (self.info_installment[month]) != 'undefined' ? self.info_installment[month] : {};
            self.showDetailInstallment(data);
        });


        $(document).on('click', '#btn-pay-installment', function (event) {
            if (self.data.bank_code == '') {
                nh_functions.showAlertGritter('error', 'Bạn chưa chọn ngân hàng');
                return false;
            }

            if (self.data.card == '') {
                nh_functions.showAlertGritter('error', 'Bạn chưa chọn loại thẻ');
                return false;
            }

            if (self.data.month == '') {
                nh_functions.showAlertGritter('error', 'Bạn chưa chọn số tháng thanh toán');
                return false;
            }

            self.payInstallment();
        });
    },

    showCards: function (str_cards) {
        $('#list-cards-installment li').addClass('hidden');
        var list_cards = str_cards.split(',');
        if (!$.isEmptyObject(list_cards)) {
            $('#list-cards-installment li').each(function (index) {
                var card = $(this).data('card');
                if ($.inArray(card, list_cards) > -1) {
                    $(this).removeClass('hidden');
                }
            });
        }
    },

    loadInfoInstallment: function () {
        var self = this;
        nh_functions.showLoadingPage();
        $.ajax({
            async: true,
            url: '/orders/Orders/loadInfoInstallment',
            type: 'POST',
            dataType: 'json',
            data: {data: self.data},
            success: function (response) {
                if (!$.isEmptyObject(response)) {
                    self.info_installment = response;
                    self.showMonthInstallment(response);
                }
                nh_functions.hiddenLoadingPage();
            },
            error: function (response, json, errorThrown) {

            }
        });
    },

    showMonthInstallment: function (response) {
        var self = this;
        var html_month = '';
        var i = 0;
        $.each(response, function (index, value) {
            var active = '';
            if (i == 0) {
                active = 'active';
                self.data.month = index;
                self.showDetailInstallment(value);
            }
            var month = typeof (value.month) != 'undefined' ? value.month : '';
            if (month > 0) {
                html_month += '<li data-month="' + value.month + '" class="' + active + '"><a>' + value.month + ' ' + self.label.month + '</a></li>';
            }

            i++;
        });

        $('#list-month-installment').removeClass('hidden');
        $('#list-month-installment .wrap-month').html(html_month);
    },

    showDetailInstallment: function (data) {
        if (!$.isEmptyObject(data)) {
            var wrap = $('#info-installment');
            wrap.find('.month').text(data.month);
            wrap.find('.amout-by-month').text(nh_functions.formatMoney(data.amount_by_month));
            wrap.find('.amount-fee').text(nh_functions.formatMoney(data.amount_fee));
            wrap.find('.amount-final').text(nh_functions.formatMoney(data.amount_final));
        }
    },

    payInstallment: function () {
        var self = this;
        nh_functions.showLoadingPage();
        $.ajax({
            async: true,
            url: '/orders/Orders/payInstallment',
            type: 'POST',
            dataType: 'json',
            data: {data: self.data},
            success: function (response) {
                nh_functions.hiddenLoadingPage();
                if (response.code == 1) {
                    nh_functions.showAlertGritter('success', response.messages, 1000);
                } else {
                    nh_functions.showAlertGritter('error', response.messages, 1000);
                }

                if (response.router.length > 0) {
                    setTimeout(function () {
                        window.location.href = response.router;
                    }, 1200);
                }

            },
            error: function (response, json, errorThrown) {

            }
        });
    }
}

var promotion_functions = {
    checkCouponCode: function (coupon_code, arr_product_id) {
        nh_functions.showLoadingPage();
        $.ajax({
            url: '/orders/Orders/checkCouponCode',
            type: 'POST',
            async: false,
            data: {
                coupon_code: coupon_code,
                arr_product_id: arr_product_id
            },
            dataType: 'json',
            success: function (response) {

                if (response.code == 'success') {
                    setTimeout(function () {
                        promotion_functions.reloadPage();
                    }, 500);

                } else {
                    nh_functions.hiddenLoadingPage();
                    nh_functions.showAlertGritter('error', response.messages);
                }
            },
            error: function (response, json, errorThrown) {
                nh_functions.hiddenLoadingPage();
            }
        });
    },

    reloadPage: function () {
        location.reload();
    },
    goBack: function () {
        window.history.back();
    }
}
