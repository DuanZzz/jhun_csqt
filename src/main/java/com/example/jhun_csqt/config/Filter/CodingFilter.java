package com.example.jhun_csqt.config.Filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "codingFilter", urlPatterns = {"/*"})
public class CodingFilter implements Filter {
    // 初始化配置
    private FilterConfig config;

    // 初始化编码参数
    private static final String INIT_CodingParam1 = "utf-8";
    private static final String INIT_CodingParam2 = "text/html;charset=utf-8";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.config = filterConfig;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String code1 = config.getInitParameter(INIT_CodingParam1);
        String code2 = config.getInitParameter(INIT_CodingParam2);
        if(code1 != null && !code1.isEmpty()) {
            request.setCharacterEncoding(code1);
        }
        if(code2 != null && !code2.isEmpty()) {
            response.setContentType(code2);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
//        Filter.super.destroy();
    }
}
