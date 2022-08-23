package com.example.jhun_csqt.service;

import com.example.jhun_csqt.entity.Query.AlgContrastQuery;
import com.example.jhun_csqt.entity.algContrast.AlgContrastResult;

import java.util.List;

public interface AlgContrastService {
    /*查询算法搜索结果列表*/
    List<AlgContrastResult> listAlgResult(AlgContrastQuery algContrastQuery);

    /*将算法搜索结果保存在数据库中*/
    int insertAlgResult(AlgContrastResult algContrastResult);

    /*修改算法搜索结果*/
    void updateAlgResult(AlgContrastResult algContrastResult);
}
