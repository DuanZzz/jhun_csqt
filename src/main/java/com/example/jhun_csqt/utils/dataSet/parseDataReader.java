package com.example.jhun_csqt.utils.dataSet;

import java.util.ArrayList;
import java.util.Iterator;

public class parseDataReader {
    public parseGraphAdjList graph = new parseGraphAdjList(); // 储存所有顶点的邻接表

    public parseDataReader(ArrayList<String> contentList) {
        Iterator<String> EdgeList = contentList.iterator();
        while(EdgeList.hasNext()) {
            String tempEdge = EdgeList.next();
            String tmp = "";
            String tmpStr1 = "";
            String tmpStr2 = "";
            for(int i = 0; i < tempEdge.length(); i++) {
                if(tempEdge.charAt(i) != '\t' && tempEdge.charAt(i) != ' ' && tempEdge.charAt(i) != ';') {
                    tmp += tempEdge.charAt(i);
                    if(i == tempEdge.length() - 1) {
                        tmpStr2 = tmp;
                        graph.insertEdge(tmpStr1, tmpStr2);
                    }
                } else if(!tmp.equals("")) {
                    tmpStr1 = tmp;
                    tmp = "";
                }
            }
        }
    }
}
