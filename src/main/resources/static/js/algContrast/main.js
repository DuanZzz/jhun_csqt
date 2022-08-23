/*------------------------ pre_defined_var ------------------------*/
// 浏览器中用户的登录信息
var user_loginInfo;

/*--------------- 算法一输出的其他数据 ---------------*/
// 算法一的名称
var alg1Name;
// 柱状图数据
var result1_histogram;
/*--------------- 算法一输出的其他数据 ---------------*/
/*--------------- 算法二输出的其他数据 ---------------*/
// 算法二的名称
var alg2Name;
// 柱状图数据
var result2_histogram;
/*--------------- 算法二输出的其他数据 ---------------*/

// 文件名
var fileName;

// 原始社区关系图的绘制周期（默认为1s）
// var draw_rate = 1000; // 单位：ms
// 算法一输出社区关系图的绘制周期（默认为1s）
var draw_rate1 = 1000; // 单位：ms
// 算法二输出社区关系图的绘制周期（默认为1s）
var draw_rate2 = 1000; // 单位：ms

// 标记
var Sign = "N"; // 表示用户是否重复搜索数据集的标记
/*----------------------------------- preDefined_data --------------------------------*/

/*------------------------ pre_defined_var ------------------------*/

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

// 根据id设置按钮相应的样式和效果
function setButtonsStyle(id) {
    if(id === 'tick1') {
        // 给加载按钮绑定鼠标移入和移出事件（刷新按钮样式设置）
        $('#' + id).on('mouseover', function () {
            $('#refresh').attr('fill', '#FFFFFF');
            $('#refresh path').attr('stroke', '#FFFFFF');
        });
        $('#' + id).on('mouseout', function () {
            $('#refresh').attr('fill', '#000000');
            $('#refresh path').attr('stroke', '#000000');
        });
        // 给加载按钮绑定点击事件
        $('#' + id).on('click', function () {
            // 给刷新图标添加动画
            $('#refresh').css('animation', 'rotation 1s infinite ease');
            // 加载数据集文件
            fileLoad();
        });
    }
    if(id === 'uploadDataSet') {
        $('#' + id).on('mouseover', function () {
            $('#' + id + ' span svg').attr('fill', '#FFFFFF');
            $('#' + id + ' label').css('color', '#FFFFFF');
        });
        $('#' + id).on('mouseout', function () {
            $('#' + id + ' span svg').attr('fill', '#000000');
            $('#' + id + ' label').css('color', '#000000');
        });

        // 给数据集上传按钮绑定点击事件（跳转到相应页面进行文件上传）
        $('#' + id).on('click', function () {
            if (user_loginInfo['token'] !== undefined && user_loginInfo['token'] !== '') {
                if ((user_loginInfo["identityCode"] - 0) === 1) {
                    // 管理员身份时
                    window.location.href = 'http://localhost:8080/getpage?value=fileUpload';
                } else if ((user_loginInfo["identityCode"] - 0) === 2) {
                    // 游客身份时不能使用搜索功能
                    swal("权限不够！", "请联系相关人员后操作。", "warning");
                }
            } else {
                // 用户未登录时不能使用页面的主要功能
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
                            window.location.href = "http://localhost:8080/Login?flag=algContrast";
                        }
                    });
            }
        });
    }
    if(id === 'draw') {
        $('#' + id).on('mouseover', function () {
            $('#' + id + ' span svg').attr('fill', '#FFFFFF');
            $('#' + id + ' label').css('color', '#FFFFFF');
        });
        $('#' + id).on('mouseout', function () {
            $('#' + id + ' span svg').attr('fill', '#000000');
            $('#' + id + ' label').css('color', '#000000');
        });
    }
}
/*-------------------------- 下拉框选择数据集文件 --------------------------*/

function input1Limited(id, checkboxTId, keyword_inputName) {
    /*------ 规定输入的顶点id不能为空 ------*/
    $('#' + id).on("blur", function () {
        if(user_loginInfo["token"] !== undefined && user_loginInfo["token"] !== "") {
            if((user_loginInfo["identityCode"] - 0) === 1) {
                // 身份为管理员时允许获取关键词集
                fileName = $('#fileList option:selected').val();
                let nodeId = $('#' + id).val();
                // 检查数据集文件是否选择
                if(fileName == "" || fileName == null || fileName == undefined) {
                    swal("请先选择数据集文件！", "按顺序填入信息哟~", "warning");
                    clearInputText(id);
                } else {
                    if(nodeId == "" || nodeId == null || nodeId == undefined) {
                        swal("nodeId不能为空！", "请先输入顶点id。", "warning");
                        // 清空table下的所有子标签
                        $('#' + checkboxTId + ' tr').remove();
                    } else if(!verifyData(nodeId)) {
                        swal("nodeId的格式有误！", "请重新输入~", "error");
                        // 清空当前文本框
                        clearInputText(id);
                        // 清空table下的所有子标签
                        $('#' + checkboxTId + ' tr').remove();
                    } else {
                        // 首先清空table下的所有子标签
                        $('#' + checkboxTId + ' tr').remove();
                        /*-------------------- 获取搜索顶点id对应的电影关键词集，并设置在复选框集群中 --------------------*/
                        $.ajax({
                            url: "αβAWCS/acquireKeywords",
                            headers: { "token": user_loginInfo["token"] },
                            type: "post",
                            data: { "fileName": fileName, "nodeId": nodeId },
                            dataType: "json",
                            success: function (res) {
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
                                        let trId = checkboxTId + trStr + (i + 1);
                                        $('#' + checkboxTId).append("<tr id='" + trId +"'></tr>");
                                    }
                                    /*---------- 添加tr标签 ----------*/
                                    /*------ 添加复选框和电影关键词 ------*/
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
                                        let trId = checkboxTId + trStr + index;
                                        $('#' + trId).append("<td><div><input class='checked-focus' type='checkbox' " +
                                            "value='"+keywordValue+"' name='"+keyword_inputName+"'>" +
                                            "<span>"+keywordValue+"</span></td></div>");
                                    }
                                    /*------ 添加复选框和电影关键词 ------*/
                                } else {
                                    swal("搜索顶点id=" + nodeId + "对应的电影关键词为空！", "请重新输入顶点id。", "warning");
                                    clearInputText(id);
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
                        window.location.href = "http://localhost:8080/Login?flag=algContrast";
                    }
                });
        }
    });
    /*------ 规定输入的顶点id不能为空 ------*/
}

function input2Limited(upperDegreeId, id) {
    /*------ 规定输入的上层顶点的度不能为空 ------*/
    $('#' + upperDegreeId).on("blur", function () {
        let nodeId = $('#' + id).val();
        let upperDegree = $('#' + upperDegreeId).val();
        // 检查顶点id是否填写
        if(nodeId === "" || nodeId === null || nodeId === undefined) {
            swal("请先填写搜索顶点id！", "按顺序填写信息哟~", "warning");
            clearInputText(upperDegreeId);
        } else {
            if(upperDegree === "" || upperDegree === null || upperDegree === undefined) {
                swal("上层顶点的度不能为空！", "请先输入~", "warning");
            } else if(!verifyData(upperDegree)) {
                swal("数据格式有误", "请重新输入~", "error");
                clearInputText(upperDegreeId);
            }
        }
    });
}

function input3Limited(lowerDegreeId, upperDegreeId) {
    /*------ 规定输入的上层和下层顶点的度不能为空 ------*/
    $('#' + lowerDegreeId).on("blur", function () {
        let upperDegree = $('#' + upperDegreeId).val();
        let lowerDegree = $('#' + lowerDegreeId).val();
        // 检查上层顶点的度是否填写
        if(upperDegree === "" || upperDegree === null || upperDegree === undefined) {
            swal("请先填写上层顶点的度！", "按顺序填写信息哟~", "warning");
            clearInputText(lowerDegreeId);
        } else {
            if(lowerDegree === "" || lowerDegree === null || lowerDegree === undefined) {
                swal("下层顶点的度不能为空！", "请先输入~", "warning");
            } else if(!verifyData(lowerDegree)) {
                swal("数据格式有误", "请重新输入~", "error");
                clearInputText(lowerDegreeId);
            }
        }
    });
}

/*------ 根据inputName获取已选中的单选按钮的值（算法约束方式） ------*/
function selectedWay(inputName) {
    let way = $('input[name='+inputName+']:checked').val();
    return way;
}
/*------ 根据inputName获取已选中的单选按钮的值（算法约束方式） ------*/

/*--------------- 获取下拉列表中选择的数据集文件 ---------------*/
function acquireDataSetFile(fileListId) {
    let dataSetFileName = $('#' + fileListId + ' option:selected').val();
    return dataSetFileName;
}
/*--------------- 获取下拉列表中选择的数据集文件 ---------------*/

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

// 未登录时点击登录按钮
function loginS() {
    window.location.href = "http://localhost:8080/Login?flag=algContrast";
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

/*------------------- 页面初始化加载模块 -------------------*/
$(function () {
    setButtonsStyle('tick1');
    setButtonsStyle('uploadDataSet');
    setButtonsStyle('draw');

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

    fileLoad();

    // 限制算法一的输入框
    input1Limited('nodeId', 'checkboxT', 'alg1_keyword');
    // 限制算法二的输入框
    input1Limited('nodeId2', 'checkboxT2', 'alg2_keyword');

    /*----------------- r-slider.js 实现滑块控制绘图周期 -----------------*/
    // var a3 = new slider({
    //     container: "#originSlider",
    //
    //     start : 1,
    //     end:100,
    //     step:1,
    //     value:50,
    //
    //     showValue:true,
    //     ondrag: function (value) {
    //         console.log(value.values[0]);
    //     }
    // });
    /*----------------- r-slider.js 实现滑块控制绘图周期 -----------------*/

    /*-------------- 根据用户是否登录来设置相应的变量和属性 --------------*/
    // 点击登录时
    $('#loginState').on('click', loginS);
    // 获取浏览器中用户的登录信息
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
                                                    window.location.href = "http://localhost:8080/getpage?value=algContrast"; // Login?flag=algContrast
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

    originalDataSet('nodeId', 'nodeId2', 'fileList', 'drawOriginDataSet');

    algorithm_search('leftGraph', 'search_btn1', 'AlgList1', 'nodeId', 'upperDegree', 'lowerDegree', 'algoConstraint', 'alg1_keyword', 'fileList');
    algorithm_search('rightGraph', 'search_btn2', 'AlgList2', 'nodeId2', 'upperDegree2', 'lowerDegree2', '', 'alg2_keyword', 'fileList');
});
/*------------------- 页面初始化加载模块 -------------------*/

/*------------------------------- 算法搜索按钮的功能函数-------------------------------*/
function algorithm_search(containerId, searchBtnId, algSelectId, searchNodeId, upperDegreeId, lowerDegreeId, algConstraintName, keyword_inputName, fileListId) {
    $('#' + searchBtnId).on('click', () => {
        if (user_loginInfo['token'] !== undefined && user_loginInfo['token'] !== '') {
            if ((user_loginInfo["identityCode"] - 0) === 1) {
                // 管理员身份时
                /*------------------- 用户输入的数据 -------------------*/
                // 下拉框选择的算法名
                let AlgName = $('#' + algSelectId + ' option:selected').val();
                // 搜索顶点的id
                let nodeId = $('#' + searchNodeId).val();
                // 上层顶点的度
                let upperDegree = $('#' + upperDegreeId).val();
                // 下层顶点的度
                let lowerDegree = $('#' + lowerDegreeId).val();
                // 算法的约束方式
                let constraintWay = '';
                if(algConstraintName !== undefined && algConstraintName !== '') {
                    constraintWay = selectedWay(algConstraintName);
                }
                // 关键词集
                let keywords = [];
                if(keyword_inputName !== undefined && keyword_inputName !== '') {
                    keywords = listSelectedKeyword(keyword_inputName);
                }
                // 数据集文件
                let dataSetFile = acquireDataSetFile(fileListId);
                /*------------------- 用户输入的数据 -------------------*/

                // 数据检验
                if(nodeId === "" || nodeId === null || nodeId === undefined) {
                    swal("请先填入顶点id！", "按顺序依次填写哟~~~", "info");
                } else if(upperDegree === "" || upperDegree === null || upperDegree === undefined) {
                    swal("请先填入上层顶点的度！", "按顺序依次填写哟~~~", "info");
                } else if(lowerDegree === "" || lowerDegree === null || lowerDegree === undefined) {
                    swal("请先填入下层顶点的度！", "按顺序依次填写哟~~~", "info");
                } else if(!verifyData(nodeId)) {
                    clearInputText('nodeId');
                } else if(!verifyData(upperDegree)) {
                    clearInputText('upperDegree');
                } else if(!verifyData(lowerDegree)) {
                    clearInputText('lowerDegree');
                } else {
                    if(AlgName === '(α,β)-AWCS') {
                        if(keywords === undefined || keywords.length === 0) {
                            swal("请先至少选择一个关键词！", "谢谢配合~", "info");
                        } else {
                            // 关键词选择后
                            startSearch(containerId, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile);
                        }
                    } else {
                        startSearch(containerId, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile);
                    }
                }
            } else if ((user_loginInfo["identityCode"] - 0) === 2) {
                // 游客身份时不能使用搜索功能
                swal("权限不够！", "请联系相关人员后操作。", "warning");
            }
        } else {
            // 用户未登录时不能使用页面的主要功能
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
                        window.location.href = "http://localhost:8080/Login?flag=algContrast";
                    }
                });
        }
    });
}
/*------------------------------- 算法搜索按钮的功能函数-------------------------------*/

function startSearch(containerId, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile) {
    /*------------- 打包数据（用于在数据库中检查搜索结果用） -------------*/
    let user_inputData = {};
    user_inputData['nodeId'] = nodeId;
    user_inputData['upperDegree'] = upperDegree;
    user_inputData['lowerDegree'] = lowerDegree;
    user_inputData['constraintWay'] = constraintWay;
    user_inputData['keywords'] = keywords;

    let inputData_check = {};
    inputData_check['algName'] = AlgName;
    inputData_check['dataSet'] = dataSetFile;
    inputData_check['inputData'] = JSON.stringify(user_inputData);
    /*------------- 打包数据（用于在数据库中检查搜索结果用） -------------*/
    /*----------------- 在数据库中检查搜索结果 -----------------*/
    $.ajax({
        url: "algorithmContrast/checkResult",
        headers: { "token": user_loginInfo["token"] },
        type: "post",
        data: { "algContrastQuery": JSON.stringify(inputData_check) },
        dataType: "json",
        success: function (res) {
            let code = res.code;
            if(code === 1) {
                swal({
                        title: "搜索结果已存在！",
                        text: "是否重新搜索？",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "输出结果",
                        cancelButtonText: "再次搜索",
                        closeOnConfirm: true,
                        closeOnCancel: false
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            Sign = "Y";
                            // 直接显示搜索结果
                            search(containerId, Sign, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile);
                            // 使用完标记后及时还原
                            Sign = "N";
                        } else {
                            // 再次搜索数据集
                            swal({
                                    title: "点击确认以再次搜索",
                                    text: "确认继续吗？",
                                    type: "info",
                                    confirmButtonText: "确认",
                                    cancelButtonText: "取消",
                                    showConfirmButton: true,
                                    showCancelButton: true,
                                    closeOnConfirm: true
                                },
                                function(isConfirm) {
                                    if (isConfirm) {
                                        // 调用社区搜索函数再次搜索数据集
                                        search(containerId, Sign, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile);
                                    }
                                });
                        }
                    });
            } else if(code === 0) {
                // 搜索结果不存在时直接调用社区搜索函数来搜索数据集
                search(containerId, Sign, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile);
            }
        },
        error: function (res) {
            // 隐藏页面的遮盖层和加载效果
            $('#' + containerId).hideLoading();
            // 显示ajax请求出错
            swal('提示！', '数据检查出现错误。', 'error');
        }
    });
    /*----------------- 在数据库中检查搜索结果 -----------------*/
}

/*-------------------------------- 社区搜索函数 --------------------------------*/
function search(containerId, Sign, AlgName, nodeId, upperDegree, lowerDegree, constraintWay, keywords, dataSetFile) {
    // 记录算法的名称
    if(containerId === 'leftGraph') { // 算法一
        // 记录算法一的名称
        alg1Name = AlgName;
    } else if(containerId === 'rightGraph') { // 算法二
        // 记录算法二的名称
        alg2Name = AlgName;
    }
    // 将输入数据打包
    let inputData = {};
    inputData['AlgName'] = AlgName;
    inputData['nodeId'] = nodeId;
    inputData['upperDegree'] = upperDegree;
    inputData['lowerDegree'] = lowerDegree;
    inputData['constraintWay'] = constraintWay;
    inputData['keywords'] = keywords;
    inputData['dataSetFile'] = dataSetFile;
    inputData['Sign'] = Sign;

    /*------------ 显示容器的遮盖层以及加载器 ------------*/
    // 遮盖算法的输出社区网络拓扑图的容器并显示加载器
    $('#' + containerId).showLoading();
    // 根据选择的不同算法来对扇形统统计图
    if(containerId === 'leftGraph') {
        // 扇形图中的数据传递到前端之前显示加载器和遮盖层（等待期，限制用户操作）
        $('#sector1').showLoading();
    } else if(containerId === 'rightGraph') {
        // 扇形图中的数据传递到前端之前显示加载器和遮盖层（等待期，限制用户操作）
        $('#sector2').showLoading();
    }

    if((alg1Name !== undefined && alg1Name !== '') && (alg2Name !== undefined && alg2Name !== '')) {
        // 遮盖柱状图容器
        $('#columnar1').showLoading();
        $('#columnar2').showLoading();
        $('#columnar3').showLoading();
        $('#columnar4').showLoading();
        $('#columnar5').showLoading();
    }
    /*------------ 显示容器的遮盖层以及加载器 ------------*/

    // 将用户输入的数据发送给后端（POST请求）
    $.ajax({
        url: "algorithmContrast/OutCommunityGraph",
        headers: { "token": user_loginInfo["token"] },
        type: "post",
        data: { "inputData": JSON.stringify(inputData) },
        dataType: "json",
        success: function (res) {
            if(res !== null) {
                // 绘制输出社区的网络拓扑图
                drawTopology(containerId, res.nodes, res.links, 50);

                // 算法输出的其他数据的结果
                let otherResult = res.result;
                if(otherResult !== null && otherResult !== undefined) {
                    // 接收非图数据（柱状图、扇形图数据）
                    if(containerId === 'leftGraph') { // 算法一输出的数据
                        // 扇形图数据
                        let result1_sectorDiagram = JSON.parse(otherResult[1]);
                        // 绘制算法一对应的扇形统计图
                        drawSectorDiagram('sector1', alg1Name, result1_sectorDiagram);

                        // 柱状图数据（JSON对象）
                        result1_histogram = JSON.parse(otherResult[0]);
                        // 绘制柱状统计图
                        drawHGramLimited(alg1Name, alg2Name, result1_histogram, result2_histogram);
                    } else if(containerId === 'rightGraph') { // 算法二输出的数据
                        // 扇形图数据（JSON对象）
                        let result2_sectorDiagram = JSON.parse(otherResult[1]);
                        // 绘制算法二对应的扇形统计图
                        drawSectorDiagram('sector2', alg2Name, result2_sectorDiagram);

                        // 柱状图数据（JSON对象）
                        result2_histogram = JSON.parse(otherResult[0]);
                        // 绘制柱状统计图
                        drawHGramLimited(alg1Name, alg2Name, result1_histogram, result2_histogram);
                    }
                }
            }
        },
        error: function (res) {
            // 显示ajax请求出错
            swal('提示！', '社区搜索出现错误。', 'error');
        }
    });
}
/*-------------------------------- 社区搜索函数 --------------------------------*/

/*------------------ 不管是用户最后点击算法一或者是算法二进行搜索时绘制柱状图的函数（现仅支持绘制基于(α，β)-AWCS和SC(significant(α,β)-community)模型的算法输出的数据） ------------------*/
function drawHGramLimited(alg1Name, alg2Name, result1_histogram, result2_histogram) {
    if((alg1Name !== undefined && alg1Name !== '') && (alg2Name !== undefined && alg2Name !== '')
        && result1_histogram !== undefined && result2_histogram !== undefined) {
        /*------------- 构造柱状图的X轴上的名字数组（五类数据，五个数组） -------------*/
        let xAxisNames1 = ['CMF', 'CPJ', 'MQAC'];
        let xAxisNames2 = ['graphDensity'];
        let xAxisNames3 = ['rDataSet_Time', 'index_time', 'total_time'];
        let xAxisNames4 = ['avgScore', 'minScore'];
        let xAxisNames5 = ['U_vertexs', 'L_vertexs', 'U_avgDeg'];
        /*------------- 构造柱状图的X轴上的名字数组（五类数据，五个数组） -------------*/

        // 绘制柱状统计图
        let seriesData1 = generateDifferGroupData(xAxisNames1, result1_histogram, result2_histogram);
        let seriesData2 = generateDifferGroupData(xAxisNames2, result1_histogram, result2_histogram);
        let seriesData3 = generateDifferGroupData(xAxisNames3, result1_histogram, result2_histogram);
        let seriesData4 = generateDifferGroupData(xAxisNames4, result1_histogram, result2_histogram);
        let seriesData5 = generateDifferGroupData(xAxisNames5, result1_histogram, result2_histogram);

        // 绘制
        drawHistogram('columnar1', alg1Name, alg2Name, xAxisNames1, seriesData1);
        drawHistogram('columnar2', alg1Name, alg2Name, xAxisNames2, seriesData2);
        drawHistogram('columnar3', alg1Name, alg2Name, xAxisNames3, seriesData3);
        drawHistogram('columnar4', alg1Name, alg2Name, xAxisNames4, seriesData4);
        drawHistogram('columnar5', alg1Name, alg2Name, xAxisNames5, seriesData5);
    }
}
/*------------------ 不管是用户最后点击算法一或者是算法二进行搜索时绘制柱状图的函数（现仅支持绘制基于(α，β)-AWCS和SC(significant(α,β)-community)模型的算法输出的数据） ------------------*/

/*---------------- 根据柱状图的X轴上不同刻度的名称数组来生成相应的seriesData对象 ----------------*/
function generateDifferGroupData(xAxisNames, result1_histogram, result2_histogram) {
    if((result1_histogram !== undefined && result1_histogram !== null)
    && (result2_histogram !== undefined && result2_histogram !== null)) {
        if(Array.isArray(xAxisNames) && xAxisNames.length > 0) {
            let seriesData = {};
            let alg1_arrData = [];
            let alg2_arrData = [];
            // 遍历xAxisNames数组以获取alg1_arrData和alg2_arrData数组
            for (let i = 0; i < xAxisNames.length; i++) {
                if(result1_histogram[xAxisNames[i]] !== undefined && result1_histogram[xAxisNames[i]] !== '') {
                    alg1_arrData[i] = result1_histogram[xAxisNames[i]];
                }
                if(result2_histogram[xAxisNames[i]] !== undefined && result2_histogram[xAxisNames[i]] !== '') {
                    alg2_arrData[i] = result2_histogram[xAxisNames[i]];
                }
            }
            // 封装数据到seriesData中
            seriesData['alg1'] = alg1_arrData;
            seriesData['alg2'] = alg2_arrData;

            return seriesData;
        }
    } else {
        return undefined;
    }
}
/*---------------- 根据柱状图的X轴上不同刻度的名称数组来生成相应的seriesData对象 ----------------*/

/*-------------------- 根据后台传递的算法输出社区的数据指定容器并绘制网络拓扑图 --------------------*/
function drawTopology(containerId, nodes, links, edgeLength) {
    /*------------- 取消容器的遮盖层与加载器 -------------*/
    // 隐藏算法的输出社区网络拓扑图的加载器与遮盖层
    $('#' + containerId).hideLoading();
    /*------------- 取消容器的遮盖层与加载器 -------------*/

    // 清空ECharts图形所在的画布
    clearEChartsCanvas(containerId);

    // 绘图所需的节点数据
    var data = [];
    // 绘图所需的边数据
    var edges = [];

    // 获取绘图容器
    var chartDom = document.getElementById(containerId);
    // 初始化绘图容器
    var myChart = echarts.init(chartDom);
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
                if((id !== "" && id !== null && id !== undefined) && Array.isArray(keywords)) {
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
                        } else if(key_counter === keywords_line) {
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
                    // show: true,
                    // position: 'inside',
                    // formatter: '{b}'
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
        if(nodeCounter === nodes.length && linkCounter === links.length) {
            // 图形绘制完毕后的确认窗口
            // swal("图形绘制完毕。");

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
        if(nodeCounter !== nodes.length || linkCounter !== links.length) {
            if(containerId === 'leftGraph') {
                addDataTimer = setInterval(drawFunction, draw_rate1);
            } else if(containerId === 'rightGraph') {
                addDataTimer = setInterval(drawFunction, draw_rate2);
            }
        }
    }
    var addDataTimer;
    if(containerId === 'leftGraph') {
        addDataTimer = setTimeout(drawFunction, draw_rate1);
    } else if(containerId === 'rightGraph') {
        addDataTimer = setTimeout(drawFunction, draw_rate2);
    }
}
/*-------------------- 根据后台传递的算法输出社区的数据指定容器并绘制网络拓扑图 --------------------*/

/*------------------------- 绘制原始社区图的功能按钮 -------------------------*/
function originalDataSet(nodeId1, nodeId2, selectId, drawId) {
    $('#' + drawId).on('click', () => {
        if (user_loginInfo['token'] !== undefined && user_loginInfo['token'] !== '') {
            if ((user_loginInfo["identityCode"] - 0) === 1) {
                // 管理员身份时
                // 获取用户在算法一和算法二中选择的顶点id （算法一和算法二中选择的顶点相同时，统一使用绿色表示）
                let node1 = $('#' + nodeId1).val(); // 算法一的顶点和边在图中用蓝色表示
                let node2 = $('#' + nodeId2).val(); // 算法二的顶点和边在图中用橙色表示
                // 获取下拉列表中选择的数据集文件
                let dataSetFile = acquireDataSetFile(selectId);
                if((node1 !== undefined && node1 !== '') && (node2 !== undefined && node2 !== '')
                    && (dataSetFile !== undefined && dataSetFile !== '')) {
                    /*------------- 设置原始社区图容器的遮盖层与加载器 -------------*/
                    // 设置容器的加载器与遮盖层
                    $('#originalGraphContainer').showLoading();
                    /*------------- 设置原始社区图容器的遮盖层与加载器 -------------*/

                    // 将输入的数据序列化为json字符串
                    let inputData = {};
                    inputData['nodeId1'] = node1;
                    inputData['nodeId2'] = node2;
                    inputData['dataSetFile'] = dataSetFile;
                    $.ajax({
                        url: "algorithmContrast/drawOriginalCommunity",
                        headers: { "token": user_loginInfo["token"] },
                        type: "post",
                        data: { "inputData": JSON.stringify(inputData) },
                        dataType: "json",
                        success: function (res) {
                            /*------------- 取消原始社区图容器的遮盖层与加载器 -------------*/
                            // 取消容器的加载器与遮盖层
                            $('#originalGraphContainer').hideLoading();
                            /*------------- 取消原始社区图容器的遮盖层与加载器 -------------*/

                            if(res !== null && res !== undefined) {
                                let originalNodes = res.nodes;
                                let originalLinks = res.links;

                                if(originalNodes !== undefined && originalLinks !== undefined) {
                                    // 绘制原始社区图
                                    drawOriginalDataSet(originalNodes, originalLinks, 'originalGraph');
                                }
                            }
                        },
                        error: function () {
                            // ajax出错时
                            swal("提示！", "数据传输异常。", "error");
                        }
                    });
                } else {
                    // 用户未在算法一或算法二中输入顶点id
                    swal("提示！", "请补充算法搜索顶点的id！", "info");
                }
            } else if ((user_loginInfo["identityCode"] - 0) === 2) {
                // 游客身份时不能使用搜索功能
                swal("权限不够！", "请联系相关人员后操作。", "warning");
            }
        } else {
            // 用户未登录时不能使用页面的主要功能
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
                        window.location.href = "http://localhost:8080/Login?flag=algContrast";
                    }
                });
        }
    });
}
/*------------------------- 绘制原始社区图的功能按钮 -------------------------*/

/*------------------------- 绘制原始社区图的功能函数 -------------------------*/
function drawOriginalDataSet(nodes, links, containerId) {
    // 清空ECharts图形所在的画布
    clearEChartsCanvas(containerId);

    // 绘图所需的节点数据
    var data = [];
    // 绘图所需的边数据
    var edges = [];

    // 获取绘图容器
    var chartDom = document.getElementById(containerId);
    // 初始化绘图容器
    var myChart = echarts.init(chartDom);
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
        animation: false,
        series: [
            {
                type: 'graph',                 // 设置为关系图
                layout: 'force',                // 设置布局方式
                data: data,                    // 设置节点数据
                links: edges,                  // 设置边数据
                force: {
                    edgeLength: [266, 388], // param2（图中的边长）
                    repulsion: 100,
                    layoutAnimation: true,
                },
                roam: true,                    // 设置是否开启鼠标缩放和平移漫游
                draggable: true,            // 设置节点是否被拖拽（无向图的类型为力导向图时可用）
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
        if(nodeCounter === nodes.length && edgeCounter === links.length) {
            // 图形绘制完毕后的确认窗口
            // swal("图形绘制完毕。");

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
        if(nodeCounter !== nodes.length || edgeCounter !== links.length) {
            addDataTimer = setInterval(drawFunction, 500);
        }
    }
    var addDataTimer = setTimeout(drawFunction, 500);
}
/*------------------------- 绘制原始社区图的功能函数 -------------------------*/

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

                                // 管理员登录时限制输入框
                                if((identity - 0) === 1) {
                                    /*------------------- 限制算法一和算法二的第二个和第三个输入框 -------------------*/
                                    input2Limited('upperDegree', 'nodeId');
                                    input3Limited('lowerDegree', 'upperDegree');
                                    input2Limited('upperDegree2', 'nodeId2');
                                    input3Limited('lowerDegree2', 'upperDegree2');
                                    /*------------------- 限制算法一和算法二的第二个和第三个输入框 -------------------*/
                                }
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

/*------------------------------- bootstrap-slider ------------------------------*/
$("#ex1").slider();
$("#ex1").on('slide', function(slideEvt) {
    // 动态改变绘图周期（单位：ms）
    draw_rate1 = slideEvt.value * 100;
    $("#ex1SliderVal").text(slideEvt.value / 10);
});
$("#ex2").slider();
$("#ex2").on('slide', function(slideEvt) {
    // 动态改变绘图周期（单位：ms）
    draw_rate2 = slideEvt.value * 100;
    $("#ex2SliderVal").text(slideEvt.value / 10);
});
/*------------------------------- bootstrap-slider ------------------------------*/

/*----------------------------------- 统计图 -----------------------------------*/

/*------------------------------ 绘制柱状统计图 ------------------------------*/
// # xAxisData为形如 ['CMF', 'CPJ', 'MQAC'] 这样的数组
// # seriesData为形如 ['CMF', 'CPJ', 'MQAC'] 的数组中每个属性所对应的值所组成的一个对象（即含有两个算法对应数据的数组）
function drawHistogram(containerId, alg1Name, alg2Name, xAxisData, seriesData) {
    // 清空ECharts图形所在的画布
    clearEChartsCanvas(containerId);

    var chartDom = document.getElementById(containerId);
    var myChart = echarts.init(chartDom);
    var option;

    var app = {};

    const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
    ];
    app.configParameters = {
        rotate: {
            min: -90,
            max: 90
        },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: posList.reduce(function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    };
    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            };
            myChart.setOption({
                series: [
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    }
                ]
            });
        }
    };

    /*<------------------ 暂不在柱状图的每条柱子上使用文字标签的选项 ------------------>*/
    const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {}
        }
    };
    /*<------------------ 暂不在柱状图的每条柱子上使用文字标签的选项 ------------------>*/
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [alg1Name, alg2Name]
        },
        toolbox: { // 多功能菜单（可用于转换柱状图）
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [ // X轴的配置
            {
                type: 'category',
                axisTick: { show: false },
                data: xAxisData
            }
        ],
        yAxis: [ // Y轴的配置
            {
                type: 'value'
            }
        ],
        series: [
            {  // 算法一的数据
                name: alg1Name,
                type: 'bar',
                barGap: 0,
                // label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: seriesData.alg1,
            },
            {
                name: alg2Name,
                type: 'bar',
                // label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: seriesData.alg2,
            }
        ]
    };

    // 隐藏柱形图容器的加载器和遮盖层
    $('#' + containerId).hideLoading();

    option && myChart.setOption(option);

    // 绘制完成柱状图后擦除历史数据
    result1_histogram = undefined;
    result2_histogram = undefined;
}
/*------------------------------ 绘制柱状统计图 ------------------------------*/

/*---------------------- 绘制扇形统计图 ----------------------*/
function drawSectorDiagram(containerId, algText, dataObject) {
    // 清空ECharts图形所在的画布
    clearEChartsCanvas(containerId);

    var chartDom = document.getElementById(containerId);
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        title: {
            text: algText,
            subtext: '',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}：&nbsp;<strong>{c}</strong> <strong>({d}&nbsp;%)</strong>',
        },
        legend: {
            orient: 'horizontal', // vertical horizontal
            top: 'bottom', // right center
        },
        series: [
            {
                name: '用户评分的分布情况',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: dataObject.one, name: '0.0 ~ 1.0' },
                    { value: dataObject.two, name: '1.0 ~ 2.0' },
                    { value: dataObject.three, name: '2.0 ~ 3.0' },
                    { value: dataObject.four, name: '3.0 ~ 4.0' },
                    { value: dataObject.five, name: '4.0 ~ 5.0' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 隐藏扇形图容器的加载器和遮盖层
    $('#' + containerId).hideLoading();

    option && myChart.setOption(option);
}
/*---------------------- 绘制扇形统计图 ----------------------*/
/*----------------------------------- 统计图 -----------------------------------*/

/*----------------------- 清空ECharts图形所在的画布 -----------------------*/
function clearEChartsCanvas(containerId) {
    // 清空ECharts的画布并重新绘制图形
    $('#' + containerId).removeAttr("_echarts_instance_").empty();
}
/*----------------------- 清空ECharts图形所在的画布 -----------------------*/
