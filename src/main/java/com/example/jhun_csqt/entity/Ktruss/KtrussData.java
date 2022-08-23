package com.example.jhun_csqt.entity.Ktruss;

import lombok.Data;

@Data
public class KtrussData {
    /**
     * 总顶点数
     */
    private int vertices;

    /**
     * 总边数
     */
    private int edges;

    /**
     * 所有顶点的度的最大值
     */
    private int dmax;

    /**
     * 所有边的k-truss的最大值
     */
    private int kmax;

    /**
     * 图的读取时间（ms）
     */
    private double graphReadTime;

    /**
     * 求每条边的support属性所需时间
     */
    private double support_time;

    /**
     * k-truss算法的计算时间
     */
    private double ktrussCalTime;

    /**
     * 索引建立所需时间
     */
    private double indexCreationTime;

    public KtrussData() { }

    public KtrussData(int vertices, int edges, int dmax, int kmax, double graphReadTime, double support_time, double ktrussCalTime, double indexCreationTime) {
        this.vertices = vertices;
        this.edges = edges;
        this.dmax = dmax;
        this.kmax = kmax;
        this.graphReadTime = graphReadTime;
        this.support_time = support_time;
        this.ktrussCalTime = ktrussCalTime;
        this.indexCreationTime = indexCreationTime;
    }
}
