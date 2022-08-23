package com.example.jhun_csqt.entity.Common;

import lombok.Data;

/**
 * 边样式实体类
 *
 * @author: wyh
 * @Date: 2021/8/28
 * @Description:
 */
@Data
public class lineStyle {
    /**
     * 边的颜色
     */
    private String color;

    /**
     * 边的宽度
     */
    private int width;

    /**
     * 边的类型（默认为：‘solid’）
     */
    private String type;

    /**
     * 边的曲度，支持从 0 到 1 的值，值越大曲度越大（默认为：0.3）
     */
    private double curveness;

    //无参构造函数
    public lineStyle() {
        this.color = "#ccc"; // 默认为灰色
        this.width = 2; // 默认为2
        this.type = "solid"; // 默认为实线
        this.curveness = 0; // 默认为 0.3
    }
}
