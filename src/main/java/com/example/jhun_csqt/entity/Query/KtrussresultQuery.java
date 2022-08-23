package com.example.jhun_csqt.entity.Query;

import lombok.Data;

/**
 * ktruss算法结果查询类
 *
 * @author: wyh
 * @Date: 2021/9/24
 * @Description:
 */
@Data
public class KtrussresultQuery {
    /**
     * 选择的数据集文件名
     */
    private String fileName;

    /**
     * 搜索节点id
     */
    private String nodeId;

    /**
     * 社区value值
     */
    private String ktrussValue;

    public KtrussresultQuery() { }

    public KtrussresultQuery(String fileName) {
        this.fileName = fileName;
    }

    public KtrussresultQuery(String nodeId, String ktrussValue) {
        this.nodeId = nodeId;
        this.ktrussValue = ktrussValue;
    }

    public KtrussresultQuery(String fileName, String nodeId, String ktrussValue) {
        this.fileName = fileName;
        this.nodeId = nodeId;
        this.ktrussValue = ktrussValue;
    }
}
