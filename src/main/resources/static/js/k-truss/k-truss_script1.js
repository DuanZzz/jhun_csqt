// 浏览器中用户的登录信息
var user_loginInfo;

/*-------------------------- 下拉框选择数据集文件 --------------------------*/
// 数据集文件加载函数
function fileLoad() {
    // 从数据库中获取数据集文件
    $.ajax({
        url: "Files/selectFileList",
        type: "post",
        dataType: "json",
        success: function (res) {
            // 获取下拉列表的选项数
            let optionNum = $('#fileList').find('option').length;
            // 首先清空下拉列表的选项
            if(optionNum > 0) {
                $('#fileList option').remove();
            }
            // 给下拉列表添加选项
            for(let i = 0; i < res.length; i++) {
                let tmp = res[i];
                $('#fileList').append("<option value='" + tmp + "'>" + tmp +"</option>"); //添加一项option
            }

            // $('#fileList').append("<option value='value'>text</option>");  //添加一项option
            // $("#fileList").prepend("<option value='0'>请选择</option>"); //在前面插入一项option
            // $("#fileList option:last").remove(); //删除索引值最大的option
            // $("#fileList option[index='0']").remove();//删除索引值为0的option
            // $("#fileList option[value='3']").remove(); //删除值为3的option
            // $("#fileList option[text='4']").remove(); //删除text值为4的option

            // 从数据库中查询到数据集文件并且显示在页面上后解除刷新动画
            $('#refresh').css('animation', '');
        },
        error: function () {
            swal("数据集文件加载失败！", "请检查连接状态或刷新页面后重试~", "error");
            // 加载数据集文件失败后解除刷新动画
            $('#refresh').css('animation', '');
        }
    });
}

// 未登录时点击登录按钮
function loginS() {
    window.location.href = "http://localhost:8080/Login?flag=ktruss";
}
/*-------------------------- 页面初始化时加载数据集文件 --------------------------*/

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

$(function () {
    /*----------------------- 给整个页面添加popover -----------------------*/
    var popoverTriggerList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
    /*----------------------- 给整个页面添加popover -----------------------*/

    /*------ 导航栏中的列表状态 ------*/
    $('#ui').attr('hidden', true);
    $('#a1').click(function () {
        $('#ui').attr('hidden', false);
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

    // 点击登录时
    $('#loginState').on('click', loginS);
    // 获取浏览器中用户的登录信息
    getIdentityAndToken('user');
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
                                                    window.location.href = "http://localhost:8080/getpage?value=k-truss"; // Login?flag=ktruss
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

    fileLoad();

    // 给加载按钮绑定鼠标移入和移出事件（刷新按钮样式设置）
    $('#tick1').on('mouseover', function () {
        $('#refresh').attr('fill', '#FFFFFF');
        $('#refresh path').attr('stroke', '#FFFFFF');
    });
    $('#tick1').on('mouseout', function () {
        $('#refresh').attr('fill', '#000000');
        $('#refresh path').attr('stroke', '#000000');
    });
    // 给加载按钮绑定点击事件
    $('#tick1').on('click', function () {
        // 给刷新图标添加动画
        $('#refresh').css('animation', 'rotation 1s infinite ease');
        // 加载数据集文件
        fileLoad();
    });
});
/*-------------------------- 页面初始化时加载数据集文件 --------------------------*/
// 自动弹窗
// swal({
//         title: "[大标题]",
//         type: "[图标样式]",
//         timer: 1000,
//         showConfirmButton: false
//     },
//     function () {
//         setTimeout(function () {
//             /*此处填写需要进行的操作*/
//         }, 100);
//     });
/*----------------------------- 下拉框选择数据集文件 ----------------------------------*/

/*----------------------------------- 文件预览 --------------------------------------*/
/*------------------------ 方法一： ----------------------*/
// 点击调用预览方法（预览pdf文件）
// function pdf_preview(flag) {
//     // filePath 为文件所在的路径
//     // encodeURIComponent：用于 url 特殊字符的转译（如 ： ; / ? : @ & = + $ , # 这些用于分隔 URI 组件的标点符号）
//     // 项目路径
//     var previewURL = "http://localhost:8080"; // 传输协议 + ip + 端口号
//     window.open('/pdf_preview/web/viewer.html?file=' + encodeURIComponent(previewURL+"/File/preview?flag=" + flag));
// }
/*------------------------ 方法一 ----------------------*/
$('#broLink').on("click", function () {
    /*------------------------ 方法一： ----------------------*/
    // // 定义文件路径
    // let flag = "0";
    // // 文件预览
    // pdf_preview(flag);
    /*------------------------ 方法一 ----------------------*/

    /*------------------------ 方法二： ----------------------*/
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            // 设置预览文件的相对路径
            let relativeFilepath = "/pdf/Thesis/k-truss/Truss.pdf";
            // 打开一个页面进行文件预览
            window.open('/pdf/web/viewer.html?file=' + relativeFilepath);
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
                        window.location.href = "http://localhost:8080/Login?flag=ktruss";
                    }
                });
        }
    }
    /*------------------------ 方法二 ----------------------*/
});
/*----------------------------------- 文件预览 --------------------------------------*/

/*----------------------------------- 文件下载 --------------------------------------*/
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
                swal("暂无PDF文件。", "", "info");
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
                        window.location.href = "http://localhost:8080/Login?flag=ktruss";
                    }
                });
        }
    }
}

$('#downloadBtn').on("click", function () {
    // 定义文件的真实名字（用于后台重命名）
    let realName = "2017_A会_PVLDB_Truss-based Community Search：a Truss-equivalence Based Indexing Approach.pdf";
    // 定义pdf所在的文件路径
    let filePath = "/pdf/Thesis/k-truss/Truss.pdf";
    downloadPDF(realName, filePath);
})
/*----------------------------------- 文件下载 --------------------------------------*/

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
// 获取identityCode and token and userName and account
function getIdentityAndToken() {
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
}

// 改变登录按钮的相关信息
function changeInfo(id, userName) {
    if(userName === undefined || userName === "") {
        /*--------------- 退出登录后还原登录按钮 ---------------*/
        // 绑定登录（loginState）的点击事件
        $('#' + id).on('click', loginS);
        // 还原状态
        $('#' + id).text('登录');
        // 显示下拉菜单
        $('#' + id).attr('data-bs-toggle', '');
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
        $('#' + id).attr('data-bs-toggle', 'dropdown');
        $('#' + id).attr('aria-expanded', 'false');
        // 改变按钮样式
        $('#' + id).removeClass('btn-outline-secondary');
        $('#' + id).addClass('btn-outline-success');
        /*--------------- 用户登录成功后 ---------------*/
    }
}

/*----------------------------------- preDefined_data --------------------------------*/
var nodes = []; // 用于接收后端发送的节点数据
var links = []; // 用于接收后端发送的边数据
var ktrussresult = {}; // 用于接收后端发送的ktrus算法搜索结果（网页中表格展示的数据）

var fileName; // 文件名
var nodeId; // 顶点id
var ktrussValue; // 社区value值

var Sign = "N"; // 标记用户是否重复测试数据集的标志
var flag1 = 1; // 绘图时的标记

var myChart;   // 容器初始化后的画布
/*----------------------------------- preDefined_data --------------------------------*/

$('#uploadFile').click(function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许上传文件
                $('#uploadFile').attr('href', '/getpage?value=fileUpload');
            } else if((user_loginInfo["identityCode"] - 0) === 2) {
                // 游客身份时不能使用文件上传功能
                swal("权限不够！", "请联系相关人员后操作。", "warning");
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
                        window.location.href = "http://localhost:8080/Login?flag=ktruss";
                    }
                });
        }
    }
});

function infor() {
    drawImage();
}

function show(fileName, nodeId, ktrussValue, flag, code) {
    if(flag == 1) {
        // 首先显示表格框架
        var show_part = document.getElementById("result1");
        show_part.style.display = "block";
        // 将文件名、顶点id、社区值以及标记数据封装成一个JSON字符串，后台接收后进行解析
        var user_input_data = {};
        user_input_data["fileName"] = fileName;
        user_input_data["nodeId"] = nodeId;
        user_input_data["ktrussValue"] = ktrussValue;
        user_input_data["Sign"] = Sign;
        var input_data = JSON.stringify(user_input_data);

        $.ajax({
            url: "Ktruss/ktrussresult",
            headers: { "token": user_loginInfo["token"] },
            type: "post",
            data: {"userInputData": input_data},
            dataType: "json",
            success: function (res) {
                nodes = res.nodes;
                links = res.links;
                ktrussresult = res.result;

                if(ktrussresult == "dataSet_error") {
                    swal("请重新选择合适的数据集进行测试！", "", "warning");
                    // 隐藏loading指示器
                    $('#coverLayer1').hideLoading();
                } else if(ktrussresult == "noCommunity") {
                    swal("未找到社区！", "", "info");
                    // 隐藏loading指示器
                    $('#coverLayer1').hideLoading();
                } else {
                    /*------ 然后显示表格中的内容 ------*/
                    $("#ktrussresultList").html(''),
                        //将数据显示在页面上
                        //遍历数据
                        $(ktrussresult).each(function (index, element) {
                            $("#ktrussresultList").append(
                                "<tr><td>" + element.nodeId + "</td>"
                                + "<td>" + element.ktrussValue + "</td>"
                                + "<td>" + element.numberOfEdges + "</td>"
                                + "<td style='display: block;height: 66px;overflow-y: scroll'>" + element.outlinks + "</td>"
                                + "<td id='viewBtn' title='绘制视图' onclick='infor()' style='cursor: pointer'>View</td></tr>"
                            );
                        });
                    $("#ktrussresultList1").html(''),
                        $(ktrussresult.ktrussData).each(function (index, element) {
                            $("#ktrussresultList1").append(
                                "<tr><td>" + element.vertices + "</td>"
                                + "<td>" + element.edges + "</td>"
                                + "<td>" + element.dmax + "</td>"
                                + "<td>" + element.kmax + "</td>"
                                + "<td>" + element.graphReadTime + " ms" + "</td>"
                                + "<td>" + element.support_time + " ms" + "</td>"
                                + "<td>" + element.ktrussCalTime + " ms" + "</td>"
                                + "<td>" + element.indexCreationTime + " ms" + "</td></tr>"
                            );
                        });
                    /*------ 然后显示表格中的内容 ------*/
                    // 测试完后隐藏页面加载指示器（loading指示器）或给用户结束提示
                    if(code == 0) {
                        // 隐藏loading指示器
                        $('#coverLayer1').hideLoading();
                    } else if(code == 1) {
                        // 给出结束提示
                        if(Sign == "Y") {
                            swal("结果已输出！", "", "success");
                            // 使用后还原标记
                            Sign = "N";
                        } else if(Sign == "N") {
                            swal("测试结束。", "", "success");
                        }
                    }
                }
            },
            error: function () {
                // 隐藏loading指示器
                $('#coverLayer1').hideLoading();
                swal("搜索失败！", "", "error");
            }
        });
    }
}

$('#nodeId').on("blur", function () {
    fileName = $('#fileList option:selected').val();
    nodeId = $('#nodeId').val();
    // 检查上一条信息是否填入
    if(fileName == "" || fileName == null || fileName == undefined) {
        swal("请先选择数据集文件！", "按顺序填入信息哟~", "warning");
        clearInputText("nodeId");
    } else {
        if(nodeId == "" || nodeId == null || nodeId == undefined) {
            swal("nodeId不能为空！", "请先输入顶点id。", "warning");
        } else if(!verifyData(nodeId)) {
            swal("nodeId的格式有误！", "请重新输入。", "error");
            clearInputText('nodeId');
        }
    }
});

$('#ktrussValue').on("blur", function () {
    nodeId = $('#nodeId').val();
    ktrussValue = $('#ktrussValue').val();
    // 检查上一条信息是否填入
    if(nodeId == "" || nodeId == null || nodeId == undefined) {
        swal("请先填写搜索节点id！", "按顺序填入信息哟~", "warning");
        clearInputText("ktrussValue");
    } else {
        if(ktrussValue == "" || ktrussValue == null || ktrussValue == undefined) {
            swal("ktrussValue不能为空！", "请先输入社区value。", "warning");
        } else if(!verifyData(ktrussValue)) {
            swal("ktrussValue的格式有误", "请重新输入。", "error");
            clearInputText('ktrussValue');
        }
    }
});

/*------ k-truss算法的搜索功能函数 ------*/
function search () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许进行社区搜索
                // 获取用户输入的数据
                fileName = $('#fileList option:selected').val();
                nodeId = $('#nodeId').val();
                ktrussValue = $('#ktrussValue').val();
                // 数据检验
                if(fileName == "" || fileName == null || fileName == undefined) {
                    swal("数据集不能为空！", "请先选择数据集。", "warning");
                } else if(nodeId == "" || nodeId == null || nodeId == undefined) {
                } else if(ktrussValue == "" || ktrussValue == null || ktrussValue == undefined) {
                } else if(!verifyData(nodeId)) {
                    clearInputText('nodeId');
                } else if(!verifyData(ktrussValue)) {
                    clearInputText('ktrussValue');
                } else {
                    // 将输入数据封装成JSON对象进行传递
                    var ktrussQuery = {};
                    ktrussQuery["fileName"] = fileName;
                    ktrussQuery["nodeId"] = nodeId;
                    ktrussQuery["ktrussValue"] = ktrussValue;
                    var ktrussQueryJson = JSON.stringify(ktrussQuery);
                    /*swal({
                        title: "开始搜索...",
                        text: "2秒后自动关闭。",
                        timer: 2000,
                        showConfirmButton: false
                    });*/
                    /*------------------------- 以上测试成功 -------------------------*/
                    $.ajax({
                        url: "Ktruss/checkResult",
                        headers: { "token": user_loginInfo["token"] },
                        type: "post",
                        data: {"ktrussQuery": ktrussQueryJson},
                        dataType: "json",
                        success: function (res) {
                            let code = res.code;
                            if(code == "1") {
                                swal({
                                        title: "数据集" + res.message +"已测试！",
                                        text: "大小为" + res.data + "，是否重新测试？",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "输出结果",
                                        cancelButtonText: "再次测试",
                                        closeOnConfirm: false,
                                        closeOnCancel: false
                                    },
                                    function(isConfirm){
                                        if (isConfirm) {
                                            Sign = "Y";
                                            show(fileName, nodeId, ktrussValue, flag1, code);
                                        } else {
                                            swal({
                                                    title: "点击确认以再次测试",
                                                    text: "确认继续吗？",
                                                    type: "info",
                                                    confirmButtonText: "确认",
                                                    cancelButtonText: "取消",
                                                    showConfirmButton: true,
                                                    showCancelButton: true,
                                                    closeOnConfirm: false,
                                                    showLoaderOnConfirm: true
                                                },
                                                function () {
                                                    show(fileName, nodeId, ktrussValue, flag1, code);
                                                });
                                        }
                                    });
                            } else if(code == "0") {
                                // 显示loading指示器
                                $('#coverLayer1').showLoading();
                                show(fileName, nodeId, ktrussValue, flag1, code);
                            }
                        },
                        error: function () {
                            alert("ajax erring......");
                        }
                    });
                }
            } else if((user_loginInfo["identityCode"] - 0) === 2) {
                // 游客身份时不能使用社区搜索功能
                swal("权限不够！", "请联系相关人员后操作。", "warning");
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
                        window.location.href = "http://localhost:8080/Login?flag=ktruss";
                    }
                });
        }
    }
}
/*------ k-truss算法的搜索功能函数 ------*/
$("#search_btn1").on("click", search); // 第一次绑定搜索按钮的点击事件

/*检验用户输入数据的格式*/
function verifyData(data) {
    // 定义一个符合输入规范的数组
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 定义一个计数变量
    let counter = 0;
    for(i = 0; i < data.length; i++) {
        // 标记变量
        let k = parseInt(data.charAt(i));
        // 中途检测到数据不合法直接退出循环
        if(isNaN(k)) {
            break;
        }
        for(let j in arr) {
            if(k == arr[j]) {
                counter++;
                break;
            }
        }
    }
    // 判断并返回boolean类型的值
    if(counter < data.length) {
        return false;
    } else {
        return true;
    }
}

// 根据输入框的id清空文本
function clearInputText(id) {
    $('#' + id).val('');
}

// 绘制周期默认为1s
var draw_rate = 1000; // 单位：ms
// bootstrap滑块
/*------------------------------- bootstrap-slider ------------------------------*/
$('#drawRate').slider({
    formatter: function (value) {
        return value / 10 + "s";
    }
}).on('slide', function (slideEvt) {
    //当滚动时触发
    //console.info(slideEvt);
    //获取当前滚动的值，可能有重复
    // console.info(slideEvt.value);
}).on('change', function (e) {
    // 当值发生改变的时候触发
    // 获取新值并设置在draw_rate中
    draw_rate = e.value.newValue * 100;
});
/*------------------------------- bootstrap-slider ------------------------------*/

function drawImage() {
    /*------ 点击视图按钮开始绘制图形时的提示 ------*/
    swal({
            title: "开始绘制图形，请耐心等待...",
            text: "2秒后自动关闭。",
            type: "info",
            timer: 2000,
            showConfirmButton: false
        });
    /*------ 点击视图按钮开始绘制图形时的提示 ------*/
    // 解除社区搜索按钮所有的点击事件（避免在绘制图形时用户再次点击按钮出现数据紊乱）
    $("#search_btn1").off('click');
    /*------ 绘制图形时点击搜索按钮的提示 ------*/
    $("#search_btn1").click(function () {
        // 设置标记
        flag1 = 0;
        swal({
            title: "请等待当前图形绘制完毕...",
            type: "info",
            timer: 1000,
            showConfirmButton: false
        });
    });
    /*------ 绘制图形时点击搜索按钮的提示 ------*/
    // 解除视图按钮的点击事件（避免在绘制图形时用户再次点击按钮出错）
    $("#viewBtn").attr('onclick', '');

    var data = []; // 绘图所需的节点数据
    var edges = []; // 绘图所需的边数据

    // param1（容器id）
    var chartDom = document.getElementById('echarts_graph');   //获取容器并设置

    /*-------------------- 解决方案如下 (解决There is a chart instance already initialized on the dom问题) --------------------*/
    if (myChart != null && myChart != "" && myChart != undefined) {
        myChart.dispose();
    }
    /*-------------------- 解决方案如上 --------------------*/
    myChart = echarts.init(chartDom);                            //使用echarts变量来初始化容器
    var option;                                                      //定义设置（自定义）变量
    /*graph.nodes.forEach(function (node) {   //遍历图中的所有节点
        node.label = {                      //设置节点旁的文字（标签）
            show: node.symbolSize > 30      //显示属性symbolSize > 30的节点旁的文字
        };
    });*/

    option = {                //编写设置
        title: {
            text: '',         //设置绘制出来的图的标题文本
            subtext: '',      //设置别称（附带的名称）
            //设置名称和别称的位置 top/bottom  left/center/right
            top: 'bottom',                  //设置标题与底边对齐
            left: 'right'                   //设置标题与右边对齐
        },
        // 设置鼠标放在节点的提示信息：名称+描述
        tooltip: {
            // show: true,
            // formatter: function (rela) {
            //     console.log(rela);
            //     let keywords = rela.data.value;
            //     let tipInfo = "id：" + rela.data.id + "<br>keyword：";
            //     for (let i = 0; i < keywords.length; i++) {
            //         tipInfo += keywords[i] + "<br>";
            //     }
            //     // return rela.data.id+": "+rela.data.value;
            //     return tipInfo;
            // }
        },
        //线上内容
        edgeLabel: {
            // show: true,
            // formatter: function (x) {
            //     // console.log(x);
            //     return x.data.value;
            // }
        },
        //类目设置
        // legend: [{
        //     orient: 'horizontal',   // 'horizontal' | 'vertical'
        //     x: 'center',             // 'center' | 'left' | 'right'
        //     y: 'top',               // 'top' | 'bottom' | 'center'
        //
        //     selectedMode: 'multiple',
        //     data: graph.categories.map(function (a) {
        //         return a.name;
        //     })
        // }],
        // animation: true,
        // animationDuration: 1500,                  //设置动画播放（绘图动画）时间
        // animationEasingUpdate: 'quinticInOut',    //设置动画播放效果
        series: [
            {
                type: 'graph',                 //设置为关系图
                layout: 'force',                //设置布局方式
                data: data,             //设置节点数据
                links: edges,            //设 置边数据
                force: {
                    edgeLength: [33, 66], // param2（图中的边长）
                    repulsion: 100,
                    layoutAnimation: true,
                    // edgeLength: 666,
                    // repulsion: 500,
                    // gravity: 0.2
                },
                // nodeScaleRatio: 0.3,
                symbolKeepAspect: true,        // symbol为path://格式时，保持图形的长宽比
                roam: true,                    // 设置是否开启鼠标缩放和平移漫游
                draggable: true,               // 设置节点是否被拖拽（无向图的类型为力导向图时可用）
                //设置节点中的文字
                label: {
                    show: true,             //设置文字是否显示
                    position: 'inside',         //设置位置为右对齐
                    formatter: '{b}'
                },
                // 设置遮盖层和边样式
                emphasis: {
                    focus: 'adjacency',        //设置遮盖层，使得部分图被强调
                    lineStyle: {               //设置光标所在边的样式
                        width: 10              //设置边的宽度为10
                    }
                }
            }
        ]
    };

    /*------------------- 鼠标悬浮时容易脱离目标，不可采取此事件，不合适 -------------------*/
    // 鼠标悬浮在某个节点上时固定住所有节点
    /*myChart.on('mouseover', (param) => {
        if(param.dataType == 'node') {
            data.forEach((node) => {
                let option = myChart.getOption();
                let currentId = node.id;
                option.series[0].data[currentId].fixed = true;
                myChart.setOption(option);
            });
        }
    });
    // 鼠标离开某个节点时恢复所有的节点（取消固定）
    myChart.on('mouseout', (param) => {
        if(param.dataType == 'node') {
            data.forEach((node) => {
                let option = myChart.getOption();
                let currentId = node.id;
                option.series[0].data[currentId].fixed = false;
                myChart.setOption(option);
            });
        }
    });*/
    /*------------------- 鼠标悬浮时容易脱离目标，不可采取此事件，不合适 -------------------*/

    var nodeCounter = 0, linkCounter = 0;
    // 绘制函数
    var drawFunction = function () {
        // 每绘制一次清除一下定时器
        clearInterval(addDataTimer);

        if(nodeCounter < nodes.length) {
            let node = nodes[nodeCounter];
            // 重设搜索节点的属性
            // if(node.itemStyle.color == "#ff0000") {
            //     node.x = myChart.getWidth / 2;
            //     node.y = myChart.getHeight / 2;
            //     node.symbolSize = 88;
            //     node.fixed = true;
            // }
            data.push(node);
            nodeCounter++;
        }
        if (linkCounter < links.length) {
            let link = links[linkCounter];
            edges.push(link);
            linkCounter++;
        }
        myChart.setOption(option);
        // 绘制图形结束
        if(nodeCounter == nodes.length && linkCounter == links.length) {
            // 再次解除社区搜索按钮的点击事件
            $("#search_btn1").off('click');
            // 图形绘制完毕后的自动关闭窗口
            /*swal({
                title: "图形绘制完毕。",
                type: "info",
                timer: 1000,
                showConfirmButton: false
            });*/
            // 图形绘制完毕后的确认窗口
            swal("图形绘制完毕。");
            // 还原标记
            flag1 = 1;
            // 恢复搜索按钮的点击事件（第二次绑定搜索按钮的点击事件）
            $("#search_btn1").on('click', search);
            // 恢复视图按钮的点击事件
            $("#viewBtn").attr('onclick', 'infor()');
            /*-------------- 绘制结束后固定住所有节点 --------------*/
            data.forEach((node) => {
                // 获取id
                let id = node.id;
                // 获取配置项
                let option = myChart.getOption();
                // 固定住其他没被按住的节点
                option.series[0].data[id].fixed = true;
                // 应用配置项
                myChart.setOption(option);
            });
            /*-------------- 绘制结束后固定住所有节点 --------------*/
            /*----------- 对鼠标操作的节点绑定相应的事件 -----------*/
            // 鼠标按下某个结点时（绑定鼠标按下事件）
            // myChart.on('mousedown', (param) => {
            //     if(param.dataType == 'node') {
            //         // 取得当前按下的节点id
            //         let currentId = param.data.id;
            //         // 获取配置项
            //         let option = myChart.getOption();
            //         // 激活当前节点（解除固定状态）
            //         option.series[0].data[currentId].fixed = false;
            //         // 应用配置项
            //         myChart.setOption(option);
            //     }
            // });
            // // 鼠标松开某个结点时（绑定鼠标弹起事件）
            // myChart.on('mouseup', (params) => {
            //     if(params.dataType == 'node') {
            //         // 取得当前按下的节点id
            //         let currentId = params.data.id;
            //         // 获取配置项
            //         let option = myChart.getOption();
            //         // 重新固定当前节点
            //         option.series[0].data[currentId].x = params.event.offsetX;
            //         option.series[0].data[currentId].y = params.event.offsetY;
            //         // 应用配置项
            //         myChart.setOption(option);
            //     }
            // });
            /*----------- 对鼠标操作的节点绑定相应的事件 -----------*/
            // 清除定时器
            clearInterval(addDataTimer);
        }
        if(nodeCounter != nodes.length || linkCounter != links.length) {
            addDataTimer = setInterval(drawFunction, draw_rate);
        }
    }
    var addDataTimer = setTimeout(drawFunction, draw_rate);
}



// function drawImageByMethod1() {
//     var chartDom = document.getElementById('echarts_graph');
//     /*-------------------- 解决方案如下 (解决There is a chart instance already initialized on the dom问题) --------------------*/
//     if (myChart != null && myChart != "" && myChart != undefined) {
//         myChart.dispose();
//     }
//     /*-------------------- 解决方案如上 --------------------*/
//     myChart = echarts.init(chartDom);
//     var option;
//     option = {
//         title: {
//             text: '',
//             subtext: '',
//             //设置名称和别称的位置 top/bottom   left/center/right
//             top: 'bottom',                  //设置标题与底边对齐
//             left: 'right'                   //设置标题与右边对齐
//         },
//         tooltip: {
//             // show: true,
//             // formatter: function (rela) {
//             //     console.log(rela);
//             //     let keywords = rela.data.value;
//             //     let tipInfo = "id：" + rela.data.id + "<br>keyword：";
//             //     for (let i = 0; i < keywords.length; i++) {
//             //         tipInfo += keywords[i] + "<br>";
//             //     }
//             //     // return rela.data.id+": "+rela.data.value;
//             //     return tipInfo;
//             // }
//         },
//         //线上内容
//         edgeLabel: {
//             // show: true,
//             // formatter: function (x) {
//             //     // console.log(x);
//             //     return x.data.value;
//             // }
//         },
//         //类目设置
//         // legend: [{
//         //     orient: 'horizontal',   // 'horizontal' | 'vertical'
//         //     x: 'center',             // 'center' | 'left' | 'right'
//         //     y: 'top',               // 'top' | 'bottom' | 'center'
//         //
//         //     selectedMode: 'multiple',
//         //     data: graph.categories.map(function (a) {
//         //         return a.name;
//         //     })
//         // }],
//         // animation: true,
//         // animationDuration: 1500,                  //设置动画播放（绘图动画）时间
//         // animationEasingUpdate: 'quinticInOut',    //设置动画播放效果
//         series: [
//             {
//                 type: 'graph',
//                 layout: 'force',
//                 data: nodes,
//                 links: links,
//                 force: {
//                     edgeLength: 10,
//                     repulsion: 100,
//                     layoutAnimation: true
//                 },
//                 roam: true, // 设置是否开启鼠标缩放和平移漫游
//                 draggable: true, // 设置节点是否被拖拽（无向图的类型为力导向图时可用）
//                 //设置节点中的文字
//                 label: {
//                     show: true, //设置文字是否显示
//                     position: 'inside', //设置位置为右对齐
//                     formatter: '{b}'
//                 },
//                 // 设置遮盖层和边样式
//                 emphasis: {
//                     focus: 'adjacency', //设置遮盖层，使得部分图被强调
//                     lineStyle: { //设置光标所在边的样式
//                         width: 10  //设置边的宽度为10
//                     }
//                 }
//             }
//         ]
//     };
//     myChart.setOption(option);
//     /*-------------- 绘制结束后固定住所有节点 --------------*/
//     nodes.forEach((node) => {
//         // 获取id
//         let id = node.id;
//         // 获取配置项
//         let option = myChart.getOption();
//         // 固定住其他没被按住的节点
//         option.series[0].data[id].fixed = true;
//         // 应用配置项
//         myChart.setOption(option);
//     });
//     /*-------------- 绘制结束后固定住所有节点 --------------*/
// }
