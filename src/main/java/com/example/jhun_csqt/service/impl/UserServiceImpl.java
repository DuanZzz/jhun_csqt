package com.example.jhun_csqt.service.impl;

import com.example.jhun_csqt.entity.Query.UserQuery;
import com.example.jhun_csqt.entity.user.User;
import com.example.jhun_csqt.mapper.UserMapper;
import com.example.jhun_csqt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> listUser(UserQuery userQuery) {
        return userMapper.listUser(userQuery);
    }
}
