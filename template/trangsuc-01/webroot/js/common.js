var city = [{
    id: "1",
    name: "Hà nội"
}];

var listProduct = [
    //cat 1
    {
        id: 1,
        name: 'Sun & Moon',
        trademark: 'TotWoo', //thương hiệu
        price: 12345,
        price_sale: 12345,
        color: '',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/totwoo_sun_moon.png',
        pictures: [
            "uploads/tiny_uploads/totwoo_sun_moon.png",
            "uploads/tiny_uploads/totwoo_sun_moon.png",
            "uploads/tiny_uploads/totwoo_sun_moon.png"
        ],
        category: 1,
        url: 'detail-sun-moon.html'
    },
    {
        id: 2,
        name: 'Bộ Vòng tay & Dây chuyền',
        trademark: 'TotWoo', //thương hiệu
        price: 123456,
        price_sale: 123645,
        color: '',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/totwoo_vongtay_daychuyen.jpg',
        pictures: [
            "uploads/tiny_uploads/totwoo_vongtay_daychuyen.jpg",
            "uploads/tiny_uploads/totwoo_vongtay_daychuyen.jpg",
            "uploads/tiny_uploads/totwoo_vongtay_daychuyen.jpg"
        ],
        category: 1,
        url: 'detail-sun-moon.html'
    },
    {
        id: 3,
        name: 'Flower & Leaves',
        trademark: 'TotWoo', //thương hiệu
        price: 122345,
        price_sale: 121345,
        color: '',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/totwoo_flower_leaves.jpg',
        pictures: [
            "uploads/tiny_uploads/totwoo_flower_leaves.jpg",
            "uploads/tiny_uploads/totwoo_flower_leaves.jpg",
            "uploads/tiny_uploads/totwoo_flower_leaves.jpg"
        ],
        category: 1,
        url: 'detail-sun-moon.html'
    },

    //cat 2
    {
        id: 4,
        name: 'Wing Bling Flower Me Earings',
        trademark: 'Wing Bling', //thương hiệu
        price: 480000,
        price_sale: 525000,
        color: 'Hồng / Bạc',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/wing_bling_flower_me_earing.jpg',
        pictures: [
            "uploads/tiny_uploads/wing_bling_flower_me_earing.jpg",
            "uploads/tiny_uploads/wing_bling_flower_me_earing.jpg",
            "uploads/tiny_uploads/wing_bling_flower_me_earing.jpg"
        ],
        category: 2,
        url: 'detail-sun-moon.html'
    },
    {
        id: 5,
        name: 'Wing Bling Snowflake Earings',
        trademark: 'Wing Bling', //thương hiệu
        price: 380000,
        price_sale: 480000,
        color: 'Bạc / Hồng',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/wing_bling_snowflake.jpg',
        pictures: [
            "uploads/tiny_uploads/wing_bling_snowflake.jpg",
            "uploads/tiny_uploads/wing_bling_snowflake.jpg",
            "uploads/tiny_uploads/wing_bling_snowflake.jpg"
        ],
        category: 2,
        url: 'detail-sun-moon.html'
    },
    {
        id: 6,
        name: 'Wing Bling Petite Dress Necklace',
        trademark: 'Wing Bling', //thương hiệu
        price: 450000,
        price_sale: 6500000,
        color: 'Pink',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/wing_bling_petite_dress_necklace.jpg',
        pictures: [
            "uploads/tiny_uploads/wing_bling_petite_dress_necklace.jpg",
            "uploads/tiny_uploads/wing_bling_petite_dress_necklace.jpg",
            "uploads/tiny_uploads/wing_bling_petite_dress_necklace.jpg"
        ],
        category: 2,
        url: 'detail-sun-moon.html'
    },

    //cat 3
    {
        id: 7,
        name: 'Coach Floral Eau De Parfum 30ml',
        trademark: 'Coach', //thương hiệu
        price: 1399000,
        price_sale: 190000,
        color: 'Hồng / Bạc',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/coach_floral_eau.jpg',
        pictures: [
            "uploads/tiny_uploads/coach_floral_eau.jpg",
            "uploads/tiny_uploads/coach_floral_eau.jpg",
            "uploads/tiny_uploads/coach_floral_eau.jpg"
        ],
        category: 3,
        url: 'detail-sun-moon.html'
    },
    {
        id: 8,
        name: 'Salvatore Ferragamo Signorina In Flore 20ml',
        trademark: 'Salvatore', //thương hiệu
        price: 980000,
        price_sale: 1600000,
        color: 'Bạc / Hồng',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/salvatore_ferragamo_signorina_in_flore.jpg',
        pictures: [
            "uploads/tiny_uploads/salvatore_ferragamo_signorina_in_flore.jpg",
            "uploads/tiny_uploads/salvatore_ferragamo_signorina_in_flore.jpg",
            "uploads/tiny_uploads/salvatore_ferragamo_signorina_in_flore.jpg"
        ],
        category: 3,
        url: 'detail-sun-moon.html'
    },
    {
        id: 9,
        name: 'Guess Girl 30ml',
        trademark: 'Guess', //thương hiệu
        price: 850000,
        price_sale: 16500000,
        color: 'Pink',
        material: 'Hàng chính hãng', //chất liệu
        thumb: 'uploads/tiny_uploads/guess_girl.jpg',
        pictures: [
            "uploads/tiny_uploads/guess_girl.jpg",
            "uploads/tiny_uploads/guess_girl.jpg",
            "uploads/tiny_uploads/guess_girl.jpg"
        ],
        category: 3,
        url: 'detail-sun-moon.html'
    },
]

function loadCart() {
    var cart = window.localStorage.getItem("cart");
    if (cart != undefined && cart != null) {
        var cartJson = JSON.parse(cart);
        console.log('load cart ', cartJson);

        if (cartJson.length == 0) {
            $('.card-empty').show();
            $('#list-product-item-order').empty();
            $('.mini-cart-order .number').text(nh_functions.formatMoney(0));
            $("#total_price_final").text(nh_functions.formatMoney(0));
        } else {
            $('.card-empty').hide();
            $('#list-product-item-order').empty();

            let totalAmount = 0;
            let totalQuantiry = 0;
            cartJson.forEach(function (item) {
                //lấy detail product
                let productDetail = null
                for (let i = 0; i < listProduct.length; i++) {
                    if (listProduct[i].id == item.item_id) {
                        productDetail = listProduct[i]
                    }
                }

                if (productDetail != null) {
                    totalAmount += item.quantity * productDetail.price;
                    totalQuantiry += item.quantity;

                    var html = '<div class="media position-relative product-item-order">'
                    html += '<a class="product-item-info delete-order pull-right" title="Xóa" product-id="' + productDetail.id + '" item-id="' + productDetail.id + '" style="cursor: pointer;"> <i class="fa fa-times"></i> </a>';
                    html += '<div class="media-left">';
                    html += '<a href="' + productDetail.url + '" class="img-80">';
                    html += '<img src="' + productDetail.thumb + '" />';
                    html += '</a>';
                    html += '</div>';
                    html += '<div class="media-body">';
                    html += '<div class="price-well">' + productDetail.price + '</div>';
                    html += '<p class="price-before"><span>' + productDetail.price_sale + '</span></p>';
                    html += '<h4 class="media-heading"><a href="' + productDetail.url + '"> ' + productDetail.name + ' </a></h4>';
                    html += '<label class="hidden">Số lượng</label>';
                    html += '<div class="order-quantity">';
                    html += '<p>Số lượng:</p>';
                    html += '<input type="number" name="quantity[]" value="' + item.quantity + '" item-id="' + productDetail.id + '" class="input-cart" style="width: 40px;" />';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    $('#list-product-item-order').append(html);
                }
            })

            var htmlAll = ''
            $('.box-cart-right-cont').append(htmlAll);

            $('.mini-cart-order .number').text(nh_functions.formatMoney(totalQuantiry));
            $("#total_price_final").text(nh_functions.formatMoney(totalAmount));

        }
    }else {
        $('.mini-cart-order .number').text(nh_functions.formatMoney(0));
        $("#total_price_final").text(nh_functions.formatMoney(0));
    }
}

function loadCartNumber() {
    let totalQuantiry = 0;

    var cart = window.localStorage.getItem("cart");
    if (cart != undefined && cart != null) {
        var cartJson = JSON.parse(cart);

        if(cartJson.length > 0){
            cartJson.forEach(function (item) {
                totalQuantiry += item.quantity;
            })
        }
    }

    $('.mini-cart-order .number').text(nh_functions.formatMoney(totalQuantiry));
}

function loadProduct(category) {
    listProduct.forEach(function (productDetail) {
        //lấy detail product
        if (productDetail.category == category) {

            var htmlProduct = '<div class="list-item col-md-4 col-sm-4 col-xs-12">'
            htmlProduct += '<div class="item-product hover-action-product style-view-2 clearfix">'
            htmlProduct += '<span class="status-product bg-red">HOT</span>'
            htmlProduct += '<div class="img bg-img-50" title="' + productDetail.name + '">'
            htmlProduct += '<a href="' + productDetail.url + '" title="' + productDetail.name + '">'
            htmlProduct += '<img src="' + productDetail.thumb + '" alt="' + productDetail.name + '" class="img-product" />'
            htmlProduct += '</a>'
            htmlProduct += '</div>'
            htmlProduct += '<div class="info">'
            htmlProduct += '<h4 class="title-product">'
            htmlProduct += '<a href="' + productDetail.url + '">' + productDetail.name + '</a>'
            htmlProduct += '</h4>'
            htmlProduct += '<div class="price price-inline">'
            htmlProduct += '<p class="price-well">'
            htmlProduct += nh_functions.formatMoney(productDetail.price)
            htmlProduct += '</p>'
            htmlProduct += '</br>'
            htmlProduct += '<p class="price-before">'
            htmlProduct += nh_functions.formatMoney(productDetail.price_sale)
            htmlProduct += '</p>'
            htmlProduct += '</div>'
            htmlProduct += '<div class="show-list">'
            htmlProduct += '<div class="desc-product-thumb">'
            htmlProduct += '<p></p>'
            htmlProduct += '</div>'
            htmlProduct += '</div>'
            htmlProduct += '<div class="action-product bg-main">'
            htmlProduct += '<a href="javascript://" class="item-action btn-shop-cart" item-id="' + productDetail.id + '" status-store="">'
            htmlProduct += '<i class="fa fa-shopping-cart"></i>'
            htmlProduct += '<!--Thêm vào giỏ hàng-->'
            htmlProduct += '</a>'
            htmlProduct += '</div>'
            htmlProduct += '<div class="content-attr hidden"></div>'
            htmlProduct += '</div>'
            htmlProduct += '</div>'
            htmlProduct += '</div>'

            document.getElementById('list-product-item-cat' + category).insertAdjacentHTML('beforeend', htmlProduct)
        }
    })
}
