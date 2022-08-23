package com.example.jhun_csqt.entity.Query;

import lombok.Data;

/**
 * αβAWCS算法结果查询类
 *
 * @author: wyh
 * @Date: 2021/11/27
 * @Description:
 */
@Data
public class αβAWCSQuery {
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

    public αβAWCSQuery() { }

    public αβAWCSQuery(String fileName, String nodeId, String upperDegree, String lowerDegree, String constraintWay, String keywords) {
        this.fileName = fileName;
        this.nodeId = nodeId;
        this.upperDegree = upperDegree;
        this.lowerDegree = lowerDegree;
        this.constraintWay = constraintWay;
        this.keywords = keywords;
    }
}

