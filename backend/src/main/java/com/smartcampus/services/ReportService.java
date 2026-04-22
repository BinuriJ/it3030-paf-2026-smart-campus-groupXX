package com.smartcampus.services;

import com.smartcampus.dto.ReportDto;
import com.smartcampus.entity.ReportEntity;
import com.smartcampus.repository.ReportRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReportService {

    private final ReportRepository repository;

    public ReportService(ReportRepository repository) {
        this.repository = repository;
    }

    public List<ReportDto> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public ReportDto create(ReportDto dto) {
        ReportEntity entity = new ReportEntity();
        entity.setResourceId(dto.getResourceId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPriority(dto.getPriority());
        entity.setReporterName(dto.getReporterName());
        entity.setContactEmail(dto.getContactEmail());
        entity.setScreenshotUrl(dto.getScreenshotUrl());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "OPEN");
        return toDto(repository.save(entity));
    }

    private ReportDto toDto(ReportEntity entity) {
        ReportDto dto = new ReportDto();
        dto.setId(entity.getId());
        dto.setResourceId(entity.getResourceId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPriority(entity.getPriority());
        dto.setReporterName(entity.getReporterName());
        dto.setContactEmail(entity.getContactEmail());
        dto.setScreenshotUrl(entity.getScreenshotUrl());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}