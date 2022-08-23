package com.example.jhun_csqt.entity.Query;

import lombok.Data;

@Data
public class AlgContrastQuery {
    /**
     * 搜索结果的id（编号，自增主键）
     */
    private Integer id;

    /**
     * 算法名
     */
    private String algName;

    /**
     * 数据集名
     */
    private String dataSet;

    public AlgContrastQuery() {}

    public AlgContrastQuery(String algName, String dataSet) {
        this.algName = algName;
        this.dataSet = dataSet;
    }
}
