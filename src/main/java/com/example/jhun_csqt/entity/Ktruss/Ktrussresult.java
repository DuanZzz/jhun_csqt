package com.example.jhun_csqt.entity.Ktruss;

import lombok.Data;

/**
 * ktruss算法结果类
 *
 * @author: wyh
 * @Date: 2021/8/28
 * @Description:
 */
@Data
public class Ktrussresult
{
    /**
     * 搜索节点id
     */
    private String nodeId;

    /**
     * 社区value值
     */
    private String ktrussValue;

    /**
     * 总边数
     */
    private String numberOfEdges;

    /**
     * 具体的边
     */
    private String outlinks;

    /**
     * 数据集文件名
     */
    private String fileName;

    /**
     * k-truss算法输出的其他数据的字符串形式
     */
    private String otherData;

    /**
     * k-truss算法输出的其他数据
     */
    private KtrussData ktrussData;

    public Ktrussresult(String nodeId, String ktrussValue, String numberOfEdges, String outlinks, String fileName, String otherData) {
        this.nodeId = nodeId;
        this.ktrussValue = ktrussValue;
        this.numberOfEdges = numberOfEdges;
        this.outlinks = outlinks;
        this.fileName = fileName;
        this.otherData = otherData;
    }
}
