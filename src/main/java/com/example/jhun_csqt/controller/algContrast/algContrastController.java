package com.example.jhun_csqt.controller.algContrast;

import AWCSSCAlgorithms.main.BGCS.Util.abGraphAdjList;
import AWCSSCAlgorithms.main.BGCS.Util.finalMainTest;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.*;
import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Query.AlgContrastQuery;
import com.example.jhun_csqt.entity.Query.FileQuery;
import com.example.jhun_csqt.entity.algContrast.AlgContrastResult;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;
import com.example.jhun_csqt.service.AlgContrastService;
import com.example.jhun_csqt.service.FileService;
import com.example.jhun_csqt.utils.Response;
import com.example.jhun_csqt.utils.Sift.CalDifferentElementNum;
import com.example.jhun_csqt.utils.algContrast.FindOnlyResult;
import com.example.jhun_csqt.utils.dataSet.originalDataSet;
import com.example.jhun_csqt.utils.dataSet.outCommunity.AWCS_SC_outResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("algorithmContrast")
public class algContrastController {

    @Autowired
    private AlgContrastService algContrastService;

    @Autowired
    private FileService fileService;

    // 定义一个List集合存储从数据库中读取出来的数据集文件的内容
    private static ArrayList<String> contentList;

    // 根据用户输入的两个算法中搜索的顶点id和选择的数据集文件来绘制原始社区图
    @RequestMapping(value = "drawOriginalCommunity", method = {RequestMethod.POST})
    public Graph originalCommunity(HttpServletRequest request) {
        // 将输入数据转换成JSON对象
        JSONObject inputData = JSON.parseObject(request.getParameter("inputData"));
        // 获取算法一中输入的搜索顶点id
        String node1 =  inputData.getString("nodeId1");
        // 获取算法二中输入的搜索顶点id
        String node2 = inputData.getString("nodeId2");
        // 获取数据集
        String fileName = inputData.getString("dataSetFile");

        if(fileName != null && !fileName.isEmpty()) {
            /*--------------------- 根据数据集文件名在数据库中获取对应的数据集文件内容 ---------------------*/
            // new一个文件查询条件
            FileQuery fileQuery = new FileQuery(fileName);
            // 获取文件
            UploadFile file = fileService.listFile(fileQuery).get(0);
            // 获取文件内容
            String fileContent = (String)(JSONObject.parseObject(file.getFileContent()).get("fileContent"));
            // 解析文件内容
            String [] parsedFileContent = fileContent.split("\n");
            // 初始化contentList
            contentList = new ArrayList<>();
            // 给contentList赋值
            for(int i = 0; i < parsedFileContent.length; i++) {
                contentList.add(parsedFileContent[i]);
            }
            /*--------------------- 根据数据集文件名在数据库中获取对应的数据集文件内容 ---------------------*/
        }
        ArrayList<Object> NodesAndEdges = originalDataSet.acquireNodesAndEdges(contentList, node1, node2);
        ArrayList<Node> nodes = (ArrayList<Node>) NodesAndEdges.get(0);
        ArrayList<Link> edges = (ArrayList<Link>) NodesAndEdges.get(1);

        Graph graph = null;
        if((nodes != null && nodes.size() > 0) && (edges != null && edges.size() > 0)) {
            graph = new Graph(nodes, edges);
        }
        return graph;
    }

    // 根据用户在前端页面输入的数据给予相应的算法（AWCS和SC算法）来计算出输出社区的图数据并返回
    @RequestMapping(value = "OutCommunityGraph", method = {RequestMethod.POST})
    public Graph algOutCommunityGraph(HttpServletRequest request) {
        // 算法输出数据的JSONObject对象
        JSONObject algOutJSONObject = new JSONObject();
        // 算法输出的社区（abGraphAdjList对象：peelResult）
        abGraphAdjList peelResult;
        // 算法输出的社区（JSONObject对象：）
        JSONObject outCommunity_JSONObject;

        // 输出社区的节点集和边集以及其他的数据集合
        ArrayList<Node> Nodes = new ArrayList<>();
        ArrayList<Link> Links = new ArrayList<>();
        ArrayList<WithAttrEdge> out_withAttrEdges = new ArrayList<>();

        // 定义一个图（Graph）对象来封装所有要传递的数据
        Graph graph = null;
        // 算法输出的其他数据（非关系图数据，柱状图）以及用户评分分数分布情况的数据（扇形图），均以json字符串来表示
        ArrayList<String> results = new ArrayList<>();

        // 将输入数据转换成JSON对象
        JSONObject inputData = JSON.parseObject(request.getParameter("inputData"));
        // 获取用户选择的算法名
        String AlgName = inputData.getString("AlgName");
        // 获取用户输入的搜索顶点的id
        String nodeId = inputData.getString("nodeId");
        // 获取用户输入的上层顶点的度
        String upperDegree = inputData.getString("upperDegree");
        // 获取用户输入的下层顶点的度
        String lowerDegree = inputData.getString("lowerDegree");

        // 获取用户可能选择的算法的约束方式（针对AWCS算法的输入数据）
        String constraintWay = inputData.getString("constraintWay"); // 可能为空字符串

        // 获取用户可能选择的关键词集（SC算法输入数据的可选项）
        JSONArray keywords = (JSONArray)inputData.get("keywords"); // 可能为空数组
        // queryKeywordSet代表查询顶点集，即输出社区的顶点需要包含这些属性
        ArrayList<String> queryKeywordSet = new ArrayList<>();
        if(keywords != null) {
            /*----------------- 将格式转换为查询顶点集queryKeywordSet（ArrayList<String>） -----------------*/
            for (int i = 0; i < keywords.size(); i++) {
                queryKeywordSet.add((String) keywords.get(i));
            }
            /*----------------- 将格式转换为查询顶点集queryKeywordSet（ArrayList<String>） -----------------*/
        }

        // 获取数据集
        String fileName = inputData.getString("dataSetFile");
        // 初始化contentList
        contentList = new ArrayList<>();
        // 将数据库中的数据集文件格式转换为字符串集合（contentList）
        if(fileName != null && !fileName.isEmpty()) {
            /*--------------------- 根据数据集文件名在数据库中获取对应的数据集文件内容 ---------------------*/
            // new一个文件查询条件
            FileQuery fileQuery = new FileQuery(fileName);
            // 获取文件
            UploadFile file = fileService.listFile(fileQuery).get(0);
            // 获取文件内容
            String fileContent = (String)(JSONObject.parseObject(file.getFileContent()).get("fileContent"));
            // 解析文件内容
            String [] parsedFileContent = fileContent.split("\n");
            // 给contentList赋值
            for(int i = 0; i < parsedFileContent.length; i++) {
                contentList.add(parsedFileContent[i]);
            }
            /*--------------------- 根据数据集文件名在数据库中获取对应的数据集文件内容 ---------------------*/
        }
        // 接收一个表示用户是否直接输出结果的标志
        String Sign = inputData.getString("Sign");

        /*------------------------ 从数据库中查询搜索结果是否存在 ------------------------*/
        // 输入数据
        JSONObject input_object = new JSONObject();
        input_object.put("nodeId", nodeId);
        input_object.put("upperDegree", upperDegree);
        input_object.put("lowerDegree", lowerDegree);
        input_object.put("constraintWay", constraintWay);
        input_object.put("keywords", keywords);

        // new一个算法的查询条件
        AlgContrastQuery algContrastQuery = new AlgContrastQuery(AlgName, fileName);
        // 查询数据库中是否已存在当前的测试结果
        List<AlgContrastResult> algContrastResults = algContrastService.listAlgResult(algContrastQuery);
        // 记录与数据库中搜索结果相同的输出结果
        FindOnlyResult findOnlyResult = new FindOnlyResult();
        AlgContrastResult existResult = findOnlyResult.getResultEntity(AlgName, input_object.toJSONString(), algContrastResults);
        /*------------------------ 从数据库中查询搜索结果是否存在 ------------------------*/

        if((nodeId != null && !nodeId.isEmpty()) && (upperDegree != null && !upperDegree.isEmpty())
        && (lowerDegree != null && !lowerDegree.isEmpty()) && contentList.size() > 0) {
            if(AlgName != null) {
                if(AlgName.equals("(α,β)-AWCS")) { // AWCS算法
                    if((constraintWay != null && !constraintWay.isEmpty())
                    && queryKeywordSet.size() > 0) {
                        if(Sign.equals("Y")) {
                            if(existResult != null) {
                                String outputData = existResult.getOutputData();
                                JSONObject jsonObject = JSON.parseObject(outputData);
                                // 获取数据库中搜索结果的节点集
                                JSONArray nodes_jsonArray = jsonObject.getJSONArray("Nodes");
                                /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                                for (int i = 0; i < nodes_jsonArray.size(); i++) {
                                    JSONObject tmpObject = nodes_jsonArray.getJSONObject(i);
                                    float symbolSize = tmpObject.getFloat("symbolSize");
                                    String name = tmpObject.getString("name");
                                    JSONObject tmpItemStyle = tmpObject.getJSONObject("itemStyle");
                                    itemStyle style = new itemStyle();
                                    style.setColor(tmpItemStyle.getString("color"));
                                    int id = tmpObject.getInteger("id");
                                    ArrayList<String> value = new ArrayList<>();
                                    JSONArray jsonArray = tmpObject.getJSONArray("value");
                                    for (int j = 0; j < jsonArray.size(); j++) {
                                        String tmp = jsonArray.getString(j);
                                        value.add(tmp);
                                    }
                                    Node node = new Node(name, symbolSize);
                                    node.setItemStyle(style);
                                    node.setId(id);
                                    node.setValue(value);
                                    Nodes.add(node);
                                }
                                /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
//                            Nodes = (ArrayList<Node>) JSON.parseArray(nodes_jsonArray.toJSONString(), Node.class);
//                            Nodes = (ArrayList<Node>) nodes_jsonArray.toJavaList(Node.class);
                                // 获取数据库中搜索结果的边集
                                JSONArray links_jsonArray = jsonObject.getJSONArray("Links");
                                /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                                for (int i = 0; i < links_jsonArray.size(); i++) {
                                    JSONObject tmpObject = links_jsonArray.getJSONObject(i);
                                    int source = tmpObject.getInteger("source");
                                    int target = tmpObject.getInteger("target");
                                    float value = tmpObject.getFloat("value");
                                    JSONObject tmpLineStyle = tmpObject.getJSONObject("lineStyle");
                                    lineStyle style = new lineStyle();
                                    style.setColor(tmpLineStyle.getString("color"));
                                    style.setWidth(tmpLineStyle.getInteger("width"));
                                    Link link = new Link(source, target);
                                    link.setValue(value);
                                    link.setLineStyle(style);
                                    Links.add(link);
                                }
                                /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                                // 将JSONArray转化为List的三种方法（在这里使用时出现了转换后的数据未拷贝或丢失的情况，故未使用）：
//                            Links = (ArrayList<Link>) JSON.parseArray(links_jsonArray.toJSONString(), Link.class);
//                            Links = (ArrayList<Link>) links_jsonArray.toJavaList(Link.class);
//                            Links = (ArrayList<Link>) JSONArray.parseArray(links_jsonArray.toJSONString(), Link.class);
                                // 获取数据库中搜索结果的其他数据集
                                JSONArray results_jsonArray = jsonObject.getJSONArray("results");
//                            results = (ArrayList<String>) JSON.parseArray(results_jsonArray.toJSONString(), String.class);
                            results = (ArrayList<String>) results_jsonArray.toJavaList(String.class);
                            }
                        } else if(Sign.equals("N")) {
                            algOutJSONObject = finalMainTest.getAWCSResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), constraintWay, queryKeywordSet, contentList);
                            peelResult = (abGraphAdjList) algOutJSONObject.get("out_Community");
                            outCommunity_JSONObject = AWCS_SC_outResults.algorithm_outCommunity(peelResult, nodeId, "#ff0000", "#00aef0"); // 算法一中非搜索节点和边的颜色一律使用蓝色，搜索节点使用红色
                            Nodes = (ArrayList<Node>) outCommunity_JSONObject.get("out_nodes");
                            Links = (ArrayList<Link>) outCommunity_JSONObject.get("out_links");
                            out_withAttrEdges = (ArrayList<WithAttrEdge>) outCommunity_JSONObject.get("out_withAttrLinks");

                            // 数据一（非关系图数据，即柱状图数据）
                            JSONObject tmp = algOutJSONObject;
                            tmp.remove("out_Community");
                            // 将时间数据的单位转换为：s
                            tmp.put("rDataSet_Time", finalMainTest.txfloat((Long) tmp.get("rDataSet_Time"), 1000));
                            tmp.put("index_time", finalMainTest.txfloat((Long) tmp.get("index_time"), 1000));
                            tmp.put("total_time", finalMainTest.txfloat((Long) tmp.get("total_time"), 1000));

                            String algOut_otherData = tmp.toJSONString();

                            // 数据二（扇形图数据）
                            String scoreDistributeData = CalDifferentElementNum.getScoreDistributeJsonStr(out_withAttrEdges);

                            // 将数据添加在集合中
                            results.add(algOut_otherData);
                            results.add(scoreDistributeData);

                            /*---------------------- 将搜索结果保存在数据库中或对数据库中的数据进行修改 ----------------------*/
                            // 输出数据
                            JSONObject output_object = new JSONObject();
//                            JSONArray Nodes_jsonArray = JSONArray.parseArray(JSONObject.toJSONString(Nodes));
//                            JSONArray Links_jsonArray = JSONArray.parseArray(JSONObject.toJSONString(Links));
//                            JSONArray results_jsonArray = JSONArray.parseArray(JSONObject.toJSONString(results));
                            output_object.put("Nodes", Nodes);
                            output_object.put("Links", Links);
                            output_object.put("results", results);

                            AlgContrastResult algContrastResult = new AlgContrastResult(AlgName, fileName, input_object.toJSONString(), output_object.toJSONString());
                            if(existResult == null) {
                                // 数据库中不存在数据时则保存
                                algContrastService.insertAlgResult(algContrastResult);
                            } else {
                                Integer id = existResult.getId();
                                algContrastResult.setId(id);
                                algContrastService.updateAlgResult(algContrastResult);
                            }
                            /*---------------------- 将搜索结果保存在数据库中或对数据库中的数据进行修改 ----------------------*/
                        }
                        // 封装所有要传递的数据
                        graph = new Graph(Nodes, Links, results);
                    }
                } else if(AlgName.equals("SC(significant(α,β)-community)")) { // SC算法
                    if(Sign.equals("Y")) {
                        if(existResult != null) {
                            String outputData = existResult.getOutputData();
                            JSONObject jsonObject = JSON.parseObject(outputData);
                            // 获取数据库中搜索结果的节点集
                            JSONArray nodes_jsonArray = jsonObject.getJSONArray("Nodes");
                            /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                            for (int i = 0; i < nodes_jsonArray.size(); i++) {
                                JSONObject tmpObject = nodes_jsonArray.getJSONObject(i);
                                float symbolSize = tmpObject.getFloat("symbolSize");
                                String name = tmpObject.getString("name");
                                JSONObject tmpItemStyle = tmpObject.getJSONObject("itemStyle");
                                itemStyle style = new itemStyle();
                                style.setColor(tmpItemStyle.getString("color"));
                                int id = tmpObject.getInteger("id");
                                ArrayList<String> value = new ArrayList<>();
                                JSONArray jsonArray = tmpObject.getJSONArray("value");
                                for (int j = 0; j < jsonArray.size(); j++) {
                                    String tmp = jsonArray.getString(j);
                                    value.add(tmp);
                                }
                                Node node = new Node(name, symbolSize);
                                node.setItemStyle(style);
                                node.setId(id);
                                node.setValue(value);
                                Nodes.add(node);
                            }
                            /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                            // 获取数据库中搜索结果的边集
                            JSONArray links_jsonArray = jsonObject.getJSONArray("Links");
                            /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                            for (int i = 0; i < links_jsonArray.size(); i++) {
                                JSONObject tmpObject = links_jsonArray.getJSONObject(i);
                                int source = tmpObject.getInteger("source");
                                int target = tmpObject.getInteger("target");
                                float value = tmpObject.getFloat("value");
                                JSONObject tmpLineStyle = tmpObject.getJSONObject("lineStyle");
                                lineStyle style = new lineStyle();
                                style.setColor(tmpLineStyle.getString("color"));
                                style.setWidth(tmpLineStyle.getInteger("width"));
                                Link link = new Link(source, target);
                                link.setValue(value);
                                link.setLineStyle(style);
                                Links.add(link);
                            }
                            /*--------------- 将JSONArray转化为ArrayList（自定义转化方法，拷贝需要的字段值） ---------------*/
                            // 获取数据库中搜索结果的其他数据集
                            JSONArray results_jsonArray = jsonObject.getJSONArray("results");
                            results = (ArrayList<String>) results_jsonArray.toJavaList(String.class);
                        }
                    } else if(Sign.equals("N")) {
                        algOutJSONObject = finalMainTest.getSCResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), queryKeywordSet, contentList);
                        peelResult = (abGraphAdjList) algOutJSONObject.get("out_Community");
                        outCommunity_JSONObject = AWCS_SC_outResults.algorithm_outCommunity(peelResult, nodeId, "#ff0000", "#ffc107"); // 算法二中的非搜索节点和边的颜色一律使用黄色，搜索节点使用红色
                        Nodes = (ArrayList<Node>) outCommunity_JSONObject.get("out_nodes");
                        Links = (ArrayList<Link>) outCommunity_JSONObject.get("out_links");
                        out_withAttrEdges = (ArrayList<WithAttrEdge>) outCommunity_JSONObject.get("out_withAttrLinks");

                        // 数据一（非关系图数据，即柱状图数据）
                        JSONObject tmp = algOutJSONObject;
                        tmp.remove("out_Community");
                        // 将时间数据的单位转换为：s
                        tmp.put("rDataSet_Time", finalMainTest.txfloat((Long) tmp.get("rDataSet_Time"), 1000));
                        tmp.put("index_time", finalMainTest.txfloat((Long) tmp.get("index_time"), 1000));
                        tmp.put("total_time", finalMainTest.txfloat((Long) tmp.get("total_time"), 1000));

                        String algOut_otherData = tmp.toJSONString();

                        // 数据二（扇形图数据）
                        String scoreDistributeData = CalDifferentElementNum.getScoreDistributeJsonStr(out_withAttrEdges);

                        // 将数据添加在集合中
                        results.add(algOut_otherData);
                        results.add(scoreDistributeData);

                        /*---------------------- 将搜索结果保存在数据库中或对数据库中的数据进行修改 ----------------------*/
                        // 输出数据
                        JSONObject output_object = new JSONObject();
                        output_object.put("Nodes", Nodes);
                        output_object.put("Links", Links);
                        output_object.put("results", results);

                        AlgContrastResult algContrastResult = new AlgContrastResult(AlgName, fileName, input_object.toJSONString(), output_object.toJSONString());
                        if(existResult == null) {
                            // 数据库中不存在数据时则保存
                            algContrastService.insertAlgResult(algContrastResult);
                        } else {
                            Integer id = existResult.getId();
                            algContrastResult.setId(id);
                            algContrastService.updateAlgResult(algContrastResult);
                        }
                        /*---------------------- 将搜索结果保存在数据库中或对数据库中的数据进行修改 ----------------------*/
                    }
                    // 封装所有要传递的数据
                    graph = new Graph(Nodes, Links, results);
                }
            }
        }
        return graph;
    }

    // 检查当前用户输入对应的算法输出结果在数据库中是否已存在
    @RequestMapping(value = "checkResult", method = {RequestMethod.POST})
    public Response checkResult(HttpServletRequest request) {
        JSONObject jsonObject = JSONObject.parseObject(request.getParameter("algContrastQuery"));
        // 获取post请求中的数据
        String algName = jsonObject.getString("algName");
        String dataSet = jsonObject.getString("dataSet");
        String inputData = jsonObject.getString("inputData");

        // 定义一个response
        Response response;
        // new一个算法的查询条件
        AlgContrastQuery algContrastQuery = new AlgContrastQuery(algName, dataSet);
        // 查询数据库中是否已存在当前的测试结果
        List<AlgContrastResult> algContrastResults = algContrastService.listAlgResult(algContrastQuery);
        // 根据用户输入的数据来搜索数据库中相同的结果
        FindOnlyResult findOnlyResult = new FindOnlyResult();
        AlgContrastResult algContrastResult = findOnlyResult.getResultEntity(algName, inputData, algContrastResults);
        // 将检查结果封装在response中
        if(algContrastResult == null) {
            // code：0 表示搜索结果不存在
            response = new Response(0, "ResultNotExist", null);
        } else {
            // code：1 表示搜索结果存在
            response = new Response(1, "Exist", null);
        }
        return response;
    }
}
