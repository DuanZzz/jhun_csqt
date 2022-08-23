package com.example.jhun_csqt.service;

import com.example.jhun_csqt.entity.Overview.AlgOverview;
import com.example.jhun_csqt.entity.Query.AlgOverviewQuery;

import java.util.List;

public interface AlgOverviewService {
    /*查询算法概述列表*/
    List<AlgOverview> listOverview(AlgOverviewQuery algOverviewQuery);

    /*查询算法概述（根据标题模糊搜索）*/
    List<AlgOverview> searchOverview(AlgOverviewQuery algOverviewQuery);

    /*将数据集文件保存在数据库中*/
    int insertOverview(AlgOverview algOverview);

    /*修改算法概述*/
    void updateOverview(AlgOverview algOverview);

    /*删除算法概述*/
    void deleteOverview(AlgOverviewQuery algOverviewQuery);
}
