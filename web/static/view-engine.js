$(function () {

    var global = window;
    var fileMap = {};

    var memory = {
        path: '',
        mode: '',
        homePath: ''
    };

    var mode = {
        view: 'view', //default
        down: 'down'
    }

    var message = {
        dom: $('#my-alert'),
        mes: $('.message'),
        show: function (str) {
            this.mes.html(str);
            this.dom.modal('open');
        }
    }

    function setMap(item) {
        var children = item.children;
        if (children && children.length) {
            if (!fileMap[item.path] && item.type != 'file') {
                fileMap[item.path] = children;
            }
            $.each(item.children, function (i, v) {
                setMap(v);
            })
        }
    }

    function createTags(list) {
        var arr = [];
        $.each(list, function (i, v) {
            var size = toMB(v.size);
            var isFile = v.type == 'file';
            var icon = isFile ? 'am-icon-file' : 'am-icon-folder';
            var click = isFile ? '' : 'onclick="next(\'' + v.path + '\')"';
            var title = v.name + '\n' + size;
            var str = ['<div class="item" ',
                click,
                ' title="',
                title,
                '"><span class="icon ',
                icon,
                '" aria-hidden="true"> </span>',
                '<p class="item-size" >', size, '</p>',
                '<p class="label-name" >', v.name, '</p></div>'
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

    var storage = {
        stor: global.localStorage,
        pathKey: '_l_o_v_a_path1550299839288',
        modeKey: '_l_o_v_a_mode1550299839288',
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
        setMode: function (number) {
            memory.mode = number;
            this._base(this.modeKey, number);
        }
    }

    memory.mode = storage.getMode() || mode.view;

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
        if (data && data.length) {
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
            dom = createTags(directory) + createTags(files);
        } else {
            storage.removePath();
        }
        $('#dir-list').html(dom);
    }
    $.post({
        url: '/list',
        success: function (data) {
            if (data && data.path) {
                var home = data.path;
                var path = storage.getPath() || home;
                memory.homePath = home;
                setMap(data);
                update(path);
            } else {
                message.show('数据错误');
            }
        },
        error: function (err) {
            message.show('服务器发生意外情况，无法完成请求');
        }
    })

    function toMB(numb) {
        var size = Number(numb) / 1024 / 1024;
        return size.toFixed(2) + 'Mb';
    }


    $('#file-control').on('change', function (e) {
        var list = [];
        var fs = document.getElementById('file-control');
        var submit = $('.file-container');
        if (fs && fs.files && fs.files.length) {
            $.each(fs.files, function (i, v) {
                list.push(['<li><span>', v.name, '</span><label>', toMB(v.size), '</label></li>'].join(''));
            })
            $('.file-list').html(list.join(''));
            $('.file-total').html('Total: ' + fs.files.length);
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


    var loading = $('#my-modal-loading');


    /**upload */
    $('.submit-file').click(function () {
        $('#upload-submit').trigger('click');
        loading.modal('open');
    });


    /** upload */

    var progress = $.AMUI.progress;
    $('#np-s').on('click', function () {
        progress.start();
    });

    $('#np-d').on('click', function () {
        progress.done();
    });

    global.uploadFiles = function () {
        var form = $("#dataForm");
        form.ajaxSubmit(function (data) {
            loading.modal('close');
            if (data.success) {
                location.reload();
            } else {
                message.show('文件路径错误');
            }

        });
        return false;
    }

    global.next = function (key) {
        update(key);
    }
});