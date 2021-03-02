nh_member = {
    appendOptionSelect: function (id_object, json_options) {
        var list_option = '';
        $.each(json_options, function (key, value) {
            list_option += '<option value=' + key + '>' + value + '</option>';
        });
        $(id_object).empty().trigger('change');
        $(id_object).append(list_option);
    },

}
