package com.example.jhun_csqt.service.impl;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.Link;
import com.example.jhun_csqt.entity.Common.Node;
import com.example.jhun_csqt.entity.Common.itemStyle;
import com.example.jhun_csqt.entity.Common.lineStyle;
import com.example.jhun_csqt.entity.Ktruss.Ktrussresult;
import com.example.jhun_csqt.entity.Query.KtrussresultQuery;
import com.example.jhun_csqt.mapper.KtrussMapper;
import com.example.jhun_csqt.service.KtrussresultService;
import com.example.jhun_csqt.utils.dataSet.parseDataReader;
import com.example.jhun_csqt.utils.dataSet.parseGraphAdjList;
import main.Edge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KtrussresultServiceImpl implements KtrussresultService {
    @Autowired
    private KtrussMapper ktrussMapper;

    @Override
    public List<Ktrussresult> listKtrussResult(KtrussresultQuery ktrussresultQuery) { return ktrussMapper.listKtrussResult(ktrussresultQuery); }

    @Override
    public int InsertData(Ktrussresult ktrussresult)
    {
        return ktrussMapper.InsertData(ktrussresult);
    }

    @Override
    public void UpdateKtrussResult(Ktrussresult ktrussresult) { ktrussMapper.UpdateKtrussResult(ktrussresult); }


    @Override
    public ArrayList<String> edgeParse(Ktrussresult ktrussresult, String name) {
        String outLinks = (String)JSONObject.parseObject(ktrussresult.getOutlinks()).get(name);
        ArrayList<String> links = new ArrayList<>();
        String tmpStr = "";
        for(int i = 0; i < outLinks.length(); i++) {
            if(outLinks.charAt(i) != '(' && outLinks.charAt(i) != ',' && outLinks.charAt(i) != ')') {
                tmpStr += outLinks.charAt(i);
            } else if(!tmpStr.equals("")) {
                links.add(tmpStr);
                tmpStr = "";
            }
        }
        return links;
    }

    @Override
    public String vertexLink(LinkedList<Edge> e, String name) {
        String str = "";
        Iterator<Edge> var12 = e.iterator();
        Edge e1 = var12.next();
        str="(" + e1.getS() + "," + e1.getT() + ")";
        while(var12.hasNext())
        {
            Edge e2 = var12.next();
            str+=",(" + e2.getS() + "," + e2.getT() + ")";
        }
        JSONObject object = new JSONObject();
        try {
            object.put(name, str);
        } catch (JSONException ex) {
            System.err.println("Json erring！！！");
        }
        return JSONObject.toJSONString(object);
    }

    @Override
    public ArrayList<String> outputDataSet(LinkedList<Edge> e) {
        ArrayList<String> outputDataList = new ArrayList<>();
        Iterator<Edge> outputList = e.iterator();
        while(outputList.hasNext()) {
            Edge edge = outputList.next();
            String tmpStr = edge.getS() + "\t" + edge.getT();
            outputDataList.add(tmpStr);
        }
        return outputDataList;
    }

    @Override
    public List<Object> obtainNodesAndEdges(String nodeId, parseDataReader dataSetReader, parseDataReader outputDataSetReader) {
        /*------------------------ varDefine ------------------------*/
        // 初始化节点名字与下标对应的散列表
        Map<String, Integer> NameSubscriptMap = new HashMap<>();
        // 社区中的全部数据
        Map<String, parseGraphAdjList.Vertex> allDataSet = dataSetReader.graph.vertexesMap;
        // 输出社区的数据
        Map<String, parseGraphAdjList.Vertex> outputDataSet = outputDataSetReader.graph.vertexesMap;
        // 社区的点集
        List<Node> Nodes = new ArrayList<>();
        // 社区的边集
        List<Link> Edges = new ArrayList<>();

        // 标识输出社区中的边集
        Map<String, Integer> outLinkSign = new HashMap<>();

        // 定义一个与节点集中每个元素相对应的下标计数器
        int counter = 0;
        // 包含搜索节点的输出社区的散列表
        List<Edge> withSearchNodeMap = new ArrayList<>();
        // 不包含搜索节点的输出社区的散列表
        List<Edge> noSearchNodeOutMap = new ArrayList<>();
        // 非输出社区的散列表
        List<Edge> noOutMap = new ArrayList<>();
        /*------------------------ varDefine ------------------------*/
        /*------------------------ preDeal --------------------------*/
        // 遍历输出社区（标记输出边和节点）
        Set<Map.Entry<String, parseGraphAdjList.Vertex>> outSet = outputDataSet.entrySet();
        Iterator<Map.Entry<String, parseGraphAdjList.Vertex>> outDataIterator = outSet.iterator();
        while (outDataIterator.hasNext()) {
            Map.Entry<String, parseGraphAdjList.Vertex> entry = outDataIterator.next();
            parseGraphAdjList.Vertex vertex = entry.getValue();
            parseGraphAdjList.Edge edge = vertex.next;
            String leftName = vertex.name;
            while (edge != null) {
                String rightName = edge.name;
                // 拼接输出边集的标记
                String tmpStr = leftName + rightName;
                if(outLinkSign.get(tmpStr) == null) {
                    // 添加标记
                    outLinkSign.put(tmpStr, 1);
                }
                Edge tmp = new Edge(Integer.parseInt(leftName), Integer.parseInt(rightName));
                if(leftName.equals(nodeId) || rightName.equals(nodeId)) {
                    // 添加输出社区的数据（包含搜索节点）
                    withSearchNodeMap.add(tmp);
                } else {
                    // 添加输出社区的数据（不包含搜索节点）
                    noSearchNodeOutMap.add(tmp);
                }
                edge = edge.next;
            }
        }

        Set<Map.Entry<String, parseGraphAdjList.Vertex>> allSet = allDataSet.entrySet();
        Iterator<Map.Entry<String, parseGraphAdjList.Vertex>> allDataIterator = allSet.iterator();
        while (allDataIterator.hasNext()) {
            Map.Entry<String, parseGraphAdjList.Vertex> entry = allDataIterator.next();
            parseGraphAdjList.Vertex vertex = entry.getValue();
            parseGraphAdjList.Edge edge = vertex.next;
            String leftName = vertex.name;
            while (edge != null) {
                String rightName = edge.name;
                String tmpStr = leftName + rightName;
                if(outLinkSign.get(tmpStr) == null) {
                    Edge tmp = new Edge(Integer.parseInt(leftName), Integer.parseInt(rightName));
                    // 添加非输出的社区数据
                    noOutMap.add(tmp);
                }
                edge = edge.next;
            }
        }
        /*------------------------ preDeal --------------------------*/

        // test success
//        System.out.println("noOutMap_length-->" + noOutMap.size());
//        System.out.println("withSearchNodeMap_length-=>" + withSearchNodeMap.size());
//        System.out.println("noSearchNodeOutMap_length==>" + noSearchNodeOutMap.size());

        /*---------------------------------- part1_addData ----------------------------------*/
        Iterator<Edge> Iterator1 = withSearchNodeMap.iterator();
        while (Iterator1.hasNext()) {
            Edge edge = Iterator1.next();
            String key = String.valueOf(edge.getS());
            String value = String.valueOf(edge.getT());
            Node searchNode;
            Node anotherNode;
            Integer source = NameSubscriptMap.get(key);
            Integer target = NameSubscriptMap.get(value);
            Link link = null;
            if(key.equals(nodeId)) {
                if(source == null) {
                    searchNode = new Node(key, 66);
                    // 设置节点id
                    searchNode.setId(counter);
                    // 获取当前节点的样式对象
                    itemStyle itemStyle = searchNode.getItemStyle();
                    // 设置节点样式
                    // 用户搜索的节点设置为红色（#ff0000）
                    itemStyle.setColor("#ff0000");
                    source = counter;
                    Nodes.add(searchNode);
                    NameSubscriptMap.put(key, counter);
                    counter++;
                }
                if(target == null) {
                    anotherNode = new Node(value, 66);
                    // 设置节点id
                    anotherNode.setId(counter);
                    // 获取当前节点的样式对象
                    itemStyle itemStyle = anotherNode.getItemStyle();
                    // 设置节点样式
                    // 输出的其他节点设置为蓝色（#00aef0）
                    itemStyle.setColor("#00aef0");
                    target = counter;
                    Nodes.add(anotherNode);
                    NameSubscriptMap.put(value, counter);
                    counter++;
                }
                link = new Link(source, target);
            } else if(value.equals(nodeId)) {
                if(target == null) {
                    searchNode = new Node(value, 66);
                    // 设置节点id
                    searchNode.setId(counter);
                    // 获取当前节点的样式对象
                    itemStyle itemStyle = searchNode.getItemStyle();
                    // 设置节点样式
                    // 用户搜索的节点设置为红色（#ff0000）
                    itemStyle.setColor("#ff0000");
                    target = counter;
                    Nodes.add(searchNode);
                    NameSubscriptMap.put(value, counter);
                    counter++;
                }
                if(source == null) {
                    anotherNode = new Node(key, 66);
                    // 设置节点id
                    anotherNode.setId(counter);
                    // 获取当前节点的样式对象
                    itemStyle itemStyle = anotherNode.getItemStyle();
                    // 设置节点样式
                    // 输出的其他节点设置为蓝色（#00aef0）
                    itemStyle.setColor("#00aef0");
                    source = counter;
                    Nodes.add(anotherNode);
                    NameSubscriptMap.put(key, counter);
                    counter++;
                }
                link = new Link(source, target);
            }
            // 获取当前边的样式对象
            lineStyle lineStyle = link.getLineStyle();
            // 重设输出边的颜色，橙色（#ff9900）
            lineStyle.setColor("#ff9900");
            // 重设输出边的宽度
            lineStyle.setWidth(3);
            Edges.add(link);
        }
        /*---------------------------------- part1_addData ----------------------------------*/
        /*---------------------------------- part2_addData ----------------------------------*/
        Iterator<Edge> Iterator2 = noSearchNodeOutMap.iterator();
        while (Iterator2.hasNext()) {
            Edge edge = Iterator2.next();
            String key = String.valueOf(edge.getS());
            String value = String.valueOf(edge.getT());
            Node leftNode;
            Node rightNode;
            Integer source = NameSubscriptMap.get(key);
            Integer target = NameSubscriptMap.get(value);
            if(source == null) {
                leftNode = new Node(key, 66);
                // 设置节点id
                leftNode.setId(counter);
                // 获取当前节点的样式对象
                itemStyle itemStyle = leftNode.getItemStyle();
                // 设置节点样式
                // 输出的其他节点设置为蓝色（#00aef0）
                itemStyle.setColor("#00aef0");
                source = counter;
                Nodes.add(leftNode);
                NameSubscriptMap.put(key, counter);
                counter++;
            }
            if(target == null) {
                rightNode = new Node(value, 66);
                // 设置节点id
                rightNode.setId(counter);
                // 获取当前节点的样式对象
                itemStyle itemStyle = rightNode.getItemStyle();
                // 设置节点样式
                // 输出的其他节点设置为蓝色（#00aef0）
                itemStyle.setColor("#00aef0");
                target = counter;
                Nodes.add(rightNode);
                NameSubscriptMap.put(value, counter);
                counter++;
            }
            Link link = new Link(source, target);
            // 获取当前边的样式对象
            lineStyle lineStyle = link.getLineStyle();
            // 重设输出边的颜色，橙色（#ff9900）
            lineStyle.setColor("#ff9900");
            // 重设输出边的宽度
            lineStyle.setWidth(3);
            Edges.add(link);
        }
        /*---------------------------------- part2_addData ----------------------------------*/
        /*---------------------------------- part3_addData ----------------------------------*/
        Iterator<Edge> Iterator3 = noOutMap.iterator();
        while (Iterator3.hasNext()) {
            Edge edge = Iterator3.next();
            String key = String.valueOf(edge.getS());
            String value = String.valueOf(edge.getT());
            Node leftNode;
            Node rightNode;
            Integer source = NameSubscriptMap.get(key);
            Integer target = NameSubscriptMap.get(value);
            if(source == null) {
                leftNode = new Node(key, 66);
                leftNode.setId(counter);
                source = counter;
                Nodes.add(leftNode);
                NameSubscriptMap.put(key, counter);
                counter++;
            }
            if(target == null) {
                rightNode = new Node(value, 66);
                rightNode.setId(counter);
                target = counter;
                Nodes.add(rightNode);
                NameSubscriptMap.put(value, counter);
                counter++;
            }
            Link link = new Link(source, target);
            Edges.add(link);
        }
        /*---------------------------------- part3_addData ----------------------------------*/
        // 封装点集（Nodes）和边集（Edges）
        List<Object> Result = new ArrayList<>();
        Result.add(Nodes); // 添加点集
        Result.add(Edges); // 添加边集
        return Result;
     }
}
