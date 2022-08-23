package com.example.jhun_csqt.entity.Common;

import lombok.Data;

/**
 * 节点样式对象
 *
 * @author: wyh
 * @Date: 2021/8/28
 * @Description:
 */
@Data
public class itemStyle {
    /**
     * 节点颜色
     */
    private String color;

    public itemStyle() {
        this.color = "#ccc"; // 默认为灰色
    }
}
