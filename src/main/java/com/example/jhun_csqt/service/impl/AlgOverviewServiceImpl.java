package com.example.jhun_csqt.service.impl;

import com.example.jhun_csqt.entity.Overview.AlgOverview;
import com.example.jhun_csqt.entity.Query.AlgOverviewQuery;
import com.example.jhun_csqt.mapper.AlgOverviewMapper;
import com.example.jhun_csqt.service.AlgOverviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlgOverviewServiceImpl implements AlgOverviewService {
    @Autowired
    private AlgOverviewMapper algOverviewMapper;

    @Override
    public List<AlgOverview> listOverview(AlgOverviewQuery algOverviewQuery) {
        return algOverviewMapper.listOverview(algOverviewQuery);
    }

    @Override
    public List<AlgOverview> searchOverview(AlgOverviewQuery algOverviewQuery) {
        return algOverviewMapper.searchOverview(algOverviewQuery);
    }

    @Override
    public int insertOverview(AlgOverview algOverview) {
        return algOverviewMapper.insertOverview(algOverview);
    }

    @Override
    public void updateOverview(AlgOverview algOverview) {
        algOverviewMapper.updateOverview(algOverview);
    }

    @Override
    public void deleteOverview(AlgOverviewQuery algOverviewQuery) {
        algOverviewMapper.deleteOverview(algOverviewQuery);
    }
}
