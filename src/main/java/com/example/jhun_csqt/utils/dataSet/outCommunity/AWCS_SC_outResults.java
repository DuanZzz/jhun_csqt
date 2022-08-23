package com.example.jhun_csqt.utils.dataSet.outCommunity;

import AWCSSCAlgorithms.main.BGCS.Util.abGraphAdjList;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.Link;
import com.example.jhun_csqt.entity.Common.Node;
import com.example.jhun_csqt.entity.Common.itemStyle;
import com.example.jhun_csqt.entity.Common.lineStyle;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;

import java.util.*;

public class AWCS_SC_outResults {

    // 算法的输出社区（包括输出节点集和边集，均带多属性）
    public static JSONObject algorithm_outCommunity(abGraphAdjList peelResult, String searchNode, String searchNode_style, String style) {
        // 输出社区（输出节点集和边集）
        JSONObject outCommunity = new JSONObject();

        // 建立一个散列表来记录输出社区中每个独立存在的点及其在集合中的下标
        Map<String, Integer> addedNodes = new HashMap<>();
        // 创建一个记录节点下标的指针
        int counter = 0;
        // 定义一个输出社区的节点集
        ArrayList<Node> Nodes = new ArrayList<>();
        // 定义一个输出社区的边集
        ArrayList<Link> Links = new ArrayList<>();
        // 建立一个散列表来记录唯一一条带属性的边
        Map<String, Integer> addedAttrEdges = new HashMap<>();
        // 定义一个带属性边的集合
        ArrayList<WithAttrEdge> withAttrEdges = new ArrayList<>();

        // 遍历整个peelResult
        Set<Map.Entry<String, abGraphAdjList.Vertex>> set = peelResult.vertexsMap.entrySet();
        Iterator<Map.Entry<String, abGraphAdjList.Vertex>> iterator = set.iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, abGraphAdjList.Vertex> vertexEntry = iterator.next();
            // 获取顶点名（左节点名）
            String leftName = vertexEntry.getKey();
            // 获取顶点（左节点）
            abGraphAdjList.Vertex vertex = vertexEntry.getValue();
            // 获取顶点关键词集（左节点关键词集）
            ArrayList<String> leftKeywords = vertex.keyword;
            // 边的起始节点的下标
            int source = -1;

            /*--------------------- 添加左节点 ---------------------*/
            if(addedNodes.get(leftName) == null) {
                Node node = new Node(leftName, 50);
                // 1、设置节点id
                node.setId(counter);
                // 2、设置节点图标（可能需要，暂不添加）
                // 3、设置节点值（关键词）
                node.setValue(leftKeywords);
                // 获取当前节点的样式对象
                itemStyle itemStyle = node.getItemStyle();
                // 设置节点样式（将节点设置为指定颜色）
                if(leftName.equals(searchNode)) { // 需先判断当前节点是否为搜索节点
                    itemStyle.setColor(searchNode_style);
                } else {
                    itemStyle.setColor(style);
                }
                // 添加节点
                Nodes.add(node);
                addedNodes.put(leftName, counter);

                // 记录边的source值
                source = counter;

                // 指针加一
                counter++;
            } else {
                source = addedNodes.get(leftName);
            }
            /*--------------------- 添加左节点 ---------------------*/

            // 查看左节点的标识位（0表示U层，1表示L层）
            int leftMark = vertex.mark;
            // 获取一条边
            abGraphAdjList.Edge edge = vertex.next;
            while(edge != null) {
                // 边的目标节点的下标
                int target = -1;

                // 定义一条带属性边
                WithAttrEdge withAttrEdge;
                // 获取右节点名
                String rightName = edge.name;
                // 获取边的权重（用户评分）
                float score = edge.weight;
                // 定义两种可能出现的边的情况
                String queryName1 = leftName + rightName;
                String queryName2 = rightName + leftName;
                if(addedAttrEdges.get(queryName1) == null && addedAttrEdges.get(queryName2) == null) {
                    // 如果左节点的标识位为0，右节点的标识位则为1（0表示U层，1表示L层）
                    int rightMark = -1;
                    if(leftMark == 0) {
                        // 设置右节点的标识位
                        rightMark = 1;
                    } else if(leftMark == 1) {
                        // 设置右节点的标识位
                        rightMark = 0;
                    }

                    /*--------------------- 添加右节点 ---------------------*/
                    if(addedNodes.get(rightName) == null) {
                        Node node = new Node(rightName, 50);
                        // 1、设置节点id
                        node.setId(counter);
                        // 2、设置节点图标（可能需要，暂不添加）
                        // 3、设置节点值（关键词）(在下面的循环中添加右节点的关键词集合)
                        // 获取当前节点的样式对象
                        itemStyle itemStyle = node.getItemStyle();
                        // 设置节点样式（将节点设置为指定颜色）
                        if(rightName.equals(searchNode)) { // 需先判断当前节点是否为搜索节点
                            itemStyle.setColor(searchNode_style);
                        } else {
                            itemStyle.setColor(style);
                        }
                        // 添加节点
                        Nodes.add(node);
                        addedNodes.put(rightName, counter);

                        // 记录边的target值
                        target = counter;

                        // 指针加一
                        counter++;
                    } else {
                        target = addedNodes.get(rightName);
                    }
                    /*--------------------- 添加右节点 ---------------------*/

                    withAttrEdge = new WithAttrEdge (leftName, leftKeywords, leftMark, rightName, null, rightMark, score);
                    withAttrEdges.add(withAttrEdge);

                    /*---------------------------- 添加边 ----------------------------*/
                    Link link = new Link(source, target);
                    // 设置边的权重
                    link.setValue(score);
                    // 获取当前边的样式对象
                    lineStyle lineStyle = link.getLineStyle();
                    // 设置边为指定颜色
                    lineStyle.setColor(style);
                    // 设置边宽
                    lineStyle.setWidth(3);
                    Links.add(link);
                    /*---------------------------- 添加边 ----------------------------*/

                    // 带属性边加入集合之后在散列表中做个标记
                    addedAttrEdges.put(queryName1, 1);
                }
                // 获取下一条边
                edge = edge.next;
            }
        }
        /*------------------------------------------------------ 被替代的部分 ------------------------------------------------------*/
        // 遍历已加入的（全部的）带属性边（给其右节点的关键词集合赋值）
        for(int i = 0; i < withAttrEdges.size(); i++) {
            WithAttrEdge withAttrEdge = withAttrEdges.get(i);
            // 由于右节点还没有关键词集合，故需获取其名称来给其关键词集合赋值
            String rightName = withAttrEdge.getRightName();
            // 再次遍历整个peelResult，以获取带属性边的右节点的关键词集合
            Iterator<Map.Entry<String, abGraphAdjList.Vertex>> iterator1 = set.iterator();
            while (iterator1.hasNext()) {
                Map.Entry<String, abGraphAdjList.Vertex> vertexEntry = iterator1.next();
                String tmpLeftName = vertexEntry.getKey();
                abGraphAdjList.Vertex vertex = vertexEntry.getValue();
                abGraphAdjList.Edge edge;
                if(tmpLeftName.equals(rightName)) {

                    /*---------------------- 给节点集中还没有关键词集合的节点赋值 ----------------------*/
                    Integer sign = addedNodes.get(rightName);
                    if(sign != null) {
                        Nodes.get(sign).setValue(vertex.keyword);
                    }
                    /*---------------------- 给节点集中还没有关键词集合的节点赋值 ----------------------*/

                    edge = vertex.next;
                    while(edge != null) {
                        String tmpRightName = edge.name;
                        String queryName = tmpRightName + tmpLeftName;
                        // 当前边为已加入边集（withAttrEdges）中的边时
                        if(addedAttrEdges.get(queryName) != null && addedAttrEdges.get(queryName) == 1) {
                            withAttrEdge.setRightKeywords(vertex.keyword);
                            break;
                        }
                        edge = edge.next;
                    }
                }
            }
        }

        // 将输出社区的节点集添加到输出社区中去（outCommunity）
        outCommunity.put("out_nodes", Nodes);
        // 将输出社区的边集添加到输出社区中去（outCommunity）
        outCommunity.put("out_links", Links);
        // 将输出社区的带属性边集添加到输出社区中去（outCommunity）
        outCommunity.put("out_withAttrLinks", withAttrEdges);

        return outCommunity;
    }

}
