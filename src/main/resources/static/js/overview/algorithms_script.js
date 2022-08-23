/*------------------------ pre_defined_var ------------------------*/
// 定义一个页面对象
var page = {};
// 页面对象的属性
// #1、每页数据
var records = new Array();
// #2、当前页
var currentPage;
// #3、每页条数
var pageSize;
// #4、总条数
var total;
// #5、页面数
var pages;
// #6、每页最大条数
var maxPageSize = 3;

// 浏览器中用户的登录信息
var user_loginInfo;

// 限制输入数据的正则表达式： successExample: [^a-zA-Z0-9\_\u4e00-\u9fa5] [^a-zA-Z0-9\！（）——【】、：‘’“”《》，。？\u4e00-\u9fa5]
// failExample: fail: [`~!@#-_$%^&*()+=|{}':;',\[\\]<>/?~！@#￥%……&*（）——+|{}【】《》 ‘；：”“’。，、？]
const matchStr = "[^a-zA-Z0-9\\！（）——【】、：‘’“”《》，。？\u4e00-\u9fa5]";
/*------------------------ pre_defined_var ------------------------*/
/*--------------- 获取图片轮播中与图片绑定的按钮标签字符串 ---------------*/
function getImageButtons(images_length, images_divId) {
    let buttons = "";
    for (let i = 0; i < images_length; i++) {
        if(i == 0) {
            buttons += "<button type='button' data-bs-target='#"+images_divId+"' data-bs-slide-to='"+i+"' style='display: none;' aria-label='Slide " + (i + 1) + "' class='active' aria-current='true'></button>";
        } else {
            buttons += "<button type='button' data-bs-target='#"+images_divId+"' data-bs-slide-to='"+i+"' style='display: none;' aria-label='Slide " + (i + 1) + "'></button>";
        }
    }
    return buttons;
}
/*--------------- 获取图片轮播中与图片绑定的按钮标签字符串 ---------------*/
/*----------------- 获取图片轮播中图片标签字符串 -----------------*/
function getImages(images) {
    let paths = new Array();
    for (let i = 0; i < images.length; i++) {
        paths.push(images[i].filePath);
    }
    let srcs = JSON.stringify(paths);
    let images_str = "";
    for (let i = 0; i < images.length; i++) {
        let src = images[i].filePath;
        if(i == 0) {
            images_str += "<div class='carousel-item active'>" +
                "<img src='"+src+"' data-src='"+src+"' class='d-block w-100 img img-fluid' onclick=imageChecker('" + i + "&~" + srcs + "')>" +
                "</div>";
        } else {
            images_str += "<div class='carousel-item'>" +
                "<img src='"+src+"' data-src='"+src+"' class='d-block w-100 img img-fluid' onclick=imageChecker('" + i + "&~" + srcs + "')>" +
                "</div>";
        }
    }
    return images_str;
}
/*----------------- 获取图片轮播中图片标签字符串 -----------------*/
/*------ 根据tr的id移除表格中的tr标签（以删除页面上的算法概述） ------*/
function removeTrById(Algorithms, id) {
    let trId = "tr" + id;
    let trs = $('#' + Algorithms).find('tr');
    if(trs.length > 0) {
        for (let i = 0; i < trs.length; i++) {
            let tr_id = trs.eq(i).attr('id');
            if(tr_id == trId) {
                trs.eq(i).remove();
            }
        }
    }
}
/*------ 根据tr的id移除表格中的tr标签（以删除页面上的算法概述） ------*/
/*------ 移除表格中的所有tr标签（方便用户查询时清除页面主要内容后显示查询结果） ------*/
function removeAllTr(Algorithms) {
    let trs = $('#' + Algorithms).find('tr');
    if(trs.length > 0) {
        for (let i = 0; i < trs.length; i++) {
            trs.eq(i).remove();
        }
    }
}
// 未登录时点击登录按钮
function loginS() {
    window.location.href = "http://localhost:8080/Login?flag=overview";
}
/*------ 移除表格中的所有tr标签（方便用户查询时清除页面主要内容后显示查询结果） ------*/

// 日期初始化函数
function initArray() {
    this.length = initArray.arguments.length;
    for (let i = 0; i < this.length; i++)
        this[i + 1] = initArray.arguments[i];
}
// 页面中显示当前日期/时间的函数（在指定id的标签内显示）
function showCurrentTime(id) {
    // 初始化一个当前时间对象（Date）
    let today = new Date();
    // 初始化日期
    let d = new initArray(
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六");
    // 使用jQuery的$(id).text()函数来显示时间
    // 时间字符串
    let timeStr = today.getFullYear() + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日　" + d[today.getDay() + 1];
    // 显示时间字符串
    $('#' + id).text(timeStr);
}

// 在浏览器中删除用户账号
function deleteCookie(account) {
    if(account !== undefined && account !== '') {
        if($.cookie(account) !== undefined && $.cookie(account) !== "") {
            $.cookie(account, "", null);
        }
    }
}
/* 获取服务器中保存的登录信息（包括密钥） */
function getEncryptedInfo(email) {
    let encryptedInfo = {};
    $.ajax({
        url: "User/getEncryptedInfo",
        type: "post",
        dataType: "json",
        data: { "email": email },
        async: false,
        success: function (res) {
            encryptedInfo['encryptedUserInfo'] = res.data.encryptedUserInfo;
            encryptedInfo['encryptedRandomCode'] = res.data.encryptedRandomCode;
        },
        error: function () {
            swal('信息获取出错~', '', 'error');
        }
    });
    return encryptedInfo;
}
$(function () {
    /*----------- 给整个页面添加提示窗（tooltip） -----------*/
    var tooltipTriggerList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    /*----------- 给整个页面添加提示窗（tooltip） -----------*/

    /*------ 导航栏中的列表状态 ------*/
    $('#ui').attr('hidden', true);
    $('#a1').click(function () {
        $('#ui').attr('hidden', false);
    });
    // $('#forms').attr('hidden', true);
    // $('#a2').click(function () {
    //     $('#forms').attr('hidden', false);
    // });
    $('#infoNet').attr('hidden', true);
    $('#a3').click(function () {
        $('#infoNet').attr('hidden', false);
    });
    $('#bigraph').attr('hidden', true);
    $('#a4').click(function () {
        $('#bigraph').attr('hidden', false);
    });

    /*----------------- 语音增强部分 -----------------*/
    $('#voice').attr('hidden', true);
    $('#a5').click(function () {
        $('#voice').attr('hidden', false);
    });
    /*----------------- 语音增强部分 -----------------*/
    /*------ 导航栏中的列表状态 ------*/
    // 显示当前时间
    showCurrentTime('time1');

    /*-------------- 根据用户是否登录来设置相应的变量和属性 --------------*/
    // 点击登录时
    $('#loginState').on('click', loginS);

    // 页面加载时隐藏按钮
    $('#m_btns').hide();
    $('#addBtn').hide();
    // 初始化
    user_loginInfo = {};
    let identity, token, userName, account;

    // 用户的加密信息
    let encryptedInfo = getEncryptedInfo($.cookie('account'));
    let user_info = encryptedInfo.encryptedUserInfo;
    let code = encryptedInfo.encryptedRandomCode;

    // 存在则从服务器获取解密后的明文
    if(user_info !== undefined && user_info !== null) {
        let securityReq = {};
        if(code !== undefined && code !== null) {
            securityReq["randomCode"] = decryptByDES(code, '@#~！%《*、^$?');
            securityReq["cipherText"] = user_info;
        }
        $.ajax({
            url: "User/security",
            type: "post",
            data: { "securityReq": JSON.stringify(securityReq) },
            dataType: "text",
            success: function (res) {
                if(res !== null) {
                    let split = ";";
                    let split1 = "=";
                    let splits = [];
                    if(contain(res, split)) {
                        splits = res.split(split);
                        for (let i = 0; i < splits.length; i++) {
                            let splits1 = splits[i].split(split1);
                            if(splits1[0] === "token") {
                                token = splits1[1];
                            } else if(splits1[0] === "identityCode") {
                                identity = splits1[1];
                            } else if(splits1[0] === "userName") {
                                userName = splits1[1];
                            } else if(splits1[0] === "account") {
                                account = splits1[1];
                            }
                            if(token !== undefined && identity !== undefined && userName !== undefined) {
                                changeInfo('loginState', userName);
                                break;
                            }
                        }
                    }
                }
            },
            error: function (res) {
                // 显示明文获取出错消息提示框
                swal('用户信息获取出错~', '', 'error');
            }
        });
    }
    setTimeout(function () {
        // 封装数据（identity And token And userName）
        user_loginInfo["identityCode"] = identity;
        user_loginInfo["token"] = token;
        user_loginInfo["account"] = account;
        user_loginInfo["userName"] = userName;
    }, 500);

    setTimeout(function () {
        if(user_loginInfo["token"] === undefined || user_loginInfo["token"] === "") {
            $('#addBtn').attr('data-bs-toggle', '');
            $('#addBtn').attr('data-bs-target', '');
            $('#updateAlg').attr('data-bs-toggle', '');
            $('#updateAlg').attr('data-bs-target', '');
        } else {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                $('#addBtn').attr('data-bs-toggle', 'modal');
                $('#addBtn').attr('data-bs-target', '#addAlgorithmModal');
                $('#updateAlg').attr('data-bs-toggle', 'modal');
                $('#updateAlg').attr('data-bs-target', '#addAlgorithmModal');
                // 用户身份为管理员时显示增删查改按钮
                $('#m_btns').show();
                $('#addBtn').show();
            }
        }
    }, 500);

    // 用户登录之后点击按钮退出登录时
    $('#quitLogin').click(function () {
        // 提示用户
        swal({
                title: "确认退出吗？",
                text: "",
                type: "info",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showConfirmButton: true,
                showCancelButton: true,
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let account = user_loginInfo.account;
                    let token = user_loginInfo.token;
                    if(account !== undefined && token !== undefined) {
                        // 首先删除浏览器中保存的cookie
                        deleteCookie('account');
                        // 封装传输数据
                        let userInfo = {};
                        userInfo["account"] = account;
                        userInfo["token"] = token;
                        $.ajax({
                            url: "User/quitLogin",
                            type: "post",
                            data: { "userInfo": JSON.stringify(userInfo)},
                            dataType: "json",
                            success: function (res) {
                                if(res.code === 1) {
                                    setTimeout(function () {
                                        swal({
                                                title: "成功退出登录！",
                                                text: "",
                                                type: "success",
                                                confirmButtonText: "刷新状态",
                                                showConfirmButton: true,
                                                closeOnConfirm: true
                                            },
                                            function(isConfirm){
                                                if (isConfirm) {
                                                    // 刷新整个页面
                                                    window.location.href = "http://localhost:8080/getpage?value=overview"; // Login?flag=overview
                                                    // 局部刷新
                                                    // changeInfo('loginState', '');
                                                }
                                            });
                                    }, 100);
                                }
                            },
                            error: function (res) {
                                swal("退出登录失败！", "", "error");
                            }
                        });
                    }
                }
            });
    });
    /*-------------- 根据用户是否登录来设置相应的变量和属性 --------------*/

    // 隐藏全选按钮和标签
    $('#allChecked input').hide();
    $('#allChecked label').hide();

    if(typeof FileReader == "undefined") {
        swal("浏览器版本不支持~", "请更换浏览器后再上传文件！", "warning");
    }

    /*------------------- 初始化页面对象 -------------------*/
    records = new Array();
    // 页面加载时首先加载第一页的数据
    currentPage = 1;
    // 每页条数
    pageSize = 0;
    // 总条数
    total = 0;
    // 页面数
    pages = 0;
    // 显示页面加载指示器
    $('.loadingAnimation').show();
    // 加载第一页的信息
    getPageData();
    /*------------------- 初始化页面对象 -------------------*/
    /*-------------------- 页面滚动条向下滚动时异步加载（按页加载）数据库中的数据 --------------------*/
    $(window).on('scroll', getNextPageData);
    /*-------------------- 页面滚动条向下滚动时异步加载（按页加载）数据库中的数据 --------------------*/
    // 根据页面中加载的内容判断是否出现管理按钮来对算法概述进行管理
    if(getTable_trs('Algorithms') == 0) {
        $('#manageAlg').hide();
    }
});

// 改变登录按钮的相关信息
function changeInfo(id, userName) {
    if(userName === undefined || userName === "") {
        /*--------------- 退出登录后还原登录按钮 ---------------*/
        // 绑定登录（loginState）的点击事件
        $('#' + id).on('click', loginS);
        // 还原状态
        $('#' + id).text('登录');
        // 显示下拉菜单
        $('#' + id).attr('data-toggle', '');
        $('#' + id).attr('aria-expanded', '');
        // 改变按钮样式
        $('#' + id).removeClass('btn-outline-success');
        $('#' + id).addClass('btn-outline-secondary');
        /*--------------- 退出登录后还原登录按钮 ---------------*/
    } else {
        /*--------------- 用户登录成功后 ---------------*/
        // 解除登录（loginState）的点击事件
        $('#' + id).off('click');
        // 显示用户名
        $('#' + id).text('用户：' + userName);
        // 显示下拉菜单
        $('#' + id).attr('data-toggle', 'dropdown');
        $('#' + id).attr('aria-expanded', 'false');
        // 改变按钮样式
        $('#' + id).removeClass('btn-outline-secondary');
        $('#' + id).addClass('btn-outline-success');
        /*--------------- 用户登录成功后 ---------------*/
    }
}

/*------------- 获取下一页数据的函数 -------------*/
function getNextPageData() {
    const scrollBottom = 6;
    let scrollHeight = $(document).height();
    let scrollTop = $(this).scrollTop();
    let windowHeight = $(this).height();
    let sumHeight = scrollTop + windowHeight;
    if ((scrollHeight - sumHeight) <= scrollBottom) {
        // 加载数据
        // 显示页面加载指示器
        $('.loadingAnimation').show();
        setTimeout(function () {
            // 当前页数加一
            currentPage ++;
            getPageData("nextPage");
        }, 2000);
    } else {
        // 隐藏页面加载指示器
        $('.loadingAnimation').hide();
        // 隐藏提示信息
        $('#tip_info').hide();
    }
}
/*------------- 获取下一页数据的函数 -------------*/

/*---------------- 获取页面数据的函数 ----------------*/
// 改变页面中的提示信息
function changeTipInfo(id1, class2, value) {
    $('#' + id1).children('.' + class2).text(value);
}
// 加载页面数据的函数
function getPageData(flag) {
    $.ajax({
        url: "Algorithms/listPageOverview",
        type: "post",
        data: {"currentPage": currentPage, "maxPageSize": maxPageSize},
        dataType: "json",
        success: function (res) {
            // 隐藏全选按钮
            $('#allChecked label').hide();
            $('#allChecked input').hide();
            // 隐藏概述中的选择按钮
            hideCheckboxes('choose');
            // 隐藏页面加载指示器
            $('.loadingAnimation').hide();
            // 获取后台数据
            let data = res.data;
            if (res.code == 0) {
                if(flag == "nextPage") {
                    // 加入提示信息
                    changeTipInfo('tip_info', 'tip', '亲，没有更多数据了哦~~~');
                    // 显示提示信息
                    $('#tip_info').show();
                    // 始终保持在最后一页（有新数据添加时页面数自动刷新）
                    currentPage = data;
                } else {
                    // 加载第一页数据时
                    changeTipInfo('tip_info', 'tip', '暂时还没有数据哦...');
                    // 显示提示信息
                    $('#tip_info').show();
                }
            } else {
                pageSize = data.pageSize;
                total = data.total;
                pages = data.pages;
                records = data.records;
                // 判断后台返回的记录是否为空
                if (records != undefined && records != null && records.length > 0) {
                    for (let i = 0; i < records.length; i++) {
                        let record = records[i];
                        overviewAdder("Algorithms", record);
                    }
                }
                // 显示管理按钮
                $('#manageAlg').show();
                // 隐藏提示信息
                $('#tip_info').hide();
            }
        },
        error: function () {
            // 隐藏全选按钮
            $('#allChecked label').hide();
            $('#allChecked input').hide();
            // 隐藏概述中的选择按钮
            hideCheckboxes('choose');
            // 隐藏页面加载指示器
            $('.loadingAnimation').hide();
            // 隐藏提示信息
            $('#tip_info').hide();
            swal("页面数据加载失败！", "", "error");
        }
    });
}
/*---------------- 获取页面数据的函数 ----------------*/

/*------------------ 根据后台返回数据（res.data.records）中的一条记录在界面添加算法概述 ------------------*/
function overviewAdder(AlgorithmsId, record) {
    if(record != null) {
        var tr_str = "tr";
        var images_str = "images_div";
        /*------------ 非文件数据 ------------*/
        // 算法id
        let alg_id = record.id;
        // 每行的id
        let trId = tr_str + alg_id;
        // 轮播图片div块的id
        let images_divId = images_str + alg_id;
        // 作者与机构的id
        let aAI = "aai" + alg_id;
        // 出版时间的id
        let pD = "pd" + alg_id;
        // 级别与名称的id
        let gAN = "gan" + alg_id;
        // 文字描述的id
        let wD = "wd" + alg_id;
        // pdf下载按钮的id
        let pdfBtn = "pdfbtn" + alg_id;
        // 标题
        let alg_title = record.title;
        // 作者与机构
        let authorAndInstitution = record.authorAndInstitution;
        // 出版时间
        let publicDate = record.publicDate;
        // 级别与名称
        let gradeAndName = record.gradeAndName;
        // 算法的文字描述
        let wordDesc_jsonStr = record.wordDesc;
        let wordDesc = "empty";
        if(wordDesc_jsonStr != null) {
            let tmp = JSON.parse(wordDesc_jsonStr);
            if(tmp != null) {
                wordDesc = tmp.wordDesc;
            }
        }
        /*------------ 非文件数据 ------------*/
        /*------------ 文件数据 ------------*/
        // 图片数据
        let images_jsonStr = record.images;
        let images = JSON.parse(images_jsonStr);
        // pdf文件数据
        let pdfFiles_jsonStr = record.pdfFiles;
        let pdfFiles = JSON.parse(pdfFiles_jsonStr);
        let realName = pdfFiles[0].fileName;
        let path = pdfFiles[0].filePath;
        /*------------ 文件数据 ------------*/
        // 往表格中添加一行并赋予其id
        $('#' + AlgorithmsId).append("<tr id='" + trId + "'></tr>");
        // 图片按钮标签字符串
        let buttons = "";
        // 图片标签字符串
        let imageItems = "";
        if(images != null) {
            buttons = getImageButtons(images.length, images_divId);
            imageItems = getImages(images);
        }
        let overview = "<div class='card-group mb-5' style='background-color: #FFFFFF;!important;'>" +
            "<div class='card'><div class='w-30 allCenter' style='margin-right: auto;'>" +
            "<input class='checked-hooray w-35' id='"+alg_id+"' type='checkbox' name='choose' style='width: 26px; height: 26px; display: none; margin-right: auto; ' onclick='choose_click(this)'></div>" +
            "<h1 class='font1' style='text-align: center;'>" + alg_title + "</h1>" +
            "<div class='card-body'>" +
            "<div class='row1 mb-2'><span class='rowtit'>作者与机构：</span><span class='abstract-text' id='"+aAI+"'>" + authorAndInstitution + "</span></div>" +
            "<div class='row1 mb-2'><span class='rowtit'>出版时间：</span><span class='abstract-text' id='"+pD+"'>" + publicDate + "</span></div>" +
            "<div class='row1 mb-2'><span class='rowtit'>级别/名称：</span><span class='abstract-text' id='"+gAN+"'>" + gradeAndName + "</span></div>" +
            "<div class='row1'><span class='rowtit'>内容描述：</span><span id='"+wD+"'><span class='abstract-text'>" + wordDesc + "</span>" +
            "<label style='display: inline-block; width: 30px; margin-left: 10px; '><a class='a1' title='点击浏览全文' id='"+path+"' onclick=checkPDF(this)>全文</a></label></span></div></div></div>" +
            "<div class='card'>" +
            "<div class='card-body allCenter'><button type='button' id='"+pdfBtn+"' class='btn btn-primary form-control w-80' title='点击下载pdf文件' name='"+realName+ "," + path + "' >" +
            "<span style='display: inline-block; width: 88px; font-size: 20px;'>下载&nbsp;PDF</span>" +
            "<span style='display: inline-block; width: 30px;'>" +
            "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='#FFFFFF' class='bi bi-download' viewBox='0 0 16 16'>" +
            "<path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z'/>" +
            "<path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z'/></svg></span></button></div>" +
            "<div class='card-body allCenter' style='height: 500px;'>" +
            "<div class='carousel slide carousel-fade carousel-dark w-80' data-bs-ride='carousel' id='"+images_divId+"' onmouseover=images_divBtns_show('"+images_divId+"') onmouseout=images_divBtns_hide('"+images_divId+"')>" +
            "<div class='carousel-indicators'>" + buttons + "</div><div class='carousel-inner'>" + imageItems + "</div>" +
            "<button class='carousel-control-prev' type='button' data-bs-slide='prev' style='display: none;' data-bs-target='#"+images_divId+"'>" +
            "<span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span></button>" +
            "<button class='carousel-control-next' type='button' data-bs-slide='next' style='display: none;' data-bs-target='#"+images_divId+"'>" +
            "<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Next</span></button>" +
            "</div></div></div></div>";
        $('#' + trId).append(overview);

        // pdf文件为空时，隐藏全文超链接
        if((realName === undefined || realName === "") || (path === undefined || path === "")) {
            $('#' + wD + ' label a').hide();
        }
        // 给pdf按钮绑定点击事件
        $('#' + pdfBtn).on('click', function () { downloadPDF(realName, path); });
    }
}
/*------------------ 根据后台返回数据（res.data.records）中的一条记录在界面添加算法概述 ------------------*/
/*-------------------- 控制图片轮播中的按钮是否显示 --------------------*/
function images_divBtns_show(id) {
    $('#' + id + ' .carousel-indicators button').show();
    $('#' + id + ' button').show();
}
function images_divBtns_hide(id) {
    $('#' + id + ' .carousel-indicators button').hide();
    $('#' + id + ' button').hide();
}
/*-------------------- 控制图片轮播中的按钮是否显示 --------------------*/

/*--------------------- 查看全文函数 ---------------------*/
function checkPDF(a) {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            window.open('/pdf/web/viewer.html?file=' + a.id);
        } else {
            // 用户未登录时不能使用pdf论文的预览功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
}
/*--------------------- 查看全文函数 ---------------------*/
/*----------------------------------- 文件下载函数 --------------------------------------*/
function downLoadFile(fileData) {
    var form=$("<form>"); // 定义一个form表单
    form.attr("style","display:none");
    form.attr("target","_blank");
    form.attr("method","post");
    form.attr("action","/File/download");
    var input1=$("<input>");
    input1.attr("type","hidden");
    input1.attr("name","fileData");
    input1.attr("value",fileData);
    $("body").append(form); // 将表单放置在web中
    form.append(input1);
    form.submit(); // 表单提交
}

function downloadPDF(realName, filePath) {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((realName === undefined || realName === "") || (filePath === undefined || filePath === "")) {
                swal("PDF文件还未上传。", "请几天后查看。", "info");
            } else {
                // 封装
                let fileData = {};
                fileData["realName"] = realName;
                fileData["filePath"] = filePath;
                let data = JSON.stringify(fileData);
                // 下载文件
                downLoadFile(data);
            }
        } else {
            // 用户未登录时不能使用pdf论文的下载功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
}
/*----------------------------------- 文件下载函数 --------------------------------------*/

// 根据标签id判断标签内容是否为空
function isEmpty(id) {
    if($('#' + id).is('input') || $('#' + id).is('textarea')) {
        let type = $('#' + id).attr('type');
        if(type == "file") {
            let contentArr = $('#' + id).prop('files');
            return contentArr == undefined || contentArr == null || contentArr.length == 0;
        } else {
            let content = $('#' + id).val();
            return content == undefined || content == null || content == "";
        }
    } else {
        return null;
    }
}
/*------------------ 算法内容描述（图片）上传 ------------------*/
$("#imgDesc").fileinput({
    theme: 'fas',   // 设置主题
    language: 'zh', // 设置语言
    allowedFileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'], // 允许上传的文件后缀
    allowedFileTypes: ['image'], // 允许上传的文件类型 'image', 'html', 'text', 'video', 'audio', 'flash', 'object'
    showUpload: false, // 是否显示上传按钮
    minImageWidth: 50, // 图片的最小宽度
    minImageHeight: 50, // 图片的最小高度
    // maxImageWidth: 100, // 图片的最大宽度
    // maxImageHeight: 100, // 图片的最大高度
    maxFileSize: 307200, // 单位为kb，如果为0表示不限制文件大小 （这里单个限制文件最大为300M）
    minFileCount: 1, // 表示允许同时上传的最少的文件个数
    maxFileCount: 30, // 表示允许同时上传的最多的文件个数
    validateInitialCount: true,
    msgFilesTooMany: "选择上传的文件数量({n})，超过允许的最大数值({m})！"
});
/*------------------ 算法内容描述（图片）上传 ------------------*/

/*------------------------ 论文pdf文件上传 ------------------------*/
$("#pdfFile").fileinput({
    theme: 'fas',   // 设置主题
    language: 'zh', // 设置语言
    // uploadUrl: "",  // 设置上传的地址
    allowedFileExtensions: ['doc', 'docx', 'pdf'], // 允许上传的文件后缀
    allowedFileTypes: ['object'], // 允许上传的文件类型 'image', 'html', 'text', 'video', 'audio', 'flash', 'object'
    showUpload: false, // 是否显示上传按钮
    // browseClass: "btn btn-primary", // 按钮样式
    maxFileSize: 307200, // 单位为kb，如果为0表示不限制文件大小 （这里单个限制文件最大为300M）
    // minFileCount: 1, // 表示允许同时上传的最少的文件个数
    // maxFileCount: 1, // 表示允许同时上传的最多的文件个数
    // enctype: 'multipart/form-data',
    validateInitialCount: true,
    msgFilesTooMany: "选择上传的文件数量({n})，超过允许的最大数值({m})！"
});
/*------------------------ 论文pdf文件上传 ------------------------*/

// 根据标签id来清空内容
function clearContent(id) {
    if($('#' + id).is('form')) {
        $('#' + id).get(0).reset();
    }
}

// 根据标签id和颜色给标签边框加上阴影
function setShadow(id, color) {
    $('#' + id).css('border', color);
    $('#' + id).css('-webkit-box-shadow', '2px 2px 10px ' + color);
    $('#' + id).css('-moz-box-shadow', '2px 2px 10px ' + color);
}
// 根据标签id恢复标签的边框样式（复原）
function resetById(id) {
    $('#' + id).css('border', '#ced4da solid 1px');
    $('#' + id).css('box-shadow', 'none');
    $('#' + id).css('outline', 'none');
}
// 根据标签id和所给的图标的dataURL在输入框增加图标
function setIcon(id, URL) {
    $('#' + id).css('background-image', 'url("'+URL+'")');
    $('#' + id).css('background-repeat', 'no-repeat');
    $('#' + id).css('background-position', 'right calc(.375em + .1875rem) center');
    $('#' + id).css('background-size', 'calc(.75em + .375rem) calc(.75em + .375rem)');
}
// 三种颜色（蓝、红、绿）
const blueColor = "#0b5ed7";
const redColor = "#dc3545";
const greenColor = "#198754";
// 输入框icon
const failureIcon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e";
const successIcon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e";
/*----------- 输入框的聚焦和失焦事件（控制输入框的样式，不包括file类型） -----------*/
/*---------------- 输入框的失焦事件绑定的函数 ----------------*/
// 表单中自动换行
function next(id) {
    // 自动聚焦输入文本框
    $('#' + id).focus();
}
function blurTipFunWithIcon(id, nextId) {
    if(isEmpty(id)) {
        setShadow(id, redColor);
        setIcon(id, failureIcon);
    } else {
        setShadow(id, greenColor);
        setIcon(id, successIcon);

        next(nextId);
    }
}
function blurTipFun(id, nextId) {
    if(isEmpty(id)) {
        setShadow(id, redColor);
    } else {
        setShadow(id, greenColor);

        next(nextId);
    }
}
/*---------------- 输入框的失焦事件绑定的函数 ----------------*/
$('#title1').on('focus', function () {
    setShadow('title1', blueColor);
    setIcon('title1', '');
});
$('#title1').on('blur', function () {
    blurTipFunWithIcon('title1', 'authorAndInstitution');
});
$('#authorAndInstitution').on('focus', function () {
    setShadow('authorAndInstitution', blueColor);
    setIcon('authorAndInstitution', '');
});
$('#publicTime').on('focus', function () {
    setShadow('publicTime', blueColor);
});
$('#gradeAndName').on('focus', function () {
    setShadow('gradeAndName', blueColor);
    setIcon('gradeAndName', '');
});
$('#wordDesc').on('focus', function () {
    setShadow('wordDesc', blueColor);
});
$('#wordDesc').on('blur', function () {
    resetById('wordDesc');
});
/*----------- 输入框的聚焦和失焦事件（控制输入框的样式，不包括file类型） -----------*/

// 将字符串中的一个字符串(例：”-“) 替换为另一字符串(例：”/“)
// #基于js中字符串的substring方法来实现的 #只能替换单个字符
function replaceStr(STR, oldStr, newStr) {
    if(STR == undefined || STR == null || STR == "") {
        return "";
    }
    // preIndex记录oldStr上一次出现的位置
    let tmp = "", preIndex = 0, indexCounter = 0;
    for (let i = 0; i < STR.length; i++) {
        if(STR[i] == oldStr) {
            indexCounter++;
            if(indexCounter == 1) {
                preIndex = i;
                tmp += STR.substring(0, i) + newStr;
            } else {
                tmp += STR.substring(preIndex + 1, i) + newStr;
                preIndex = i;
            }
        } else if(i == STR.length - 1) {
            tmp += STR.substring(preIndex + 1, i + 1);
        }
    }
    return tmp;
}
/*------------------------- 添加算法概述 -------------------------*/

/*--------------------- 检测表格中tr标签的个数 ---------------------*/
function getTable_trs(AlgorithmsId) {
    let trs = $('#' + AlgorithmsId).find('tr');
    return trs.length;
}
/*--------------------- 检测表格中tr标签的个数 ---------------------*/

// DES解密
function decryptByDES(ciphertext, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}
// 判断字符串是否含有某个子串
function contain(STR, subStr) {
    for (let i = 0; i < STR.length; i++) {
        if(subStr === STR[i]) {
            return true;
        }
    }
    return false;
}

// 添加函数
function addAlgOverview() {
    // 整个表单对象
    let formData = new FormData();
    // 部分表单数据对象
    let partFormData = {};
    /*--------------------------- 表单的非文件数据 ---------------------------*/
    // 标题（String）
    let titleId = "title1";
    let title = $('#' + titleId).val();
    // 作者和机构（String）
    let authorAndInstitutionId = "authorAndInstitution";
    let authorAndInstitution = $('#' + authorAndInstitutionId).val();
    // 出版时间（String）
    let publicTimeId = "publicTime";
    let dateStr = $('#' + publicTimeId).val();
    let tmp = replaceStr(dateStr, "-", "/");
    let publicDate = "";
    if(tmp == "") {
        publicDate = dateStr;
    } else {
        publicDate = tmp;
    }
    // 级别/名称（String）
    let gradeAndNameId = "gradeAndName";
    let gradeAndName = $('#' + gradeAndNameId).val();
    // 算法内容的文字描述（String）
    let wordDescId = "wordDesc";
    let wordDesc = $('#' + wordDescId).val();
    /*--------------------------- 表单的非文件数据 ---------------------------*/
    // 包装非文件数据
    partFormData["title"] = title;
    partFormData["authorAndInstitution"] = authorAndInstitution;
    partFormData["publicDate"] = publicDate;
    partFormData["gradeAndName"] = gradeAndName;
    partFormData["wordDesc"] = wordDesc;
    let notFileData = JSON.stringify(partFormData);
    // 设置非文件数据
    formData.append('notFiles', notFileData);
    /*--------------------------- 表单的文件数据 ---------------------------*/
    // 算法内容图片描述的输入框id
    let imgDescId = "imgDesc";
    // 论文pdf的输入框id
    let pdfFileId = "pdfFile";
    /*--------------------------- 表单的文件数据 ---------------------------*/

    if(isEmpty(titleId)) {
        setShadow(titleId, redColor);
        setIcon(titleId, failureIcon);
    }
    if(isEmpty(authorAndInstitutionId)) {
        setShadow(authorAndInstitutionId, redColor);
        setIcon(authorAndInstitutionId, failureIcon);
    }
    if(isEmpty(publicTimeId)) {
        setShadow(publicTimeId, redColor);
    }
    if(isEmpty(gradeAndNameId)) {
        setShadow(gradeAndNameId, redColor);
        setIcon(gradeAndNameId, failureIcon);
    }
    if(isEmpty(pdfFileId)) {
        swal("请上传论文的pdf文件！", "请继续上传。", "warning");
    }
    if(!isEmpty(titleId) && !isEmpty(authorAndInstitutionId) && !isEmpty(publicTimeId) &&
        !isEmpty(gradeAndNameId) && !isEmpty(pdfFileId)) {
        /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/
        // 点击之后先禁用按钮
        // 禁用按钮
        $('.modal-footer button[id="Add"]').attr('disabled', true);
        // 解绑事件
        $('.modal-footer button[id="Add"]').off('click');
        /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/

        /*------------------------- 设置算法内容的图片集 -------------------------*/
        let images = $('#' + imgDescId).prop('files');
        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i]);
        }
        /*------------------------- 设置算法内容的图片集 -------------------------*/

        /*------------------------- 设置论文的pdf文件 -------------------------*/
        let pdfFiles = $('#' + pdfFileId).prop('files');
        for (let i = 0; i < pdfFiles.length; i++) {
            formData.append('pdfFile', pdfFiles[i]);
        }
        /*------------------------- 设置论文的pdf文件 -------------------------*/
        // 显示页面加载指示器
        $('#modalDialog').showLoading();
        $.ajax({
            url: "Algorithms/addOverview",
            headers: { "token": user_loginInfo["token"]},
            type: "post",
            data: formData,
            cache: false,
            dataType: "json",
            contentType: false, // 不设置内容类型
            processData: false, // 不处理数据
            success: function (res) {
                // 接收响应的状态码
                let code = res.code;
                // 接收响应的消息
                let msg = res.message;
                // 接收已经添加到数据库的算法概述
                let record = res.data;
                // 隐藏页面加载指示器
                $('#modalDialog').hideLoading();
                if(record != null) {
                    total++;
                    // 获取当前页面中表格里的tr标签的数量
                    let tr_length = getTable_trs('Algorithms');
                    // 当前页面条数小于maxPageSize时
                    if(tr_length < maxPageSize) {
                        overviewAdder('Algorithms', record);
                    } else if(tr_length > maxPageSize) {
                        // 加载到了最后一页时
                        if(currentPage == pages) {
                            if((total - (pages - 1) * maxPageSize) <= maxPageSize) {
                                overviewAdder('Algorithms', record);
                            }
                        }
                    }
                }
                if(code == 0) {
                    if(msg == "alreadyExist") {
                        swal("算法概述已存在！", "请重新添加。", "warning");
                        // 重置表单
                        clearContent('dataForm');
                        /*-------------- 还原输入框样式 --------------*/
                        resetInputStyle(titleId, authorAndInstitutionId, publicTimeId, gradeAndNameId);
                        /*-------------- 还原输入框样式 --------------*/
                    } else if(msg == "existEmpty") {
                        swal("请先填写必要的信息！", "请继续添加。", "warning");
                    } else if(msg == "saveFileError") {
                        swal("保存文件出错！", "请重新上传文件。", "error");
                    }
                } else if(record != null) {
                    swal("上传成功！", "感谢您的贡献~~~", "success");
                    // 重置表单
                    clearContent('dataForm');
                    /*-------------- 还原输入框样式 --------------*/
                    resetInputStyle(titleId, authorAndInstitutionId, publicTimeId, gradeAndNameId);
                    /*-------------- 还原输入框样式 --------------*/
                    /*-------------- 恢复全选按钮的选择状态 --------------*/
                    unchecked("totalChoose");
                    $('#allChecked label').text("全选");
                    // 隐藏全选按钮
                    $('#allChecked label').hide();
                    $('#allChecked input').hide();
                    // 隐藏概述中的选择按钮
                    hideCheckboxes('choose');
                    /*-------------- 恢复全选按钮的选择状态 --------------*/
                    // 根据页面中加载的内容判断是否出现管理按钮来对算法概述进行管理
                    if(getTable_trs('Algorithms') > 0) {
                        $('#manageAlg').show();
                    }
                }

                /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/
                // 恢复新增按钮
                // 恢复按钮
                $('.modal-footer button[id="Add"]').attr('disabled', false);
                // 恢复事件
                $('.modal-footer button[id="Add"]').on('click', addAlgOverview);
                /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/
            },
            error: function () {
                // 隐藏页面加载指示器
                $('#modalDialog').hideLoading();
                swal("数据上传失败！", "", "error");

                /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/
                // 恢复新增按钮
                // 恢复按钮
                $('.modal-footer button[id="Add"]').attr('disabled', false);
                // 恢复事件
                $('.modal-footer button[id="Add"]').on('click', addAlgOverview);
                /*----------------- 为解决点击新增按钮后同时发送多条重复的ajax请求的问题 -----------------*/
            }
        });
    }
}
$('#addBtn').click(function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许添加信息
                // 重置表单
                clearContent('dataForm');
                /*-------------- 还原输入框样式 --------------*/
                resetInputStyle('title1', 'authorAndInstitution', 'publicTime', 'gradeAndName');
                /*-------------- 还原输入框样式 --------------*/
                // 为模态框中相应的输入框赋予提示（即绑定失焦事件）
                $('#authorAndInstitution').on('blur', function () {
                    blurTipFunWithIcon('authorAndInstitution', 'publicTime');
                });
                $('#publicTime').on('blur', function () {
                    blurTipFun('publicTime', 'gradeAndName');
                });
                $('#gradeAndName').on('blur', function () {
                    blurTipFunWithIcon('gradeAndName', 'wordDesc');
                });

                if($('.modal-footer').children('#Update').length > 0) {
                    // 解除修改按钮的点击事件
                    $('.modal-footer button[id="Update"]').off('click');
                    let flag = updateModalAttr('新增算法概述', '新增', 'Update', 'Add');
                    if(flag) {
                        $('.modal-footer button[id="Add"]').click(function () {
                            addAlgOverview();
                        });
                    }
                } else {
                    $('.modal-footer button[id="Add"]').click(function () {
                        addAlgOverview();
                    });
                }
            }
        } else {
            // 用户未登录时不能使用页面的大部分功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
});
/*------------------------- 添加算法概述 -------------------------*/

/*-------------- 还原输入框样式 --------------*/
function resetInputStyle(titleId, authorAndInstitutionId, publicTimeId, gradeAndNameId) {
    resetById(titleId);
    setIcon(titleId, '');
    resetById(authorAndInstitutionId);
    setIcon(authorAndInstitutionId, '');
    resetById(publicTimeId);
    resetById(gradeAndNameId);
    setIcon(gradeAndNameId, '');
}
/*-------------- 还原输入框样式 --------------*/

/*------------------------- 关闭模态框并清空所有标签的内容 -------------------------*/
$('#Cancel').on('click', function () {
    // 表单id
    let formId = "dataForm";
    // 重置表单
    clearContent(formId);
    /*-------------- 还原输入框样式 --------------*/
    let titleId = "title1";
    let authorAndInstitutionId = "authorAndInstitution";
    let publicTimeId = "publicTime";
    let gradeAndNameId = "gradeAndName";
    resetInputStyle(titleId, authorAndInstitutionId, publicTimeId, gradeAndNameId);
    /*-------------- 还原输入框样式 --------------*/
});
/*------------------------- 关闭模态框并清空所有标签的内容 -------------------------*/

/*----------------- 图片查看器的实现 -----------------*/
function imageChecker(img_str) {
    let strs = img_str.split("&~");
    let index = strs[0];
    let srcs = JSON.parse(strs[1]);
    var items = [],
        // get index of element clicked
        options = {
            index: index
        };
    for (let i = 0; i < srcs.length; i++) {
        let src = srcs[i];
        items.push({
            src: src
        });
    }
    new PhotoViewer(items, options);
}
/*----------------- 图片查看器的实现 -----------------*/

/*----------------- 页面内容的搜索框（自动搜索、模糊搜索） -----------------*/
$('input[name="searchOverview"]').on('input propertychange', function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            // 登录成功后即可进行搜索
            // 获取搜索框的内容
            let title_content = $('input[name="searchOverview"]').val();
            // 定义匹配非法字符的正则表达式
            let regExp = new RegExp(matchStr, "i");
            if(title_content != "") {
                if(!regExp.test(title_content)) {
                    // 重置提示信息
                    $('input[name="searchOverview"]').attr('placeholder', '输入标题后自动搜索。(模糊搜索)');
                    // 移除placeHolder的颜色样式
                    $('input[name="searchOverview"]').removeClass('searchInfo');
                    // 显示页面加载指示器
                    $('.loadingAnimation').show();
                    // 请求后端数据
                    $.ajax({
                        url: "Algorithms/searchOverview",
                        type: "post",
                        data: {"title": title_content},
                        dataType: "json",
                        success: function (res) {
                            // 隐藏全选按钮
                            $('#allChecked label').hide();
                            $('#allChecked input').hide();
                            // 隐藏概述中的选择按钮
                            hideCheckboxes('choose');
                            // 隐藏页面加载指示器
                            $('.loadingAnimation').hide();
                            // 隐藏概述添加按钮
                            $('#addBtn').hide();
                            // 隐藏页面提示信息
                            $('#tip_info').hide();
                            let code = res.code;
                            let results;
                            // 清空表格中的所有tr标签
                            removeAllTr('Algorithms');
                            if(code == 1) {
                                results = res.data;
                                // 判断后台返回的记录是否为空
                                if(results != undefined && results != null && results.length > 0) {
                                    for (let i = 0; i < results.length; i++) {
                                        let result = results[i];
                                        overviewAdder("Algorithms", result);
                                    }
                                }
                                // 解除页面绑定的滚动事件
                                $(window).off('scroll');
                            } else {
                                // 搜索不到结果时提示用户
                                // 加入提示信息
                                changeTipInfo('tip_info', 'tip', '暂无该数据......');
                                // 显示提示信息
                                $('#tip_info').show();
                            }
                        },
                        error: function () {
                            // 隐藏页面加载指示器
                            $('.loadingAnimation').hide();
                            // 隐藏概述添加按钮
                            $('#addBtn').hide();
                            // 隐藏全选按钮
                            $('#allChecked label').hide();
                            $('#allChecked input').hide();
                            // 隐藏概述中的选择按钮
                            hideCheckboxes('choose');
                            // 重新绑定页面的滚动事件
                            $(window).on('scroll', getNextPageData);
                            swal("搜索失败！", "", "error");
                        }
                    });
                } else {
                    // 加入提示信息
                    $('input[name="searchOverview"]').attr('placeholder', '输入含有非法字符！');
                    // 将输入框中的提示标红
                    $('input[name="searchOverview"]').addClass('searchInfo');
                    setTimeout(function () {
                        // 1s后清空输入框
                        $('input[name="searchOverview"]').val('');
                    }, 1000);
                }
            } else {
                // 显示页面加载指示器
                $('.loadingAnimation').show();
                // 重新加载第一页数据之前清空页面所有数据
                // 清空表格中的所有tr标签
                removeAllTr('Algorithms');
                // 输入的算法标题为空时加载第一页的信息
                getPageData();
                // 管理员才能添加算法概述
                if((user_loginInfo.identityCode - 0) === 1) {
                    // 显示概述添加按钮
                    $('#addBtn').show();
                }
                // 重新绑定页面的滚动事件
                $(window).on('scroll', getNextPageData);
            }
        } else {
            // 清空搜索框中的文本
            $('input[name="searchOverview"]').val('');
            // 用户未登录时不能使用搜索功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
});
/*----------------- 页面内容的搜索框（自动搜索、模糊搜索） -----------------*/

// 判断所有name为choose的input（checkbox）是否被隐藏
function chooseIsAllHidden(name) {
    let chooses = $('input[name='+name+']');
    for (let i = 0; i < chooses.length; i++) {
        let state = chooses.eq(i).css('display');
        if(state == "flex") {
            return false;
        }
    }
    return true;
}
// 控制选择按钮的显示或隐藏
function ctrlCheckboxes(name) {
    // 获取所有name为choose的input（checkbox）
    let chooses = $('input[name='+name+']');
    for (let i = 0; i < chooses.length; i++) {
        let state = chooses.eq(i).css('display');
        if(state == "none") {
            chooses.eq(i).css('display', "flex");
        } else if(state == "flex") {
            chooses.eq(i).css('display', "none");
        }
    }
}
function hideCheckboxes(name) {
    // 获取所有name为choose的input（checkbox）
    let chooses = $('input[name='+name+']');
    for (let i = 0; i < chooses.length; i++) {
        chooses.eq(i).css('display', 'none');
    }
}
/*----------------- 算法概述管理按钮 -----------------*/
$('#manageAlg').click(function () {
    /*------ 必须保证全选按钮和选择按钮同时出现（不然就是个bug了——_——） ------*/
    // 获取全选按钮和标签的状态（是否被隐藏）
    let isHidden1 = $('#allChecked input').is(':hidden');
    let isHidden2 = $('#allChecked label').is(':hidden');
    if(isHidden1 && isHidden2) {
        if(chooseIsAllHidden('choose')) {
            $('#allChecked input').show();
            $('#allChecked label').show();
            ctrlCheckboxes('choose');
        }
    } else {
        if(!chooseIsAllHidden('choose')) {
            $('#allChecked input').hide();
            $('#allChecked label').hide();
            ctrlCheckboxes('choose');
        }
    }
    /*------ 必须保证全选按钮和选择按钮同时出现（不然就是个bug了——_——） ------*/
});
/*----------------- 算法概述管理按钮 -----------------*/

/*------------------ 全选和反选函数 ------------------*/
/*------ 根据input的name属性来选中或取消选中复选框 ------*/
function checked(name) {
    let chooses = $('input[name='+name+']');
    for (let key in chooses) {
        chooses[key].checked = true;
    }
}
function unchecked(name) {
    let chooses = $('input[name='+name+']');
    for (let key in chooses) {
        chooses[key].checked = false;
    }
}
/*------ 根据input的name属性来选中或取消选中复选框 ------*/
/*--------------------- 全选函数 ---------------------*/
function allClicked(check) {
    if(check.checked) {
        checked('choose');
        $('#allChecked label').text("全不选");
    } else {
        unchecked('choose');
        $('#allChecked label').text("全选");
    }
}
/*--------------------- 全选函数 ---------------------*/
/*--------------- 判断复选框是否全部选中 ---------------*/
function isAllChecked(name) {
    let checked_counter = 0;
    let chooses = $('input[name='+name+']');
    for (let key in chooses) {
        if(chooses[key].checked) {
            checked_counter++;
        }
    }
    return checked_counter == chooses.length;
}
/*--------------- 判断复选框是否全部选中 ---------------*/
/*------------------- 选择函数 -------------------*/
function choose_click(check) {
    if(!check.checked) {
        unchecked("totalChoose");
        $('#allChecked label').text("全选");
    } else {
        if(isAllChecked('choose')) {
            checked("totalChoose");
            $('#allChecked label').text("全不选");
        } else {
            unchecked("totalChoose");
            $('#allChecked label').text("全选");
        }
    }
}
/*------------------- 选择函数 -------------------*/
/*------------------ 全选和反选函数 ------------------*/

/*------ 根据inputName获取复选框中已选中的复选框的id（即算法概述的id） ------*/
function listSelectedId(name) {
    let selectedItems = [];
    let objs = $('input[name='+name+']');
    for(let i in objs) {
        if(objs[i].checked) {
            let tmpId = objs[i].id;
            selectedItems.push(tmpId);
        }
    }
    return selectedItems;
}
/*------ 根据inputName获取复选框中已选中的复选框的id（即算法概述的id） ------*/
/*--------- 删除算法概述（可通过复选框实现批量删除，需要删除的有：数据库的数据、服务器的数据以及页面存在的数据） ---------*/
$('#deleteAlg').on('click', function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许删除信息
                // 获取已选复选框的id（即算法概述的id）
                let ids = listSelectedId('choose');
                // 筛选数组
                let IDS = new Array();
                for (let i = 0; i < ids.length; i++) {
                    if(ids[i] != undefined && ids[i] != null && ids[i] != "") {
                        IDS.push(ids[i]);
                    }
                }
                if(IDS != undefined && IDS != null && IDS.length > 0) {
                    // 将数组序列化
                    let idArray = JSON.stringify(IDS);
                    // 弹出确认框确认删除
                    swal({
                            title: "确认删除吗？",
                            text: "",
                            type: "info",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(isConfirm){
                            if (isConfirm) {
                                // 添加遮盖层和页面指示器
                                $('.content').showLoading();
                                $.ajax({
                                    url: "Algorithms/deleteOverview",
                                    headers: { "token": user_loginInfo["token"] },
                                    type: "post",
                                    data: {"idArray": idArray},
                                    dataType: "json",
                                    success: function (res) {
                                        if(res.code == 1) {
                                            // 删除页面中存在的数据
                                            if(IDS.length > 0) {
                                                for (let i = 0; i < IDS.length; i++) {
                                                    removeTrById('Algorithms', IDS[i]);
                                                }
                                                swal("删除成功。", "", "success");
                                                // 隐藏遮盖层和页面指示器
                                                $('.content').hideLoading();
                                                /*-------------- 恢复全选按钮的选择状态 --------------*/
                                                unchecked("totalChoose");
                                                $('#allChecked label').text("全选");
                                                /*-------------- 恢复全选按钮的选择状态 --------------*/
                                                /*---------------- 页面内容清空后 ----------------*/
                                                if(getTable_trs('Algorithms') == 0) {
                                                    // 隐藏全选按钮
                                                    $('#allChecked input').hide();
                                                    $('#allChecked label').hide();
                                                    // 隐藏概述中的选择按钮
                                                    hideCheckboxes('choose');
                                                    // 隐藏管理按钮
                                                    $('#manageAlg').hide();
                                                    // 加入提示信息
                                                    changeTipInfo('tip_info', 'tip', '暂无数据......');
                                                    // 显示提示信息
                                                    $('#tip_info').show();
                                                }
                                                /*---------------- 页面内容清空后 ----------------*/
                                            }
                                        }
                                    },
                                    error: function () {
                                        // 隐藏遮盖层和页面指示器
                                        $('.content').hideLoading();
                                        swal("删除失败！", "", "error");
                                    }
                                });
                            }
                        });
                } else {
                    swal("请先选择算法概述！", "", "error");
                }
            }
        } else {
            // 用户未登录时不能使用页面的大部分功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
});
/*--------- 删除算法概述（可通过复选框实现批量删除） ---------*/

// 修改模态框下子元素相应的属性
function updateModalAttr(text1, text2, id1, id2) {
    $('#exampleModalLabel').text(text1);
    let buttons = $('.modal-footer button');
    for (let i = 0; i < buttons.length; i++) {
        if(buttons.eq(i).attr('id') == id1) {
            buttons.eq(i).text(text2);
            buttons.eq(i).attr('id', id2);
            return true;
        }
    }
    return false;
}
/*--------- 修改算法概述（一次修改一个算法概述） ---------*/
// 修改函数
function updateAlgOverview() {
    // 整个表单对象
    let formData1 = new FormData();
    // 部分表单数据对象
    let partFormData = {};
    /*--------------------------- 表单的非文件数据 ---------------------------*/
    // 标题（String）
    let titleId = "title1";
    let title = $('#' + titleId).val();
    // 作者和机构（String）
    let authorAndInstitutionId = "authorAndInstitution";
    let authorAndInstitution = $('#' + authorAndInstitutionId).val();
    // 出版时间（String）
    let publicTimeId = "publicTime";
    let dateStr = $('#' + publicTimeId).val();
    let tmp = replaceStr(dateStr, "-", "/");
    let publicDate = "";
    if(tmp != "") {
        publicDate = tmp;
    }
    // 级别/名称（String）
    let gradeAndNameId = "gradeAndName";
    let gradeAndName = $('#' + gradeAndNameId).val();
    // 算法内容的文字描述（String）
    let wordDescId = "wordDesc";
    let wordDesc = $('#' + wordDescId).val();
    /*--------------------------- 表单的非文件数据 ---------------------------*/
    // 包装非文件数据
    partFormData["title"] = title;
    partFormData["authorAndInstitution"] = authorAndInstitution;
    partFormData["publicDate"] = publicDate;
    partFormData["gradeAndName"] = gradeAndName;
    partFormData["wordDesc"] = wordDesc;
    let notFileData = JSON.stringify(partFormData);
    formData1.append('notFiles', notFileData);
    /*--------------------------- 表单的文件数据 ---------------------------*/
    // 算法内容图片描述的输入框id
    let imgDescId = "imgDesc";
    // 论文pdf的输入框id
    let pdfFileId = "pdfFile";
    /*--------------------------- 表单的文件数据 ---------------------------*/
    if(isEmpty(titleId)) {
        setShadow(titleId, redColor);
        setIcon(titleId, failureIcon);
    }
    if(isEmpty(authorAndInstitutionId) && isEmpty(publicTimeId) &&
        isEmpty(gradeAndNameId)) {
        swal("请至少再选一项进行修改！", "（tip：作者/机构 或 出版时间 或 级别/名称）", "warning");
    }
    if(!isEmpty(titleId) && (!isEmpty(authorAndInstitutionId) || !isEmpty(publicTimeId) ||
        !isEmpty(gradeAndNameId))) {
        /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/
        // 点击之后先禁用按钮
        // 禁用按钮
        $('.modal-footer button[id="Update"]').attr('disabled', true);
        // 解绑事件
        $('.modal-footer button[id="Update"]').off('click');
        /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/

        /*------------------------- 设置算法内容的图片集 -------------------------*/
        let images = $('#' + imgDescId).prop('files');
        for (let i = 0; i < images.length; i++) {
            formData1.append('image', images[i]);
        }
        /*------------------------- 设置算法内容的图片集 -------------------------*/
        /*------------------------- 设置论文的pdf文件 -------------------------*/
        let pdfFiles = $('#' + pdfFileId).prop('files');
        for (let i = 0; i < pdfFiles.length; i++) {
            formData1.append('pdfFile', pdfFiles[i]);
        }
        /*------------------------- 设置论文的pdf文件 -------------------------*/
        // 显示页面加载指示器
        $('#modalDialog').showLoading();
            $.ajax({
                url: "Algorithms/updateOverview",
                headers: { "token": user_loginInfo["token"] },
                type: "post",
                data: formData1,
                cache: false,
                dataType: "json",
                contentType: false, // 不设置内容类型
                processData: false, // 不处理数据
                success: function (res) {
                    // 接收响应的状态码
                    let code = res.code;
                    // 接收响应的消息
                    let msg = res.message;
                    // 接收已经添加到数据库的算法概述
                    let algOverview = res.data;
                    // 隐藏页面加载指示器
                    $('#modalDialog').hideLoading();
                    if(code == 0) {
                        if(msg == "titleIsEmpty") {
                            swal("标题不能为空！", "请继续添加。", "warning");
                        } else if(msg == "noEnd") {
                            swal("请至少再选一项进行修改！", "请继续添加。", "warning");
                        } else if(msg == "delFileFail") {
                            swal("移除文件失败！", "请重新上传。", "error");
                        } else if(msg == "saveFileFail") {
                            swal("保存文件失败！", "请重新上传。", "error");
                        } else if(msg == "overviewIsNotExist") {
                            swal("算法概述不存在！", "请重新输入标题。", "warning");
                        }
                    } else if(algOverview != null) {
                        swal("修改成功！", "感谢您的帮助~~~", "success");
                        // 重置表单
                        clearContent('dataForm');
                        /*-------------- 还原输入框样式 --------------*/
                        resetInputStyle(titleId, authorAndInstitutionId, publicTimeId, gradeAndNameId);
                        /*-------------- 还原输入框样式 --------------*/
                        /*------ 以下填写修改页面中算法概述的代码（存在则修改） ------*/
                        update('Algorithms', algOverview);
                        /*------ 以下填写修改页面中算法概述的代码（存在则修改） ------*/
                    }

                    /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/
                    // 点击之后先解禁按钮
                    // 解禁按钮
                    $('.modal-footer button[id="Update"]').attr('disabled', false);
                    // 重绑事件
                    $('.modal-footer button[id="Update"]').on('click', updateAlgOverview);
                    /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/
                },
                error: function () {
                    /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/
                    // 点击之后先解禁按钮
                    // 解禁按钮
                    $('.modal-footer button[id="Update"]').attr('disabled', false);
                    // 重绑事件
                    $('.modal-footer button[id="Update"]').on('click', updateAlgOverview);
                    /*----------------- 为解决点击修改按钮后可能同时发送多条重复的ajax请求的问题 -----------------*/

                    // 隐藏页面加载指示器
                    $('#modalDialog').hideLoading();
                    swal("数据修改失败！", "", "error");
                }
            });
        }
}

/*--------- 判断父元素下是否含有子元素 ---------*/
// $('(# / .)×××').find('(# / .)×××'); $('(# / .)×××').children('(# / .)×××');
// function isHas(selector1, selector2) {
//
// }
/*--------- 判断父元素下是否含有子元素 ---------*/
// 根据算法概述对象修改表格中指定算法概述的函数
function update(tableId, algOverview) {
    let alg_id = algOverview.id;
    let trId = "tr" + alg_id;
    // 作者与机构的id
    let aAI = "aai" + alg_id;
    // 出版时间的id
    let pD = "pd" + alg_id;
    // 级别与名称的id
    let gAN = "gan" + alg_id;
    // 文字描述的id
    let wD = "wd" + alg_id;
    // pdf下载按钮的id
    let pdfBtn = "pdfbtn" + alg_id;
    // 作者与机构
    let authorAndInstitution = algOverview.authorAndInstitution;
    // 出版时间
    let publicDate = algOverview.publicDate;
    // 级别/名称
    let gradeAndName = algOverview.gradeAndName;
    // 文字描述
    let wordDesc = algOverview.wordDesc;
    if(wordDesc == 'null') {
        wordDesc = "empty";
    } else {
        wordDesc = JSON.parse(wordDesc).wordDesc;
    }
    // 图片描述
    let images_jsonStr = algOverview.images;
    let images = JSON.parse(images_jsonStr);
    // pdf文件
    let pdfFiles_jsonStr = algOverview.pdfFiles;
    let pdfFile = JSON.parse(pdfFiles_jsonStr)[0];
    // 判断从表格中是否能找到需修改的指定元素
    // 方法一：
    // let trItem = $('#' + tableId).find('#' + trId);
    // 方法二：
    let trItem = $('#' + tableId).children('#' + trId);
    // 如果元素存在则修改
    if(trItem.length > 0) {
        // 修改作者与机构
        $('#' + aAI).text(authorAndInstitution);
        // 修改出版时间
        $('#' + pD).text(publicDate);
        // 修改级别与名称
        $('#' + gAN).text(gradeAndName);
        // 修改文字描述
        $('#' + wD + '>span').text(wordDesc);
        // 修改pdf文件
        if(pdfFile.state != null && pdfFile.state == "pdfEmpty") {
            // 修改后上传的pdf为空时
            // 修改链接pdf的超链接（隐藏全文超链接）
            $('#' + wD + ' label a').hide();
            // 修改链接pdf的下载按钮
            // 首先解除点击事件
            $('#' + pdfBtn).off('click');
            // 给pdf按钮绑定点击事件
            $('#' + pdfBtn).on('click', function () { downloadPDF('', ''); });
        } else {
            // 修改链接pdf的超链接
            $('#' + wD + ' label a').attr('id', pdfFile.filePath);
            // 显示全文超链接
            $('#' + wD + ' label a').show();
            // 修改链接pdf的下载按钮
            // 首先解除点击事件
            $('#' + pdfBtn).off('click');
            // 给pdf按钮绑定点击事件
            $('#' + pdfBtn).on('click', function () { downloadPDF(pdfFile.fileName, pdfFile.filePath); });
        }
        // 修改内容的图片描述
        let images_divId = "images_div" + alg_id;
        if(images == null || images.length == 0) {
            // 修改后上传的图片为空时
            $('#' + images_divId).children('.carousel-indicators').html('');
            $('#' + images_divId).children('.carousel-inner').html('');
        } else {
            let buttons = getImageButtons(images.length, images_divId);
            let imageItems = getImages(images);
            $('#' + images_divId).children('.carousel-indicators').html(buttons);
            $('#' + images_divId).children('.carousel-inner').html(imageItems);
        }
    }
}
// 修改按钮
$('#updateAlg').on('click', function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许修改信息
                // 重置表单
                clearContent('dataForm');
                /*-------------- 还原输入框样式 --------------*/
                resetInputStyle('title1', 'authorAndInstitution', 'publicTime', 'gradeAndName');
                /*-------------- 还原输入框样式 --------------*/
                // 为模态框中相应的输入框移除提示
                // 首先移除失焦事件
                $('#authorAndInstitution').off('blur');
                $('#authorAndInstitution').on('blur', function () {
                    resetById('authorAndInstitution');
                });
                // 首先移除失焦事件
                $('#publicTime').off('blur');
                $('#publicTime').on('blur', function () {
                    resetById('publicTime');
                });
                // 首先移除失焦事件
                $('#gradeAndName').off('blur');
                $('#gradeAndName').on('blur', function () {
                    resetById('gradeAndName');
                });

                if($('.modal-footer').children('#Add').length > 0) {
                    // 解除增加的点击事件
                    $('.modal-footer button[id="Add"]').off('click');
                    let flag = updateModalAttr('修改算法概述', '修改', 'Add', 'Update');
                    if(flag) {
                        $('.modal-footer button[id="Update"]').on('click', updateAlgOverview);
                    }
                }
            }
        } else {
            // 用户未登录时不能使用页面的大部分功能
            // 提示用户
            swal({
                    title: "请先登录！",
                    text: "",
                    type: "warning",
                    confirmButtonText: "确定",
                    closeOnConfirm: true
                },
                function(isConfirm){
                    if (isConfirm) {
                        window.location.href = "http://localhost:8080/Login?flag=overview";
                    }
                });
        }
    }
});
/*--------- 修改算法概述（一次修改一个算法概述） ---------*/

