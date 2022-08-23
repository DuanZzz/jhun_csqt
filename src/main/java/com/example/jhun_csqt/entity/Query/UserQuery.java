package com.example.jhun_csqt.entity.Query;

import lombok.Data;

@Data
public class UserQuery {
    /**
     * 用户主键id
     */
    private Integer id;

    /**
     * 用户邮箱
     */
    private String email;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户身份识别码
     */
    private Integer identityCode;

    public UserQuery() {  }

    public UserQuery(String email) {
        this.email = email;
    }

    public UserQuery(String email, Integer identityCode) {
        this.email = email;
        this.identityCode = identityCode;
    }

    public UserQuery(String email, String password, Integer identityCode) {
        this.email = email;
        this.password = password;
        this.identityCode = identityCode;
    }
}
