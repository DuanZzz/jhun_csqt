package com.example.jhun_csqt.entity.αβAWCS;

import lombok.Data;

import java.util.ArrayList;

@Data
public class WithAttrEdge {
    /**
     * 用户id
     */
    private String leftName;

    /**
     * 用户的关键词集
     */
    private ArrayList<String> leftKeywords;

    /**
     * 带属性边的左节点标识位
     */
    private int leftMark;

    /**
     * 电影id
     */
    private String rightName;

    /**
     * 电影的关键词集
     */
    private ArrayList<String> rightKeywords;

    /**
     * 带属性边的右节点标识位
     */
    private int rightMark;

    /**
     * 用户评分
     */
    private float score;

    public WithAttrEdge() {}

    public WithAttrEdge(String leftName, ArrayList<String> leftKeywords, int leftMark, String rightName, ArrayList<String> rightKeywords, int rightMark, float score) {
        this.leftName = leftName;
        this.leftKeywords = leftKeywords;
        this.leftMark = leftMark;
        this.rightName = rightName;
        this.rightKeywords = rightKeywords;
        this.rightMark = rightMark;
        this.score = score;
    }
}
