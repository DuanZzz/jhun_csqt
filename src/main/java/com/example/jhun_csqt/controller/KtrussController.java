package com.example.jhun_csqt.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.example.jhun_csqt.entity.Common.Graph;
import com.example.jhun_csqt.entity.Common.Link;
import com.example.jhun_csqt.entity.Common.Node;
import com.example.jhun_csqt.entity.File.UploadFile;
import com.example.jhun_csqt.entity.Ktruss.KtrussData;
import com.example.jhun_csqt.entity.Ktruss.Ktrussresult;
import com.example.jhun_csqt.entity.Query.FileQuery;
import com.example.jhun_csqt.entity.Query.KtrussresultQuery;
import com.example.jhun_csqt.service.FileService;
import com.example.jhun_csqt.service.KtrussresultService;
import com.example.jhun_csqt.utils.Response;
import com.example.jhun_csqt.utils.dataSet.parseDataReader;
import main.Edge;
import main.Main;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Ktruss")
public class KtrussController {
    @Autowired
    private KtrussresultService ktrussresultService;

    @Autowired
    private FileService fileService;

    /**
     * 存储社区图中所有节点的集合
     */
    private List<Node> Nodes = new ArrayList<>();

    /**
     * 存储社区图中所有边的集合
     */
    private List<Link> Links = new ArrayList<>();

    /**
     * 存储从社区图输出的结果
     */
    private Ktrussresult KtrussResult;

    @RequestMapping(value = "ktrussresult", method = {RequestMethod.POST})
    public Graph ktrussresult(HttpServletRequest request) {
        SimpleDateFormat DateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 指定日期输出的格式（用做性能测试的时间格式）
//        System.out.println("开始处理==========>" + DateFormatter.format(new Date()) + "\n"); // testPoint1

        // 获取用户输入的数据并转换成JSON对象
        JSONObject user_input_data = JSON.parseObject(request.getParameter("userInputData"));
        // 获取数据集文件名
        String fileName = user_input_data.getString("fileName");
        String nodeId = user_input_data.getString("nodeId");
        String ktrussValue = user_input_data.getString("ktrussValue");
        // 接收一个标记用户是否直接输出结果的标志
        String Sign = user_input_data.getString("Sign");

        //类型转换
        int s = Integer.parseInt(nodeId);
        int k = Integer.parseInt(ktrussValue);
        // 设置索引文件的路径
        String pathtec = ".\\indexFiles";
        // 根据文件名在数据库中获取对应的文件
        // new一个文件查询条件
        FileQuery fileQuery = new FileQuery(fileName);
        // 获取文件
        UploadFile file = fileService.listFile(fileQuery).get(0);
        // 获取文件内容
        String fileContent = (String)(JSONObject.parseObject(file.getFileContent()).get("fileContent"));
        // 解析文件内容
        String [] parsedFileContent = fileContent.split("\n");
        // 定义一个List集合存储解析后的文件内容
        ArrayList<String> contentList = new ArrayList<>();
        for(int i = 0; i < parsedFileContent.length; i++) {
            contentList.add(parsedFileContent[i]);
        }

        /*-------------- 以下涉及的数据为通过算法输出的数据--------------*/
        // 创建主对象（Ktruss算法中的类实例化的对象）
        Main m = new Main();

        // 存储数据集中的全部数据
        parseDataReader dataSetReader = new parseDataReader(contentList);

        // 定义一个存储输出结果的链表
        LinkedList<Edge> e = new LinkedList<>();
        // 定义一个存储输出边的集合
        ArrayList<String> links1 = null;
        // json数据中的属性名
        String name = "outlinks";

        // ktruss算法输出的其他数据
        Map<String, Double> ktrussData = null;
        KtrussData ktrussData1 = null;

        // 通过判断用户当前的输入对应的输出的结果在数据表中是否存在来确定是否插入数据
        // new一个ktruss结果集查询条件
        KtrussresultQuery ktrussresultQuery = new KtrussresultQuery(fileName, nodeId, ktrussValue);
        List<Ktrussresult> f = ktrussresultService.listKtrussResult(ktrussresultQuery);

        // 调用对象中的test方法获取社区图中输出的边的集合
        if(Sign.equals("N")) {
            try {
                e = m.test(contentList, pathtec, s, k);
            } catch (Exception ex) {
                return new Graph(null, null, "dataSet_error");
            }
            try {
                links1 = new ArrayList<>();
                for(Edge edge : e) {
                    links1.add(String.valueOf(edge.getS()));
                    links1.add(String.valueOf(edge.getT()));
                }
            } catch (NullPointerException ex) {
                System.err.println("No Community !!!");
                return new Graph(null, null, "noCommunity");
            }
            // 算法界面中输出的边的数量
            String n = Integer.toString(e.size());
            // 格式化之后输出的边
            String str = ktrussresultService.vertexLink(e, name);

            // 创建一个JSONObject对象
            JSONObject json = new JSONObject();

            ktrussData = Main.getKtrussOutData();
            ktrussData1 = new KtrussData();
            for(Map.Entry<String, Double> map : ktrussData.entrySet()) {
                switch (map.getKey()) {
                    case "vertices":
                        ktrussData1.setVertices(map.getValue().intValue());
                        json.put("vertices", String.valueOf(map.getValue().intValue()));
                        break;
                    case "edges":
                        ktrussData1.setEdges(map.getValue().intValue());
                        json.put("edges", String.valueOf(map.getValue().intValue()));
                        break;
                    case "dmax":
                        ktrussData1.setDmax(map.getValue().intValue());
                        json.put("dmax", String.valueOf(map.getValue().intValue()));
                        break;
                    case "kmax":
                        ktrussData1.setKmax(map.getValue().intValue());
                        json.put("kmax", String.valueOf(map.getValue().intValue()));
                        break;
                    case "graphReadTime":
                        ktrussData1.setGraphReadTime(map.getValue());
                        json.put("graphReadTime", String.valueOf(map.getValue()));
                        break;
                    case "support_time":
                        ktrussData1.setSupport_time(map.getValue());
                        json.put("support_time", String.valueOf(map.getValue()));
                        break;
                    case "ktrussCalTime":
                        ktrussData1.setKtrussCalTime(map.getValue());
                        json.put("ktrussCalTime", String.valueOf(map.getValue()));
                        break;
                    case "indexCreationTime":
                        ktrussData1.setIndexCreationTime(map.getValue());
                        json.put("indexCreationTime", String.valueOf(map.getValue()));
                        break;
                }
            }
            // 实例化一个Ktrussresult对象
            KtrussResult = new Ktrussresult(nodeId, ktrussValue, n, str, fileName, json.toJSONString());

            if(f.size() == 0) {
                // 数据不存在着直接插入
                ktrussresultService.InsertData(KtrussResult);
            } else {
                // 存在则覆盖测试结果
                ktrussresultService.UpdateKtrussResult(KtrussResult);
            }
        } else if(Sign.equals("Y")) {
            KtrussResult = f.get(0);
            links1 = ktrussresultService.edgeParse(KtrussResult, name);
            int counter = -1, i = 0;
            while(i < links1.size() && counter < links1.size()) {
                counter = i + 1;
                Edge e1 = new Edge(Integer.parseInt(links1.get(i)), Integer.parseInt(links1.get(counter)));
                e.add(e1);
                i = counter + 1;
            }
            // 从数据库中获取otherData并设置
            JSONObject jsonObject = JSONObject.parseObject(KtrussResult.getOtherData());
            ktrussData1 = new KtrussData(Integer.parseInt((String)jsonObject.get("vertices")),
                    Integer.parseInt((String)jsonObject.get("edges")), Integer.parseInt((String)jsonObject.get("dmax")),
                    Integer.parseInt((String)jsonObject.get("kmax")), Double.parseDouble((String)jsonObject.get("graphReadTime")),
                    Double.parseDouble((String)jsonObject.get("support_time")), Double.parseDouble((String)jsonObject.get("ktrussCalTime")),
                    Double.parseDouble((String)jsonObject.get("indexCreationTime")));
        }
        // 设置算法输出的其他数据
        KtrussResult.setKtrussData(ktrussData1);
        /*-------------- 以上涉及的数据为通过算法输出的数据--------------*/

        /*----------------- 以下为获取节点和边的数据 -----------------*/
        ArrayList<String> outputDataSet = ktrussresultService.outputDataSet(e);
        // 存储从数据集中输出的数据
        parseDataReader outputDataSetReader = new parseDataReader(outputDataSet);
        // 建立社区图的节点集中下标与名字一一对应的散列表并返回一个结果集（包括点集和边集）,并设置输出社区的样式
        List<Object> NodesAndEdgesResult = ktrussresultService.obtainNodesAndEdges(nodeId, dataSetReader, outputDataSetReader);
        // 获取并设置社区图中所有节点的集合
        Nodes = (List<Node>) NodesAndEdgesResult.get(0);
        // 获取并设置社区图中所有边的集合
        Links = (List<Link>) NodesAndEdgesResult.get(1);
        // 将社区图中所有的节点和边封装成一个对象Grafh（社区图）
        Graph graph = new Graph(Nodes, Links);
        // 重新设置输出结果
        KtrussResult.setOutlinks((String) JSONObject.parseObject(KtrussResult.getOutlinks()).get(name)); // (String) JSONObject.parseObject(ktrussresult.getOutlinks()).get(name)
        graph.setResult(KtrussResult);
        return graph;
    }

    @RequestMapping(value = "checkResult", method = {RequestMethod.POST})
    public Response checkResult(HttpServletRequest request) {
        JSONObject jsonObject = JSONObject.parseObject(request.getParameter("ktrussQuery"));
        // 获取post请求中的数据
        String fileName = (String)jsonObject.get("fileName");
        String nodeId = (String)jsonObject.get("nodeId");
        String ktrussValue = (String)jsonObject.get("ktrussValue");
        // 定义一个response
        Response response;
        // new一个查询条件
        KtrussresultQuery ktrussresultQuery = new KtrussresultQuery(fileName, nodeId, ktrussValue);
        // 查询数据库中是否已存在当前的测试结果
        List<Ktrussresult> ktrussresults = ktrussresultService.listKtrussResult(ktrussresultQuery);
        // 判断
        if(ktrussresults.size() > 0) {
            System.out.println("Aready Test！");
            // 获取已测试的数据集名称
            String name = ktrussresults.get(0).getFileName();
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
