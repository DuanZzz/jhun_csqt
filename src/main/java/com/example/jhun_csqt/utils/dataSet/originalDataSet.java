package com.example.jhun_csqt.utils.dataSet;

import com.example.jhun_csqt.entity.Common.Link;
import com.example.jhun_csqt.entity.Common.Node;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class originalDataSet {

    // 分隔符数组，分隔符可能含有 （tab: \t，空格和分号）
    private static String[] splits = {"\t", " ", ";"};

    // 根据指定的分隔符集来获取某字符串中含有的分隔符
    private static String acquireSplit(String[] splits, String str) {
        for (String tmp:
             splits) {
            if(str.contains(tmp)) {
                return tmp;
            }
        }
        return null;
    }

    public static ArrayList<Object> acquireNodesAndEdges(ArrayList<String> contentList, String node1, String node2) {
        // 节点集
        ArrayList<Node> nodes = new ArrayList<>();
        // 边集
        ArrayList<Link> edges = new ArrayList<>();
        // 节点名称和下标的散列表
        Map<String, Integer> node_name_subscript = new HashMap<>();
        // 节点下标计数器
        int counter = 0;

        // 获取分隔符（仅取第一行）
        String split = acquireSplit(splits, contentList.get(0));

        for (String lineStr:
             contentList) {
            if(split != null && !split.isEmpty()) {
                String[] tmpElems = lineStr.split(split);
                String leftNodeName = tmpElems[0];
                String rightNodeName = tmpElems[1];

                /*------------------ 添加节点 ------------------*/
                if(node_name_subscript.get(leftNodeName) == null) { // node_name_subscript.putIfAbsent(leftNodeName, 1);
                    node_name_subscript.put(leftNodeName, counter);

                    Node tmpNode = new Node(leftNodeName, 50);
                    tmpNode.setId(counter);
                    if(!node1.equals(node2)) {
                        if(leftNodeName.equals(node1)) {
                            tmpNode.getItemStyle().setColor("#00aef0"); // 蓝色
                        } else if(leftNodeName.equals(node2)) {
                            tmpNode.getItemStyle().setColor("#ff9900"); // 橙色
                        }
                    } else {
                        if(leftNodeName.equals(node1)) {
                            tmpNode.getItemStyle().setColor("#198754"); // 绿色
                        }
                    }
                    nodes.add(tmpNode);

                    counter++;
                }
                if(node_name_subscript.get(rightNodeName) == null) { // node_name_subscript.putIfAbsent(rightNodeName, 1);
                    node_name_subscript.put(rightNodeName, counter);

                    Node tmpNode = new Node(rightNodeName, 50);
                    tmpNode.setId(counter);
                    if(!node1.equals(node2)) {
                        if(rightNodeName.equals(node1)) {
                            tmpNode.getItemStyle().setColor("#00aef0"); // 蓝色
                        } else if(rightNodeName.equals(node2)) {
                            tmpNode.getItemStyle().setColor("#ff9900"); // 橙色
                        }
                    } else {
                        if(rightNodeName.equals(node1)) {
                            tmpNode.getItemStyle().setColor("#198754"); // 绿色
                        }
                    }
                    nodes.add(tmpNode);

                    counter++;
                }
                /*------------------ 添加节点 ------------------*/

                /*------------------ 添加边 ------------------*/
                Integer source = node_name_subscript.get(leftNodeName);
                Integer target = node_name_subscript.get(rightNodeName);
                if(source != null && target != null) {
                    Link tmpEdge = new Link(source, target);
                    edges.add(tmpEdge);
                }
                /*------------------ 添加边 ------------------*/
            }
        }

        // 封装节点和边并返回
        ArrayList<Object> NodesAndEdges = new ArrayList<>();
        NodesAndEdges.add(nodes);
        NodesAndEdges.add(edges);

        return NodesAndEdges;
    }

}
