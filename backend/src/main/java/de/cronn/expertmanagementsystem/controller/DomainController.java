package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.DomainsApi;
import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.mapper.DomainMapper;
import de.cronn.expertmanagementsystem.model.DomainDto;
import de.cronn.expertmanagementsystem.model.DomainPageDtoDto;
import de.cronn.expertmanagementsystem.model.DomainRequestDto;
import de.cronn.expertmanagementsystem.service.DomainService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
public class DomainController implements DomainsApi {

    private final DomainService domainService;
    private final DomainMapper domainMapper;

    public DomainController(DomainService domainService, DomainMapper domainMapper) {
        this.domainService = domainService;
        this.domainMapper = domainMapper;
    }


    @Override
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DomainPageDtoDto> domainsGet(String name, Integer page, Integer size) {

        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;

        org.springframework.data.domain.Page<de.cronn.expertmanagementsystem.entity.Domain> domainPage =
                domainService.getDomains(name, pageNumber, pageSize);

        List<DomainDto> dtoList = domainPage.getContent().stream()
                .map(domainMapper::toDto)
                .toList();

        DomainPageDtoDto responseDto = new DomainPageDtoDto();
        responseDto.setContent(dtoList);
        responseDto.setTotalElements(domainPage.getTotalElements());
        responseDto.setTotalPages(domainPage.getTotalPages());
        responseDto.setNumber(domainPage.getNumber());
        responseDto.setSize(domainPage.getSize());

        return ResponseEntity.ok(responseDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> domainsIdDelete(Integer id) {
        domainService.deleteDomain(id.longValue());
        return ResponseEntity.noContent().build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DomainDto> domainsIdPut(Integer id, DomainRequestDto domainRequestDto) {
        Domain updateData = domainMapper.toEntity(domainRequestDto);

        Domain updatedDomain = domainService.updateDomain(id.longValue(), updateData);

        return ResponseEntity.ok(domainMapper.toDto(updatedDomain));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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