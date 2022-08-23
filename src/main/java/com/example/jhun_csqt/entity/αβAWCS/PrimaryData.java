package com.example.jhun_csqt.entity.αβAWCS;

import lombok.Data;

import java.util.ArrayList;

@Data
public class PrimaryData {
    /**
     * 查询顶点的度
     */
    private int searchNodeDegree;

    /**
     * (α，β)-AWCS图密度
     */
    private double graphDentity;

    /**
     * (α，β)-AWCS顶点最小查询顶点属性集覆盖率
     */
    private String minCoverRate;

    /**
     * (α，β)-AWCS顶点平均查询顶点属性集覆盖率
     */
    private String averageCoverRate;

    /**
     * (α，β)-AWCS用户平均评分
     */
    private double averageScore;

    /**
     * peelResult的json数组表示形式
     */
    private ArrayList<WithAttrEdge> out_withAttrEdges;

    public PrimaryData() {}

    public PrimaryData(int searchNodeDegree, double graphDentity, String minCoverRate, String averageCoverRate, double averageScore) {
        this.searchNodeDegree = searchNodeDegree;
        this.graphDentity = graphDentity;
        this.minCoverRate = minCoverRate;
        this.averageCoverRate = averageCoverRate;
        this.averageScore = averageScore;
    }
}
