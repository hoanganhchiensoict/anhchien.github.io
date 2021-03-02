// silv
// ---- NOTE: this plugin require use library bootstrap v3.0 more

var nh_comments = {
    options: {
        object: '#nh-comment',
        awaiting_approval: 0,
        login_require: 0,
        limit: 10,
        time_reload: 600000,
        show_notice_success: 0, // show notice comment success full after comment
        show_avatar: 0,
        accept_emoticon: 0,
        accept_photo: 0,
        accept_like: 0,
        accept_comment: 0,

        page: 1,
        logged: 0,

        url:'',
        foreign_id: '', // require this param
        type: '', // require this param
        member_id: '',
        full_name: '',
        avatar: '',
        phone: '',
        email: '',
        content: '',
        img_url: '',// photo attach
        img_thumb: '',
        img_original: '',
        parent_id: ''
    },
    commenting: {
        item_comment: '', // item_comment > 0 -> reply
        line: 0,
        col: 0,
        caret: 0,
    },
    template: {
        item_comment: ''
        + ' <div class="comment">'
        + '     <div class="nh-avatar"></div>'
        + '     <div class="block-content">'
        + '         <div class="wrap-content">'
        + '             <span class="author"></span>'
        + '             <span class="content-comment"></span>'
        + '             <span class="view-photo-comment"></span>'
        + '         </div>'
        + '         <div class="actions">'
        + '             <a class="btn-like" title="Thích" href="#">Thích</a>'
        + '             <span class="split"> · </span>'
        + '             <a class="btn-reply" href="#">Trả lời</a>'
        + '             <a class="show-like hidden" href="#">'
        + '                 <span class="split"> · </span>'
        + '                 <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>'
        + '                 <span class="number-like"></span>'
        + '             </a>'
        + '             <span class="split"> · </span>'
        + '             <span class="show-time" data-toggle="tooltip" title="">'
        + '                 <i class="fa fa-clock-o" aria-hidden="true"></i>'
        + '                 <span class="time"></span>'
        + '             </span>'
        + '         </div>'
        + '     </div>'
        + ' </div>',
        more_reply: ''
        + ' <div class="list-reply">'
        + '     <a class="more-reply" data-count="" href="#">'
        + '         <i class="fa fa-share" aria-hidden="true"></i>'
        + '         <span class="content-reply"></span>'
        + '     </a>'
        + ' </div>',
        close_reply: ''
        + ' <a class="close-reply" data-count="" href="#">'
        + '     <i class="fa fa-reply" aria-hidden="true"></i>'
        + '     <span class="content-reply"></span>'
        + ' </a>',
        icon_photo_comment: ''
        + ' <a class="photo-comment">'
        + '     <i class="fa fa-camera-retro" aria-hidden="true"></i>'
        + ' </a>',
        enter_comment: ''
        + ' <div class="enter-comment">'
        + '     <div class="nh-avatar"></div>'
        + '     <div class="input-comment">'
        + '         <div class="wrap-input">'
        + '             <div id="my-comment" class="my-comment" name="my_comment" contenteditable="true"></div>'
        + '             <div class="comment-attach">'
        + '                 <a class="emoticons-comment">'
        + '                     <i class="fa fa-smile-o" aria-hidden="true"></i>'
        + '                 </a>'
        + '                 <a class="photo-comment">'
        + '                     <i class="fa fa-camera-retro" aria-hidden="true"></i>'
        + '                 </a>'
        + '                 <input type="file" accept="image/*" name="comment_photo[]" class="input-photo-comment">'
        + '             </div>'
        + '         </div>'
        + '     </div>'
        + ' </div>',
        row_content_comment: ''
        + ' <div data-row="true"><span data-text="true"></span></div>',
        pagination: ''
        + ' <div class="pagination-comment" data-page="">'
        + '     <a class="page-link">'
        + '         <i class="fa fa-reply-all" aria-hidden="true"></i> Xem thêm bình luận'
        + '     </a>'
        + '     <span class="pull-right page-count"></span>'
        + ' </div>',
        hidden_element: ''
        + ' <div class="hidden-element-comment"></div>',
        photo_attach_preview: ''
        + ' <div class="preview-photo-attach">'
        + '     <span class="list-photo-attach">'
        + '         <i class="fa fa-spinner fa-spin photo-attach-loading"></i>'
        + '     </span>'
        + '     <a class="close-photo-attach">'
        + '         <i class="fa fa-times" aria-hidden="true"></i>'
        + '     </a>'
        + ' </div>',
    },
    init: function (options) {
        var self = this;

        self.options.url = window.location.href;;
        // extend config on load plugin
        $.extend(self.options, options);

        // load comment
        self.loadComments(self.options);

        // reload comment by time config
        setTimeout(function () {
            self.reloadComment(self.options);
        }, self.options.time_reload);

        //event click modal require info
        $(document).on("click", "#submit-require-info", function (e) {
            var check_info = true;
            $('#modal-require-info input').each(function (index) {
                if ($(this).attr('name') == 'input_name') {
                    if ($.trim($(this).val()).length == 0) {
                        var label_validate = '<span class="note" style="float: left;margin: 5px 0 0 0;color: #a94442;font-size: 12px;">Vui lòng nhập tên hiển thị</span>';
                        $(this).after(label_validate);
                        check_info = false;
                        return false;
                    }
                    self.options.full_name = $(this).val();
                }

                if ($(this).attr('name') == 'input_email') {
                    self.options.email = $(this).val();
                }

                if ($(this).attr('name') == 'input_phone') {
                    self.options.phone = $(this).val();
                }
            });

            if (check_info) {
                $('#modal-require-info').modal('hide');
                self.addComment(self.options);
            }

        });

        //event click reply
        $(document).on("click", self.options.object + " .btn-reply", function (e) {

            var parent_id = typeof($(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
            self.options.parent_id = parent_id;

            // check btn-reply is comment parent or comment child
            if ($(this).closest('.item-comment').find('.list-reply.show').length > 0) {
                // if click btn-reply in child -> focus to input comment
                $(this).closest('.item-comment').find('.my-comment').focus();
            } else {
                // else reload list reply of comment parent
                if (parent_id != '') {
                    self.loadReply({parent_id: parent_id}, function () {
                        $(self.options.object).find('.item-comment[data-id="' + parent_id + '"] .list-reply .my-comment').focus();
                    });
                } else {
                    self.loadModal({
                        modal: 'modal_error',
                        title: 'Hiển thị câu trả lời',
                        message: 'Xảy ra vấn đề khi hiển thị câu trả lời của bình luận này , xin vui lòng làm mới trang hoặc liên hệ tới hotline.',
                    });
                }
            }

            return false;
        });

        //event click more reply
        $(document).on("click", self.options.object + " .more-reply", function (e) {
            var parent_id = typeof($(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
            if (parent_id != '') {
                self.loadReply({parent_id: parent_id});
            }
            return false;
        });

        //event click close reply
        $(document).on("click", self.options.object + " .close-reply", function (e) {
            var wrap_item = $(this).closest('.item-comment');
            var count_reply = $(this).attr('data-count');
            $(this).closest('.list-reply').remove();
            wrap_item.append(self.template.more_reply);
            wrap_item.find('.list-reply .more-reply').attr('data-count', count_reply);
            wrap_item.find('.list-reply .content-reply').text('Hiển thị ' + count_reply + ' câu trả lời');

            return false;
        });

        //event click pagination
        $(document).on("click", self.options.object + " .pagination-comment", function (e) {
            var page = typeof( $(this).attr('data-page')) != 'undefined' ? $(this).attr('data-page') : '';
            if (page != '') {
                self.options.page = page;

                // load comment
                self.loadComments(self.options);
            }

        });

        //event click button like
        $(document).on("click", self.options.object + " .btn-like", function (e) {
            // plus or minus count like
            var count_like = $(this).closest('.actions').find('.number-like').text();
            if (count_like == '') {
                count_like = 0;
            }
            var type = '';
            if ($(this).hasClass('liked')) {
                type = 'unlike';
                if ($.isNumeric(count_like) && count_like > 0) {
                    count_like--;
                }
            } else {
                type = 'like';
                if ($.isNumeric(count_like)) {
                    count_like++;
                }
            }

            // change number like off comment
            $(this).closest('.actions').find('.number-like').text(count_like);
            $(this).closest('.actions').find('.show-like').toggleClass('hidden', count_like == 0);

            // add or remove class 'liked'
            $(this).toggleClass('liked');

            // add or remove comment
            var comment_id = typeof( $(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
            if (comment_id != '' && !$(this).hasClass('liking')) {
                var data = {
                    type: type,
                    comment_id: comment_id,
                    member_id: self.options.member_id
                }

                var btn_like = $(this);
                // add class liking in button like

                btn_like.addClass('liking');
                // add comment to db
                self.likeComment(data, function (respone) {
                    if (respone.code == 'success') {
                        // remove class liking when success
                        btn_like.removeClass('liking');
                    }
                });
            }

            return false;
        });

        // event click button show emoticons
        $(document).on("click", self.options.object + " .emoticons-comment", function (e) {

            // remove all class active in emoticons-comment
            $(self.options.object + '.emoticons-comment').removeClass('active');

            // toggle class active
            $(this).addClass('active');

            var offset = $(this).offset();

            if ($(self.options.object + ' .wrap-emoticons').length == 0) {
                var wrap_emoticons = $('<div class="wrap-emoticons">').html('<div class="list-emoticons"></div>');

                var list_emotions = self.getListEmoticons();
                if (!$.isEmptyObject(list_emotions)) {
                    $.each(list_emotions, function (index, value) {
                        if (typeof(value.url_img) != 'undefined') {
                            var emoticon = '<div class="item-emoticon" data-code="' + value.code + '"><img src="' + value.url_img + '" /></div>';
                            wrap_emoticons.find('.list-emoticons').append(emoticon);
                        }
                    })
                }

                $(self.options.object + ' .hidden-element-comment').append(wrap_emoticons);

                // check which wheel event is supported. Don't use both as it would fire each event
                var wheelEvent = self.isEventSupported('mousewheel') ? 'mousewheel' : 'wheel';

                // event wheel div emoticons
                wrap_emoticons.on(wheelEvent, function (e) {
                    var oEvent = e.originalEvent,
                        delta = oEvent.deltaY || oEvent.wheelDelta;

                    // not scroll page when scrolled to top or bot of div emotions
                    if ((wrap_emoticons.scrollTop() === (wrap_emoticons[0].scrollHeight - wrap_emoticons.innerHeight()) && delta > 0) || (wrap_emoticons.scrollTop() === 0 && delta < 0)) {
                        e.preventDefault();
                    }

                });
            } else {
                var wrap_emoticons = $(self.options.object + ' .wrap-emoticons');
                wrap_emoticons.removeClass('hidden');
            }

            wrap_emoticons.css({
                'top': offset.top - 190,
                'left': offset.left - 420,
            });
        });

        // event click select emoticon
        $(document).on("click", self.options.object + " .wrap-emoticons .item-emoticon", function (e) {

            var obj_line = self.getObjectLineComment();
            var obj_col = self.getObjectColComment();
            var obj_input_comment = $('.emoticons-comment.active').closest('.enter-comment').find('.my-comment');

            if(obj_input_comment.length == 0){
                return false;
            }
            var emoticon = '<span class="img-emoticon" data-col="" data-type="emoticon" data-code="' + $(this).attr('data-code') + '" style="background-image:url(' + $(this).find('img').attr('src') + ')"> </span>';

            // check member login before add comment
            var check_login = self.checkLoginBeforeComment();
            if(!check_login){
                return false;
            }

            if(obj_line != null){

                // check obj_col empty
                if(obj_col == null){
                    obj_line.append(emoticon);
                    // replace data column
                    self.replaceDataColComment(obj_line);
                    self.setCaretToObject(obj_line.find('span[data-col]:last-child').get(0), 1);

                    //set position commenting
                    self.commenting.col = 0;
                }else{
                    var content = obj_col.text();
                    if (content.length == self.commenting.caret || obj_col.attr('data-type') == 'emoticon') {
                        obj_col.after(emoticon);
                    } else {

                        var split_html = '<span data-col="">' + content.substring(0, self.commenting.caret) + '</span>' + emoticon + '<span data-col="">' + content.substring(self.commenting.caret, content.length) + '</span>';
                        obj_col.replaceWith(split_html);
                    }

                    // replace data column
                    self.replaceDataColComment(obj_line);

                    self.setCaretToObject(obj_line.find('span[data-col]:last-child').get(0), 1);

                    //set position commenting
                    self.commenting.col = self.commenting.col + 1;
                }

            }else{
                obj_input_comment.html('');
                obj_input_comment.append('<div data-line="0">' + emoticon + '</div>');

                self.commenting.line = 0;

                obj_line = obj_input_comment.find('div[data-line]:last-child');

                // replace data column
                self.replaceDataColComment(obj_line);

                self.setCaretToObject(obj_line.find('span[data-col]:last-child').get(0), 1);

                //set position commenting
                self.commenting.col = 0;
            }

            self.commenting.caret = 1;

            return false;
        });

        //event keydown to my comment
        $(document).on("keydown", self.options.object + " .my-comment", function (e) {
            var obj_line = self.getObjectLineComment();
            var obj_col = self.getObjectColComment();
            var text_col = obj_col != null ? obj_col.text() : '';

            // check member login before comment
            var check_login = self.checkLoginBeforeComment();
            if(!check_login) return false;

            //if press enter + shift
            if (e.keyCode == 13 && e.shiftKey == true && obj_col != null) {
                // html of call after caret
                var col_after = '';
                if (obj_col.nextAll().length > 0) {
                    $.each(obj_col.nextAll(), function (index, col) {
                        col_after = col_after + col.outerHTML;
                    });
                }

                // get html new col
                var new_row = '';
                if (text_col.length == self.commenting.caret) {
                    new_row = '<div data-line=""><span data-col="0"><br></span>' + col_after + '</div>';
                } else {
                    new_row = '<div data-line=""><span data-col="0">' + text_col.substring(self.commenting.caret, text_col.length) + '</span>' + col_after + '</div>';
                }

                // replace text in old col and remove all col in after
                obj_col.text(text_col.substring(0, self.commenting.caret));
                obj_col.nextAll().remove();

                // add new row
                obj_line.after(new_row);

                //replace data-line in comment
                $(this).find('div[data-line]').each(function (index, line) {
                    $(line).attr('data-line', index);
                });

                // set caret position after append row
                self.setCaretToObject(obj_line.next().find('span[data-col]').get(0), 0);

                return false;
            }

            //if press enter -> insert comment to database
            if (e.keyCode == 13 && e.shiftKey == false && obj_col != null) {
                // clear option basic before submit
                self.clearOptionsComment();

                if ($(this).closest('.list-reply').length > 0) {
                    self.options.parent_id = $(this).closest('.item-comment').attr('data-id');
                }
                self.options.content = self.parseContentComment($(this));
                if ($(this).closest('.input-comment').find('.preview-photo-attach .photo-attach').length > 0) {
                    self.options.img_url = $(this).closest('.input-comment').find('.preview-photo-attach .photo-attach').attr('src');
                    self.options.img_thumb = $(this).closest('.input-comment').find('.preview-photo-attach .photo-attach').attr('data-thumb');
                    self.options.img_original = $(this).closest('.input-comment').find('.preview-photo-attach .photo-attach').attr('data-original');
                }

                // remove html comment
                $('.my-comment').html('');

                // add comment
                self.addComment(self.options);
                return false;
            }

            // if press alt + arrow on MAC OS or ctrl + arrow on WINDOWN
            if ((e.keyCode == 37 || e.keyCode == 39 ) && (e.ctrlKey == true || e.metaKey == true) && obj_line != null) {
                var col_focus = null;
                var positon_focus = 0;
                var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? true : false;
                // arrow left
                if ((e.keyCode == 37 && e.metaKey == true && isMac) || (e.keyCode == 37 && e.ctrlKey == true && !isMac)) {
                    col_focus = obj_line.find('[data-col]:first-child').length > 0 ? obj_line.find('[data-col]:first-child') : null;
                    positon_focus = 0;
                }

                // arrow right
                if ((e.keyCode == 39 && e.metaKey == true && isMac) || (e.keyCode == 39 && e.ctrlKey == true && !isMac)) {
                    col_focus = obj_line.find('span[data-col]:last-child').length > 0 ? obj_line.find('span[data-col]:last-child') : null;
                    positon_focus = col_focus.text().length > 0 ? col_focus.text().length : 0;
                }

                if (col_focus != null) {
                    self.setCaretToObject(col_focus.get(0), positon_focus);
                }
            }

            // press backspace when caret focus to emoticon
            if(e.keyCode == 8 && obj_col != null && obj_col.attr('data-type') == 'emoticon'){
                self.setCaretToObject(obj_col.prev('span[data-col]').get(0), obj_col.prev('span[data-col]').text().length);
                obj_col.remove();
                return false;
            }

            // append data-line and span 'data-col' when caret focus to div my-comment
            var caret = document.getSelection();
            if ($(caret.anchorNode).hasClass('my-comment') || (typeof $(caret.anchorNode).attr('data-line') !== typeof undefined && $(caret.anchorNode).attr('data-line') !== false) || (obj_col != null && obj_col.attr('data-type') == 'emoticon' )) {
                if (obj_line == null) {
                    $(this).html('');
                    $(this).append('<div data-line="0"><span data-col="0"><br></span></div>');
                    var new_col = $(this).find('div[data-line="0"]:last-child span[data-col="0"]').length > 0 ? $(this).find('div[data-line="0"]:last-child span[data-col="0"]') : null;
                } else {
                    obj_line.append('<span data-col=""></span>');
                    var new_col = obj_line.find('span[data-col]:last-child').length > 0 ? obj_line.find('span[data-col]:last-child') : null;

                    // replace data-line after insert new col
                    self.replaceDataColComment(obj_line);
                }

                // set caret for new
                if (new_col != null) {
                    new_col.html(e.key.length > 1 ? '' : e.key);
                    self.setCaretToObject(new_col.get(0), 1);
                }
                return false;
            }

        });

        //event keyup to my comment
        $(document).on("keyup click", self.options.object + " .my-comment", function (e) {
            // remove all tag or text exception
            self.removeAllTagException($(this));

            //set caret , row and item commenting
            var item_id = typeof($(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
            var caret = document.getSelection();

            var line = self.commenting.line;
            if (!$.isEmptyObject(caret.anchorNode)) {
                line = $(caret.anchorNode.parentElement).closest('div[data-line]').length > 0 ? $(caret.anchorNode.parentElement).closest('div[data-line]').attr('data-line') : self.commenting.line;
            }

            var col = 0;
            if (typeof($(caret.anchorNode).attr('data-col')) != 'undefined') {
                col = $(caret.anchorNode).attr('data-col');
            } else if (!$.isEmptyObject(caret.anchorNode)) {
                col = typeof($(caret.anchorNode.parentElement).attr('data-col')) != 'undefined' ? $(caret.anchorNode.parentElement).attr('data-col') : self.commenting.col;
            }

            self.commenting.item_comment = item_id;
            self.commenting.line = parseInt(line);
            self.commenting.col = parseInt(col);

            // check character commenting is unicode
            if (!(e.type == 'keyup' && e.key == 'Backspace' && e.keyCode == 8)) {
                self.commenting.caret = caret.focusOffset;
            }

        });

        //event paste text
        $(document).on("paste", self.options.object + " .my-comment", function (e) {
            var paste_txt = e.originalEvent.clipboardData.getData('text');
            if (paste_txt.length > 0) {
                var obj_line = self.getObjectLineComment();
                var obj_col = self.getObjectColComment();
                if (obj_col != null) {
                    obj_col.text(obj_col.text() + paste_txt);
                    // set caret position after append row
                    self.setCaretToObject(obj_col.get(0), obj_col.text().length);
                }
            }
            return false;
        });

        //event click button upload photo
        $(document).on("click", self.options.object + " .photo-comment", function (e) {
            $(this).closest('.comment-attach').find('input.input-photo-comment').trigger('click');
        });

        //event select photo upload
        $(document).on("change", self.options.object + " .comment-attach input.input-photo-comment", function (e) {
            if ($(this).val().length > 0) {

                var wrap_input = $(this).closest('.input-comment');

                // remove icon attach photo
                wrap_input.find('.photo-comment').remove();

                //remove div preview photo old
                wrap_input.find('.preview-photo-attach').remove();

                // append div list photo
                wrap_input.append(self.template.photo_attach_preview);

                // upload photo
                var comment_id = typeof( $(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
                var file = $(this).get(0).files[0];
                var formData = new FormData();
                formData.append('comment_id', comment_id);
                formData.append('file', file);

                self.uploadPhoto(formData, function (response) {
                    if (response.code == 'success' && !$.isEmptyObject(response.data)) {

                        // empty html in list photo
                        wrap_input.find('.list-photo-attach').html('');

                        // append item photo
                        $.each(response.data, function (index, photo) {

                            var arr_thumb = $.parseJSON(photo.path_thumb);
                            var size = self.getSizeThumbImage(photo);
                            if (size == 0) {
                                var src_photo = photo['original'];
                            } else {
                                var src_photo = typeof(arr_thumb[size]) != 'undefined' ? arr_thumb[size] : photo['original'];
                            }

                            // push image
                            var item_photo = $('<div class="item-photo-attach">').html("<img class='photo-attach' src='" + src_photo + "' data-original='" + photo['original'] + "' data-thumb='" + photo.path_thumb.toString() + "'/>");
                            wrap_input.find('.list-photo-attach').append(item_photo);
                        });
                    }
                });
            }
        });

        // event click button close preview photo upload
        $(document).on("click", self.options.object + " .preview-photo-attach .close-photo-attach", function (e) {
            var wrap_input = $(this).closest('.input-comment');

            wrap_input.find('.preview-photo-attach').remove();
            if (wrap_input.find('.photo-comment').length == 0) {
                wrap_input.find('.emoticons-comment').after(self.template.icon_photo_comment);
            }

        });

        // close element showing when click body page
        $(document).click(function (e) {
            $("body").click(function (e) {
                if (e.target.className != 'wrap-emoticons' && e.target.className != 'item-emoticon' && !$(e.target).is('.item-emoticon *')) {
                    $(self.options.object + " .wrap-emoticons").addClass('hidden');
                }
            });
        });
    },
    autoClick: function () {
        // event test auto click
        console.log('auto click');
        return false;
        // reload comment by time config
        setTimeout(function () {
            console.log('timeout');
            $('.nh-comment .item-comment:first .actions .btn-like').trigger('click');
            nh_comments.autoClick();
        }, 10);

    },
    getListComments: function (options, callback) {
        var data = {};
        $.ajax({
            async: false,
            cache: true,
            url: '/comments/action/get-list-comments',
            type: 'POST',
            dataType: 'json',
            data: options,
            success: function (response) {
                data = response;
            },
            error: function (response, json, errorThrown) {
                console.log('Get list comments fail !');
            }
        });

        return data;
    },
    getHtmlItemComment: function (data, type, callback) {
        var self = this;
        if (type == 'add') {
            var item_comment = $('<div data-id="' + data.id + '" class="item-comment">').html(self.template.item_comment);
            item_comment.attr('data-id', data.id);
        } else {
            var item_comment = $(self.options.object + ' .item-comment[data-id="' + data.id + '"] > .comment');
        }

        // set value for comment
        item_comment.find('.author').text(data.full_name);
        item_comment.find('.content-comment').html(data.content);
        item_comment.find('.time').text(data.time);
        item_comment.find('.show-time').attr('title', data.full_time);
        // avatar
        if (self.options.show_avatar > 0) {
            if (!$.isEmptyObject(data.avatar) && data.avatar.length > 0) {
                var avatar = '<img class="img-avatar" src="' + data.avatar + '">';
            } else {
                var avatar = '<i class="fa fa-bell-o" aria-hidden="true"></i>';
            }
            item_comment.find('.nh-avatar').html(avatar);
        } else {
            item_comment.find('.nh-avatar').remove();
        }


        // photo attach
        if (!$.isEmptyObject(data.img_url) && data.img_url.length > 0) {

            var photo_attach = '<img src="' + data.img_url + '">';

            item_comment.find('.view-photo-comment').html(photo_attach);
        }

        // show or hidden button like and count like
        if(self.options.accept_like ==  0){
            item_comment.find('.btn-like').next('.split').remove();
            item_comment.find('.btn-like').remove();

            item_comment.find('.show-like').remove();
        }else {
            // show count like
            if (data.count_like != 0 && data.count_like != '') {
                item_comment.find('.number-like').text(data.count_like);
                item_comment.find('.show-like').removeClass('hidden');
            }

            // check like this
            if (data.like_this > 0) {
                item_comment.find('.btn-like').addClass('liked');
            }
        }




        // show or hidden button reply
        if (self.options.accept_comment == 0 || data.parent_id > 0) {
            item_comment.find('.btn-reply').next('.split').remove();
            item_comment.find('.btn-reply').remove();
        } else {
            if (data.count_reply > 0) {
                item_comment.find('.count-reply').removeClass('hidden').text(data.count_reply);
            }

            // check comment this
            if (data.comment_this > 0) {
                item_comment.find('.btn-reply').addClass('replied');
            }
        }


        return item_comment;
    },
    loadComments: function (options, callback) {

        var self = this;
        var wrap_comment = $(self.options.object);

        // append input comment to view
        if ($(self.options.object + ' > .enter-comment').length == 0) {
            wrap_comment.append(self.template.enter_comment);

            // show or hidden avatar
            if (self.options.show_avatar == 0) {
                wrap_comment.find('.nh-avatar').remove();
            } else if (self.options.avatar.length > 0) {
                wrap_comment.find('.nh-avatar').html('<img class="img-avatar" src="' + self.options.avatar + '">');
            } else {
                wrap_comment.find('.nh-avatar').html('<i class="fa fa-bell-o" aria-hidden="true"></i>');
            }
            // show or hidden emoticon
            if (self.options.accept_emoticon == 0) {
                wrap_comment.find('.emoticons-comment').remove();
            }

            // show or hidden emoticon
            if (self.options.accept_photo == 0) {
                wrap_comment.find('.photo-comment').remove();
            }

        }

        // append div hidden_element
        if ($(self.options.object + ' > .hidden-element-comment').length == 0) {
            wrap_comment.append(self.template.hidden_element);
        }


        // get list comment
        var data = self.getListComments(options);

        var list_comment = data.comments;

        // load list comment
        if (!$.isEmptyObject(list_comment)) {
            var id_before = typeof($(self.options.object + ' > .item-comment:last').attr('data-id')) != 'undefined' ? $(self.options.object + ' > .item-comment:last').attr('data-id') : '';

            $.each(list_comment, function (index, value) {
                // insert html off item comment
                if ($(self.options.object + ' .item-comment[data-id="' + value.id + '"]').length == 0) {
                    //html item comment
                    var item_comment = self.getHtmlItemComment(value, 'add');
                    // add html comment to view
                    if (id_before != '') {
                        $(self.options.object + ' .item-comment[data-id="' + id_before + '"]').after(item_comment);
                    } else {
                        $(self.options.object + ' > .enter-comment').after(item_comment);
                    }
                }
                // update info of comment
                else {
                    self.getHtmlItemComment(value, 'update');
                }

                // update reply
                if ($(self.options.object + ' .item-comment[data-id="' + value.id + '"] .list-reply').hasClass('show')) {
                    self.loadReply({data: value.reply});
                } else if (value.count_reply > 0) {
                    $(self.options.object + ' .item-comment[data-id="' + value.id + '"] .list-reply').remove();
                    $(self.options.object + ' .item-comment[data-id="' + value.id + '"]').append(self.template.more_reply);
                    $(self.options.object + ' .item-comment[data-id="' + value.id + '"] .list-reply .more-reply').attr('data-count', value.count_reply);
                    $(self.options.object + ' .item-comment[data-id="' + value.id + '"] .list-reply .content-reply').text('Hiển thị ' + value.count_reply + ' câu trả lời');
                }

                id_before = value.id;
            });
        }

        //append pagination comment
        var pagination = data.pagination;

        // clear old pagination
        $(self.options.object + ' .pagination-comment').remove();

        if (!$.isEmptyObject(pagination) && pagination.total_page > 1 && pagination.accept_next == 1) {
            // add new pagination
            $(self.options.object + ' .hidden-element-comment').before(self.template.pagination);
            $(self.options.object + ' .pagination-comment').attr('data-page', pagination.page + 1);
            $(self.options.object + ' .pagination-comment').find('.page-count').text(pagination.current + ' trong số ' + pagination.total_record);
        }

        // tooltip
        $('[data-toggle="tooltip"]').tooltip({delay: {"show": 300}});

    },
    reloadComment: function (options, callback) {
        var self = this;
        // get list ids show reply comment loaded
        var ids_reply = [];
        $(self.options.object + ' .list-reply.show').each(function (index) {
            var id = typeof($(this).closest('.item-comment').attr('data-id')) != 'undefined' ? $(this).closest('.item-comment').attr('data-id') : '';
            if (id != '') {
                ids_reply.push(id);
            }
        });

        // set ids to options
        if (!$.isEmptyObject(ids_reply)) {
            options.ids_reply = ids_reply;
        }

        // load comment
        self.loadComments(options);

        // reload comment by time config
        setTimeout(function () {
            self.reloadComment(options);
        }, options.time_reload);
    },
    addComment: function (data, callback) {
        if (typeof(callback) != 'function') {
            callback = function () {
            };
        }

        var self = this;
        // show modal bootstrap when not require login
        if (self.options.login_require == 0 && self.options.full_name == '') {
            self.loadModal({modal: 'modal_require_info'});
            return false;
        }

        $.ajax({
            async: true,
            url: '/comments/action/add-comment',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (response) {

                self.closeAllElementHidden();
                $('#modal-require-info').modal('hide');

                var modal = 'modal_comment_error';
                if (response.code == 'success') {
                    $('.my-comment').html('');
                    modal = 'modal_comment_success';

                    // remove preview photo upload
                    if ($(self.options.object).find('.preview-photo-attach').length > 0) {
                        $(self.options.object).find('.preview-photo-attach').remove();
                    }

                    if (self.options.awaiting_approval == 0) {
                        // append comment to view
                        var item_comment = self.getHtmlItemComment(response.data, 'add');
                        if (response.data.parent_id > 0) {
                            var wrap_comment = $(self.options.object).find('.item-comment[data-id="' + response.data.parent_id + '"] .list-reply .enter-comment');
                            wrap_comment.before(item_comment);
                        } else {
                            var wrap_comment = $(self.options.object).find('.enter-comment:first-child');
                            wrap_comment.after(item_comment);
                        }

                        // show icon upload photo
                        if (wrap_comment.find('.photo-comment').length == 0) {
                            wrap_comment.find('.emoticons-comment').after(self.template.icon_photo_comment);
                        }
                    } else {
                        setTimeout(function(){
                            self.loadModal({
                                modal: 'modal_comment_awaiting_approval'
                            });
                        }, 500);
                    }


                }

                // clear options after comment
                self.clearOptionsComment();

                // show modal comment success
                if (self.options.show_notice_success != 0 && self.options.awaiting_approval == 0) {
                    self.loadModal({
                        modal: modal
                    });
                }
            },
            error: function (response, json, errorThrown) {
                console.log('Add comment fail !');
            }
        });
    },
    replaceEmoticon: function (line_obj) {
        var obj_tmp = $('<div>').html($(line_obj).html());
        if (obj_tmp.find('span.img-emoticon').length > 0) {
            obj_tmp.find('span.img-emoticon').each(function (index, emoticon) {
                var code = $(emoticon).attr('data-code');
                var obj_tmp = emoticon;
                $(obj_tmp).replaceWith('(__NH_EMOTICON____' + code + '__)');
            });
        }
        return obj_tmp.text();
    },
    parseContentComment: function (wrap_obj) {
        var self = this;
        var content = '';
        if (!$.isEmptyObject(wrap_obj.find('div[data-line]'))) {
            wrap_obj.find('div[data-line]').each(function (index, line) {
                content += self.replaceEmoticon($(line)) + '\n';
            });
        }
        return content;
    },
    loadReply: function (options, callback) {

        if (typeof(callback) != 'function') {
            callback = function () {
            };
        }

        var self = this;
        var list_comment = {}

        //check this item comment exit div '.list-reply'
        if ($(self.options.object).find('.item-comment[data-id="' + options.parent_id + '"] .list-reply').length == 0) {
            $(self.options.object).find('.item-comment[data-id="' + options.parent_id + '"]').append('<div class="list-reply show"></div>');
        }
        var wrap_reply = $(self.options.object).find('.item-comment[data-id="' + options.parent_id + '"] .list-reply');
        wrap_reply.addClass('show');

        // clear old reply
        wrap_reply.html('');

        // get list reply
        if (!$.isEmptyObject(options.data)) {
            list_comment = options.data;
        } else {
            self.options.parent_id = options.parent_id;
            var data = self.getListComments(self.options);
            list_comment = data.comments;
        }

        // clear parent_id after get list comment
        self.clearOptionsComment();

        // insert reply
        if (!$.isEmptyObject(list_comment)) {
            $.each(list_comment, function (index, value) {
                //html item reply
                var item_reply = self.getHtmlItemComment(value, 'add');
                wrap_reply.append(item_reply);
            });
        }

        //html close reply
        if (list_comment.length > 0) {
            wrap_reply.prepend(self.template.close_reply);
            wrap_reply.find('.close-reply').attr('data-count', list_comment.length);
            wrap_reply.find('.content-reply').text('Ẩn ' + list_comment.length + ' câu trả lời');
        }


        // insert html input reply
        wrap_reply.append(self.template.enter_comment);

        // show or hidden avatar
        if (self.options.show_avatar == 0) {
            wrap_reply.find('.nh-avatar').remove();
        } else if (self.options.avatar.length > 0) {
            wrap_reply.find('.enter-comment .nh-avatar').html('<img class="img-avatar" src="' + self.options.avatar + '">');
        } else {
            wrap_reply.find('.enter-comment .nh-avatar').html('<i class="fa fa-bell-o" aria-hidden="true"></i>');
        }


        // show or hidden emoticon
        if (self.options.accept_emoticon == 0) {
            wrap_reply.find('.emoticons-comment').remove();
        }

        // show or hidden emoticon
        if (self.options.accept_photo == 0) {
            wrap_reply.find('.photo-comment').remove();
        }

        // tooltip
        $('[data-toggle="tooltip"]').tooltip({delay: {"show": 300}});

        // callback
        callback();
    },
    clearOptionsComment: function () {
        var self = this;
        self.options.content = '';
        self.options.parent_id = '';
        self.options.img_url = '';
        self.options.img_thumb = '';
        self.options.img_original = '';
    },
    likeComment: function (data, callback) {

        if (typeof(callback) != 'function') {
            callback = function () {
            };
        }

        $.ajax({
            async: true,
            url: '/comments/action/like-comment',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (response) {
                callback(response);
            },
            error: function (response, json, errorThrown) {
                console.log('Like comment fail !');
            }
        });
    },
    getListEmoticons: function () {
        var data = {};
        $.ajax({
            async: false,
            url: '/comments/action/get-list-emoticons',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                data = response;
            },
            error: function (response, json, errorThrown) {
                console.log('Get list emoticons fail !');
            }
        });

        return data;
    },
    closeAllElementHidden: function () {
        var self = this;
        $(self.options.object + " .hidden-element-comment > div").addClass('hidden');
    },
    loadModal: function (options, callback) {
        if (typeof(callback) != 'function') {
            callback = function () {
            };
        }
        $.ajax({
            async: true,
            url: '/comments/action/load-modal-bootstrap',
            type: 'POST',
            dataType: 'html',
            data: options,
            success: function (response) {
                // remove modal old
                $('.modal-comment').remove();

                // append html of modal to body
                $('body').append(response);

                // show new modal
                $('.modal-comment').modal('show');

                //callback
                callback(response);
            },
            error: function (response, json, errorThrown) {
                console.log('Load modal bootstrap false !');
            }
        });
    },
    isEventSupported: function (eventName) {
        var el = document.createElement('div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        return isSupported;
    },
    getObjectLineComment: function () {
        var self = this;
        var obj_line;
        if (self.commenting.item_comment == '') {
            obj_line = $(self.options.object + ' >  .enter-comment .my-comment div[data-line="' + self.commenting.line + '"]');
        } else {
            obj_line = $(self.options.object + ' .item-comment[data-id="' + self.commenting.item_comment + '"] .my-comment div[data-line="' + self.commenting.line + '"]');
        }
        return obj_line.length > 0 ? obj_line : null;
    },
    getObjectColComment: function () {
        var self = this;
        var obj_col;

        if (self.commenting.item_comment == '') {
            obj_col = $(self.options.object + ' >  .enter-comment .my-comment div[data-line="' + self.commenting.line + '"] [data-col="' + self.commenting.col + '"]');
        } else {
            obj_col = $(self.options.object + ' .item-comment[data-id="' + self.commenting.item_comment + '"] .my-comment div[data-line="' + self.commenting.line + '"] [data-col="' + self.commenting.col + '"]');
        }

        return obj_col.length > 0 ? obj_col : null;
    },
    setCaretToObject: function (selector, positon) {
        if (typeof(positon) == 'undefined') {
            positon = 0;
        }
        if ($(selector).length > 0) {
            // set caret position after append row
            selector.focus();
            var textNode = selector.firstChild;
            if (textNode != null) {
                var range = document.createRange();
                range.setStart(textNode, positon);
                range.setEnd(textNode, positon);

                var caret_select = window.getSelection();
                caret_select.removeAllRanges();
                caret_select.addRange(range);

            }
        }
    },
    replaceDataColComment: function (obj_line) {
        //replace data-col in row of comment
        obj_line.find('[data-col]').each(function (index, col) {
            $(col).attr('data-col', index);
        });
    },
    removeAllTagException: function (obj_wrap) {
        // remove tag in my comment
        if (obj_wrap.hasClass('my-comment')) {
            obj_wrap.children().each(function () {
                if (typeof $(this).attr('data-line') == 'undefined') {
                    this.remove();
                } else {
                    // remove tag in line
                    $(this).children().each(function () {
                        if (typeof $(this).attr('data-col') == 'undefined') {
                            this.remove();
                        }
                    });
                }
            });
        }
    },
    uploadPhoto: function (data, callback) {
        if (typeof(callback) != 'function') {
            callback = function () {
            };
        }

        $.ajax({
            async: true,
            url: '/comments/action/upload-photo',
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            data: data,
            success: function (response) {
                callback(response);
            },
            error: function (response, json, errorThrown) {
                console.log('Upload photo fail !');
            }
        });
    },
    getSizeThumbImage: function (data) {
        var size = 260;// default
        if (data.width < 50 && data.height < 50) {
            size = 0;// original
        } else if (data.width < 150 && data.height < 150) {
            size = 50;
        }
        else if (data.width < 150 && data.height < 150) {
            size = 50;
        }
        else if (data.width < 260 && data.height < 260) {
            size = 150;
        }
        else if (data.width < 350 && data.height < 350) {
            size = 260;
        } else if (data.width > 350 || data.height > 350) {
            size = 350
        } else if (data.width > 260 || data.height > 260) {
            size = 260
        } else if (data.width > 150 || data.height > 150) {
            size = 150
        } else if (data.width > 50 || data.height > 50) {
            size = 50
        }
        return size;

    },
    checkLoginBeforeComment:function () {
        var self = this;

        // show modal alert require login
        if (self.options.login_require == 1 && self.options.logged == 0) {
            if ($('#login-modal').length == 0) {
                self.loadModal({modal: 'modal_login'}, function (a) {
                    $('#login-modal').modal('show');
                });
            } else {
                $('#login-modal').modal('show');
            }

            return false;
        }else{
            return true;
        }
    }
};
