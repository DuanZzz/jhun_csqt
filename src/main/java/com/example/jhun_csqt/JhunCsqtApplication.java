package com.example.jhun_csqt;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;

@SpringBootApplication
@Configuration
@MapperScan("com.example.jhun_csqt.mapper") // 扫描mapper包
@ServletComponentScan
public class JhunCsqtApplication extends SpringBootServletInitializer {
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        // 单个数据大小
        factory.setMaxFileSize(DataSize.parse("102400KB"));
        // 总上传数据大小
        factory.setMaxRequestSize(DataSize.parse("307200KB"));
        return factory.createMultipartConfig();
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder){
        // 指向SpringBoot的引导类
        return builder.sources(JhunCsqtApplication.class);
    }

    public static void main(String[] args) { SpringApplication.run(JhunCsqtApplication.class, args); }
}
