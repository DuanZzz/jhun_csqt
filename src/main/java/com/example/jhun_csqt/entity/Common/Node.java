package com.example.jhun_csqt.entity.Common;

import lombok.Data;

import java.util.ArrayList;

/**
 * 节点实体对象
 *
 * @author: wyh
 * @Date: 2021/8/3
 * @Description:
 */
@Data
public class Node {
    /**
     * 节点id
     */
    private int id;

    /**
     * 节点名称
     */
    private String name;

    /**
     * 节点样式
     */
    private String symbol;

    /**
     * 节点大小属性（可以理解为一个圆的半径）
     */
    private float symbolSize;

    /**
     * 节点x轴坐标
     */
    private float x;

    /**
     * 节点y轴坐标
     */
    private float y;

    /**
     * 节点是否固定在画板上
     */
    private boolean fixed;

    /**
     * 节点值 （ArrayList初始化：new ArrayList<>(Arrays.asList("Comedy", "Action", "Drama"))）
     */
    private ArrayList<String> value;

    /**
     * 节点样式
     */
    private itemStyle itemStyle;

    /**
     * 设置节点关键词
     *
     * @param keywords
     */
    public void setValue(ArrayList<String> keywords) {
        // 初始化当前节点的关键词集合
        this.value = new ArrayList<>(keywords.size());
        // 设置关键词
        for (int i = 0; i < keywords.size(); i++) {
            this.value.add(keywords.get(i));
        }
    }

    public Node() {
        this.itemStyle = new itemStyle();
    }

    public Node(String name, float symbolSize) {
        this.name = name;
        this.symbolSize = symbolSize;
        this.itemStyle = new itemStyle(); // 初始化节点的样式对象
    }
}
