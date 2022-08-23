package com.example.jhun_csqt.mapper;

import com.example.jhun_csqt.entity.Query.αβAWCSQuery;
import com.example.jhun_csqt.entity.αβAWCS.αβAWCSResult;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface αβAWCSMapper {
    /*查询(α，β)-AWCS算法的社区搜索结果列表*/
    List<αβAWCSResult> listαβAWCSResult(αβAWCSQuery awcsQuery);

    /*将计算数据保存在数据库中*/
    int InsertData(αβAWCSResult awcsResult);

    /*覆盖ktruss算法输出的测试结果*/
    void UpdateαβAWCSResult(αβAWCSResult awcsResult);
}
