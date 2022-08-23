package com.example.jhun_csqt.entity.αβAWCS;

import lombok.Data;

@Data
public class TimeData {
    /**
     * 数据集读取时间
     */
    private String graphReadTime;

    /**
     * Iabs索引构建时间
     */
    private String iabsIndexBulidTime;

    /**
     * a，b-core筛选时间
     */
    private String abCoreSiftTime;

    /**
     * keyword筛选时间
     */
    private String keyWordSiftTime;

    /**
     * SCS-Peel筛选时间
     */
    private String scsPeelSiftTime;

    /**
     * 程序运行总时间
     */
    private String runTotalTime;

    public TimeData() {}

    public TimeData(String graphReadTime, String iabsIndexBulidTime, String abCoreSiftTime, String keyWordSiftTime, String scsPeelSiftTime, String runTotalTime) {
        this.graphReadTime = graphReadTime;
        this.iabsIndexBulidTime = iabsIndexBulidTime;
        this.abCoreSiftTime = abCoreSiftTime;
        this.keyWordSiftTime = keyWordSiftTime;
        this.scsPeelSiftTime = scsPeelSiftTime;
        this.runTotalTime = runTotalTime;
    }
}
