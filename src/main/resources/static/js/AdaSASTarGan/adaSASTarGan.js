/*-------------------- 预定义的变量 --------------------*/
// 浏览器中用户的登录信息
var user_loginInfo;
// 下载标记
var downloadFlag = 0;
// 音频所在的资源路径（相对路径）
const audioUrlPath = "/static/audio";
/*-------------------- 预定义的变量 --------------------*/

// 未登录时点击登录按钮
function loginS() {
    window.location.href = "http://localhost:8080/Login?flag=adasastargan";
}

// 改变按钮上的文本的函数
function changeBtnText(id, text) {
    $('#' + id).text(text);
}
// 递归实现音频延时下载
function delayDownloadAudios(audios, index, id, timeout) {
    if((audios !== undefined && audios.length > 0) && (typeof index == "number" && index >= 0) &&
        (typeof timeout == "number" && timeout >= 0)) {
        if(index >= audios.length) {
            return true;
        } else {
            let downloadLink = document.getElementById(id);
            let audioName = audios[index];
            $(downloadLink).attr('href', audioUrlPath + '/' + audioName);
            $(downloadLink).attr('download', audioName);
            downloadLink.click();
            // 递归延时下载
            setTimeout(() => {
                delayDownloadAudios(audios, index + 1, id, timeout);
            }, timeout);
        }
    } else {
        return false;
    }
}
// 下载音频文件并还原下载按钮、复选框和标记
function download(checkBoxName, downloadBtnId, downloadLinkId) {
    // 获取所有选中的复选框的值（即音频文件名）
    let audios = getCheckBoxValue(checkBoxName);
    // 间隔时间
    let timeout = 3000; // 延时3s下载
    // 方法二（延时下载音频文件）：
    delayDownloadAudios(audios, 0, downloadLinkId, timeout);
    // 方法一（同步下载）：
    // if(audios !== undefined && audios.length > 0) {
    //     let downloadLink = document.getElementById('downloadAudio');
    //     for (let i = 0; i < audios.length; i++) {
    //         let audioName = audios[i];
    //         $(downloadLink).attr('href', audioUrlPath + '/' + audioName);
    //         $(downloadLink).attr('download', audioName);
    //         downloadLink.click();
    //     }
    // }
    // 还原复选框和下载按钮
    resetCheckBoxAndBtn(downloadBtnId, checkBoxName);
    // 还原标记
    downloadFlag = 0;
}
// 批量下载函数
function downloadMany(checkBoxName, downloadBtnId) {
    if(downloadFlag === 0) {
        let audios = $('input[name="'+checkBoxName+'"]');
        for (let i = 0; i < audios.length; i++) {
            if(audios.eq(i).css('display') === 'none') {
                audios.eq(i).css('display', 'block');
            }
        }
        // 改变按钮上的文字
        changeBtnText(downloadBtnId, '下载');
        // 改变下载按钮的状态
        $('#' + downloadBtnId).attr('disabled', true);
        // 改变标记
        downloadFlag = 1;
    } else if(downloadFlag === 1) {
        swal({
            title: "开始下载...",
            text: "每隔 3s 下载一个音频文件。",
            type: "info",
            timer: 2000,
            showConfirmButton: false
        });
        download('audioChoose', 'audioDownloadMany', 'downloadAudio');
    }
}
// 根据名称判断是否有复选框被选中
function isChecked(name) {
    let checkBoxS = $('input[name="'+name+'"]');
    for (let key in checkBoxS) {
        if(checkBoxS[key].checked)
            return true;
    }
    return false;
}
// 获取所有被选中的复选框的值
function getCheckBoxValue(name) {
    // 值的集合
    let values = [];
    // 复选框集
    let checkBoxS = $('input[name="'+name+'"]');
    for (let key in checkBoxS) {
        if(checkBoxS[key].checked) {
            values.push(checkBoxS[key].value);
        }
    }
    return values;
}
// 还原复选框和批量下载按钮
function resetCheckBoxAndBtn(id, name) {
    // 还原复选框
    let checkBoxS = $('input[name="'+name+'"]');
    for (let key in checkBoxS) {
        // 恢复为未选中的状态
        if(checkBoxS[key].checked) {
            checkBoxS[key].checked = false;
        }
    }
    for (let i = 0; i < checkBoxS.length; i++) {
        // 隐藏复选框
        checkBoxS.eq(i).css('display', 'none');
    }
    // 还原按钮
    $('#' + id).attr('disabled', false);
    // 还原下载按钮上的文字
    changeBtnText('audioDownloadMany', '批量下载');
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

$(function () {
    /*---------------- 导航栏中的列表状态 ----------------*/
    $('#ui').attr('hidden', true);
    $('#a1').click(function () {
        $('#ui').attr('hidden', false);
    });
    $('#forms').attr('hidden', true);
    $('#a2').click(function () {
        $('#forms').attr('hidden', false);
    });
    $('#infoNet').attr('hidden', true);
    $('#a3').click(function () {
        $('#infoNet').attr('hidden', false);
    });
    $('#bigraph').attr('hidden', true);
    $('#a4').click(function () {
        $('#bigraph').attr('hidden', false);
    });
    /*---------------- 导航栏中的列表状态 ----------------*/

    // 显示当前时间
    showCurrentTime('time1');

    /*------------- 批量下载音频文件的功能实现 -------------*/
    $('#audioDownloadMany').on('click', function () {
        downloadMany('audioChoose', 'audioDownloadMany');
    });

    const checkBoxS = document.getElementsByName('audioChoose');
    checkBoxS.forEach(checkBox => {
        checkBox.addEventListener('click', () => {
            let checkBoxState = isChecked('audioChoose');
            if(checkBoxState) {
                // 改变下载按钮的状态
                $('#audioDownloadMany').attr('disabled', false);
            } else {
                // 改变下载按钮的状态
                $('#audioDownloadMany').attr('disabled', true);
            }
        });
    });
    /*------------- 批量下载音频文件的功能实现 -------------*/

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
                                                    window.location.href = "http://localhost:8080/getpage?value=adasastargan";
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
});

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

