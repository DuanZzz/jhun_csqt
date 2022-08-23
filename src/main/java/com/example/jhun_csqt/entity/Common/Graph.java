package com.example.jhun_csqt.entity.Common;

import lombok.Data;

import java.util.List;

/**
 * 社区图实体对象
 *
 * @author: wyh
 * @Date: 2021/8/3
 * @Description:
 */
@Data
public class Graph {
    /**
     * 节点集合
     */
    private List nodes;

    /**
     * 边集合
     */
    private List links;

    /**
     * 用户使用ktruss算法的搜索结果
     */
    private Object result;

    //带两个参数的有参构造函数
    public Graph(List nodes, List links) {
        this.nodes = nodes;
        this.links = links;
    }

    public Graph(List nodes, List links, Object result) {
        this.nodes = nodes;
        this.links = links;
        this.result = result;
    }
}

