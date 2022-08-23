package com.example.jhun_csqt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author wyh
 * @date 2021/5/9 23:11
 * @description 通过controller类进行页面跳转
 */
@Controller
public class ChoosePagesController {
    //跳转首页
    @RequestMapping("index")
    public String index()
    {
        return "index";
    }

    //跳转到指定页
    @RequestMapping(value="getpage",method={RequestMethod.GET})
    public String Page(HttpServletRequest request) throws ServletException, IOException {
        String Value="index";
        String value = request.getParameter("value");

        switch (value) {
            case "achievements":
                Value="achievements";
                break;
            case "view":
                Value="view";
                break;
            case "connect":
                Value="connect";
                break;
            case "overview":
                Value="overview";
                break;
            case "k-core":
                Value="k-core";
                break;
            case "αβAWCS":
                Value="αβAWCS";
                break;
            case "k-truss":
                Value="k-truss";
                break;
            case "k-clique":
                Value="k-clique";
                break;
            case "K-ECC":
                Value="K-ECC";
                break;
            case "algContrast":
                Value="algContrast";
                break;
            case "fileUpload":
                Value="fileUpload";
                break;
            case "login":
                Value="login";
                break;
            case "adasastargan":
                Value="adasastargan";
                break;
        }
        return Value;
    }

    // 跳转到登录页面
    @RequestMapping("Login")
    public String Login() {
        return "login";
    }
}
