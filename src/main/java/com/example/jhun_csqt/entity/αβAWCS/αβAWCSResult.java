package com.example.jhun_csqt.entity.αβAWCS;

import lombok.Data;

/**
 * αβAWCS算法结果类
 *
 * @author: wyh
 * @Date: 2021/11/27
 * @Description:
 */
@Data
public class αβAWCSResult {
    /**
     * 数据集文件名
     */
    private String fileName;

    /**
     * 搜索顶点id
     */
    private String nodeId;

    /**
     * 上层顶点的度
     */
    private String upperDegree;

    /**
     * 下层顶点的度
     */
    private String lowerDegree;

    /**
     * 算法约束方式
     */
    private String constraintWay;

    /**
     * 电影关键词
     */
    private String keywords;

    /**
     * αβAWCS算法输出的主要数据
     */
    private PrimaryData primaryData_jsonStr;

    /**
     * αβAWCS算法输出的主要数据的json字符串表示形式
     */
    private String primaryData;

    /**
     * αβAWCS算法输出的时间数据
     */
    private TimeData timeData_jsonStr;

    /**
     * αβAWCS算法输出的时间数据的json字符串表示形式
     */
    private String timeData;

    public αβAWCSResult() { }

    public αβAWCSResult(String fileName, String nodeId, String upperDegree, String lowerDegree, String constraintWay, String keywords, String primaryData_jsonStr, String timeData_jsonStr) {
        this.fileName = fileName;
        this.nodeId = nodeId;
        this.upperDegree = upperDegree;
        this.lowerDegree = lowerDegree;
        this.constraintWay = constraintWay;
        this.keywords = keywords;
        this.primaryData = primaryData_jsonStr;
        this.timeData = timeData_jsonStr;
    }
}
