package com.example.jhun_csqt.utils.serverFiles;

import java.io.File;
import java.util.Map;

public class fileOperations {
    public static boolean deleteFile(File file, Map<String, Integer> fileNames) {
        if (file == null || !file.exists()) {
            System.out.println("文件删除失败, 请检查文件路径是否正确。");
            return false;
        }
        if(fileNames == null || fileNames.size() == 0) {
            System.out.println("删除失败, 文件不存在！");
            return false;
        }
        // 取得这个目录下的所有子文件对象
        File[] files = file.listFiles();
        // 遍历该目录下的文件对象
        for (File file1 : files) {
            // 获取文件名
            String fileName = file1.getName();
            if(fileNames.get(fileName) != null && fileNames.get(fileName) == 1) {
                // 打印文件名
                System.out.println(fileName);
                // 删除文件
                file1.delete();

                // 判断子目录是否存在子目录,如果是文件则删除
//                if (file1.isDirectory()) {
//                    deleteFile(file1, fileNames);
//                } else {
//                    file1.delete();
//                }
            }
        }
        //删除空文件夹  for循环已经把上一层节点的目录清空。
//        file.delete();
        return true;
    }
}

