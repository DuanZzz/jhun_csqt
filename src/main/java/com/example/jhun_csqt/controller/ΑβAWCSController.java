package com.example.jhun_csqt.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.Graph;
import com.example.jhun_csqt.entity.Common.Link;
import com.example.jhun_csqt.entity.Common.Node;
import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Query.FileQuery;
import com.example.jhun_csqt.entity.Query.αβAWCSQuery;
import com.example.jhun_csqt.entity.αβAWCS.PrimaryData;
import com.example.jhun_csqt.entity.αβAWCS.TimeData;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;
import com.example.jhun_csqt.entity.αβAWCS.αβAWCSResult;
import com.example.jhun_csqt.service.FileService;
import com.example.jhun_csqt.service.αβAWCSService;
import com.example.jhun_csqt.utils.Conversion.Metric;
import com.example.jhun_csqt.utils.Response;
import com.example.jhun_csqt.utils.αβAWCS.parseWithAttrEdges;
import main.java.BGCS.Algorithms.Index.Ia_bs;
import main.java.BGCS.Algorithms.Keyword.Loose;
import main.java.BGCS.Algorithms.Keyword.Strong;
import main.java.BGCS.Algorithms.SCS.SCS_Peel;
import main.java.BGCS.Util.DataReader;
import main.java.BGCS.Util.abGraphAdjList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("αβAWCS")
public class ΑβAWCSController {
    @Autowired
    private αβAWCSService awcsService;

    @Autowired
    private FileService fileService;

    // 定义存储整个数据集的Edges
    private List<Link> Edges;

    // 定义存储整个数据集的Nodes
    private List<Node> Nodes;

    // 定义一个List集合存储从数据库中读取出来的数据集文件的内容
    private static ArrayList<String> contentList;

    // (α，β)-AWCS算法输出的主要数据
    private static PrimaryData primaryData;

    // (α，β)-AWCS算法输出的时间数据
    private static TimeData timeData;

    @RequestMapping(value = "αβAWCSResult", method = {RequestMethod.POST})
    public Graph αβAWCSResultAcquire(HttpServletRequest request) {
        /*------------------------------- 获取用户输入的数据 -------------------------------*/
        // 定义(α，β)-AWCS算法输出结果的对象
        αβAWCSResult awcsResult = null;
        // 转换成JSON对象
        JSONObject user_input_data = JSON.parseObject(request.getParameter("userInputData"));
        // 数据集名
        String fileName = user_input_data.getString("fileName");
        // 搜索顶点id
        String nodeId = user_input_data.getString("nodeId");
        // 上层顶点的度
        String upperDegree = user_input_data.getString("upperDegree");
        // 下层顶点的度
        String lowerDegree = user_input_data.getString("lowerDegree");
        // 算法的约束方式
        String constraintWay = user_input_data.getString("constraintWay");
        // 关键词集
        JSONArray keywords = (JSONArray)user_input_data.get("keywords");
        // 获取关键词字符串
        String keywordStr = (String) keywords.get(0);
        for(int i = 1; i < keywords.size(); i++) {
            String tmp = "," + keywords.get(i);
            keywordStr += tmp;
        }
        // 接收一个标记用户是否直接输出结果的标志
        String Sign = user_input_data.getString("Sign");
        /*------------------------------- 获取用户输入的数据 -------------------------------*/

        /*--------------------- 根据数据集文件名在数据库中获取对应的数据集文件内容 ---------------------*/
        // new一个文件查询条件
        FileQuery fileQuery = new FileQuery(fileName);
        long readFile_BeginTime = System.currentTimeMillis();
        // 获取文件
        UploadFile file = fileService.listFile(fileQuery).get(0);
        long readFile_EndTime = System.currentTimeMillis();
        long readFile_CostTime = readFile_EndTime - readFile_BeginTime;
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

        /*----------------- 获取查询顶点集queryKeywordSet -----------------*/
        // queryKeywordSet代表查询顶点集，即输出社区的顶点需要包含这些属性
        ArrayList<String> queryKeywordSet = new ArrayList<>();
        for (int i = 0; i < keywords.size(); i++) {
            queryKeywordSet.add((String) keywords.get(i));
        }
        /*----------------- 获取查询顶点集queryKeywordSet -----------------*/

        /*---------------------------------- AWCS-SC算法对比方法测试 ----------------------------------*/
//        if((upperDegree != null && !upperDegree.isEmpty()) && (lowerDegree != null && !lowerDegree.isEmpty())) {
////            System.err.println(finalMainTest.getAWCSResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), "loose", queryKeywordSet, contentList));
////
////            System.err.println(finalMainTest.getSCResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), queryKeywordSet, contentList));
//
//            // AWCS算法的输出结果
//            JSONObject AWCS_object = finalMainTest.getAWCSResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), "loose", queryKeywordSet, contentList);
//            abGraphAdjList AWCS_peelResult = (abGraphAdjList) AWCS_object.get("out_Community");
//            JSONObject AWCS_JSONObject = AWCS_SC_outResults.algorithm_outCommunity(AWCS_peelResult, "#00aef0"); // 蓝色
//            ArrayList<Node> AWCS_out_nodes = (ArrayList<Node>) AWCS_JSONObject.get("out_nodes");
//            ArrayList<Link> AWCS_out_links = (ArrayList<Link>) AWCS_JSONObject.get("out_links");
//            // SC算法的输出结果
//            JSONObject SC_object = finalMainTest.getSCResults(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), queryKeywordSet, contentList);
//            abGraphAdjList SC_peelResult = (abGraphAdjList) SC_object.get("out_Community");
//            JSONObject SC_JSONObject = AWCS_SC_outResults.algorithm_outCommunity(SC_peelResult, "#ff9900"); // 橙色
//            ArrayList<Node> SC_out_nodes = (ArrayList<Node>) SC_JSONObject.get("out_nodes");
//            ArrayList<Link> SC_out_links = (ArrayList<Link>) SC_JSONObject.get("out_links");
//
//            // 打印测试
//            System.out.println(AWCS_out_nodes.toString());
//            System.out.println(AWCS_out_links.toString());
//
//            System.err.println("<<=========================================================================>>");
//
//            System.out.println(SC_out_nodes.toString());
//            System.out.println(SC_out_links.toString());
//        }
        /*---------------------------------- AWCS-SC算法对比方法测试 ----------------------------------*/

        // 实例化一个数据集读取对象
        DataReader reader = new DataReader(contentList, queryKeywordSet);
        /*------------------------ 从数据库中查询算法的输出结果是否存在 ------------------------*/
        // 通过判断用户当前的输入对应的输出的结果在数据表中是否存在来确定是否插入数据
        // new一个(α，β)-AWCS结果集查询条件
        αβAWCSQuery awcsQuery = new αβAWCSQuery(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywordStr);
        List<αβAWCSResult> queryResult = awcsService.listαβAWCSResult(awcsQuery);
        /*------------------------ 从数据库中查询算法的输出结果是否存在 ------------------------*/

        if(Sign.equals("N")) {
            // 初始化算法输出的主要数据
            primaryData = new PrimaryData();
            // 初始化算法输出的时间数据
            timeData = new TimeData();
            /*--------------------------- 设置(α，β)-AWCS算法输出的主要数据 ---------------------------*/
            // 设置查询定点的度
            primaryData.setSearchNodeDegree(reader.upperGraph.vertexsMap.get(nodeId).degree.get(1).realDegreeMap.get(1));
            /*--------------------------- 设置(α，β)-AWCS算法输出的主要数据 ---------------------------*/
            // 建立高效索引以快速检索目标社区
            long buildIndex_BeginTime = System.currentTimeMillis();
            Ia_bs Iabs = new Ia_bs();
            Iabs.buildIndex(reader, Integer.parseInt(upperDegree));
            long buildIndex_EndTime = System.currentTimeMillis();
            long buildIndex_CostTime = buildIndex_EndTime - buildIndex_BeginTime;
            // 从索引中检索a,b-core
            long queryABCore_BeginTime = System.currentTimeMillis();
            abGraphAdjList result;
            result = Iabs.query(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), reader.upperGraph, reader.lowerGraph);
            long queryABCore_EndTime = System.currentTimeMillis();
            long queryABCore_CostTime = queryABCore_EndTime - queryABCore_BeginTime;
            // 给result里的L层顶点的keyword赋值
            result.addLowerVertexKeyword(reader.lowerGraph);
            // 从a,b-core中基于keyword筛选得到包含查询属性集的社区，得到的结果L层顶点均有关键字，U层顶点不需要有关键字
            long keyword_BeginTime = System.currentTimeMillis();
            abGraphAdjList keywordResult = null;
            Strong strongChoose = new Strong();
            Loose looseChoose = new Loose();
            // 设置算法约束方式，算法1：使用严格约束，算法2：使用松弛约束-Global
            if(constraintWay != null && !constraintWay.isEmpty()) {
                // 未搜索到社区的情况
                try {
                    if(constraintWay.equals("strong")) {
                        keywordResult = strongChoose.query(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), queryKeywordSet, result);
                    } else if(constraintWay.equals("loose")) {
                        keywordResult = looseChoose.globalQuery(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), queryKeywordSet, result);
                    }
                } catch (Exception ex) {
                    return new Graph(null, null, "noOutResult");
                }
            }
            long keyword_EndTime = System.currentTimeMillis();
            long keyword_CostTime = keyword_EndTime - keyword_BeginTime;
            // 最后给result里的lower层加关键字以方便计算各种数值
            keywordResult.addLowerVertexKeyword(reader.lowerGraph);
            // 对包含查询属性集的社区剥离权重低的边，得到最终结果
            long peel_BeginTime = System.currentTimeMillis();
            // (α，β)-AWCS算法输出的重要结果
            abGraphAdjList peelResult;
            SCS_Peel peel = new SCS_Peel();
            peelResult = peel.query(nodeId, Integer.parseInt(upperDegree), Integer.parseInt(lowerDegree), keywordResult);
            // 最后给peelResult里的lower层和upper层顶点加关键字以方便计算各种数值
            peelResult.addLowerVertexKeyword(reader.lowerGraph);
            // 再给upper层加关键字
            peelResult.addUpperVertexKeyword();
            long peel_EndTime = System.currentTimeMillis();
            long peel_CostTime = peel_EndTime - peel_BeginTime;
            peelResult.keywordScoreCompute(queryKeywordSet);
            /*--------------------------- 设置(α，β)-AWCS算法输出的时间数据 ---------------------------*/
            // 获取并设置程序运行的总时间
            long totalTime = readFile_CostTime + buildIndex_CostTime + queryABCore_CostTime + keyword_CostTime + peel_CostTime;
            if(totalTime < 1000) {
                timeData.setRunTotalTime(totalTime + "ms");
            } else {
                timeData.setRunTotalTime(Metric.txdouble((double) totalTime / 1000, 4) + "s");
            }
            // 设置SCS-Peel筛选时间（设为s）
            if(peel_CostTime < 1000) {
                timeData.setScsPeelSiftTime(peel_CostTime + "ms");
            } else {
                timeData.setScsPeelSiftTime(Metric.txdouble((double) peel_CostTime / 1000, 4) + "s");
            }
            // 设置keyword筛选时间（设为s）
            if(keyword_CostTime < 1000) {
                timeData.setKeyWordSiftTime(keyword_CostTime + "ms");
            } else {
                timeData.setKeyWordSiftTime(Metric.txdouble((double) keyword_CostTime / 1000, 4) + "s");
            }
            // 设置 a，b-core筛选时间（设为s）
            if(queryABCore_CostTime < 1000) {
                timeData.setAbCoreSiftTime(queryABCore_CostTime + "ms");
            } else {
                timeData.setAbCoreSiftTime(Metric.txdouble((double) queryABCore_CostTime / 1000, 4) + "s");
            }
            // 设置Iabs索引构建时间（设为s）
            if(buildIndex_CostTime < 1000) {
                timeData.setIabsIndexBulidTime(buildIndex_CostTime + "ms");
            } else {
                timeData.setIabsIndexBulidTime(Metric.txdouble((double) buildIndex_CostTime / 1000, 4) + "s");
            }
            // 设置数据集读取时间（设为s）
            if(readFile_CostTime < 1000) {
                timeData.setGraphReadTime(readFile_CostTime + "ms");
            } else {
                timeData.setGraphReadTime(Metric.txdouble((double) readFile_CostTime / 1000, 4) + "s");
            }
            /*--------------------------- 设置(α，β)-AWCS算法输出的时间数据 ---------------------------*/
            /*--------------------------- 设置(α，β)-AWCS算法输出的主要数据 ---------------------------*/
            // 设置(α，β)-AWCS图密度
            primaryData.setGraphDentity(peelResult.densityCompute());
            // 设置(α，β)-AWCS顶点最小查询顶点属性集覆盖率
            primaryData.setMinCoverRate(peelResult.minKeywordScoreCompute(queryKeywordSet) * 100 + "%");
            // 设置(α，β)-AWCS顶点平均查询顶点属性集覆盖率
            primaryData.setAverageCoverRate(peelResult.averageKeywordScoreCompute(queryKeywordSet) * 100 + "%");
            // 设置(α，β)-AWCS用户平均评分
            primaryData.setAverageScore(peelResult.averageWeightCompute());
            // (α，β)-AWCS算法输出的带属性边数据
            ArrayList<WithAttrEdge> out_withAttrEdges = awcsService.out_withAttrEdges(peelResult);


            /*---------------------------- printTest2 ----------------------------*/
//            System.err.println("输出社区评价数：" + out_withAttrEdges.size());
////            for (WithAttrEdge edge:
////                    out_withAttrEdges) {
////                System.err.println(edge.getScore());
////            }
//
//            long firstTime = System.currentTimeMillis();
//            Map<Float, Integer> scoreMap = CalDifferentElementNum.outCommunity_score(out_withAttrEdges);
//
//            Map<String, Integer> scoreDistribute = new HashMap<>();
//            Set<Map.Entry<Float, Integer>> set = scoreMap.entrySet();
//            Iterator<Map.Entry<Float, Integer>> iterator = set.iterator();
//            while (iterator.hasNext()) {
//                Map.Entry<Float, Integer> vertexEntry = iterator.next();
//                float key = vertexEntry.getKey();
//                if(key >= 0.0 && key <= 1.0) {
//                    scoreDistribute.put("0.0 ~ 1.0", (scoreDistribute.get("0.0 ~ 1.0") == null ? 0 : scoreDistribute.get("0.0 ~ 1.0")) + vertexEntry.getValue());
//                } else if(key > 1.0 && key <= 2.0) {
//                    scoreDistribute.put("1.0 ~ 2.0", (scoreDistribute.get("1.0 ~ 2.0") == null ? 0 : scoreDistribute.get("1.0 ~ 2.0")) + vertexEntry.getValue());
//                } else if(key > 2.0 && key <= 3.0) {
//                    scoreDistribute.put("2.0 ~ 3.0", (scoreDistribute.get("2.0 ~ 3.0") == null ? 0 : scoreDistribute.get("2.0 ~ 3.0")) + vertexEntry.getValue());
//                } else if(key > 3.0 && key <= 4.0) {
//                    scoreDistribute.put("3.0 ~ 4.0", (scoreDistribute.get("3.0 ~ 4.0") == null ? 0 : scoreDistribute.get("3.0 ~ 4.0")) + vertexEntry.getValue());
//                } else if(key > 4.0 && key <= 5.0) {
//                    scoreDistribute.put("4.0 ~ 5.0", (scoreDistribute.get("4.0 ~ 5.0") == null ? 0 : scoreDistribute.get("4.0 ~ 5.0")) + vertexEntry.getValue());
//                }
//                System.err.println(vertexEntry.getKey() + " ==> " + vertexEntry.getValue());
//            }
//
//            Set<Map.Entry<String, Integer>> set1 = scoreDistribute.entrySet();
//            Iterator<Map.Entry<String, Integer>> iterator1 = set1.iterator();
//            while (iterator1.hasNext()) {
//                Map.Entry<String, Integer> vertexEntry1 = iterator1.next();
//                String key = vertexEntry1.getKey();
//                System.err.println(key + "：" + vertexEntry1.getValue());
//            }
//
//            long endTime = System.currentTimeMillis();
//            System.out.println("\n算法耗时：" + (endTime - firstTime) + "ms");
            /*---------------------------- printTest2 ----------------------------*/


            primaryData.setOut_withAttrEdges(out_withAttrEdges);
            /*--------------------------- 设置(α，β)-AWCS算法输出的主要数据 ---------------------------*/
            // 实例化一个主要数据的json对象
            JSONObject primaryData_jsonObject = new JSONObject();
            // 给json对象设置数据
            primaryData_jsonObject.put("searchNodeDegree", primaryData.getSearchNodeDegree());
            primaryData_jsonObject.put("graphDentity", primaryData.getGraphDentity());
            primaryData_jsonObject.put("minCoverRate", primaryData.getMinCoverRate());
            primaryData_jsonObject.put("averageCoverRate", primaryData.getAverageCoverRate());
            primaryData_jsonObject.put("averageScore", primaryData.getAverageScore());
            primaryData_jsonObject.put("peelResult", parseWithAttrEdges.parseEdges(primaryData.getOut_withAttrEdges()));
            // 实例化一个时间数据的json对象
            JSONObject timeData_jsonObject = new JSONObject();
            // 给json对象设置数据
            timeData_jsonObject.put("graphReadTime", timeData.getGraphReadTime());
            timeData_jsonObject.put("iabsIndexBulidTime", timeData.getIabsIndexBulidTime());
            timeData_jsonObject.put("abCoreSiftTime", timeData.getAbCoreSiftTime());
            timeData_jsonObject.put("keyWordSiftTime", timeData.getKeyWordSiftTime());
            timeData_jsonObject.put("SCSPeelSiftTime", timeData.getScsPeelSiftTime());
            timeData_jsonObject.put("runTotalTime", timeData.getRunTotalTime());
            // 实例化一个结果对象
            awcsResult = new αβAWCSResult(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywordStr,
                    JSONObject.toJSONString(primaryData_jsonObject), JSONObject.toJSONString(timeData_jsonObject));
            awcsResult.setPrimaryData_jsonStr(primaryData);
            awcsResult.setTimeData_jsonStr(timeData);
            if(queryResult.size() == 0) {
                awcsService.InsertData(awcsResult);
            } else {
                awcsService.UpdateαβAWCSResult(awcsResult);
            }
        } else if(Sign.equals("Y")) {
            // 获取算法已输出的结果
            awcsResult = queryResult.get(0);
            // 获取算法已输出的主要数据并设置
            JSONObject primaryData_jsonObject = JSONObject.parseObject(awcsResult.getPrimaryData());
            primaryData = new PrimaryData(Integer.parseInt(primaryData_jsonObject.getString("searchNodeDegree")),
                    Double.parseDouble(primaryData_jsonObject.getString("graphDentity")),
                    primaryData_jsonObject.getString("minCoverRate"), primaryData_jsonObject.getString("averageCoverRate"),
                    Double.parseDouble(primaryData_jsonObject.getString("averageScore")));
            // 设置peelResult的json数组表示形式
            JSONArray peelResult_jsonArr = (JSONArray) primaryData_jsonObject.get("peelResult");
            ArrayList<WithAttrEdge> out_withAttrEdges = parseWithAttrEdges.parseJsonArr(peelResult_jsonArr);
            primaryData.setOut_withAttrEdges(out_withAttrEdges);
            awcsResult.setPrimaryData_jsonStr(primaryData);
            // 清空不必要的数据
            awcsResult.setPrimaryData(null);
            // 获取算法已输出的时间数据并设置
            JSONObject timeData_jsonObject = JSONObject.parseObject(awcsResult.getTimeData());
            timeData = new TimeData(timeData_jsonObject.getString("graphReadTime"), timeData_jsonObject.getString("iabsIndexBulidTime"),
                    timeData_jsonObject.getString("abCoreSiftTime"), timeData_jsonObject.getString("keyWordSiftTime"),
                    timeData_jsonObject.getString("SCSPeelSiftTime"), timeData_jsonObject.getString("runTotalTime"));
            awcsResult.setTimeData_jsonStr(timeData);
            // 清空不必要的数据
            awcsResult.setTimeData(null);
        }
        // 解析数据集中的全部数据（reader）解析成=>带属性边数据
        ArrayList<WithAttrEdge> all_withAttrEdges = awcsService.all_withAttrEdges(reader.originalGraph);

        /*---------------------------- printTest1 ----------------------------*/
//        System.err.println("总评价数：" + all_withAttrEdges.size());
//        for (WithAttrEdge edge:
//             all_withAttrEdges) {
//            System.err.println(edge.getScore());
//        }
        /*---------------------------- printTest1 ----------------------------*/

        List<Object> result = awcsService.acquireNodesAndEdges(nodeId, primaryData.getOut_withAttrEdges(), all_withAttrEdges);
        // 获取并设置点集
        Nodes = (List<Node>) result.get(0);
        // 获取并设置边集
        Edges = (List<Link>) result.get(1);

        // 测试生成的点集和边集（success）
//        System.out.println("originalGraph_vertexsMap_size=>" + reader.originalGraph.vertexsMap.size());
//        System.out.println("Nodes_length=>" + Nodes.size());
//        System.out.println(Nodes);
//        System.out.println("Edges_length=>" + Edges.size());
//        System.out.println(Edges);

//        System.out.println("输出带属性边的数量=>" + primaryData.getOut_withAttrEdges().size());
//        System.out.println(primaryData.getOut_withAttrEdges());
//        System.out.println("全部带属性边的数量=>" + all_withAttrEdges.size());

        // 将社区图中所有的节点和边封装成一个对象Grafh（社区图）
        Graph graph = new Graph(Nodes, Edges, awcsResult);
        return graph;
    }

    // 根据用户id和所选的数据集获取对应的电影关键词集
    @RequestMapping(value = "acquireKeywords", method = {RequestMethod.POST})
    public ArrayList<String> acquireKeywords(HttpServletRequest request) {
        // 获取数据集名
        String fileName = request.getParameter("fileName");
        // 获取用户id
        String qNode = request.getParameter("nodeId");
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
        // 定义一个电影关键词集合
        ArrayList<String> keywords;
        try {
            keywords = DataReader.UserKeywordQuery(qNode, contentList);
        } catch (Exception e) {
            System.err.println("电影关键词集合为空！");
            return new ArrayList<>();
        }
        return keywords;
    }

    // 检查当前用户输入对应的算法输出结果在数据库中是否已存在
    @RequestMapping(value = "checkResult", method = {RequestMethod.POST})
    public Response checkResult(HttpServletRequest request) {
        JSONObject jsonObject = JSONObject.parseObject(request.getParameter("αβAWCSQuery"));
        // 获取post请求中的数据
        String fileName = jsonObject.getString("fileName");
        String nodeId = jsonObject.getString("nodeId");
        String upperDegree = jsonObject.getString("upperDegree");
        String lowerDegree = jsonObject.getString("lowerDegree");
        String constraintWay = jsonObject.getString("constraintWay");
        JSONArray keywords = (JSONArray)jsonObject.get("keywords");
        // 获取关键词字符串
        String keywordStr = (String) keywords.get(0);
        for(int i = 1; i < keywords.size(); i++) {
            String tmp = "," + keywords.get(i);
            keywordStr += tmp;
        }

        // new一个αβAWCS算法的查询条件
        αβAWCSQuery awcsQuery = new αβAWCSQuery(fileName, nodeId, upperDegree, lowerDegree, constraintWay, keywordStr);

        // 定义一个response
        Response response;
        // 查询数据库中是否已存在当前的测试结果
        List<αβAWCSResult> αβAWCSResults = awcsService.listαβAWCSResult(awcsQuery);
        // 判断
        if(αβAWCSResults.size() > 0) {
            System.out.println("Aready Test！");
            // 获取已测试的数据集名称
            String name = αβAWCSResults.get(0).getFileName();
            // new一个查询条件
            FileQuery fileQuery = new FileQuery(name);
            // 获取数据集的大小（反馈给用户，让用户判断是否重新测试）
            String size = fileService.listFile(fileQuery).get(0).getFileSize();
            // 将文件名和大小的数据封装在response中
            // 1表示数据集已测试，message表示已测试的文件名，data表示文件大小
            response = new Response(1, name, size);
        } else {
            response = new Response(0, "noTest", null);
        }
        return response;
    }
}
