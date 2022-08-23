/*---------------------------- 全局变量定义区域 ----------------------------*/
// 验证密码格式的正则表达式（((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,20})）
// ((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\x21-\x7e]+).{8,20}) or ((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20})
// \W：元符号，相当于[^a-zA-Z0-9_]，匹配除了字母、数字、下划线字符之外的任何字符
const verifyPassRegExp = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,20})';
/*---------------------------- 全局变量定义区域 ----------------------------*/

/* 获取服务器中保存的登录信息（包括密钥） */
function getEncryptedInfo(email) {
    let encryptedInfo = {};
    $.ajax({
        url: "User/getEncryptedInfo",
        type: "post",
        data: { "email": email },
        dataType: "json",
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
function getUserLoginInfo() {
    /*--------- 页面初始化后判断浏览器中是否含有用户的登录信息，有则填入 ---------*/
    // 隐藏眼睛图标
    $('#eyeBtn').hide();

    // 保存在浏览器中用户的登录信息
    let user_loginInfo = {};
    /// 用户的加密信息
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
                    if(contain(res, ';')) {
                        let splits = res.split(';');
                        for (let i = 0; i < splits.length; i++) {
                            let tmp = splits[i].split('=');
                            if(tmp[0] === "identityCode") {
                                user_loginInfo["identityCode"] = tmp[1];
                            } else if(tmp[0] === "account") {
                                user_loginInfo["account"] = tmp[1];
                            } else if(tmp[0] === "password") {
                                user_loginInfo["password"] = tmp[1];
                            }
                        }
                    }
                    if((user_loginInfo.account !== undefined && user_loginInfo.account !== "") &&
                        (user_loginInfo.password !== undefined && user_loginInfo.password !== "")) {
                        // 填入信息
                        // 用户身份识别码
                        if((user_loginInfo["identityCode"] - 0) === 1) {
                            $('#adminBtn').attr('checked', true);
                        } else if((user_loginInfo["identityCode"] - 0) === 2) {
                            $('#visitorBtn').attr('checked', true);
                        }
                        // 首先改变输入框的样式
                        $('input[name="email"]').addClass('has-val');
                        $('input[name="pass"]').addClass('has-val');
                        // 邮箱
                        $('input[name="email"]').val(user_loginInfo["account"]);
                        // 密码
                        $('input[name="pass"]').val(user_loginInfo["password"]);

                        // 显示眼睛图标
                        $('#eyeBtn').show();

                        // 记住密码选项自动勾选
                        $('input[name="remember-me"]').attr('checked', true);
                    }
                }
            },
            error: function (res) {
                // 显示明文获取出错消息提示框
                noticeBox('用户信息获取出错~', 'error', 'topCenter');
            }
        });
    }
    /*--------- 页面初始化后判断浏览器中是否含有用户的登录信息，有则填入 ---------*/
}

// 还原密码框图标的样式
function resetPassInput(id, name) {
    // 还原密码输入框中图标的状态以及输入框的type属性
    $('input[name="'+name+'"]').attr('type', 'password');
    $('#' + id).css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/img/login/icons/eye-slash.svg") no-repeat scroll 0% 0% / 30px 30px padding-box border-box');
}

// 根据身份来设置输入框的状态
function setInputStateByIdentity(identity, email, pass, remember, forgotPass) {
    if(typeof identity == "number") {
        if(identity === 1) {
            $('input[name="'+email+'"]').attr('disabled', false);
            $('input[name="'+pass+'"]').attr('disabled', false);
            $('input[name="'+remember+'"]').attr('disabled', false);
            $('#' + forgotPass).on('click', function () {
                swal('请联系管理员。', 'QQ：1784589809', 'info');
            });
            $('#' + forgotPass).attr('disabled', false);
        } else if(identity === 2) {
            $('input[name="'+email+'"]').attr('disabled', true);
            $('input[name="'+pass+'"]').attr('disabled', true);
            $('input[name="'+remember+'"]').attr('disabled', true);
            $('#' + forgotPass).off('click');
            $('#' + forgotPass).attr('disabled', true);
        }
    }
}

// function callback(res) {
//     console.log(res);
//
//     /* res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
//        res（客户端出现异常错误 仍返回可用票据） = {ret: 0, ticket: "String", randstr: "String", errorCode: Number, errorMessage: "String"}
//        res（用户主动关闭验证码）= {ret: 2}
//     */
//     if (res.ticket){
//         // 上传票据 可根据errorCode和errorMessage做特殊处理或统计
//     }
// }
// // 验证码js加载错误处理
// function loadErrorCallback() {
//     var CaptchaAppId = '2096286650'
//     /* 生成票据或自行做其它处理 */
//     var ticket = 'terror_1001_' + CaptchaAppId + Math.floor(new Date().getTime() / 1000);
//     callback({
//         ret: 0,
//         randstr: '@'+ Math.random().toString(36).substr(2),
//         ticket: ticket,
//         errorCode: 1001,
//         errorMessage: 'jsload_error',
//     });
// }

$(document).ready(function () {

    //方法1: 直接生成一个验证码对象。
    // try {
    //     var captcha1 = new TencentCaptcha('CaptchaAppId', callback);
    //     captcha1.show(); // 显示验证码
    // } catch (error) {
    //     loadErrorCallback();
    // }
    // //方法2:绑定一个元素并自动识别场景id和回调。
    // try {
    //     // 绑定一个元素并自动识别场景id和回调
    //     // 验证码会读取dom上的`data-appid`和`data-cbfn`以及`data-biz-state`(可选)自动初始化
    //     new TencentCaptcha(document.getElementById('TencentCaptcha'));
    // } catch (error) {
    //     loadErrorCallback();
    // }
    //方法3：绑定一个元素并手动传入场景Id和回调。
    // try {
    //     new TencentCaptcha(
    //         document.getElementById('TencentCaptcha'),
    //         '2096286650',
    //         callback,
    //         // { bizState: '' },
    //     );
    // } catch (error) {
    //     loadErrorCallback();
    // }


    getUserLoginInfo();
    // 动态显示图标
    $('input[name="pass"]').on('input propertychange blur', function () {
        let pass = $('input[name="pass"]').val();
        if(pass !== undefined && pass !== "") {
            $('#eyeBtn').show();
        } else {
            resetPassInput('eyeBtn', 'pass');
            $('#eyeBtn').hide();
        }
    });
    // 给图标绑定点击事件（动态变化）
    $('#eyeBtn').click(function () {
        // 取密码输入框中的值
        let passValue = $('input[name="pass"]').val();
        if(passValue !== undefined && passValue !== "") {
            let inputTypeValue = $('input[name="pass"]').prop('type');
            if(inputTypeValue === 'password') {
                $('input[name="pass"]').attr('type', 'text');
                $('#eyeBtn').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/img/login/icons/eye.svg") no-repeat scroll 0% 0% / 30px 30px padding-box border-box');
            } else {
                $('input[name="pass"]').attr('type', 'password');
                $('#eyeBtn').css('background', 'rgba(0, 0, 0, 0) url("http://localhost:8080/static/img/login/icons/eye-slash.svg") no-repeat scroll 0% 0% / 30px 30px padding-box border-box');
            }
        }
    });

    $('#forgotPass').on('click', function () {
        swal('请联系管理员。', 'QQ：1784589809', 'info');
    });

    // 用户选择身份后绑定相应的事件
    $('input[name="identity"]').on('click', () => {
        // 获取用户身份识别码
        let identity = $('input[name="identity"]:checked').val();
        if(identity !== undefined) {
            let identityCode = identity - 0;
            // 设置
            setInputStateByIdentity(identityCode, 'email', 'pass', 'remember-me', 'forgotPass');
        }
    });

    // 页面加载时自动改变单选按钮中汉字的颜色
    setLabelColor('btnGroup1');
    $('#btnGroup1 input').click(function () {
        setLabelColor('btnGroup1');
    });
});

/*--------------------- 输入框验证和点击登录按钮提交 ---------------------*/
/*==================================================================
    [ 输入框失去焦点后的样式 ]*/
$('.input100').each(function() {
    $(this).on('blur', function() {
        if($(this).val().trim() !== "") {
            $(this).addClass('has-val');
        } else {
            $(this).removeClass('has-val');
        }
    });
});

/*------------------ 非法验证以及输入框非法提示样式设置 ------------------*/
function validate (input) {
    if($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            // 邮箱格式不正确时将文本框清空
            $('input[name="email"]').val('');
            return false;
        } else {
            return true;
        }
    } else {
        // 密码输入框的验证（增加了密码格式的验证）trim方法去首尾空格
        let password = $(input).val().trim();
        if(password === '') {
            return false;
        } else {
            if(password.length < 8) {
                $('#PASSWORD').attr('data-validate', '密码至少需要8个字符');
                // 密码格式不正确时将文本框清空
                $('input[name="pass"]').val('');
                $('#eyeBtn').hide();
                return false;
            } else {
                // 判断密码是否符合指定的格式
                if(!password.match(verifyPassRegExp)) {
                    $('#PASSWORD').attr('data-validate', '密码至少包含一个大写字母、一个小写字母、一个数字和一个特殊字符（特殊字符不包括下划线）');
                    // 密码格式不正确时将文本框清空
                    $('input[name="pass"]').val('');
                    $('#eyeBtn').hide();
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
}

function showValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
}
/*------------------ 非法验证以及输入框非法提示样式设置 ------------------*/

// 输入框聚焦时隐藏非法输入的提示
$('.validate-form .input100').each(function(){
    $(this).focus(function() {
        hideValidate(this);
    });
});
/*--------------------- 输入框验证和点击登录按钮提交 ---------------------*/

/*--------------------- 改变单选按钮的颜色 ---------------------*/
function setLabelColor(id) {
    let inputs = $('#' + id).children('input');
    let labels = $('#' + id).children('label');
    for (let i = 0; i < inputs.length; i++) {
        let id = inputs.eq(i).prop('id');
        if(inputs.eq(i).is(':checked')) {
            for (let j = 0; j < labels.length; j++) {
                if(labels.eq(j).prop('for') === id) {
                    labels.eq(j).css('color', '#ffffff');
                }
            }
        } else {
            for (let j = 0; j < labels.length; j++) {
                if(labels.eq(j).prop('for') === id) {
                    labels.eq(j).css('color', '#666666');
                }
            }
        }
    }
}
/*--------------------- 改变单选按钮的颜色 ---------------------*/

// 判断字符串是否含有某个子串
function contain(STR, subStr) {
    for (let i = 0; i < STR.length; i++) {
        if(subStr === STR[i]) {
            return true;
        }
    }
    return false;
}

/*--------------- notice.js实现消息提示框 ---------------*/
function noticeBox(text, type, position) {
    new NoticeJs({
        text: text,
        type: type,
        position: position,
        animation: { // 消息框的动画效果
            open: 'animated bounceInRight',
            close: 'animated bounceOutLeft'
        }
    }).show();
}
/*--------------- notice.js实现消息提示框 ---------------*/

// 在浏览器中保存用户账号（ajax.cookie，有效期一年）
function saveCookie(account) {
    $.cookie('account', account, { expires: 365 });
}
/*---------------------- 用户登录函数 ----------------------*/
function Login(email, pass, identity) {
    // 封装用户信息
    let user = {};
    user["email"] = email;
    user["pass"] = pass;
    user["identity"] = identity;
    // 判断记住密码复选框是否被选中
    if($('input[name="remember-me"]').is(":checked")) {
        user["remember"] = 1;
    } else {
        user["remember"] = 0;
    }
    let user_jsonStr = JSON.stringify(user);
    $.ajax({
        url: "User/login",
        type: "post",
        data: {"userInfo": user_jsonStr},
        dataType: "json",
        success: function (res) {
            if(res !== null) {
                let user_token;
                if(res.data !== null) {
                    // 在客户端保存登录成功的用户账号
                    let account = res.data.account;
                    saveCookie(account);
                    // 获取随机编码
                    let randomCode = res.data.randomCode;
                    if(randomCode !== undefined) {
                        // 编码存在则保存
                        saveEncryptedCode(randomCode);
                    }
                    // 获取登录成功后用户的token（令牌）
                    user_token = res.data.userToken;
                }
                if(res.message === "emailNotExist") {
                    noticeBox('用户邮箱不存在！', 'warning', 'topCenter');
                    // 延时（2s）自动刷新页面
                    setTimeout(refreshPage, 2000);
                } else if(res.message === "passWrong") {
                    noticeBox('密码错误！', 'error', 'topCenter');
                    // 延时（2s）自动刷新页面
                    setTimeout(refreshPage, 2000);
                } else {
                    if(res.message === "alreadyLogin") {
                        // 在客户端保存用户已经登录成功的账号
                        saveCookie(email);
                        noticeBox('请先退出登录！', 'warning', 'topCenter');
                    } else if(res.message === "success") {
                        // 显示登录成功消息提示框
                        noticeBox('登录成功。', 'success', 'topCenter');
                    }
                    // 设置请求头并跳转页面
                    let header = { "token": user_token };
                    // 根据标识获取登录后跳转页面的url
                    let url = getURLByFlag(window.location.href);
                    // 发送ajax请求
                    router(url, 'get', header, '');
                }
            } else {
                // 显示登录失败消息提示框
                noticeBox('用户身份识别码有误！', 'error', 'topCenter');
            }
        },
        error: function (res) {
            // 显示登录出错消息提示框
            noticeBox('登录出错~', 'error', 'topCenter');
        }
    });
}
/*---------------------- 用户登录函数 ----------------------*/

/*---------- 在服务器中加密保存用户登录成功后的随机编码 ----------*/
function saveEncryptedCode(code) {
    let encryptedCode = encryptByDES(code, '@#~！%《*、^$?');
    let email = $.cookie('account');
    let infoGroup1 = {};
    infoGroup1['email'] = email;
    infoGroup1['code'] = encryptedCode;
    $.ajax({
        url: "User/saveCode",
        type: "post",
        data: { "infoGroup1": JSON.stringify(infoGroup1) },
        error: () => {
            noticeBox('密钥保存失败！', 'error', 'topCenter');
        }
    });
}
/*---------- 在服务器中保存用户登录成功后加密的随机编码 ----------*/

// DES加密
function encryptByDES(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
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

function getURLByFlag(value) {
    let flag;
    if(typeof value == "string" && value !== "") {
        if(contain(value, '?') && contain(value, '=')) {
            flag = value.substring("?").split("=")[1];
            if(flag === "ktruss")
                return "getpage?value=k-truss";
            if(flag === "overview")
                return "getpage?value=overview";
            if(flag === "abAWCS")
                return "getpage?value=αβAWCS";
            if(flag === "kclique")
                return "getpage?value=k-clique";
            if(flag === "kcore")
                return "getpage?value=k-core";
            if(flag === "KECC")
                return "getpage?value=K-ECC";
            if(flag === "achievements")
                return "getpage?value=achievements";
            if(flag === "view")
                return "getpage?value=view";
            if(flag === "connect")
                return "getpage?value=connect";
            if(flag === "adasastargan")
                return "getpage?value=adasastargan";
            if(flag === "algContrast")
                return "getpage?value=algContrast";
        } else {
            return "index";
        }
    }
    return "index";
}

// 自定义ajax的异步请求
function router(url, type, header, data) {
    $.ajax({
        url: url,
        type: type,
        headers: header,
        data: data,
        success: function () {
            // 2s后跳转至对应页面
            setTimeout(function () {
                window.location.href = "http://localhost:8080/" + url;
            }, 2000);
        },
        error: function () {
            // setTimeout(function () {
            //     // 登录失败则返回到相应的错误页面
            //     window.location.href = "http://localhost:8080/error";
            // }, 2000);
        }
    });
}

/*==================================================================
    [ 点击登录按钮进行登录 ]*/
function clickLogin(isVerifyPass) {
    /*------------ 获取用户选择的身份验证码 ------------*/
    // 方法一：
    // let identities = $('input[name="identity"]');
    // // 根据用户选择的身份进行登录
    // let identityCode = 0;
    // for (let i = 0; i < identities.length; i++) {
    //     let identity = identities.eq(i);
    //     if(identity.is(':checked')) {
    //         identityCode = identity.val() - 0;
    //         break;
    //     }
    // }
    // 方法二：
    let identityCode = 0;
    if($('input[name="identity"]:checked').val() !== undefined) {
        identityCode = $('input[name="identity"]:checked').val() - 0;
    }
    /*------------ 获取用户选择的身份验证码 ------------*/
    // 用户身份识别码必须大于零
    if(identityCode === 0) {
        noticeBox('请选择身份后登录！', 'warning', 'topCenter');
    } else {
        // 邮箱和密码
        let email = "", pass = "";
        if(identityCode === 1) {
            // 获取class=“validate-input”下的所有class=“input100”的输入框
            let inputs = $('.validate-input .input100');
            // 验证输入框是否全部验证通过
            let check = true;
            // 进行验证
            for (let i = 0; i < inputs.length; i++) {
                if(!validate(inputs[i])) {
                    showValidate(inputs[i]);
                    check = false;
                }
            }
            // 输入框全部验证通过后
            if(check) {
                // 获取邮箱
                email = $('input[name="email"]').val();
                // 获取密码
                pass = $('input[name="pass"]').val();
                // 进行拼图验证码的验证
                if(isVerifyPass === 0) {
                    noticeBox('请进行拼图验证！', 'warning', 'topCenter');
                } else if(isVerifyPass === 2) {
                    noticeBox('验证失败！', 'error', 'topCenter');
                } else if(isVerifyPass === 1) {
                    // 验证通过后进行登录
                    Login(email, pass, identityCode);
                }
            }
        } else if(identityCode === 2) {
            // 进行拼图验证码的验证
            if(isVerifyPass === 0) {
                noticeBox('请进行拼图验证！', 'warning', 'topCenter');
            } else if(isVerifyPass === 2) {
                noticeBox('验证失败！', 'error', 'topCenter');
            } else if(isVerifyPass === 1) {
                // 给游客进行编号
                email = "visitor";
                // 验证成功后登录
                Login(email, pass, identityCode);
            }
        }
    }
}
/*------------- 拼图验证码进行验证 -------------*/
$('#verifyPanel').slideVerify({
    type : 2,   // 类型
    vOffset : 5,  // 误差量，根据需求自行调整
    vSpace : 5, // 间隔
    imgName : ['1.jpg', '2.jpg'],
    imgSize : {
        width: '450px',
        height: '249px',
    },
    blockSize : {
        width: '40px',
        height: '40px',
    },
    barSize : {
        width : '450px',
        height : '40px',
    },
    ready : function() { // 重新刷新后
        // 解除登录按钮绑定的所有点击事件
        $('#loginBtn').off('click');
        // 重新绑定登录成功后的点击事件
        $('#loginBtn').on('click',function() {
            clickLogin(0); // 验证成功后
        });
    },
    success : function() { // 验证通过后
        // 解除登录按钮绑定的所有点击事件
        $('#loginBtn').off('click');
        // 重新绑定登录成功后的点击事件
        $('#loginBtn').on('click',function() {
            clickLogin(1); // 验证成功后
        });
    },
    error : function() { // 验证失败后
        // 解除登录按钮绑定的所有点击事件
        $('#loginBtn').off('click');
        // 重新绑定登录失败后的点击事件
        $('#loginBtn').on('click',function() {
            clickLogin(2);
        });
    }
});
/*------------- 判断用户是否通过拼图验证码的验证 -------------*/

/* 浏览器上刷新按钮的刷新功能（用于刷新当前页面） */
function refreshPage() {
    window.location.reload();
}
