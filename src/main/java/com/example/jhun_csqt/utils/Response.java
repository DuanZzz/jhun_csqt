package com.example.jhun_csqt.utils;

import lombok.Data;

/**
 * @author wyh
 * @date 2021/9/23
 * @description 统一返回结果的格式工具类
 */
@Data
public class Response {
    /**
     * 状态码，1表示成功，0表示失败
     */
    private Integer code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 返回包装类型
     */
    private Object data;

    public Response() { }

    public Response(Integer code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
