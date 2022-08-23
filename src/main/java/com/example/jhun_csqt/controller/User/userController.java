package com.example.jhun_csqt.controller.User;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.config.Cache.LoginCache;
import com.example.jhun_csqt.entity.Query.UserQuery;
import com.example.jhun_csqt.entity.user.User;
import com.example.jhun_csqt.service.UserService;
import com.example.jhun_csqt.utils.EncryptionAlg.Code.RandomCode;
import com.example.jhun_csqt.utils.EncryptionAlg.ECC.ECC_Alg;
import com.example.jhun_csqt.utils.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.KeyPair;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("User")
public class userController {
    @Autowired
    private UserService userService;

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    // 用户登录（管理员、游客）
    @RequestMapping(value = "login", method = { RequestMethod.POST } )
    public Response userLogin(HttpServletRequest request) {
        JSONObject user = (JSONObject) JSON.parse(request.getParameter("userInfo"));
        // 账号
        String email = user.getString("email");
        // 密码
        String pass = user.getString("pass");
        // 身份识别码
        Integer identityCode = user.getInteger("identity");
        // 用户选择是否记住密码
        Integer remember = user.getInteger("remember");
        // 用户的登录信息
        String user_info = "";
        // 用户token
        String user_token;

        if((identityCode != null && identityCode > 0)) {
            if(identityCode == 1) {
                // 管理员登录时
                if((email != null && !email.isEmpty()) && (pass != null && !pass.isEmpty())) {
                    // 封装一个查询对象（通过邮箱和身份识别码来验证用户邮箱是否存在）
                    UserQuery userQuery = new UserQuery(email, identityCode);
                    // 在数据库中查找是否存在该用户
                    List<User> users = userService.listUser(userQuery);
                    if(users.size() == 0) {
                        log.error("用户邮箱不存在! email: {}", email);
                        return new Response(0, "emailNotExist", null);
                    }
                    User tmpUser = users.get(0);
                    // 判断用户的登录密码是否正确
                    if(!tmpUser.getPassword().equals(pass)) {
                        log.error("用户密码错误! pass: {}", pass);
                        return new Response(0, "passWrong", null);
                    }
                    // 首先判断用户是否已经登录
                    if(LoginCache.getCache(email) != null) {
                        log.warn("用户已登录! email: {}", email);
                        // 返回已登录用户的token（令牌）
                        // 包装数据
                        JSONObject object = new JSONObject();
                        object.put("userToken", LoginCache.getCache(email));
                        return new Response(0, "alreadyLogin", object);
                    }
                    user_token = System.currentTimeMillis() + new Random().nextInt(1000000) + "";
                    // 登陆成功则将登录信息暂存到内存中
                    LoginCache.setCache(user_token, email);
                    LoginCache.setCache(email, user_token);

                    // 获取已登录用户的用户名
                    String userName = tmpUser.getUserName();
                    // 获取用户的登录信息
                    if(remember == 1) { // 记住密码时
                        // 序列化cookie信息
                        user_info += "identityCode=" + identityCode + ";account=" + email +
                                ";password=" + pass + ";userName=" + userName + ";token=" + user_token;
                    } else {
                        // 序列化保存的cookie信息
                        user_info += "identityCode=" + identityCode + ";account=" + email + ";userName=" + userName + ";token=" + user_token;
                    }

                    // 加密数据（userInfo）
                    // 获取密钥对
                    KeyPair keyPair = ECC_Alg.generateECCKeyPair(256);
                    // 获取加密数据
                    byte[] encrypt = ECC_Alg.getCiphertext(keyPair, user_info);
                    user_info = new String(encrypt);
                    // 根据随机生成的编码保存密钥对
                    String randomCode = RandomCode.randomRangeCode(20);
                    if(LoginCache.getLoginInfo(email) == null) {
                        LoginCache.setUSER_KEY(randomCode, keyPair);
                        // 保存密文的bytes
                        LoginCache.setLoginInfo(user_info, encrypt);

                        // 保存已登录用户的登录信息（加密的）
                        LoginCache.setLoginInfo(email, user_info);
                        // 用户第一次登录成功时创建一个临时会话（用于保存登录成功产生的随机码，即安全指令）
                        HttpSession session = request.getSession();
                        session.setAttribute(email, randomCode);
                    }

                    // 包装数据
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("account", email);
                    jsonObject.put("userToken", user_token);
                    jsonObject.put("randomCode", randomCode);

                    // 返回加密数据和token
                    return new Response(1, "success", jsonObject);
                }
            } else if(identityCode == 2) {
                // 游客登录时
                if((!email.isEmpty())) {
                    // 给游客重新设置账号
                    long vNum = LoginCache.visitorNum;
                    email += vNum;
                    // 首先判断用户是否已经登录
                    if(LoginCache.getCache(email) != null) {
                        log.warn("用户已登录! account: {}", email);
                        // 返回已登录用户的token（令牌）
                        // 包装数据
                        JSONObject object = new JSONObject();
                        object.put("userToken", LoginCache.getCache(email));
                        return new Response(0, "alreadyLogin", object);
                    }
                    // 游客登录不需要密码（直接获得token）
                    user_token = System.currentTimeMillis() + new Random().nextInt(1000000) + "";
                    // 登陆成功则将登录信息暂存到内存中
                    LoginCache.setCache(user_token, email);
                    LoginCache.setCache(email, user_token);

                    // 获取用户的登录信息
                    user_info += "identityCode=" + identityCode + ";account=" + email + ";userName=游客" + vNum + ";token=" + user_token;
                    // 根据随机生成的编码保存密钥对
                    String randomCode = RandomCode.randomRangeCode(20);
                    // 加密数据（userInfo）
                    // 获取密钥对
                    KeyPair keyPair = ECC_Alg.generateECCKeyPair(256);
                    // 获取加密数据
                    byte[] encrypt = ECC_Alg.getCiphertext(keyPair, user_info);
                    user_info = new String(encrypt);
                    if(LoginCache.getLoginInfo(email) == null) {
                        // 保存密钥对
                        LoginCache.setUSER_KEY(randomCode, keyPair);
                        // 保存密文的bytes
                        LoginCache.setLoginInfo(user_info, encrypt);

                        // 保存已登录用户的登录信息（加密的）
                        LoginCache.setLoginInfo(email, user_info);
                        // 用户第一次登录成功时创建一个临时会话（用于保存登录成功产生的随机码，即安全指令）
                        HttpSession session = request.getSession();
                        session.setAttribute(email, randomCode);
                    }

                    // 包装数据
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("account", email);
                    jsonObject.put("userToken", user_token);
                    jsonObject.put("randomCode", randomCode);

                    // 游客编号加一
                    vNum++;
                    LoginCache.visitorNum = vNum;

                    // 返回加密数据和token
                    return new Response(1, "success", jsonObject);
                }
            }
        }
        return null;
    }

    // 保存用户登录成功后前端产生的密钥（第二次加密后的随机编码）
    @RequestMapping(value = "saveCode", method = { RequestMethod.POST } )
    public void saveCode(HttpServletRequest request) {
        JSONObject user = (JSONObject) JSON.parse(request.getParameter("infoGroup1"));
        // 账号
        String account = user.getString("email");
        // 随机码
        String code = user.getString("code");
        HttpSession session = request.getSession();
        session.setAttribute((String) session.getAttribute(account), code);
    }

    // 获取用户登录成功后的加密信息（登录信息和第二次加密的密钥）
    @RequestMapping(value = "getEncryptedInfo", method = { RequestMethod.POST } )
    public Response getEncryptedInfo(HttpServletRequest request) {
        HttpSession session = request.getSession();

        String account = request.getParameter("email");
        String encryptedUserInfo = (String) LoginCache.getLoginInfo(account);
        String encryptedRandomCode = (String) session.getAttribute((String) session.getAttribute(account));

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("encryptedUserInfo", encryptedUserInfo);
        jsonObject.put("encryptedRandomCode", encryptedRandomCode);

        return new Response(1, "success", jsonObject);
    }

    // 退出登录（管理员、游客）
    @RequestMapping(value = "quitLogin", method = { RequestMethod.POST } )
    public Response quitLogin(HttpServletRequest request) {
        JSONObject user = (JSONObject) JSON.parse(request.getParameter("userInfo"));
        // 账号
        String account = user.getString("account");
        // 用户token
        String user_token = user.getString("token");
        // 随机编码（安全指令）
        String randomCode = (String) request.getSession().getAttribute(account);

        // 删除内存（LoginCache）中保存的token信息
        LoginCache.deleteCache(user_token);
        LoginCache.deleteCache(account);
        if(randomCode != null) {
            // 删除密钥对
            LoginCache.deleteUSER_KEY(randomCode);
        }
        // 删除账号和密文绑定的登录信息
        LoginCache.deleteLoginInfo((String) LoginCache.getLoginInfo(account));
        LoginCache.deleteLoginInfo(account);
        // 删除用户登录成功后保存在session中的密令
        request.getSession().removeAttribute(account);
        // 删除加密的随机编码
        request.getSession().removeAttribute((String) request.getSession().getAttribute(account));
        // 销毁session（用户会话）
        request.getSession().invalidate();

        return new Response(1, "", null);
    }

    // 保障用户登录信息的安全，服务器端使用ECC加密算法（管理员、游客）
    @RequestMapping(value = "security", method = { RequestMethod.POST } )
    public String security(HttpServletRequest request) {
        JSONObject user = (JSONObject) JSON.parse(request.getParameter("securityReq"));

        // 获取随机编码（安全密令）
        String randomCode = user.getString("randomCode");
        // 密钥对
        KeyPair keyPair = null;
        if(randomCode != null && !randomCode.isEmpty()) {
            // 根据安全密令获取密钥对
            keyPair = LoginCache.getUSER_KEY(randomCode);
        }

        // 获取密文
        String ciphertext = user.getString("cipherText");
        // 密文的字节数组
        byte[] encrypt = new byte[0];
        if(ciphertext != null && !ciphertext.isEmpty()) {
            // 获取数组
            encrypt = (byte[]) LoginCache.getLoginInfo(ciphertext);
        }

        // 明文
        String clearText;
        if(keyPair != null && encrypt.length > 0) {
            // 获取明文
            clearText = ECC_Alg.getCleartext(keyPair, encrypt);
            if(clearText != null) {
                return clearText;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
