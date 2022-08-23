package com.example.jhun_csqt.service;

import com.example.jhun_csqt.entity.Ktruss.Ktrussresult;
import com.example.jhun_csqt.entity.Query.KtrussresultQuery;
import com.example.jhun_csqt.utils.dataSet.parseDataReader;
import main.Edge;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public interface KtrussresultService
{
    /*查询k-truss算法的社区搜索结果列表*/
    List<Ktrussresult> listKtrussResult(KtrussresultQuery ktrussresultQuery);
    /*将计算数据保存在数据库中*/
    int InsertData(Ktrussresult ktrussresult);
    /*覆盖ktruss算法输出的测试结果*/
    void UpdateKtrussResult(Ktrussresult ktrussresult);


    /**
     * 输出边数据格式解析
     *
     * @param ktrussresult
     * @param name
     * @return
     */
    ArrayList<String> edgeParse(Ktrussresult ktrussresult, String name);

    /**
     * 将输出的边进行格式化后显示在算法界面
     *
     * #该方法对运行效率没影响
     *
     * @param e
     * @return
     */
    String vertexLink(LinkedList<Edge> e, String name);

    /**
     * 获取输出数据集
     *
     * @param e
     * @return
     */
    ArrayList<String> outputDataSet(LinkedList<Edge> e);

    /**
     * 根据输出数据集获取全部数据集的点集和边集
     *
     * @param dataSetReader
     * @param outputDataSetReader
     * @return
     */
    List<Object> obtainNodesAndEdges(String nodeId, parseDataReader dataSetReader, parseDataReader outputDataSetReader);
}
