package com.example.jhun_csqt.utils.dataSet;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class parseGraphAdjList {

    public Map<String, Vertex> vertexesMap; // 存储所有的顶点

    public class Vertex {
        public String name; // 顶点名称
        public Edge next; // 下一段弧
        public boolean visited;

        Vertex(String name, boolean visited, Edge next) {
            this.name = name;
            this.next = next;
            this.visited = visited;
        }
    }

    public class Edge {
        public String name; // 被指向顶点名称
        public boolean visited;
        public Edge next; // 下一段弧

        Edge(String name, boolean visited, Edge next) {
            this.name = name;
            this.visited = visited;
            this.next = next;
        }
    }

    public parseGraphAdjList() {
        this.vertexesMap = new LinkedHashMap<>();
    }

    public void insertVertex(String vertexName) { // 添加顶点
        Vertex vertex = new Vertex(vertexName,false, null);
        vertexesMap.put(vertexName, vertex);
    }

    public void insertEdge(String begin, String end) { // 添加弧
        Vertex beginVertex = vertexesMap.get(begin);
        if (beginVertex == null) {
            beginVertex = new Vertex(begin,false,null);
            vertexesMap.put(begin, beginVertex);
        }
        Edge edge = new Edge(end, false, null);
        if (beginVertex.next == null) {
            beginVertex.next = edge;
        } else {
            Edge lastEdge = beginVertex.next;
            while (lastEdge.next != null) {
                lastEdge = lastEdge.next;
            }
            lastEdge.next = edge;
        }
    }

    public void print() { // 打印图
        Set<Map.Entry<String, Vertex>> set = vertexesMap.entrySet();
        Iterator<Map.Entry<String, Vertex>> iterator = set.iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Vertex> entry = iterator.next();
            Vertex vertex = entry.getValue();
            Edge edge = vertex.next;
            while (edge != null) {
                System.out.println(vertex.name + " 指向 " + edge.name);
                edge = edge.next;
            }
        }
    }
}
