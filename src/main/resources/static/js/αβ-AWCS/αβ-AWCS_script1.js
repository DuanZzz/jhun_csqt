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
    window.location.href = "http://localhost:8080/Login?flag=abAWCS";
}

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

// 页面初始化时加载数据集文件
$(function () {
    /*------ 导航栏中的列表状态 ------*/
    $('#ui').attr('hidden', true);
    $('#a1').click(function () {
        $('#ui').attr('hidden', false);
    });
    $('#infoNet').attr('hidden', true);
    $('#a3').click(function () {
        $('#infoNet').attr('hidden', false);
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

    // 点击登录按钮时
    $('#loginState').on('click', loginS);
    // 获取用户的登录信息
    getIdentityAndToken();
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
                        // 再删除服务器中保存的登录信息
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
                                                    window.location.href = "http://localhost:8080/getpage?value=αβAWCS"; // Login?flag=abAWCS
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
/*----------------------------- 下拉框选择数据集文件 ----------------------------------*/

/*----------------------------------- 文件预览 --------------------------------------*/
$('#broLink').on("click", function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            // 设置预览文件的相对路径
            let relativeFilepath = "/pdf/Thesis/αβ-AWCS/？"; // 此处填写论文名称（.pdf）
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
                        window.location.href = "http://localhost:8080/Login?flag=abAWCS";
                    }
                });
        }
    }
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
                        window.location.href = "http://localhost:8080/Login?flag=abAWCS";
                    }
                });
        }
    }
}

$('#downloadBtn').on("click", function () {
    // 定义文件的真实名字（用于后台重命名）
    let realName = ""; // 此处填写pdf文件的真实名称
    // 定义pdf所在的文件路径
    let filePath = "/pdf/Thesis/αβ-AWCS/？"; // 此处填写论文名称（.pdf）
    downloadPDF(realName, filePath);
});
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

// 文件上传
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
                        window.location.href = "http://localhost:8080/Login?flag=abAWCS";
                    }
                });
        }
    }
});

/*----------------------------------- preDefined_data --------------------------------*/
var nodes = []; // 用于接收后端发送的节点数据
var links = []; // 用于接收后端发送的边数据
var αβAWCSResult = {}; // 用于接收后端发送的(α，β)-AWCS算法搜索结果（网页中第一个表格展示的数据）

var fileName; // 文件名
var nodeId; // 搜索顶点id
var upperDegree; // 上层顶点的度
var lowerDegree; // 下层顶点的度
var constraintWay; // 算法约束方式
var keywords; // 电影关键词

// 标记
var Sign = "N"; // 表示用户是否重复测试数据集的标记
var flag1 = 1; // 绘图时的标记

var myChart;   // 容器初始化后的画布
/*----------------------------------- preDefined_data --------------------------------*/

// 点击视图按钮后调用画图函数进行图形绘制
function infor() {
    // drawImage();
    drawImageByForce('echarts_graph', 'searchBtn', 'viewBtn', 10);
}

function show(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, flag, code) {
    if(flag == 1) {
        // 首先显示表格框架
        var show_part = document.getElementById("result1");
        show_part.style.display = "block";
        // 将用户输入的数据封装成一个JSON字符串，后台接收后进行解析
        var user_input_data = {};
        user_input_data["fileName"] = fileName;
        user_input_data["nodeId"] = nodeId;
        user_input_data["upperDegree"] = upperDegree;
        user_input_data["lowerDegree"] = lowerDegree;
        user_input_data["constraintWay"] = constraintWay;
        user_input_data["keywords"] = keywords;

        user_input_data["Sign"] = Sign;
        var input_data = JSON.stringify(user_input_data);

        $.ajax({
            url: "αβAWCS/αβAWCSResult",
            headers: { "token": user_loginInfo["token"] },
            type: "post",
            data: {"userInputData": input_data},
            dataType: "json",
            success: function (res) {
                nodes = res.nodes;
                links = res.links;
                αβAWCSResult = res.result;

                if(αβAWCSResult == "noOutResult") {
                    swal("未搜索到社区！", "", "info");
                    // 隐藏loading指示器
                    $('#coverLayer1').hideLoading();
                } else {
                    /*------ 然后显示表格中的内容 ------*/
                    // 清空表格数据
                    $("#αβAWCSResultList").html(''),
                        //将数据显示在页面上
                        //遍历数据
                        $(αβAWCSResult.primaryData_jsonStr).each(function (index, element) {
                            $("#αβAWCSResultList").append(
                                "<tr><td>" + element.searchNodeDegree + "</td>"
                                + "<td>" + element.graphDentity + "</td>"
                                + "<td>" + element.minCoverRate + "</td>"
                                + "<td>" + element.averageCoverRate + "</td>"
                                + "<td>" + element.averageScore + "</td>"
                                + "<td id='viewBtn' title='绘制视图' onclick='infor()' style='cursor: pointer'>View</td></tr>"
                            );
                        });
                    // 清空表格数据
                    $("#αβAWCSResultList1").html(''),
                        $(αβAWCSResult.timeData_jsonStr).each(function (index, element) {
                            $("#αβAWCSResultList1").append(
                                "<tr><td>" + element.graphReadTime + "</td>"
                                + "<td>" + element.iabsIndexBulidTime + "</td>"
                                + "<td>" + element.abCoreSiftTime + "</td>"
                                + "<td>" + element.keyWordSiftTime + "</td>"
                                + "<td>" + element.scsPeelSiftTime + "</td>"
                                + "<td>" + element.runTotalTime  + "</td>"
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
                alert("ajax erring......");
            }
        });
    }
}

/*------ 规定输入的顶点id不能为空 ------*/
$('#nodeId').on("blur", function () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许获取关键词集
                fileName = $('#fileList option:selected').val();
                nodeId = $('#nodeId').val();
                // 检查数据集文件是否选择
                if(fileName == "" || fileName == null || fileName == undefined) {
                    swal("请先选择数据集文件！", "按顺序填入信息哟~", "warning");
                    clearInputText("nodeId");
                } else {
                    if(nodeId == "" || nodeId == null || nodeId == undefined) {
                        swal("nodeId不能为空！", "请先输入顶点id。", "warning");
                        // 清空table下的所有子标签
                        $("#checkboxT tr").remove();
                    } else if(!verifyData(nodeId)) {
                        swal("nodeId的格式有误！", "请重新输入~", "error");
                        // 清空当前文本框
                        clearInputText('nodeId');
                        // 清空table下的所有子标签
                        $("#checkboxT tr").remove();
                    } else {
                        // 首先清空table下的所有子标签
                        $("#checkboxT tr").remove();
                        /*-------------------- 获取搜索顶点id对应的电影关键词集，并设置在复选框集群中 --------------------*/
                        $.ajax({
                            url: "αβAWCS/acquireKeywords",
                            headers: { "token": user_loginInfo["token"] },
                            type: "post",
                            data: { "fileName": fileName, "nodeId": nodeId },
                            dataType: "json",
                            success: function (res) {

                                console.log(res)

                                if(res.length > 0) {
                                    /*---------- 添加tr标签 ----------*/
                                    // 计算需要添加的tr标签的数量
                                    let groupNum = 3; // 每五个关键词为一组，添加一个tr标签
                                    let keywords_size = res.length;
                                    let trNumStr = (keywords_size / groupNum).toString(); // 添加的tr标签的数量
                                    let trNum;
                                    if(trNumStr.indexOf(".") != -1) {
                                        trNum = parseInt(trNumStr.substring(0, trNumStr.indexOf("."))) + 1;
                                    } else {
                                        trNum = parseInt(trNumStr);
                                    }
                                    // 添加
                                    let trStr = "tr";
                                    for (let i = 0; i < trNum; i++) {
                                        let trId = trStr + (i + 1);
                                        $('#checkboxT').append("<tr id='" + trId +"'></tr>");
                                    }
                                    /*---------- 添加tr标签 ----------*/
                                    /*------ 添加复选框和电影关键词 ------*/
                                    // 定义input的name
                                    let inputName = "keyword";
                                    // 定义关键词计数器（每5个一计）
                                    let keyCounter = 0;
                                    // 定义tr标签计数器
                                    let index = 1;
                                    for (let i = 0; i < res.length; i++) {
                                        let keywordValue = res[i];
                                        keyCounter++;
                                        if(keyCounter > groupNum) {
                                            keyCounter = 1;
                                            index++;
                                        }
                                        let trId = trStr + index;
                                        $('#' + trId).append("<td><div><input class='checked-focus' type='checkbox' " +
                                            "value='"+keywordValue+"' name='"+inputName+"'>" +
                                            "<span>"+keywordValue+"</span></td></div>");
                                    }
                                    /*------ 添加复选框和电影关键词 ------*/
                                } else {
                                    swal("搜索顶点id=" + nodeId + "对应的电影关键词为空！", "请重新输入顶点id。", "warning");
                                    clearInputText('nodeId');
                                }
                            },
                            error: function () {
                                alert("ajax erring......");
                            }
                        });
                        /*-------------------- 获取搜索顶点id对应的电影关键词集，并设置在复选框集群中 --------------------*/
                    }
                }
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
                        window.location.href = "http://localhost:8080/Login?flag=abAWCS";
                    }
                });
        }
    }
});
/*------ 规定输入的顶点id不能为空 ------*/

/*------ 规定输入的上层和下层顶点的度不能为空 ------*/
$('#upperDegree').on("blur", function () {
    nodeId = $('#nodeId').val();
    upperDegree = $('#upperDegree').val();
    // 检查顶点id是否填写
    if(nodeId == "" || nodeId == null || nodeId == undefined) {
        swal("请先填写搜索顶点id！", "按顺序填写信息哟~", "warning");
        clearInputText("upperDegree");
    } else {
        if(upperDegree == "" || upperDegree == null || upperDegree == undefined) {
            swal("上层顶点的度不能为空！", "请先输入~", "warning");
        } else if(!verifyData(upperDegree)) {
            swal("数据格式有误", "请重新输入~", "error");
            clearInputText('upperDegree');
        }
    }
});
$('#lowerDegree').on("blur", function () {
    upperDegree = $('#upperDegree').val();
    lowerDegree = $('#lowerDegree').val();
    // 检查上层顶点的度是否填写
    if(upperDegree == "" || upperDegree == null || upperDegree == undefined) {
        swal("请先填写上层顶点的度！", "按顺序填写信息哟~", "warning");
        clearInputText("lowerDegree");
    } else {
        if(lowerDegree == "" || lowerDegree == null || lowerDegree == undefined) {
            swal("下层顶点的度不能为空！", "请先输入~", "warning");
        } else if(!verifyData(lowerDegree)) {
            swal("数据格式有误", "请重新输入~", "error");
            clearInputText('lowerDegree');
        }
    }
});
/*------ 规定输入的上层和下层顶点的度不能为空 ------*/

/*------ 根据inputName获取已选中的单选按钮的值（算法约束方式） ------*/
function selectedWay(inputName) {
    let way = $('input[name='+inputName+']:checked').val();
    return way;
}
/*------ 根据inputName获取已选中的单选按钮的值（算法约束方式） ------*/

/*------ 根据inputName获取复选框中已选中的电影关键词 ------*/
function listSelectedKeyword(inputName) {
    let selectedItems = [];
    let objs = $('input[name='+inputName+']');
    for(i in objs) {
        if(objs[i].checked) {
            let tmpKey = objs[i].value;
            selectedItems.push(tmpKey);
        }
    }
    return selectedItems;
}
/*------ 根据inputName获取复选框中已选中的电影关键词 ------*/

/*------ 检验用户输入数据的格式是否为纯数字字符串 ------*/
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
/*------ 检验用户输入数据的格式是否为纯数字字符串 ------*/

/*------ 根据输入框id清空文本 ------*/
function clearInputText(id) {
    $('#' + id).val('');
}
/*------ 根据输入框id清空文本 ------*/

/*------ (α，β)-AWCS算法的搜索功能函数 ------*/
function search () {
    if(user_loginInfo !== undefined && user_loginInfo !== "") {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 获取用户输入的数据
                fileName = $('#fileList option:selected').val();
                nodeId = $('#nodeId').val();
                upperDegree = $('#upperDegree').val();
                lowerDegree = $('#lowerDegree').val();
                constraintWay = selectedWay('algoConstraint');
                keywords = listSelectedKeyword('keyword');
                // 数据检验
                if(fileName == "" || fileName == null || fileName == undefined) {
                    swal("数据集不能为空！", "请先选择数据集。", "warning");
                } else if(nodeId == "" || nodeId == null || nodeId == undefined) {
                    swal("请先填入顶点id！", "按顺序依次填写哟~~~", "warning");
                } else if(upperDegree == "" || upperDegree == null || upperDegree == undefined) {
                    swal("请先填入上层顶点的度！", "按顺序依次填写哟~~~", "warning");
                } else if(lowerDegree == "" || lowerDegree == null || lowerDegree == undefined) {
                    swal("请先填入下层顶点的度！", "按顺序依次填写哟~~~", "warning");
                } else if(keywords.length == 0 || keywords == undefined) {
                    swal("请先至少选择一个关键词！", "谢谢配合~", "warning");
                } else if(!verifyData(nodeId)) {
                    clearInputText('nodeId');
                } else if(!verifyData(upperDegree)) {
                    clearInputText('upperDegree');
                } else if(!verifyData(lowerDegree)) {
                    clearInputText('lowerDegree');
                } else {
                    // 将输入数据封装成JSON对象进行传递
                    var αβAWCSQuery = {};
                    αβAWCSQuery["fileName"] = fileName;
                    αβAWCSQuery["nodeId"] = nodeId;
                    αβAWCSQuery["upperDegree"] = upperDegree;
                    αβAWCSQuery["lowerDegree"] = lowerDegree;
                    αβAWCSQuery["constraintWay"] = constraintWay;
                    αβAWCSQuery["keywords"] = keywords;
                    var αβAWCSQueryJson = JSON.stringify(αβAWCSQuery);
                    $.ajax({
                        url: "αβAWCS/checkResult",
                        headers: { "token": user_loginInfo["token"] },
                        type: "post",
                        data: {"αβAWCSQuery": αβAWCSQueryJson},
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
                                            show(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, flag1, code);
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
                                                    show(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, flag1, code);
                                                });
                                        }
                                    });
                            } else if(code == "0") {
                                // 显示页面加载指示器（loading指示器）
                                $('#coverLayer1').showLoading();
                                show(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, flag1, code);
                            }
                        },
                        error: function () {
                            alert("ajax erring......");
                            // 隐藏页面加载指示器（loading指示器）
                            $('#coverLayer1').hideLoading();
                        }
                    });
                }
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
                        window.location.href = "http://localhost:8080/Login?flag=abAWCS";
                    }
                });
        }
    }
}
/*------ (α，β)-AWCS算法的搜索功能函数 ------*/
$("#searchBtn").on('click', search); // 第一次绑定搜索按钮的点击事件

// 绘制周期默认为0.5s
var draw_rate = 500; // 单位：ms
// bootstrap滑块
/*------------------------------- bootstrap-slider ------------------------------*/
$('#drawRate').slider({
    formatter: function (value) {
        return value / 10 + "s";
    }
}).on('change', function (e) {
    // 值发生改变时触发
    // 不断地获取新值并设置在draw_rate中
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
    $("#searchBtn").off('click');
    /*------ 绘制图形时点击搜索按钮的提示 ------*/
    $("#searchBtn").click(function () {
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

    // 绘图所需的节点数据
    var data = [];
    // 绘图所需的边数据
    var edges = [];
    // 获取绘图容器
    var chartDom = document.getElementById('echarts_graph');
    /*--------------- 避免重复绘制以及There is a chart instance already initialized on the dom的问题 ---------------*/
    if (myChart != null && myChart != "" && myChart != undefined) {
        myChart.dispose();
    }
    /*--------------- 避免重复绘制以及There is a chart instance already initialized on the dom的问题 ---------------*/
    // 初始化绘图容器
    myChart = echarts.init(chartDom);
    // 自定义“设置（option）”变量
    var option;
    option = {
        // 标题（父子标题）
        title: {
            text: '',         // 父标题
            subtext: '',      // 子标题（或别称）
            // 设置标题的位置 top/bottom/left/right/center
            top: 'bottom',    // 标题与底边对齐
            left: 'right'     // 标题与右边对齐
        },
        // 设置提示窗（鼠标放在节点和边上时显示的提示信息）
        tooltip: {
            show: true,
            formatter: function (info) {
                let tipInfo = "";
                let userId = info.data.name;
                let keywords = info.data.value;
                if((userId != "" && userId != null && userId != undefined) && Array.isArray(keywords)) {
                    // 添加用户id
                    tipInfo += "id: " + userId + "<br>keywords：<br>";
                    // 添加关键词
                    // 每行关键词的个数
                    let keywords_line = 3;
                    // 记录关键词的个数
                    let key_counter = 0;
                    for (let i = 0; i < keywords.length; i++) {
                        key_counter ++;
                        if(key_counter < keywords_line) {
                            tipInfo += keywords[i] + "&emsp;";
                        } else if(key_counter == keywords_line) {
                            tipInfo += keywords[i];
                        } else {
                            tipInfo += "<br>" + keywords[i] + "&emsp;";
                            key_counter = 1;
                        }
                    }
                }
                return tipInfo;
            }
        },
        // 设置线上内容
        edgeLabel: {
            show: true,
            formatter: function (info) {
                return info.data.value;
            }
        },
        animation: false,
        series: [
            {
                type: 'graph',                 // 设置为关系图
                layout: 'none',                // 设置布局方式
                data: data,                    // 设置节点数据
                links: edges,                  // 设置边数据
                roam: true,                    // 设置是否开启鼠标缩放和平移漫游
                // draggable: true,            // 设置节点是否被拖拽（无向图的类型为力导向图时可用）
                // 设置节点中的文字
                label: {
                    show: true,                // 设置文字是否显示
                    position: 'top',           // 设置位置与顶部对齐
                    formatter: '{b}'
                },
                // 设置遮盖层和边样式
                emphasis: {
                    focus: 'adjacency',        // 设置遮盖层，对比强调
                    lineStyle: {               // 设置光标所在边的样式
                        width: 10              // 设置边的宽度为10
                    }
                }
            }
        ]
    };
    var nodeCounter = 0, edgeCounter = 0;
    var drawFunction = function () {
        // 每绘制一次清除一下定时器
        clearInterval(addDataTimer);

        if(nodeCounter < nodes.length) {
            let node = nodes[nodeCounter];
            data.push(node);
            nodeCounter++;
        }
        if (edgeCounter < links.length) {
            let link = links[edgeCounter];
            edges.push(link);
            edgeCounter++;
        }
        myChart.setOption(option); // 应用配置
        // 绘制图形结束
        if(nodeCounter == nodes.length && edgeCounter == links.length) {
            // 再次解除社区搜索按钮的点击事件
            $("#searchBtn").off('click');
            // 图形绘制完毕后的确认窗口
            swal("图形绘制完毕。");
            // 还原标记
            flag1 = 1;
            // 恢复搜索按钮的点击事件（第二次绑定搜索按钮的点击事件）
            $("#searchBtn").on('click', search);
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
            // 清除定时器
            clearInterval(addDataTimer);
        }
        if(nodeCounter != nodes.length || edgeCounter != links.length) {
            addDataTimer = setInterval(drawFunction, draw_rate);
        }
    }
    var addDataTimer = setTimeout(drawFunction, draw_rate);
}

// 力导向图布局画法
function drawImageByForce(containerID, searchBtnID, viewBtnID, edgeLength) {
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
    $("#" + searchBtnID).off('click');
    /*------ 绘制图形时点击搜索按钮的提示 ------*/
    $("#" + searchBtnID).click(function () {
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
    $("#" + viewBtnID).attr('onclick', '');

    var data = [];  // 绘图所需的节点数据
    var edges = []; // 绘图所需的边数据
    var chartDom = document.getElementById(containerID);
    if (myChart != null && myChart != "" && myChart != undefined) {
        myChart.dispose();
    }
    myChart = echarts.init(chartDom);
    var option;
    option = {
        title: {
            text: '',
            subtext: '',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {
            show: true,
            formatter: function (info) {
                let tipInfo = "";
                let id = info.data.name;
                let keywords = info.data.value;
                if((id != "" && id != null && id != undefined) && Array.isArray(keywords)) {
                    // 添加id
                    tipInfo += "id：" + id + "<br>电影关键词：<br>";
                    // 添加关键词
                    // 每行关键词的个数
                    let keywords_line = 3;
                    // 记录关键词的个数
                    let key_counter = 0;
                    for (let i = 0; i < keywords.length; i++) {
                        key_counter ++;
                        if(key_counter < keywords_line) {
                            tipInfo += keywords[i] + "&emsp;";
                        } else if(key_counter == keywords_line) {
                            tipInfo += keywords[i];
                        } else {
                            tipInfo += "<br>" + keywords[i] + "&emsp;";
                            key_counter = 1;
                        }
                    }
                }
                return tipInfo;
            }
        },
        edgeLabel: {
            show: true,
            formatter: function (info) {
                return info.data.value;
            }
        },
        animation: false,
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: data,
                links: edges,
                force: {
                    edgeLength: edgeLength,
                    repulsion: 100,
                    // gravity: 0.1
                },
                roam: true,
                draggable: true,
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{b}'
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 10
                    }
                }
            }
        ]
    };
    var nodeCounter = 0, linkCounter = 0;
    // 绘制函数
    var drawFunction = function () {
        // 每绘制一次清除一下定时器
        clearInterval(addDataTimer);

        if(nodeCounter < nodes.length) {
            let node = nodes[nodeCounter];
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
            $("#" + searchBtnID).off('click');
            // 图形绘制完毕后的确认窗口
            swal("图形绘制完毕。");
            // 还原标记
            flag1 = 1;
            // 恢复搜索按钮的点击事件（第二次绑定搜索按钮的点击事件）
            $("#" + searchBtnID).on('click', search);
            // 恢复视图按钮的点击事件
            $("#" + viewBtnID).attr('onclick', 'infor()');
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
            // 清除定时器
            clearInterval(addDataTimer);
        }
        if(nodeCounter != nodes.length || linkCounter != links.length) {
            addDataTimer = setInterval(drawFunction, draw_rate);
        }
    }
    var addDataTimer = setTimeout(drawFunction, draw_rate);
}