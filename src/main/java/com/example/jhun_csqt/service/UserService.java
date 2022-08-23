package com.example.jhun_csqt.service;

import com.example.jhun_csqt.entity.Query.UserQuery;
import com.example.jhun_csqt.entity.user.User;

import java.util.List;

public interface UserService {
    /* 查询用户列表 */
    List<User> listUser(UserQuery userQuery);
}
