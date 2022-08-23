package com.example.jhun_csqt.service.impl;

import com.example.jhun_csqt.entity.Query.AlgContrastQuery;
import com.example.jhun_csqt.entity.algContrast.AlgContrastResult;
import com.example.jhun_csqt.mapper.AlgContrastMapper;
import com.example.jhun_csqt.service.AlgContrastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlgContrastServiceImpl implements AlgContrastService {
    @Autowired
    private AlgContrastMapper algContrastMapper;

    @Override
    public List<AlgContrastResult> listAlgResult(AlgContrastQuery algContrastQuery) {
        return algContrastMapper.listAlgResult(algContrastQuery);
    }

    @Override
    public int insertAlgResult(AlgContrastResult algContrastResult) {
        return algContrastMapper.insertAlgResult(algContrastResult);
    }

    @Override
    public void updateAlgResult(AlgContrastResult algContrastResult) {
        algContrastMapper.updateAlgResult(algContrastResult);
    }
}
