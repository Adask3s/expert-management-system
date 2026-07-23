package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.DomainsApi;
import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.mapper.DomainMapper;
import de.cronn.expertmanagementsystem.model.DomainDto;
import de.cronn.expertmanagementsystem.model.DomainRequestDto;
import de.cronn.expertmanagementsystem.service.DomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DomainController implements DomainsApi {

    private final DomainService domainService;
    private final DomainMapper domainMapper;

    public DomainController(DomainService domainService, DomainMapper domainMapper) {
        this.domainService = domainService;
        this.domainMapper = domainMapper;
    }

    @Override
    public ResponseEntity<List<DomainDto>> domainsGet() {
        List<DomainDto> respone = domainService.getAllDomains().stream()
                .map(domainMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(respone);
    }

    @Override
    public ResponseEntity<Void> domainsIdDelete(Integer id) {
        domainService.deleteDomain(id.longValue());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<DomainDto> domainsIdPut(Integer id, DomainRequestDto domainRequestDto) {
        Domain updateData = domainMapper.toEntity(domainRequestDto);

        Domain updatedDomain = domainService.updateDomain(id.longValue(), updateData);

        return ResponseEntity.ok(domainMapper.toDto(updatedDomain));
    }

    @Override
    public ResponseEntity<DomainDto> domainsPost(DomainRequestDto domainRequestDto) {

        Domain domainToSave = domainMapper.toEntity(domainRequestDto);

        Domain savedDomain = domainService.createDomain(domainToSave);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedDomain.getId())
                .toUri();

        DomainDto responseDto = domainMapper.toDto(savedDomain);
        return ResponseEntity.created(location).body(responseDto);
    }
}