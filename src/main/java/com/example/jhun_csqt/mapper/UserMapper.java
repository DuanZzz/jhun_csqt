package com.example.jhun_csqt.mapper;

import com.example.jhun_csqt.entity.Query.UserQuery;
import com.example.jhun_csqt.entity.user.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    /* 查询用户列表 */
    List<User> listUser(UserQuery userQuery);
}
