package com.example.jhun_csqt.config.Interceptor;

import com.example.jhun_csqt.config.Cache.LoginCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录拦截器
 *
 * @author wyh
 * @date 2021/12/29
 * @Description:
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {
    // 网页虚拟根路径
    private static String virtualROOT;

    // 登录日志打印器
    private static final Logger log = LoggerFactory.getLogger(LoginInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 初始化根路径
        virtualROOT = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        // 获取请求头中的token（用户令牌）
        String token = request.getHeader("token");
        log.info("请求开始, url: {}, token: {}", request.getRequestURL(), token);
        if (token == null || token.isEmpty()) {
            log.warn("token不能为空！");
        }
        String account = LoginCache.getCache(token);
        if(account == null || account.isEmpty()) {
            log.warn("用户未登录！");
            // 用户未登录时重定向到登录页面进行登录
            response.sendRedirect(virtualROOT + "/Login");
            return true;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, ModelAndView arg3) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest arg0, HttpServletResponse response, Object arg2, Exception arg3) throws Exception {
    }
}
