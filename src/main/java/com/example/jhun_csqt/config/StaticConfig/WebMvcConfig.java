package com.example.jhun_csqt.config.StaticConfig;

import com.example.jhun_csqt.config.Interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/templates/**").addResourceLocations("classpath:/templates/");
        // 加载管理员上传的文件路径下的资源
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:D:/Program Files/Apache Software Foundation/Tomcat 10.0/webapps/files");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/File/**", "/Files/**", "/Ktruss/**", "/Algorithms/**", "/αβAWCS/**", "/algorithmContrast/**")
                .excludePathPatterns("/File/download", "/Files/uploadFile", "/Files/selectFileList", "/Algorithms/listPageOverview", "/Algorithms/searchOverview");
//                .excludePathPatterns("/**/Login", "/**/login", "/index", "/**/getpage", "/static/**",
//                        "/**/*.css", "/**/*.js", "/**/*.png", "/**/*.svg", "/**/*.jpg", "/**/*.jpeg",
//                        "/**/*.gif", "/**/*.ico", "/**/*.map", "/**/fonts", "/**/pdf", "/**/vendor");
    }
}
