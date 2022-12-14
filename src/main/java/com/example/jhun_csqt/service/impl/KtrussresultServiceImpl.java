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
            System.err.println("Json erring?????????");
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
        // ????????????????????????????????????????????????
        Map<String, Integer> NameSubscriptMap = new HashMap<>();
        // ????????????????????????
        Map<String, parseGraphAdjList.Vertex> allDataSet = dataSetReader.graph.vertexesMap;
        // ?????????????????????
        Map<String, parseGraphAdjList.Vertex> outputDataSet = outputDataSetReader.graph.vertexesMap;
        // ???????????????
        List<Node> Nodes = new ArrayList<>();
        // ???????????????
        List<Link> Edges = new ArrayList<>();

        // ??????????????????????????????
        Map<String, Integer> outLinkSign = new HashMap<>();

        // ??????????????????????????????????????????????????????????????????
        int counter = 0;
        // ?????????????????????????????????????????????
        List<Edge> withSearchNodeMap = new ArrayList<>();
        // ????????????????????????????????????????????????
        List<Edge> noSearchNodeOutMap = new ArrayList<>();
        // ???????????????????????????
        List<Edge> noOutMap = new ArrayList<>();
        /*------------------------ varDefine ------------------------*/
        /*------------------------ preDeal --------------------------*/
        // ????????????????????????????????????????????????
        Set<Map.Entry<String, parseGraphAdjList.Vertex>> outSet = outputDataSet.entrySet();
        Iterator<Map.Entry<String, parseGraphAdjList.Vertex>> outDataIterator = outSet.iterator();
        while (outDataIterator.hasNext()) {
            Map.Entry<String, parseGraphAdjList.Vertex> entry = outDataIterator.next();
            parseGraphAdjList.Vertex vertex = entry.getValue();
            parseGraphAdjList.Edge edge = vertex.next;
            String leftName = vertex.name;
            while (edge != null) {
                String rightName = edge.name;
                // ???????????????????????????
                String tmpStr = leftName + rightName;
                if(outLinkSign.get(tmpStr) == null) {
                    // ????????????
                    outLinkSign.put(tmpStr, 1);
                }
                Edge tmp = new Edge(Integer.parseInt(leftName), Integer.parseInt(rightName));
                if(leftName.equals(nodeId) || rightName.equals(nodeId)) {
                    // ???????????????????????????????????????????????????
                    withSearchNodeMap.add(tmp);
                } else {
                    // ??????????????????????????????????????????????????????
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
                    // ??????????????????????????????
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
                    // ????????????id
                    searchNode.setId(counter);
                    // ?????????????????????????????????
                    itemStyle itemStyle = searchNode.getItemStyle();
                    // ??????????????????
                    // ???????????????????????????????????????#ff0000???
                    itemStyle.setColor("#ff0000");
                    source = counter;
                    Nodes.add(searchNode);
                    NameSubscriptMap.put(key, counter);
                    counter++;
                }
                if(target == null) {
                    anotherNode = new Node(value, 66);
                    // ????????????id
                    anotherNode.setId(counter);
                    // ?????????????????????????????????
                    itemStyle itemStyle = anotherNode.getItemStyle();
                    // ??????????????????
                    // ???????????????????????????????????????#00aef0???
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
                    // ????????????id
                    searchNode.setId(counter);
                    // ?????????????????????????????????
                    itemStyle itemStyle = searchNode.getItemStyle();
                    // ??????????????????
                    // ???????????????????????????????????????#ff0000???
                    itemStyle.setColor("#ff0000");
                    target = counter;
                    Nodes.add(searchNode);
                    NameSubscriptMap.put(value, counter);
                    counter++;
                }
                if(source == null) {
                    anotherNode = new Node(key, 66);
                    // ????????????id
                    anotherNode.setId(counter);
                    // ?????????????????????????????????
                    itemStyle itemStyle = anotherNode.getItemStyle();
                    // ??????????????????
                    // ???????????????????????????????????????#00aef0???
                    itemStyle.setColor("#00aef0");
                    source = counter;
                    Nodes.add(anotherNode);
                    NameSubscriptMap.put(key, counter);
                    counter++;
                }
                link = new Link(source, target);
            }
            // ??????????????????????????????
            lineStyle lineStyle = link.getLineStyle();
            // ????????????????????????????????????#ff9900???
            lineStyle.setColor("#ff9900");
            // ????????????????????????
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
                // ????????????id
                leftNode.setId(counter);
                // ?????????????????????????????????
                itemStyle itemStyle = leftNode.getItemStyle();
                // ??????????????????
                // ???????????????????????????????????????#00aef0???
                itemStyle.setColor("#00aef0");
                source = counter;
                Nodes.add(leftNode);
                NameSubscriptMap.put(key, counter);
                counter++;
            }
            if(target == null) {
                rightNode = new Node(value, 66);
                // ????????????id
                rightNode.setId(counter);
                // ?????????????????????????????????
                itemStyle itemStyle = rightNode.getItemStyle();
                // ??????????????????
                // ???????????????????????????????????????#00aef0???
                itemStyle.setColor("#00aef0");
                target = counter;
                Nodes.add(rightNode);
                NameSubscriptMap.put(value, counter);
                counter++;
            }
            Link link = new Link(source, target);
            // ??????????????????????????????
            lineStyle lineStyle = link.getLineStyle();
            // ????????????????????????????????????#ff9900???
            lineStyle.setColor("#ff9900");
            // ????????????????????????
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
        // ???????????????Nodes???????????????Edges???
        List<Object> Result = new ArrayList<>();
        Result.add(Nodes); // ????????????
        Result.add(Edges); // ????????????
        return Result;
     }
}
