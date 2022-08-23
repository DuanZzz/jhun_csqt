package com.example.jhun_csqt.entity.user;

import lombok.Data;

@Data
public class User {
    /**
     * 用户主键id
     */
    private Integer id;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 用户邮箱
     */
    private String email;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户身份识别码（1为管理员，2为游客）
     */
    private Integer identityCode;

    public User() {  }

    public User(Integer id, String userName, String email, String password, Integer identityCode) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.identityCode = identityCode;
    }
}
