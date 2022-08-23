package com.example.jhun_csqt.entity.Common;

import lombok.Data;

/**
 * 边实体对象
 *
 * @author: wyh
 * @Date: 2021/8/4
 * @Description:
 */
@Data
public class Link {
    /**
     * 边id值
     */
    private int id;

    /**
     * 边名称
     */
    private String name;

    /**
     * 边起始点的id值
     */
    private int source;

    /**
     * 边终止点的id值
     */
    private int target;

    /**
     * 边的样式
     */
    private lineStyle lineStyle;

    /**
     * 边的权值（权重）
     */
    private float value;

    //构造函数
    public Link(int source, int target) {
        this.source = source;
        this.target = target;
        this.lineStyle = new lineStyle();
    }
}