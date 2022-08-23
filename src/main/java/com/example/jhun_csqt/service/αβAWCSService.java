package com.example.jhun_csqt.service;

import com.example.jhun_csqt.entity.Query.αβAWCSQuery;
import com.example.jhun_csqt.entity.αβAWCS.WithAttrEdge;
import com.example.jhun_csqt.entity.αβAWCS.αβAWCSResult;
import main.java.BGCS.Util.GraphAdjList;
import main.java.BGCS.Util.abGraphAdjList;

import java.util.ArrayList;
import java.util.List;

public interface αβAWCSService {
    /* 查询(α，β)-AWCS算法的社区搜索结果列表 */
    List<αβAWCSResult> listαβAWCSResult(αβAWCSQuery awcsQuery);

    /*将计算数据保存在数据库中*/
    int InsertData(αβAWCSResult awcsResult);

    /*覆盖ktruss算法输出的测试结果*/
    void UpdateαβAWCSResult(αβAWCSResult awcsResult);


    /*获取(α，β)-AWCS算法输出结果(peelResult)的Json字符串表示*/
    ArrayList<WithAttrEdge> out_withAttrEdges(abGraphAdjList peelResult);

    /*获取数据集中全部的数据（带属性的节点和边）*/
    ArrayList<WithAttrEdge> all_withAttrEdges(GraphAdjList originalGraph);

    /*获取整个数据集的Nodes和Edges便于ECharts绘图*/
    List<Object> acquireNodesAndEdges(String qNode,ArrayList<WithAttrEdge> out_withAttrEdges, ArrayList<WithAttrEdge> all_withAttrEdges);
}
