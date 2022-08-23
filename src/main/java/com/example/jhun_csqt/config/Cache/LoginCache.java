package com.example.jhun_csqt.config.Cache;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.util.HashMap;
import java.util.Map;

/**
 * 登录缓存
 *
 * @Author: wyh
 * @Date: 2021/12/29
 * @Description:
 */
@Component
@Scope(value = "singleton")
public class LoginCache {
    // 游客的编号
    public static long visitorNum = 1;

    // 保存用户登录后的token（令牌）
    private static Map<String, String> CACHE = new HashMap<>();

    public static String getCache(String str) {
        return CACHE.get(str);
    }

    public static void setCache(String str, String STR) {
        CACHE.put(str, STR);
    }

    public static void deleteCache(String str) {
        CACHE.remove(str);
    }

    // cookie的密钥对和密文以及用户的账号信息
    private static Map<String, Object> LoginInfo = new HashMap<>();

    public static Object getLoginInfo(String str) {
        return LoginInfo.get(str);
    }

    public static void setLoginInfo(String str, Object obj) {
        LoginInfo.put(str, obj);
    }

    public static void deleteLoginInfo(String str) {
        LoginInfo.remove(str);
    }

    // 用户的密钥对（公钥和私钥）
    private static Map<String, KeyPair> USER_KEY = new HashMap<>();

    public static KeyPair getUSER_KEY(String str) {
        return USER_KEY.get(str);
    }

    public static void setUSER_KEY(String str, KeyPair keyPair) {
        USER_KEY.put(str, keyPair);
    }

    public static void deleteUSER_KEY(String str) {
        USER_KEY.remove(str);
    }
}
