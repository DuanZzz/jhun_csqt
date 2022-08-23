package com.example.jhun_csqt.mapper;

import com.example.jhun_csqt.entity.Ktruss.Ktrussresult;
import com.example.jhun_csqt.entity.Query.KtrussresultQuery;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface KtrussMapper {
    /*查询k-truss算法的社区搜索结果列表*/
    List<Ktrussresult> listKtrussResult(KtrussresultQuery ktrussresultQuery);

    /*将计算数据保存在数据库中*/
    int InsertData(Ktrussresult ktrussresult);

    /*覆盖ktruss算法输出的测试结果*/
    void UpdateKtrussResult(Ktrussresult ktrussresult);
}
