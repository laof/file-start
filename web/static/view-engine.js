$(function () {

    var global = window;
    var fileMap = {};

    if (!global.localStorage || !global.WebSocket) {
        $('body').html('<h1 class="garbage">The version is too low. Please update the version.<h1>');
        return;
    }

    var storage = {
        stor: global.localStorage,
        myId: '_l_o_v_a_name1550299839288',
        pathKey: '_l_o_v_a_path1550299839288',
        modeKey: '_l_o_v_a_mode1550299839288',
        tabsKey: '__l_o_v_a_tabs1550299839288',
        gridListKey: '_l_o_v_a_grid_list1550299839288',
        _base: function (key, value) {
            var stor = this.stor
            if (stor) {
                if (value) {
                    stor.setItem(key, value)
                } else {
                    return stor.getItem(key) || ''
                }
            }
            return '';
        },
        getPath: function () {
            return this._base(this.pathKey);
        },
        setPath: function (path) {
            this._base(this.pathKey, path);
        },
        removePath: function () {
            if (this.stor) {
                this.stor.removeItem(this.pathKey);
            }
        },
        getMode: function () {
            return this._base(this.modeKey);
        },
        setMode: function (str) {
            memory.mode = str;
            this._base(this.modeKey, str);
        },
        getGridList: function () {
            return this._base(this.gridListKey);
        },
        setGridList: function (str) {
            memory.gridList = str;
            this._base(this.gridListKey, str);
        }
    }




    var AjaxUrl = {
        list: '/list',
        upload: '/upload'
    }

    var memory = {
        path: '',
        mode: '',
        gridList: '',
        homePath: ''
    };

    var mode = {
        view: 'view', //default
        down: 'down'
    }

    var GridList = {
        grid: 'grid', //default
        list: 'list'
    }

    var message = {
        dom: $('#my-alert'),
        mes: $('.message'),
        show: function (str) {
            this.mes.html(str);
            this.dom.modal('open');
        }
    }

    function guid() {
        return 'xxyxxxyxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var myId = localStorage.getItem(storage.myId)

    if (!myId) {
        myId = guid();
        localStorage.setItem(storage.myId, myId);
    }

    function getDate(data) {
        var now = data || new Date();
        var y = now.getFullYear();
        var m = now.getMonth() + 1;
        var d = now.getDate();
        return now.toTimeString().substr(0, 8);
    }


    function pushMassageList(data) {
        var li = $('<li/>');
        var pre = $('<pre/>');
        var p = $('<p/>');
        var myself = data.author === myId;

        var time = '<span class="show-time">' + getDate(new Date(data.time)) + '</span>';

        if (myself) {
            li.addClass('my');
            p.html(time);
        } else {
            li.addClass('other');
            p.html(time);
        }

        li.append(p);
        pre.text(data.text);

        li.append(pre);

        $('.talk-list').append(li);

    }


    $('.uuid,.chat-tabs').html(myId);

    var socket = io(location.host);
    socket.on('connect', function () {
        socket.emit('chat message', myId);
    });
    socket.on('event', function (data) {
        // console.log(data);
    });
    socket.on('chat message', function (data) {
        pushMassageList(data);
    });
    socket.on('disconnect', function () {});

    function changeTabs(type) {
        var select = 'select';
        $('th').removeClass(select);
        $('th[type=' + type + ']').addClass(select);
        switch (type) {
            case 'a':
                $('.files').show();
                $('.chat').hide();
                break;
            case 'b':
                $('.files').hide();
                $('.chat').show();
                break;
        }
        localStorage.setItem(storage.tabsKey, type);
    }

    var currentTabs = localStorage.getItem(storage.tabsKey) || 'a';
    changeTabs(currentTabs);

    $('th').on('click', function () {
        var type = $(this).attr('type');
        changeTabs(type);
    })


    function sentMessage() {
        var element = $('#input-text');
        var text = element.val();
        element.val('').html('').focus().val('');
        if ($.trim(text) !== '') {
            socket.emit('chat message', text);
        }
    }


    $('#input-text').keydown(function (e) {
        var element = $(this);
        if (e.keyCode === 13) {
            if (e.ctrlKey) {
                element.val(element.val() + '\r');
            } else {
                sentMessage();
                return false;
            }
        }
    });

    $('.send-message').on('click', function () {
        sentMessage();
    })






    function setMap(item) {
        var children = item.children;
        if (children) {
            if (!fileMap[item.path] && item.type != 'file') {
                fileMap[item.path] = children;
            }
            $.each(children, function (i, v) {
                setMap(v);
            })
        }
    }

    function createTags(list) {
        var arr = [];
        $.each(list, function (i, v) {
            var size = toSize(v.size);
            var isFile = v.type == 'file';
            var icon = isFile ? 'am-icon-file-text' : 'am-icon-folder-open';
            var click = isFile ? '' : 'onclick="next(\'' + v.path + '\')"';
            var title = v.name + '\n' + size;
            var str = ['<div class="item" ',
                click,
                ' title="',
                title,
                '"><span class="icon ',
                icon,
                '" aria-hidden="true"> </span>',
                '<p class="label-name" >', v.name, '</p>',
                '<p class="item-size" >', size, '</p></div>',
            ].join('');
            if (isFile) {
                var down = memory.mode == mode.down;
                var attrDownload = down ? ' download ="' + v.name + '" ' : '';
                str = ['<a class="item-file" href="', v.download, '" ', attrDownload, ' download-name="', v.name, '">', str, '</a>'].join('');
            }
            arr.push(str);
        });
        return arr.join('');
    }



    memory.mode = storage.getMode() || mode.view;
    memory.gridList = storage.getGridList() || GridList.grid;

    var modeInst = {
        init: function () {
            var dom;
            if (memory.mode == mode.view) {
                dom = $('.view-mode');
            } else {
                dom = $('.download-mode');
            }
            dom.trigger('click');
        },
        change: function (status) {
            var view = status == mode.view;
            var attr = 'download';
            var files = $('.item-file');
            if (view) {
                files.removeAttr(attr);
            } else {
                files.each(function () {
                    var file = $(this);
                    file.attr(attr, file.attr('download-name'));
                })
            }
            storage.setMode(status);
        }
    }

    // 切换模式
    var modeRadios = $('[name=mode-options]');
    modeRadios.on('change', function () {
        var value = modeRadios.filter(':checked').val();
        modeInst.change(value == 1 ? mode.view : mode.down);
    });

    modeInst.init();

    function currentPath(path) {
        storage.setPath(path);
        memory.path = path;
        $('.path').html(path); // show current path
        $('#upload-dir').val(path); // upload params
    }

    function update(key) {
        var dom = '<h4 class="no-file">No resources</h4>';
        var data = fileMap[key];
        currentPath(key);
        if (data) {
            var directory = [];
            var files = [];
            $.each(data, function (i, v) {
                var isFile = v.type == 'file';
                if (isFile) {
                    files.push(v);
                } else {
                    directory.push(v);
                }
            });
            if (directory.length || files.length) {
                dom = createTags(directory) + createTags(files);
            }
        } else {
            return update(memory.homePath);
        }
        $('#dir-list').html(dom);
    }



    function toSize(size) {
        var num = 1024.00;
        //byte
        if (!size) {
            return 'No size';
        }
        if (size < num) {
            return size + 'B';
        }
        if (size < Math.pow(num, 2)) {
            return (size / num).toFixed(2) + 'K';
        }
        //kb
        if (size < Math.pow(num, 3)) {
            return (size / Math.pow(num, 2)).toFixed(2) + 'M';
        }
        //M
        if (size < Math.pow(num, 4)) {
            return (size / Math.pow(num, 3)).toFixed(2) + 'G';
        }
        //G
        return (size / Math.pow(num, 4)).toFixed(2) + 'T';
    }


    $('#file-control').on('change', function (e) {
        var list = [];
        var fs = document.getElementById('file-control');
        var submit = $('.file-container');
        if (fs && fs.files && fs.files.length) {
            var size = 0;
            $.each(fs.files, function (i, v) {
                size += v.size;
                list.push(['<li><span>', v.name, '</span><span>', toSize(v.size), '</span></li>'].join(''));
            })
            $('.file-list').html(list.join(''));
            $('.file-total').html('Total: ' + fs.files.length + ' , size: ' + toSize(size));
            submit.show();
        } else {
            submit.hide();
        }
    });

    $('.nav-bar .am-btn').click(function () {
        var dom = $(this);
        var index = dom.attr('index');
        var home = memory.homePath;
        switch (Number(index)) {
            case 1:
                /**home */
                update(home);
                break;
                /**update */
            case 2:
                location.reload();
                break;
                /**back */
            case 3:
                var thanPath = memory.path;
                if (thanPath && thanPath != home) {
                    var list = thanPath.split('/');
                    list.pop();
                    update(list.join('/'));
                } else {
                    update(home);
                }
                break;
                /**select window */
            case 4:
                $('#file-control').trigger('click');
                break;
        }

    })





    /**upload */
    $('.submit-file').click(function () {
        $('#upload-submit').trigger('click');
    });

    /** upload */
    var progress = $.AMUI.progress;
    $('#np-s').on('click', function () {
        progress.start();
    });

    $('#np-d').on('click', function () {
        progress.done();
    });

    var listGridDom = $('.list-grid').on('click', function (event) {
        $(this).find('i').toggleClass('current-hide');
        $('#dir-list').toggleClass('tabulation')
        if (event.offsetY) {
            storage.setGridList(memory.gridList === GridList.grid ? GridList.list : GridList.grid);
        }
    })

    if (memory.gridList === GridList.list) {
        listGridDom.trigger('click');
    }

    global.uploadFiles = function () {
        var form = $("#dataForm");
        form.ajaxSubmit(function (data) {
            if (data && data.success) {
                location.reload();
            }
        });
        return false;
    }

    global.next = function (key) {
        update(key);
    }


    /** loading */
    var loading = $('#my-modal-loading');
    $(document).ajaxStart(function () {
        loading.modal('open');
    }).ajaxComplete(function (event, response, request) {

        loading.modal('close');

        if (response.status == 200) {
            var data = response.responseJSON || {};
            if (data.success) {
                return;
            }
            let mes = '';
            var url = request.url;
            // list
            if (url === AjaxUrl.list) {
                mes = '读取文件失败';
                // upload
            } else {
                mes = '文件路径错误';
            }
            if (mes) {
                message.show(mes);
            }

        } else {
            message.show('服务器发生意外情况，无法完成请求');
        }
    })

    $.post({
        url: AjaxUrl.list,
        success: function (data) {
            if (data && data.success) {
                var home = data.path;
                var path = storage.getPath() || home;
                memory.homePath = home;
                setMap(data);
                update(path);
            }
        }
    })
});