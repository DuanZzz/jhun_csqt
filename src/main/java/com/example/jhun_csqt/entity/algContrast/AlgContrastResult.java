package com.example.jhun_csqt.entity.algContrast;

import lombok.Data;

@Data
public class AlgContrastResult {
    /**
     * 算法搜索结果id（编号，自增主键）
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

    /**
     * 用户输入数据（不包括算法名和数据集，json字符串）
     */
    private String inputData;

    /**
     * 算法输出数据（json字符串）
     */
    private String outputData;

    public AlgContrastResult() {};

    public AlgContrastResult(String algName, String dataSet, String inputData, String outputData) {
        this.algName = algName;
        this.dataSet = dataSet;
        this.inputData = inputData;
        this.outputData = outputData;
    }

    @Override
    public String toString() {
        return "AlgContrastResult{" +
                "id=" + id +
                ", algName='" + algName + '\'' +
                ", dataSet='" + dataSet + '\'' +
                ", inputData='" + inputData + '\'' +
                ", outputData='" + outputData + '\'' +
                '}';
    }
}
